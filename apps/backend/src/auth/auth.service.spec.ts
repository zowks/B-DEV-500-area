import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import {
    ForbiddenException,
    UnprocessableEntityException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { Argon2Service } from "src/argon2/argon2.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaClient } from "@prisma/client";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { randomUUID } from "node:crypto";

const users = [
    {
        id: "30613b7a-11a4-4864-a05b-2d7854b00e6e",
        email: "Vivianne.Blanda@gmail.com",
        hashedPassword: "MygfvmlwZi3agN6X-hashed",
        firstname: "Vivianne",
        lastname: "Blanda",
        isAdmin: false
    },
    {
        id: "4efa9c4a-49da-432a-b806-b4d52b6fc765",
        email: "Enola.Sipes97@hotmail.com",
        hashedPassword: "Ti7E99bVxlXxmIiy-hashed",
        firstname: "Enola",
        lastname: "Sipes",
        isAdmin: false
    },
    {
        id: "6104ad42-14c9-4a6b-a12b-7562f49ab4d0",
        email: "Shayne_Dare@hotmail.com",
        hashedPassword: "liNBKOFz19SAcAeJ-hashed",
        firstname: "Shayne",
        lastname: "Dare",
        isAdmin: false
    },
    {
        id: "dd9f2e0e-9eaf-442e-9c38-038af26ad2fc",
        email: "Gretchen.Emard46@gmail.com",
        hashedPassword: "d4NpYSZXtFkSmPsv-hashed",
        firstname: "Gretchen",
        lastname: "Emard",
        isAdmin: true
    },
    {
        id: "9553b48a-6983-4783-ab44-14411bd4ed57",
        email: "Orlo.Feest@hotmail.com",
        hashedPassword: "J5Vy6IrNLI9buRgS-hashed",
        firstname: "Orlo",
        lastname: "Feest",
        isAdmin: true
    },
    {
        id: "d234318f-8f9e-4a15-af3d-f752f7e04b27",
        email: "Zachary_Feil@gmail.com",
        hashedPassword: "FguCWpHgIzleQuhn-hashed",
        firstname: "Zachary",
        lastname: "Feil",
        isAdmin: true
    },
    {
        id: "43820a4e-77af-491f-84e3-94808395015b",
        email: "Mason_Runte@hotmail.com",
        hashedPassword: "RdaOvJff2uWAetfP-hashed",
        firstname: "Mason",
        lastname: "Runte",
        isAdmin: true
    },
    {
        id: "e72af15a-3d6b-4a04-8855-d06ced48e94b",
        email: "Ken_Kuhic@gmail.com",
        hashedPassword: "yWHGF97ljT5Kgx4X-hashed",
        firstname: "Ken",
        lastname: "Kuhic",
        isAdmin: true
    }
];

describe("AuthService", () => {
    let authService: AuthService;
    let prismaService: DeepMockProxy<PrismaClient>;
    let argon2Service: Argon2Service;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        prismaService = mockDeep<PrismaClient>();
        jwtService = {
            forgeJwe: jest
                .fn()
                .mockImplementation((data) => Promise.resolve(data))
        };
        argon2Service = {
            hashPassword: jest
                .fn()
                .mockImplementation((password: string) =>
                    Promise.resolve(password + "-hashed")
                ),
            verifyPassword: jest
                .fn()
                .mockImplementation(
                    async (hash: string, password: string) =>
                        hash === (await argon2Service.hashPassword(password))
                )
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: prismaService },
                { provide: JwtService, useValue: jwtService },
                { provide: Argon2Service, useValue: argon2Service }
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    describe("Register a new user", () => {
        it("should create the user", async () => {
            const registerDto: RegisterDto = {
                email: "email.is.not.used@example.com",
                password: "password",
                firstname: "John",
                lastname: "DOE",
                has_accepted_terms_and_conditions: true
            };

            prismaService.user.create.mockResolvedValueOnce({
                id: randomUUID()
            } as any);

            expect(await authService.register(registerDto)).toBe(void 0);
            expect(argon2Service.hashPassword).toHaveBeenCalledWith(
                registerDto.password
            );

            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: registerDto.email,
                    hashedPassword: `${registerDto.password}-hashed`,
                    firstname: registerDto.firstname,
                    lastname: registerDto.lastname
                },
                select: {
                    id: true
                }
            });
        });

        it("should not create the user (email is already taken)", async () => {
            const user = users[0];
            const registerDto: RegisterDto = {
                email: user.email,
                password: user.hashedPassword.replace(/\-hashed$/, ""),
                firstname: user.firstname,
                lastname: user.lastname,
                has_accepted_terms_and_conditions: true
            };

            prismaService.user.create.mockResolvedValueOnce({
                id: user.id
            } as any);

            try {
                await authService.register(registerDto);
            } catch (e) {
                console.error(e);
                expect(e).toBeInstanceOf(UnprocessableEntityException);
            }

            expect(argon2Service.hashPassword).toHaveBeenCalledWith(
                registerDto.password
            );
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: registerDto.email,
                    hashedPassword: `${registerDto.password}-hashed`,
                    firstname: registerDto.firstname,
                    lastname: registerDto.lastname
                },
                select: { id: true }
            });
        });

        it("should not create the user (terms and conditions were rejected)", async () => {
            const registerDto: RegisterDto = {
                email: "email.is.not.used@example.com",
                password: "password",
                firstname: "John",
                lastname: "DOE",
                has_accepted_terms_and_conditions: false
            };

            try {
                await authService.register(registerDto);
            } catch (e) {
                expect(e).toBeInstanceOf(UnprocessableEntityException);
            }

            expect(argon2Service.hashPassword).not.toHaveBeenCalled();
            expect(prismaService.user.create).not.toHaveBeenCalled();
        });
    });

    describe("Login", () => {
        it("should return the current user", async () => {
            const user = users[0];
            const loginDto: LoginDto = {
                email: user.email,
                password: user.hashedPassword.replace("-hashed", "")
            };

            prismaService.user.findUnique.mockResolvedValueOnce(user);

            expect(await authService.login(loginDto)).toStrictEqual({
                id: expect.stringMatching(
                    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
                )
            });
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: loginDto.email
                },
                select: {
                    id: true,
                    hashedPassword: true
                }
            });

            expect(argon2Service.verifyPassword).toHaveBeenCalledWith(
                user.hashedPassword,
                loginDto.password
            );
        });

        it("should not return a user (user does not exist)", async () => {
            const loginDto: LoginDto = {
                email: "invalid.email@example.com",
                password: "password"
            };

            prismaService.user.findUnique.mockResolvedValueOnce(null);

            try {
                await authService.login(loginDto);
            } catch (e) {
                expect(e).toBeInstanceOf(ForbiddenException);
            }
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email },
                select: { id: true, hashedPassword: true }
            });
            expect(argon2Service.verifyPassword).not.toHaveBeenCalled();
        });

        it("should not return a user (password do not match)", async () => {
            const user = users[0];
            const loginDto: LoginDto = {
                email: user.email,
                password: "invalid password"
            };
            prismaService.user.findUnique.mockResolvedValueOnce({
                email: user.email,
                hashedPassword: user.hashedPassword
            } as any);

            try {
                await authService.login(loginDto);
            } catch (e) {
                expect(e).toBeInstanceOf(ForbiddenException);
            }
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email },
                select: { id: true, hashedPassword: true }
            });
            expect(argon2Service.verifyPassword).toHaveBeenCalledWith(
                user.hashedPassword,
                loginDto.password
            );
        });
    });
});
