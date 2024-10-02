import { Test, TestingModule } from "@nestjs/testing";
import { GoogleOAuthService } from "./google.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";

describe("GoogleService", () => {
    let service: GoogleOAuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, PrismaModule],
            providers: [GoogleOAuthService]
        }).compile();

        service = module.get<GoogleOAuthService>(GoogleOAuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
