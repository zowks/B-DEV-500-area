import { Test, TestingModule } from "@nestjs/testing";
import { YoutubeCredentialsService } from "../youtube/youtube_credentials.service";
import { ConfigService } from "@nestjs/config";

describe("YoutubeCredentialsService", () => {
    let service: YoutubeCredentialsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                        getOrThrow: jest.fn()
                    }
                },
                YoutubeCredentialsService
            ]
        }).compile();

        service = module.get<YoutubeCredentialsService>(
            YoutubeCredentialsService
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
