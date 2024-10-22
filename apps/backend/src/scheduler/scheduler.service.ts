import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { transformer } from "../area/generic.transformers";
import { OAuthManager, OAuthCredential } from "../oauth/oauth.interface";
import { AreaServiceAuthentication, AreaStatus } from "@prisma/client";
import {
    AreaAction,
    AreaReaction,
    AreaTask
} from "../area/interfaces/area.interface";
import { AreaService } from "../area/area.service";
import { OAuthService } from "../oauth/oauth.service";
import {
    ActionResource,
    AreaServiceAuth
} from "../area/services/interfaces/service.interface";
import { User } from "src/users/interfaces/user.interface";

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
    private clockIds: { [task: string]: NodeJS.Timeout } = {};

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @Inject(forwardRef(() => AreaService))
        private readonly areaService: AreaService,
        private readonly oauthService: OAuthService
    ) {}

    async onModuleInit() {
        await this.cacheManager.reset();
    }

    async onModuleDestroy() {
        Object.values(this.clockIds).forEach(clearTimeout);
        this.clockIds = {};
        await this.cacheManager.reset();
    }

    private async getOAuthCredential(
        userId: User["id"],
        scopes: string[],
        credentialsManager: OAuthManager
    ): Promise<OAuthCredential | null> {
        const credentials: OAuthCredential[] =
            await credentialsManager.loadCredentialsByScopes(
                userId,
                scopes,
                credentialsManager.OAUTH_TOKEN_URL,
                credentialsManager.OAUTH_REVOKE_URL
            );
        if (0 === credentials.length) return null;

        const credential = credentials[0];
        if (credential.expires_at > new Date()) return credential;
        return await credentialsManager.refreshCredential(credential);
    }

    private async getServiceAuth(
        userId: User["id"],
        kind: AreaAction | AreaReaction,
        auth: Omit<AreaServiceAuthentication, "id">
    ): Promise<AreaServiceAuth> {
        if (0 < kind.config.oauthScopes?.length) {
            const credentialsManager =
                this.oauthService.getOAuthCredentialsManager(kind.service);
            const credential = await this.getOAuthCredential(
                userId,
                kind.config.oauthScopes,
                credentialsManager
            );
            if (null === credential)
                throw new ForbiddenException("Token was revoked.");
            return { oauth: credential.access_token };
        }

        if (auth.apiKey) return { apiKey: auth.apiKey };

        if (auth.webhook) return { webhook: auth.webhook };
    }

    private async getResource(task: AreaTask): Promise<ActionResource> {
        const auth = await this.getServiceAuth(
            task.userId,
            task.action,
            task.actionAuth
        );

        return await task.action.config.trigger(auth);
    }

    async postData(task: AreaTask, transformedData: object): Promise<boolean> {
        let auth: AreaServiceAuth;
        try {
            auth = await this.getServiceAuth(
                task.userId,
                task.reaction,
                task.reactionAuth
            );
        } catch {
            return false;
        }

        try {
            await task.reaction.config.produce(auth, transformedData);
        } catch {
            return false;
        }
        return true;
    }

    private logTask(task: AreaTask) {
        console.log(`--- [AREA ${task.areaId} Log Start] ---`);
        console.log(`Action : ${task.action.service}.${task.action.method}`);
        console.log(
            `Reaction : ${task.reaction.service}.${task.reaction.method}`
        );
        console.log(`Next tick: ${task.delay} seconds`);
        console.log(`--- [AREA ${task.areaId} Log End] ---`);
    }

    private async executeTask(task: AreaTask): Promise<boolean> {
        this.logTask(task);
        let data: ActionResource;
        try {
            data = await this.getResource(task);
        } catch {
            return false;
        }

        const transformedData = transformer(data.data, {
            ...task.reactionBody
        });

        const oldCache = await this.cacheManager.get(task.name);

        await this.cacheManager.set(
            task.name,
            data.cacheValue,
            (task.delay + 60) * 1000
        );

        if (null === oldCache || data.cacheValue === oldCache) return true;

        return await this.postData(task, transformedData);
    }

    scheduleTask(task: AreaTask) {
        const clockId = setTimeout(async () => {
            const keepPolling = await this.executeTask(task);
            clearTimeout(clockId);
            if (keepPolling && Object.keys(this.clockIds).includes(task.name))
                return this.scheduleTask(task);

            if (!keepPolling) {
                delete this.clockIds[task.name];
                await this.areaService.update(task.userId, task.areaId, {
                    status: AreaStatus.ERROR
                });
            }
        }, task.delay * 1000);
        this.clockIds[task.name] = clockId;
    }

    async startPolling(task: AreaTask) {
        const keepPolling = await this.executeTask(task);
        if (!keepPolling) {
            await this.areaService.update(task.userId, task.areaId, {
                status: AreaStatus.ERROR
            });
            return;
        }

        if (null === task.actionAuth.webhook) this.scheduleTask(task);
    }

    isRunning(taskName: string): boolean {
        return undefined !== this.clockIds[taskName];
    }

    stopPolling(taskName: string) {
        if (!this.isRunning(taskName)) return;
        clearTimeout(this.clockIds[taskName]);
        delete this.clockIds[taskName];
    }
}
