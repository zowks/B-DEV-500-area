import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

describe("UsersService", () => {
    let service: UsersService;
    let prismaService: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        prismaService = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: prismaService }
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
