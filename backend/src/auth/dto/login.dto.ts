import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @ApiProperty({
    description: 'The email to log the user in with.',
    maxLength: 254,
    example: 'john.doe@email-provider.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'The password to log the user in with.',
    minLength: 8,
  })
  readonly password: string;
}
