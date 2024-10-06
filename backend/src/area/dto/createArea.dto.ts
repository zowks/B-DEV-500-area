import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    MaxLength
} from "class-validator";
import { AreaServiceAuthDto } from "./areaServiceAuth.dto";

export class CreateAreaDto {
    @ApiProperty({
        description: "The name of the AREA being created.",
        example: "LikeNotifier"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({
        description: "The description of the AREA being created.",
        example:
            "This AREA will notify me every time I like a new video via a Discord webhook."
    })
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({
        description:
            "The action ID. It must contain the service and the method separated by a dot.",
        example: "youtube.on_liked_video"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly actionId: string;

    @ApiPropertyOptional({
        description:
            "The action service authentication method used to receive data.",
        type: AreaServiceAuthDto,
        examples: [
            { apiKey: "<API_KEY_HERE>" },
            { oauth: 1 },
            { webhook: "https://example.com/webhookId/webhookSecret" }
        ]
    })
    @IsObject()
    @IsOptional()
    readonly actionAuth: AreaServiceAuthDto;

    @ApiProperty({
        description:
            "The reaction ID. It must contain the service and the method separated by a dot.",
        example: "discord.send_embed"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly reactionId: string;

    @ApiPropertyOptional({
        description:
            "The object representing the reaction payload. It may contain variables from the action object.",
        example: {
            title: "You liked the video {{title}}.",
            description: "You can access the video by clicking [here]({{url}})",
            imageUrl: "{{thumbnail}}",
            authorName: "{{channelName}}",
            authorUrl: "https://youtube.com/channel/{{channelId}}"
        }
    })
    @IsObject()
    readonly reactionBody: object;

    @ApiPropertyOptional({
        description:
            "The reaction service authentication method used to post data.",
        type: AreaServiceAuthDto,
        examples: [
            { apiKey: "<API_KEY_HERE>" },
            { oauth: 1 },
            { webhook: "https://example.com/webhookId/webhookSecret" }
        ]
    })
    @IsObject()
    @IsOptional()
    readonly reactionAuth: AreaServiceAuthDto;

    @ApiProperty({
        description:
            "The delay in seconds to which the poll-based event should be triggered.",
        example: 10
    })
    @IsNumber()
    @IsPositive()
    readonly delay: number;
}