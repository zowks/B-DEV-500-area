import { Test, TestingModule } from "@nestjs/testing";
import { DiscordOAuthService } from "./discord.service";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

describe("DiscordService", () => {
    let service: DiscordOAuthService;

    let prismaService: DeepMockProxy<PrismaClient>;
    beforeEach(async () => {
        prismaService = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DiscordOAuthService,
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

        service = module.get<DiscordOAuthService>(DiscordOAuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
