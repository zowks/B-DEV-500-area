import { ApiPropertyOptional } from "@nestjs/swagger";
import { OAuthCredential } from "@prisma/client";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Matches,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ name: "OneFieldDefined", async: false })
class OneFieldDefinedConstraint implements ValidatorConstraintInterface {
    validate(object: AreaServiceAuthDto) {
        const optionalKeys = ["apiKey", "oauth", "webhook"];
        const definedKeys = optionalKeys.filter(
            (key) => object[key] !== undefined && object[key] !== null
        );

        return definedKeys.length === 1;
    }

    defaultMessage(args: ValidationArguments) {
        return `Exactly one of the fields (${args.property}) must be defined.`;
    }
}

export class AreaServiceAuthDto {
    @ApiPropertyOptional({
        description:
            "The API key used to interact with the action or reaction service.",
        type: String
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Validate(OneFieldDefinedConstraint)
    readonly apiKey?: string;

    @ApiPropertyOptional({
        description:
            "The OAuth credential ID used to interact with the action or reaction service.",
        type: Number
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Validate(OneFieldDefinedConstraint)
    readonly oauth?: OAuthCredential["id"];

    @ApiPropertyOptional({
        description:
            "The webhook URL used to get data from the actoin service or post data to the reaction service. The value for an action MUST BE 'local'.",
        type: String,
        examples: [
            "local",
            "https://discord.com/webhooks/webhookId/webhookSecret"
        ]
    })
    @IsUrl()
    @Matches(/^local$/)
    @IsOptional()
    @Validate(OneFieldDefinedConstraint)
    readonly webhook?: string;
}
