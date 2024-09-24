import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Argon2Service } from 'src/argon2/argon2.service';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly argon2Service: Argon2Service,
  ) {}

  async register(registerDto: RegisterDto): Promise<Pick<User, 'id'>> {
    if (!registerDto.has_accepted_terms_and_conditions)
      throw new UnprocessableEntityException();

    const hashedPassword = await this.argon2Service.hashPassword(
      registerDto.password,
    );

    try {
      return await this.prismaService.users.create({
        data: {
          email: registerDto.email,
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          hashed_password: hashedPassword,
        },
        select: {
          id: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && 'P2002' === e.code)
        throw new ConflictException();

      throw e;
    }
  }

  async login(loginDto: LoginDto): Promise<Pick<User, 'id'>> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: loginDto.email,
      },
      select: {
        email: true,
        hashed_password: true,
        id: true,
      },
    });

    if (null === user) throw new ForbiddenException();

    if (
      !this.argon2Service.verifyPassword(
        user.hashed_password,
        loginDto.password,
      )
    )
      throw new ForbiddenException();

    return { id: user.id };
  }
}
