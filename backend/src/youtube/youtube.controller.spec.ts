import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { YouTubeService } from "./youtube.service";
import { YoutubeController } from "./youtube.controller";
import { CronModule } from "src/cron/cron.module";
import { DiscordModule } from "src/discord/discord.module";
import { YoutubeCredentialsService } from "./youtube_credentials.service";

describe("YoutubeController", () => {
    let controller: YoutubeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, CronModule, DiscordModule, HttpModule],
            providers: [
                YouTubeService,
                { provide: YoutubeCredentialsService, useValue: {} }
            ],
            controllers: [YoutubeController]
        }).compile();

        controller = module.get<YoutubeController>(YoutubeController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
