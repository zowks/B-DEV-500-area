import { Test, TestingModule } from "@nestjs/testing";
import { DiscordCredentialsService } from "./discord_credentials.service";
import { ConfigService } from "@nestjs/config";

describe("DiscordCredentialsService", () => {
    let service: DiscordCredentialsService;

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
                DiscordCredentialsService
            ]
        }).compile();

        service = module.get<DiscordCredentialsService>(
            DiscordCredentialsService
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
