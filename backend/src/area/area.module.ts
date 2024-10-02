import { Module } from "@nestjs/common";
import { AreaController } from './area.controller';
import { PollingModule } from "src/polling/polling.module";
import { WebhookModule } from "src/webhook/webhook.module";
import { AreaService } from './area.service';
import { PrismaModule } from "src/prisma/prisma.module";
import { OAuthModule } from "src/oauth/oauth.module";
import { SchedulerModule } from "src/scheduler/scheduler.module";

@Module({
    imports: [PrismaModule, SchedulerModule, OAuthModule, PollingModule, WebhookModule],
    controllers: [AreaController],
    providers: [AreaService]
})
export class AreaModule {}
