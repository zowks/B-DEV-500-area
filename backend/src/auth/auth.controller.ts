import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnprocessableEntityResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@ApiTags("authentication")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    @ApiExtraModels(LoginResponseDto)
    @ApiCreatedResponse({
        description:
            "Creates a new user account. An access token is returned. It must be present as a Bearer token to talk to the API.",
        schema: {
            $ref: getSchemaPath(LoginResponseDto)
        }
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
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<LoginResponseDto> {
        const accessToken = await this.authService.register(registerDto);
        return { access_token: accessToken };
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
}
