import { forwardRef, Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { AreaModule } from "src/area/area.module";

@Module({
    imports: [forwardRef(() => AreaModule)],
    providers: [SchedulerService],
    exports: [SchedulerService]
})
export class SchedulerModule {}
