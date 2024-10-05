import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { hash } from "crypto";
import { transformer } from "../area/generic_transformer";
import { OAuthCredential } from "../oauth/oauth.interface";
import { AreaStatus } from "@prisma/client";
import { AreaTask } from "src/area/interfaces/area.interface";
import { AreaService } from "src/area/area.service";

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
    private clockIds: { [task: string]: NodeJS.Timeout } = {};

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @Inject(forwardRef(() => AreaService))
        private readonly areaService: AreaService
    ) {}

    async onModuleInit() {
        await this.cacheManager.reset();
    }

    async onModuleDestroy() {
        Object.values(this.clockIds).forEach(clearTimeout);
        this.clockIds = {};
        await this.cacheManager.reset();
    }

    private async getLatestCredential(
        task: AreaTask
    ): Promise<OAuthCredential | null> {
        let credential: OAuthCredential;

        try {
            credential = await task.credentialsManager.loadCredential(
                task.oauthCredentialId
            );
        } catch (e) {
            if (e instanceof NotFoundException) return null;
            throw e;
        }
        if (credential.expires_at > new Date()) return credential;
        return await task.credentialsManager.refreshCredential(credential);
    }

    private async getData(task: AreaTask) {
        const credential = await this.getLatestCredential(task);
        if (null === credential)
            throw new ForbiddenException("Token was revoked.");

        return await task.action.config.trigger(credential.access_token);
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

        try {
            await task.reaction.config.produce(
                task.reactionFields,
                transformedData
            );
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
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

        this.scheduleTask(task);
    }

    isRunning(taskName: string): boolean {
        return undefined !== this.clockIds[taskName];
    }

    stopPolling(taskName: string) {
        clearTimeout(this.clockIds[taskName]);
        delete this.clockIds[taskName];
    }
}
