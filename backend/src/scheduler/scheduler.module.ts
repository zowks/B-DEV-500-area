import { forwardRef, Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { AreaModule } from "../area/area.module";
import { OAuthModule } from "src/oauth/oauth.module";

@Module({
    imports: [OAuthModule, forwardRef(() => AreaModule)],
    providers: [SchedulerService],
    exports: [SchedulerService]
})
export class SchedulerModule {}
