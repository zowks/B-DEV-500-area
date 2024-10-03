import { ApiProperty } from "@nestjs/swagger";
import { YouTubeService } from "src/polling/youtube/youtube.service";
import { DiscordService } from "src/webhook/discord/discord.service";

export type ActionTrigger = (accessToken: string) => Promise<any>;

export type ActionTriggers = {
    [name: string]: ActionTrigger;
};

export abstract class Action {
    abstract get triggers(): ActionTriggers;
    static get endpoints(): string[] {
        return [];
    }
}

export abstract class Actions {
    @ApiProperty({
        description: "The available YouTube action endpoints",
        example: YouTubeService.endpoints
    })
    readonly youtube: string[];
}

export type ReactionTrigger = (
    webhookUrl: string,
    fields: { [k: string]: string },
    data: any
) => Promise<any>;

export type ReactionTriggers = {
    [name: string]: ReactionTrigger;
};

export abstract class Reaction {
    abstract get triggers(): ReactionTriggers;
    static get endpoints(): string[] {
        return [];
    }
}

export abstract class Reactions {
    @ApiProperty({
        description: "The available Discord reaction endpoints",
        example: DiscordService.endpoints
    })
    readonly discord: string[];
}
