import { ApiProperty } from "@nestjs/swagger";
import { AreaDiscordEmbed } from "../discord/interfaces/discordEmbed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtubeVideo.interface";

export class ActionField {
    @ApiProperty({
        description: "The name of the field.",
        type: String,
        examples: ["apiKey", "oauth", "webhook"]
    })
    readonly name: keyof AreaServiceAuth;

    @ApiProperty({
        description: "The name of the field.",
        example: "The GitHub webhook URL to get data on action."
    })
    readonly description: string;
}

export class ReactionField {
    @ApiProperty({
        description: "The name of the field.",
        type: String,
        examples: ["apiKey", "oauth", "webhook"]
    })
    readonly name: keyof AreaServiceAuth;

    @ApiProperty({
        description: "The name of the field.",
        example: "The Discord webhook URL to execute on reaction."
    })
    readonly description: string;
}

export interface AreaServiceAuth {
    readonly apiKey?: string;
    readonly oauth?: string;
    readonly webhook?: string;
}

export interface ActionDescription {
    description: string;
    oauthScopes?: string[];
    fields: { name: keyof AreaServiceAuth; description: string }[];
    trigger: (auth: AreaServiceAuth) => Promise<AreaYouTubeVideo>;
}

export interface ReactionDescription {
    description: string;
    oauthScopes?: string[];
    fields: { name: keyof AreaServiceAuth; description: string }[];
    produce: (auth: AreaServiceAuth, data: AreaDiscordEmbed) => Promise<void>;
}
