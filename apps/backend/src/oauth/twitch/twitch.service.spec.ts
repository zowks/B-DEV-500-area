import { Test, TestingModule } from "@nestjs/testing";
import { TwitchOAuthService } from "./twitch.service";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

describe("TwitchService", () => {
    let service: TwitchOAuthService;

    let prismaService: DeepMockProxy<PrismaClient>;
    beforeEach(async () => {
        prismaService = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TwitchOAuthService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                        getOrThrow: jest.fn()
                    }
                },
                { provide: PrismaService, useValue: prismaService }
            ]
        }).compile();

        service = module.get<TwitchOAuthService>(TwitchOAuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
