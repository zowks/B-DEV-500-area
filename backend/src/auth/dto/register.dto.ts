import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class RegisterDto {
    @IsEmail()
    @MaxLength(254)
    @IsNotEmpty()
    @ApiProperty({
        description:
            "The email to be registered. It must be unique. If it's not, an error will be returned.",
        maxLength: 254,
        example: "john.doe@email-provider.com"
    })
    readonly email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @ApiProperty({
        description:
            "The password the user wants to log in with. It may or may not be hashed by the frontend, as it will get hashed by the backend anyway.",
        minLength: 8,
        example: "PasswordOf8OrMoreCharacters"
    })
    readonly password: string;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: "The user's first name",
        maxLength: 255,
        example: "John"
    })
    readonly firstname: string;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        description: "The user's last name",
        maxLength: 255,
        example: "DOE"
    })
    readonly lastname: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        description:
            "The user must accepts the termes and conditions of the services in order to create it's account. By default the value is set to 'false'. The users has to set it to true, which will be asserted by the backend.",
        default: false,
        type: "boolean",
        examples: [true, false]
    })
    readonly has_accepted_terms_and_conditions: boolean;
}
