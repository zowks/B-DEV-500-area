import { ApiPropertyOptional } from "@nestjs/swagger";
import { OAuthCredential } from "@prisma/client";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl
} from "class-validator";

export class AreaServiceAuthDto {
    @ApiPropertyOptional({
        description:
            "The API key used to interact with the action or reaction service.",
        type: String
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly apiKey?: string;

    @ApiPropertyOptional({
        description:
            "The OAuth credential ID used to interact with the action or reaction service.",
        type: Number
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    readonly oauth?: OAuthCredential["id"];

    @ApiPropertyOptional({
        description:
            "The webhook URL used to get data from the actoin service or post data to the reaction service.",
        type: String
    })
    @IsUrl()
    @IsOptional()
    readonly webhook?: string;
}
