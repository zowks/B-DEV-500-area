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
import { hash } from "crypto";
import { transformer } from "../area/generic_transformer";
import { OAuthManager, OAuthCredential } from "../oauth/oauth.interface";
import { AreaStatus } from "@prisma/client";
import { AreaTask } from "../area/interfaces/area.interface";
import { AreaService } from "../area/area.service";
import { OAuthService } from "../oauth/oauth.service";
import { AreaServiceAuth } from "../area/services/interfaces/service.interface";

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
        scopes: string[],
        credentialsManager: OAuthManager
    ): Promise<OAuthCredential | null> {
        const credentials: OAuthCredential[] =
            await credentialsManager.loadCredentialsByScopes(scopes);
        if (0 === credentials.length) return null;

        const credential = credentials[0];
        if (credential.expires_at > new Date()) return credential;
        return await credentialsManager.refreshCredential(credential);
    }

    private async getActionServiceAuth(
        task: AreaTask
    ): Promise<AreaServiceAuth> {
        if (0 < task.action.config.oauthScopes.length) {
            const credentialsManager =
                this.oauthService.getOAuthCredentialsManager(
                    task.action.service
                );
            const credential = await this.getOAuthCredential(
                task.action.config.oauthScopes,
                credentialsManager
            );
            if (null === credential)
                throw new ForbiddenException("Token was revoked.");
            return { oauth: credential.access_token };
        }

        if (task.actionAuth.apiKey) return { apiKey: task.actionAuth.apiKey };

        if (task.actionAuth.webhook)
            return { webhook: task.actionAuth.webhook };
    }

    private async getReactionServiceAuth(
        task: AreaTask
    ): Promise<AreaServiceAuth> {
        if (0 < task.reaction.config.oauthScopes.length) {
            const credentialsManager =
                this.oauthService.getOAuthCredentialsManager(
                    task.reaction.service
                );
            const credential = await this.getOAuthCredential(
                task.reaction.config.oauthScopes,
                credentialsManager
            );
            if (null === credential)
                throw new ForbiddenException("Token was revoked.");
            return { oauth: credential.access_token };
        }

        if (task.reactionAuth.apiKey)
            return { apiKey: task.reactionAuth.apiKey };

        if (task.reactionAuth.webhook)
            return { webhook: task.reactionAuth.webhook };
    }

    private async getData(task: AreaTask) {
        const auth = await this.getActionServiceAuth(task);

        return await task.action.config.trigger(auth);
    }

    async postData(task: AreaTask, transformedData: object): Promise<boolean> {
        let auth: AreaServiceAuth;
        try {
            auth = await this.getReactionServiceAuth(task);
        } catch (e) {
            console.error(e);
            return false;
        }

        try {
            await task.reaction.config.produce(auth, transformedData);
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }

    private async executeTask(
        task: AreaTask,
        firstRun: boolean = false
    ): Promise<boolean> {
        let data: object;
        try {
            data = await this.getData(task);
        } catch (e) {
            console.error(e);
            return false;
        }

        const transformedData = transformer(data, { ...task.reactionBody });

        const oldCache = await this.cacheManager.get(task.name);

        const newCache = hash("sha512", JSON.stringify(data), "hex").toString();

        await this.cacheManager.set(
            task.name,
            newCache,
            (task.delay + 5) * 1000
        );

        if (firstRun || newCache === oldCache) return true;

        return await this.postData(task, transformedData);
    }

    scheduleTask(task: AreaTask) {
        const clockId = setTimeout(async () => {
            const keepTicking = await this.executeTask(task, false);
            clearTimeout(clockId);
            if (keepTicking && Object.keys(this.clockIds).includes(task.name))
                return this.scheduleTask(task);

            if (!keepTicking) {
                delete this.clockIds[task.name];
                await this.areaService.update(task.areaId, {
                    status: AreaStatus.ERROR
                });
            }
        }, task.delay * 1000);
        this.clockIds[task.name] = clockId;
    }

    async startPolling(task: AreaTask) {
        await this.executeTask(task, true);

        if (null === task.actionAuth.webhook) this.scheduleTask(task);
    }

    isRunning(taskName: string): boolean {
        return undefined !== this.clockIds[taskName];
    }

    stopPolling(taskName: string) {
        clearTimeout(this.clockIds[taskName]);
        delete this.clockIds[taskName];
    }
}
