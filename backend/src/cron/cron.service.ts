import { Injectable } from "@nestjs/common";
import { CronJob } from "cron";
import { AreaTask } from "./interfaces/cron.interface";

@Injectable()
export class CronService {
    createCron(cronConfig: AreaTask) {
        const cron = CronJob.from({
            cronTime: `*/${cronConfig.delay} * * * * *`,
            onTick: async () => {
                const credentials =
                    await cronConfig.oauthManager.loadCredentials(
                        cronConfig.userId
                    );

                if (0 === credentials.length) return cron.stop();

                let credential = credentials[0];
                if (credential.expires_at <= new Date())
                    credential =
                        await cronConfig.oauthManager.refreshCredentials(
                            credential
                        );

                let data: any;
                try {
                    data = await cronConfig.action(credential.access_token);
                } catch (e) {
                    console.error(e);
                    cron.stop();
                }
                if (null === data) return;

                try {
                    await cronConfig.reaction(
                        cronConfig.webhookUrl,
                        cronConfig.fields,
                        data
                    );
                } catch (e) {
                    console.error(e);
                    cron.stop();
                }
            },
            timeZone: "Europe/Paris"
        });
        cron.start();
    }
}
