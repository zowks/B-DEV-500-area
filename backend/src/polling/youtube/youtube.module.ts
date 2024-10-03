import { Module } from "@nestjs/common";
import { YouTubeService } from "./youtube.service";
import { SchedulerModule } from "src/scheduler/scheduler.module";

@Module({
    imports: [SchedulerModule],
    providers: [YouTubeService],
    exports: [YouTubeService]
})
export class YoutubeModule {}
