import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { YouTubeService } from "./youtube.service";
import { YoutubeCredentialsService } from "./youtube_credentials.service";

describe("YoutubeService", () => {
    let service: YouTubeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                { provide: YoutubeCredentialsService, useValue: {} },
                YouTubeService
            ]
        }).compile();

        service = module.get<YouTubeService>(YouTubeService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
