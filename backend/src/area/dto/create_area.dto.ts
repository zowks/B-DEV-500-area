import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, Matches } from "class-validator";

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

    @ApiProperty({
        description:
            "The fields represent the required elements to make the reaction possible. For instance, it may contain a webhook URL.",
        example: {
            webhook:
                "https://discord.com/api/webhooks/XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX"
        }
    })
    @IsObject()
    readonly fields: object;
}
