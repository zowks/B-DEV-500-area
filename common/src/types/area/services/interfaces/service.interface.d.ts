import { AreaDiscordEmbed } from "../discord/interfaces/discordEmbed.interface";
import { AreaYouTubeVideo } from "../youtube/interfaces/youtubeVideo.interface";
export interface AreaServiceAuth {
    readonly apiKey?: string;
    readonly oauth?: string;
    readonly webhook?: string;
}
export interface ActionDescription {
    description: string;
    oauthScopes?: string[];
    auth?: keyof AreaServiceAuth;
    trigger: (auth: AreaServiceAuth) => Promise<AreaYouTubeVideo>;
}
export interface ReactionDescription {
    description: string;
    oauthScopes?: string[];
    auth?: keyof AreaServiceAuth;
    produce: (auth: AreaServiceAuth, data: AreaDiscordEmbed) => Promise<void>;
}
