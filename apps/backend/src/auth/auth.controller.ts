import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { User } from "src/users/interfaces/user.interface";
import { JwtGuard } from "./guards/jwt.guard";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly authService: AuthService
    ) {}

    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        description:
            "Creates a new user account. The user should then be able to log itself in."
    })
    @ApiConflictResponse({
        description: "The email is already taken."
    })
    @ApiUnprocessableEntityResponse({
        description:
            "All fields match their criteria, but the user did not accept the terms and conditions."
    })
    @ApiBadRequestResponse({
        description:
            "Some of the fields are incorrect. Make sure it fits the Register DTO."
    })
    async register(@Body() registerDto: RegisterDto): Promise<void> {
        await this.authService.register(registerDto);
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    @ApiExtraModels(LoginResponseDto)
    @ApiOkResponse({
        description:
            "The credentials are OK. An access token is returned. It must be present as a Bearer token to talk to the API.",
        schema: {
            $ref: getSchemaPath(LoginResponseDto)
        }
    })
    @ApiForbiddenResponse({
        description: "Either the email or password or both are invalid."
    })
    @ApiBadRequestResponse({
        description:
            "Some of the fields are incorrect. Make sure it fits the Login DTO."
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        const accessToken = await this.authService.login(loginDto);
        return { access_token: accessToken };
    }

    @Post("/logout")
    @UseGuards(JwtGuard)
    @ApiBearerAuth("bearer")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description:
            "The user's token has been cached until it expires. The logout is successful."
    })
    @ApiUnauthorizedResponse({
        description: "The user was not logged in."
    })
    async logout(@Req() req: Request) {
        const { id } = req.user as Pick<User, "id">;
        const jwe = req.headers.authorization.slice(7);
        const { exp } = (await this.authService.jwtService.verifyJwe(jwe)) as {
            exp: number;
        };
        const now = Date.now();
        const delta = exp * 1000 - now;
        console.log(delta);
        if (0 < delta) {
            await this.cacheManager.set(jwe, id, delta);
        }
    }
}
