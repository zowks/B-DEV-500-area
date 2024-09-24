import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {}
}
