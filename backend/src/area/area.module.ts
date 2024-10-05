import { forwardRef, Module } from "@nestjs/common";
import { AreaController } from "./area.controller";
import { AreaService } from "./area.service";
import { PrismaModule } from "../prisma/prisma.module";
import { OAuthModule } from "../oauth/oauth.module";
import { SchedulerModule } from "../scheduler/scheduler.module";

@Module({
    imports: [PrismaModule, OAuthModule, forwardRef(() => SchedulerModule)],
    controllers: [AreaController],
    providers: [AreaService],
    exports: [AreaService]
})
export class AreaModule {}
