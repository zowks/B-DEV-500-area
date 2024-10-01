import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { YouTubeService } from "./youtube.service";
import { YoutubeCredentialsService } from "./youtube_credentials.service";
import { YoutubeController } from "./youtube.controller";
import { CronModule } from "src/cron/cron.module";
import { DiscordModule } from "src/discord/discord.module";

@Module({
    imports: [HttpModule, CronModule, DiscordModule],
    providers: [YouTubeService, YoutubeCredentialsService],
    exports: [YouTubeService, YoutubeCredentialsService],
    controllers: [YoutubeController]
})
export class YoutubeModule {}
