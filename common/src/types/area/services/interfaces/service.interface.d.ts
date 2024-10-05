import { AreaDiscordEmbed } from "../discord/interfaces/discordEmbed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtubeVideo.interface";
export declare class ReactionField {
    readonly name: string;
    readonly type: string;
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
