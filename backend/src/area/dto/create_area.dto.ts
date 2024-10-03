import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsObject,
    IsString,
    IsUrl,
    Matches
} from "class-validator";

export class CreateAreaDto {
    @ApiProperty({
        description:
            "The action ID. It must contain the service and the method separated by a dot.",
        example: "youtube.last_liked_video"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly actionId: string;

    @ApiProperty({
        description:
            "The reaction ID. It must contain the service and the method separated by a dot.",
        example: "discord.send_message"
    })
    @IsString()
    @Matches(/[a-z_]+\.[a-z_]+/)
    @IsNotEmpty()
    readonly reactionId: string;

    @ApiProperty({
        description: "The reaction webhook.",
        example: "https://discord.com/api/webhooks/XXX/XXX"
    })
    @IsUrl()
    @IsNotEmpty()
    readonly reactionWebhookUrl: string;

    @ApiProperty({
        description:
            "The fields to be used in both action and reaction. The keys are the fields of the action response object, the values are the fields of the reaction body object.",
        example: {
            title: "title",
            description: "description",
            thumbnail: "image",
            url: "url",
            channelName: "author"
        }
    })
    @IsObject()
    readonly fields: {
        [k: string]: string;
    };
}
