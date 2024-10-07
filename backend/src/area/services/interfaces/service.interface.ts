import { AreaDiscordEmbed } from "../discord/interfaces/discord_embed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtube_video.interface";

export interface DescriptionParam {
    name: string;
    type: string;
    description: string;
}

export interface ActionDescription {
    description: string;
    params: DescriptionParam[];
    trigger: (accessToken: string) => Promise<AreaYouTubeVideo>;
}

export interface ReactionDescription {
    description: string;
    params: DescriptionParam[];
    produce: (fields: object, data: AreaDiscordEmbed) => Promise<void>;
}
