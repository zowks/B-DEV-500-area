import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDate,
    IsString,
    IsUrl,
    Matches,
    IsOptional,
    IsNumber
} from "class-validator";

export class AreaDiscordEmbed {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "The title of the embed." })
    readonly title?: string;

    @IsString({})
    @Matches(/^rich$/)
    @ApiProperty({
        default: "rich",
        description: "The type of the embed. Always 'rich' for a Webhook."
    })
    readonly type?: "rich";

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "The description of the embed." })
    readonly description?: string;

    @IsUrl()
    @IsOptional()
    @ApiPropertyOptional({
        description: "The title URL. It makes the title of the embed clickable."
    })
    readonly url?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    @ApiPropertyOptional({
        description: "The timestamp to which the embed has been created."
    })
    readonly timestamp?: Date;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "The left sidebar color of the embed. The value must be an RGB color formated as a number."
    })
    readonly color?: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "The footer of the embed."
    })
    readonly footer?: string;

    @IsUrl()
    @IsOptional()
    @ApiPropertyOptional({
        description: "The image of the embed. Wider than the thumbnail."
    })
    readonly imageUrl?: string;

    @IsUrl()
    @IsOptional()
    @ApiPropertyOptional({
        description: "The thumbnail of the embed. Narrower than the image."
    })
    readonly thumbnailUrl?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "The author name."
    })
    readonly authorName?: string;

    @IsUrl()
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "The author URL. It makes the author of the embed clickable."
    })
    readonly authorUrl?: string;
}
