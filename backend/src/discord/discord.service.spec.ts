import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/axios";
import { DiscordService } from "./discord.service";
import { DiscordCredentialsService } from "./discord_credentials.service";

describe("DiscordService", () => {
    let service: DiscordService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                { provide: DiscordCredentialsService, useValue: {} },
                DiscordService
            ]
        }).compile();

        service = module.get<DiscordService>(DiscordService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
