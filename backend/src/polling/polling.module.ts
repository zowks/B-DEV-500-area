import { Module } from "@nestjs/common";
import { YoutubeModule } from "./youtube/youtube.module";

@Module({
    imports: [YoutubeModule],
    exports: [YoutubeModule]
})
export class PollingModule {}
