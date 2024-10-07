import { Test, TestingModule } from "@nestjs/testing";
import { DiscordOAuthController } from "./discord.controller";

describe("DiscordController", () => {
    let controller: DiscordOAuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DiscordOAuthController]
        }).compile();

        controller = module.get<DiscordOAuthController>(DiscordOAuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
