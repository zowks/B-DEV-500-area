import { Test, TestingModule } from "@nestjs/testing";
import { OAuthDBService } from "./oauthDb.service";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

describe("OAuthDBService", () => {
    let service: OAuthDBService;
    let prismaService: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        prismaService = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OAuthDBService,
                { provide: PrismaService, useValue: prismaService }
            ]
        }).compile();

        service = module.get<OAuthDBService>(OAuthDBService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
