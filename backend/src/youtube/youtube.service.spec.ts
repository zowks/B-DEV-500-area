import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { YouTubeService } from "./youtube.service";
import { CredentialsModule } from "src/credentials/credentials.module";

describe("YoutubeService", () => {
    let service: YouTubeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CredentialsModule, HttpModule],
            providers: [YouTubeService]
        }).compile();

        service = module.get<YouTubeService>(YouTubeService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
