import { Test, TestingModule } from "@nestjs/testing";
import { Argon2Service } from "./argon2.service";

describe("Argon2Service", () => {
    let argon2service: Argon2Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Argon2Service]
        }).compile();

        argon2service = module.get<Argon2Service>(Argon2Service);
    });

    it("should be defined", () => {
        expect(argon2service).toBeDefined();
    });

    describe("password verification", () => {
        it("should validate the password", async () => {
            const hash =
                "$argon2id$v=19$m=12288,t=3,p=1$uGRNmO1eNvgaCxwz4Btgjw$KiXfk8BaDcZGqLVxxzRsNzUyC4DGHro3jRUdWE9fc8U";
            const password = "password";

            expect(argon2service.verifyPassword(hash, password)).resolves.toBe(
                true
            );
        });

        it("should not validate the password", async () => {
            const hash =
                "$argon2id$v=19$m=12288,t=3,p=1$uGRNmO1eNvgaCxwz4Btgjw$KiXfk8BaDcZGqLVxxzRsNzUyC4DGHro3jRUdWE9fc8U";
            const password = "invalid_password";

            expect(argon2service.verifyPassword(hash, password)).resolves.toBe(
                false
            );
        });
    });

    describe("password hashing", () => {
        it("should hash the password", async () => {
            const password = "password";
            const result = await argon2service.hashPassword(password);
            const [alg, version, config, hash] = result.split(/\$/).slice(1);
            const [m, t, p] = config.split(/,/).map((v) => +v.slice(2));

            expect(alg).toBe("argon2id");
            expect(+version.slice(2)).toBe(0x13);
            expect(m).toBe(Argon2Service.CONFIG.m);
            expect(t).toBe(Argon2Service.CONFIG.t);
            expect(p).toBe(Argon2Service.CONFIG.p);
            expect(hash.length).toBeGreaterThan(0);
        });
    });
});
