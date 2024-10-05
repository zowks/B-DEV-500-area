import { ApiPropertyOptional } from "@nestjs/swagger";
import { AreaStatus } from "@prisma/client";
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength
} from "class-validator";

export class UpdateAreaDto {
    @ApiPropertyOptional({
        description: "The name of the AREA being created.",
        example: "LikeNotifier"
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name?: string;

    @ApiPropertyOptional({
        description: "The description of the AREA being created.",
        example:
            "This AREA will notify me every time I like a new video via a Discord webhook."
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly description?: string;

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
    @IsOptional()
    @IsObject()
    readonly reactionBody?: object;

    @ApiPropertyOptional({
        description:
            "The fields represent the required elements to make the reaction possible. For instance, it may contain a webhook URL.",
        example: {
            webhook:
                "https://discord.com/api/webhooks/XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX"
        }
    })
    @IsOptional()
    @IsObject()
    readonly reactionFields?: object;

    @ApiPropertyOptional({
        description:
            "The delay in seconds to which the poll-based event should be triggered.",
        example: 10
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    readonly delay?: number;

    @ApiPropertyOptional({
        description: "The AREA status.",
        enum: [AreaStatus.RUNNING, AreaStatus.STOPPED, AreaStatus.ERROR]
    })
    readonly status?: AreaStatus;
}
