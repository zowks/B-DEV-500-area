import { Test, TestingModule } from "@nestjs/testing";
import { AreaService } from "./area.service";
import { SchedulerService } from "src/scheduler/scheduler.service";
import { OAuthService } from "src/oauth/oauth.service";
import { YouTubeService } from "src/polling/youtube/youtube.service";
import { DiscordService } from "src/webhook/discord/discord.service";

describe("AreaService", () => {
    let service: AreaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AreaService,
                { provide: SchedulerService, useValue: {} },
                { provide: OAuthService, useValue: {} },
                { provide: YouTubeService, useValue: {} },
                { provide: DiscordService, useValue: {} }
            ]
        }).compile();

        service = module.get<AreaService>(AreaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
