import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Argon2Service } from "src/argon2/argon2.service";
import { JwtService } from "src/jwt/jwt.service";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: PrismaService, useValue: {} },
                { provide: Argon2Service, useValue: {} },
                { provide: JwtService, useValue: {} },
                AuthService
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
