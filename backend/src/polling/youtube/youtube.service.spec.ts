import { Test, TestingModule } from "@nestjs/testing";
import { YouTubeService } from "./youtube.service";

describe("YoutubeService", () => {
    let service: YouTubeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                YouTubeService
            ]
        }).compile();

        service = module.get<YouTubeService>(YouTubeService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
