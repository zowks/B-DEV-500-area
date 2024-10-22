import { Test, TestingModule } from "@nestjs/testing";
import { GoogleOAuthService } from "./google.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

describe("GoogleService", () => {
    let service: GoogleOAuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleOAuthService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                        getOrThrow: jest.fn()
                    }
                },
                { provide: PrismaService, useValue: {} }
            ]
        }).compile();

        service = module.get<GoogleOAuthService>(GoogleOAuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
