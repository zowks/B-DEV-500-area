import { Test, TestingModule } from "@nestjs/testing";
import { TwitchOAuthController } from "./twitch.controller";

describe("TwitchController", () => {
    let controller: TwitchOAuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TwitchOAuthController]
        }).compile();

        controller = module.get<TwitchOAuthController>(TwitchOAuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
