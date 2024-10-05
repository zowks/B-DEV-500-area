import { Test, TestingModule } from "@nestjs/testing";
import { OAuthService } from "./oauth.service";
import { GoogleOAuthService } from "./google/google.service";

describe("OauthService", () => {
    let service: OAuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OAuthService,
                { provide: GoogleOAuthService, useValue: {} }
            ]
        }).compile();

        service = module.get<OAuthService>(OAuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
