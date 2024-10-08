import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AreaModule } from "src/area/area.module";
import { SchedulerModule } from "src/scheduler/scheduler.module";

@Module({
    imports: [PrismaModule, AreaModule, SchedulerModule],
    controllers: [WebhookController],
    providers: [WebhookService]
})
export class WebhookModule {}
