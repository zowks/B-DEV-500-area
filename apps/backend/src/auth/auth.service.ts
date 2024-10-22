import {
    ConflictException,
    ForbiddenException,
    Injectable,
    UnprocessableEntityException
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Argon2Service } from "../argon2/argon2.service";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly argon2Service: Argon2Service,
        readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<void> {
        if (!registerDto.has_accepted_terms_and_conditions)
            throw new UnprocessableEntityException();

        const hashedPassword = await this.argon2Service.hashPassword(
            registerDto.password
        );

        try {
            const createdUser = await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    firstname: registerDto.firstname,
                    lastname: registerDto.lastname,
                    hashedPassword
                },
                select: {
                    id: true
                }
            });
            await this.jwtService.forgeJwe({ id: createdUser.id });
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                "P2002" === e.code
            )
                throw new ConflictException();

            throw e;
        }
    }

    async login(loginDto: LoginDto): Promise<string> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: loginDto.email
            },
            select: {
                id: true,
                hashedPassword: true
            }
        });

        if (null === user) throw new ForbiddenException();

        const isPasswordValid = await this.argon2Service.verifyPassword(
            user.hashedPassword,
            loginDto.password
        );
        if (!isPasswordValid) throw new ForbiddenException();

        return await this.jwtService.forgeJwe({ id: user.id });
    }
}
