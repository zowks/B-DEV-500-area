import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import * as jose from "jose";

const fakeEnv = {
    JWT_ISSUER: "area-backend-unit-tests",
    JWT_SECRET: "5044d47226c19a4d63fd7eab79373b30",
    JWE_PUBLIC_KEY: "test/test_jwe_public_key.pem",
    JWE_PRIVATE_KEY: "test/test_jwe_private_key.pem",
    JWT_EXPIRES_IN: 3
};

const configService: Partial<ConfigService> = {
    get: jest
        .fn()
        .mockImplementation((property: string): string => fakeEnv[property]),
    getOrThrow: jest.fn().mockImplementation((property: string): string => {
        const value = fakeEnv[property];
        if (undefined === value)
            throw new Error(`Env variable not found: ${property}`);
        return value;
    })
};

function b64decode(s: string): string {
    return Buffer.from(s, "base64").toString("utf-8");
}

describe("CryptoService", () => {
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtService,
                { provide: ConfigService, useValue: configService }
            ]
        }).compile();

        jwtService = module.get<JwtService>(JwtService);
        expect(jwtService.areKeysLoaded()).toBe(false);
    });

    it("should be defined", () => {
        expect(jwtService).toBeDefined();
    });

    describe("JWE settings", () => {
        it("should confirm the required settings for JWE forge and verification", () => {
            expect(JwtService.JWS_ALG).toBe("HS512");
            expect(JwtService.JWE_ALG).toBe("RSA-OAEP-512");
            expect(JwtService.JWE_ENC).toBe("A256GCM");
        });

        it("should make sure the secret key is 32 bytes long", () => {
            expect(
                Test.createTestingModule({
                    providers: [
                        JwtService,
                        {
                            provide: ConfigService,
                            useValue: {
                                get: jest
                                    .fn()
                                    .mockImplementation(
                                        (property: string): string =>
                                            property !== "JWT_SECRET"
                                                ? fakeEnv[property]
                                                : "invalidkeylength"
                                    )
                            }
                        }
                    ]
                }).compile()
            ).rejects.toThrow(Error);
        });
    });

    describe("JWE forge", () => {
        it("should forge a new JWE", async () => {
            const _payload = { id: randomUUID() };
            const jwe = await jwtService.forgeJwe(_payload);
            expect(jwtService.areKeysLoaded()).toBe(true);
            const segments = jwe.split(".", 2);

            const decodedHeader = b64decode(segments[0]);
            expect(JSON.parse(decodedHeader)).toStrictEqual({
                alg: JwtService.JWE_ALG,
                enc: JwtService.JWE_ENC
            });

            const decodedPayload = b64decode(segments[1]);
            expect(() => JSON.parse(decodedPayload)).toThrow(SyntaxError);
        });
    });

    describe("JWE verify", () => {
        it("should return the paylaod from the jwe", async () => {
            const jwe = await jwtService.forgeJwe({ id: randomUUID() });
            const jwt = (await jwtService.verifyJwe(jwe, false)) as any;
            expect(jwtService.areKeysLoaded()).toBe(true);

            expect(jwt.id).toMatch(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
            );
        });
        it("should return an error as the jwe is expired", async () => {
            const jwe = await jwtService.forgeJwe({ id: randomUUID() });
            const timeout = setTimeout(async function () {
                try {
                    await jwtService.verifyJwe(jwe);
                    fail("JWE must have expired.");
                } catch (e) {
                    expect(e).toBeInstanceOf(
                        jose.errors.JWTClaimValidationFailed
                    );
                }
                clearTimeout(timeout);
            }, 3500);
        });
    });
});
