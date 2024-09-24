import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Creates a new user account.',
  })
  @ApiConflictResponse({
    description: 'The email is already taken.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Some of the fields are incorrect. Make sure it fits the Register DTO.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The credentials are OK.',
  })
  @ApiForbiddenResponse({
    description: 'Either the email or password or both are invalid.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Some of the fields are incorrect. Make sure it fits the Login DTO.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
