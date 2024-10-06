import { ApiProperty } from "@nestjs/swagger";
import { AreaDiscordEmbed } from "../discord/interfaces/discordEmbed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtubeVideo.interface";

export class ReactionField {
    @ApiProperty({
        description: "The name of the field.",
        example: "webhook"
    })
    readonly name: string;

    @ApiProperty({
        description: "The type of the field.",
        example: "string"
    })
    readonly type: string;

    @ApiProperty({
        description: "The name of the field.",
        example: "The Discord webhook URL to execute on reaction."
    })
    readonly description: string;
}

export interface ActionDescription {
    description: string;
    trigger: (accessToken: string) => Promise<AreaYouTubeVideo>;
}

export interface ReactionDescription {
    description: string;
    fields: ReactionField[];
    produce: (fields: object, data: AreaDiscordEmbed) => Promise<void>;
}
