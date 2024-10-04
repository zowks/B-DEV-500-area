import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { hash } from "crypto";
import { transformer } from "src/area/generic_transformer";
import { AreaConfig, AreaTask } from "src/cron/interfaces/cron.interface";
import { OAuthCredentials } from "src/oauth/oauth.interface";

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
    private intervalIds: NodeJS.Timeout[] = [];

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async onModuleInit() {
        await this.cacheManager.reset();
    }

    async onModuleDestroy() {
        this.intervalIds.forEach(clearInterval);
        await this.cacheManager.reset();
    }

    private async getLatestCredential(
        cron: AreaTask
    ): Promise<OAuthCredentials | null> {
        const credentials = await cron.oauthManager.loadCredentials(
            cron.userId
        );

        if (0 === credentials.length) return null;

        if (credentials[0].expires_at > new Date()) return credentials[0];
        return await cron.oauthManager.refreshCredentials(credentials[0]);
    }

    private buildCacheKey(
        userId: string,
        attributes: {
            action: { service: string; method: string };
            reaction: { service: string; method: string };
        }
    ) {
        return `${attributes.action.service}.${attributes.action.method}/${attributes.reaction.service}.${attributes.reaction.method}/${userId}`;
    }

    private async getData(cron: AreaTask): Promise<any | null> {
        const credential = await this.getLatestCredential(cron);

        let data: any;
        try {
            data = await cron.action(credential.access_token);
        } catch (e) {
            console.error(e);
            return null;
        }
        return data;
    }

    private async executeTask(
        attributes: AreaConfig,
        cron: AreaTask,
        firstRun: boolean = false
    ) {
        const data = await this.getData(cron);
        if (null === data) return;

        const transformedData = transformer(data, { ...cron.reactionBody });

        const key = this.buildCacheKey(cron.userId, attributes);
        const oldCache = await this.cacheManager.get(key);

        const newCache = hash("sha512", JSON.stringify(data), "hex").toString();
        await this.cacheManager.set(key, newCache, (cron.delay + 5) * 1000);

        if (firstRun || newCache === oldCache) return;

        try {
            await cron.reaction(cron.fields, transformedData);
        } catch (e) {
            console.error(e);
        }
    }

    async startPolling(attributes: AreaConfig, cron: AreaTask) {
        await this.executeTask(attributes, cron, true);

        this.intervalIds.push(
            setInterval(
                () => this.executeTask(attributes, cron, false),
                cron.delay * 1000
            )
        );
    }
}
