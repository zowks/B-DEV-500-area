import { AreaDiscordEmbed } from "../discord/interfaces/discordEmbed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtubeVideo.interface";
export declare class ActionField {
    readonly name: keyof AreaServiceAuth;
    readonly description: string;
}
export declare class ReactionField {
    readonly name: keyof AreaServiceAuth;
    readonly description: string;
}
export interface AreaServiceAuth {
    readonly apiKey?: string;
    readonly oauth?: string;
    readonly webhook?: string;
}
export interface ActionDescription {
    description: string;
    oauthScopes: string[];
    fields: {
        name: keyof AreaServiceAuth;
        description: string;
    }[];
    trigger: (auth: AreaServiceAuth) => Promise<AreaYouTubeVideo>;
}
export interface ReactionDescription {
    description: string;
    oauthScopes: string[];
    fields: {
        name: keyof AreaServiceAuth;
        description: string;
    }[];
    produce: (auth: AreaServiceAuth, data: AreaDiscordEmbed) => Promise<void>;
}
