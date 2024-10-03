import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { AreaConfig, AreaTask } from "src/cron/interfaces/cron.interface";
import { OAuthCredentials } from "src/oauth/oauth.interface";

@Injectable()
export class SchedulerService implements OnModuleDestroy {
    private timeoutIds: NodeJS.Timeout[] = [];

    private cache = {};

    onModuleDestroy() {
        this.timeoutIds.forEach(clearTimeout);
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

    private isFirstRun(attributes: AreaConfig, cron: AreaTask): boolean {
        const key = this.buildCacheKey(cron.userId, attributes);
        return undefined === this.cache[key];
    }

    private async getData(
        attributes: AreaConfig,
        cron: AreaTask
    ): Promise<any | null> {
        const credential = await this.getLatestCredential(cron);

        let data: any;
        try {
            data = await cron.action(credential.access_token);
        } catch (e) {
            console.error(e);
        }
        if (null === data) return;

        const key = this.buildCacheKey(cron.userId, attributes);
        const firstRun = this.isFirstRun(attributes, cron);
        if (!firstRun && data === this.cache[key]) return null;

        this.cache[key] = data;
        return data;
    }

    private schedulePolling(attributes: AreaConfig, cron: AreaTask) {
        this.timeoutIds.push(
            setTimeout(async () => {
                const data = await this.getData(attributes, cron);
                if (null !== data)
                    try {
                        await cron.reaction(cron.webhookUrl, cron.fields, data);
                    } catch (e) {
                        console.error(e);
                    }

                this.schedulePolling(attributes, cron);
            }, cron.delay)
        );
    }

    startPolling(attributes: AreaConfig, cron: AreaTask) {
        this.schedulePolling(attributes, cron);
    }
}
