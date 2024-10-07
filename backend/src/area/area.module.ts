import { forwardRef, Module } from "@nestjs/common";
import { AreaController } from "./area.controller";
import { AreaService } from "./area.service";
import { PrismaModule } from "../prisma/prisma.module";
import { SchedulerModule } from "../scheduler/scheduler.module";

@Module({
    imports: [PrismaModule, forwardRef(() => SchedulerModule)],
    controllers: [AreaController],
    providers: [AreaService],
    exports: [AreaService]
})
export class AreaModule {}
