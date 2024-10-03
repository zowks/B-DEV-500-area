import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/users/interfaces/user.interface";
import { CreateAreaDto } from "./dto/create_area.dto";
import { YouTubeService } from "src/polling/youtube/youtube.service";
import { DiscordService } from "src/webhook/discord/discord.service";
import {
    Actions,
    ActionTriggers,
    Reactions,
    ReactionTriggers
} from "./interfaces/services.interface";
import { OAuthService } from "src/oauth/oauth.service";
import { SchedulerService } from "src/scheduler/scheduler.service";

@Injectable()
export class AreaService {
    readonly actionsEndpoints: Actions;
    private readonly actionsTriggers: Record<string, ActionTriggers>;

    readonly reactionsEndpoints: Reactions;
    private readonly reactionsTriggers: Record<string, ReactionTriggers>;

    constructor(
        private readonly schedulerService: SchedulerService,
        private readonly oauthService: OAuthService,
        private readonly youtubeService: YouTubeService,
        private readonly discordService: DiscordService
    ) {
        this.actionsEndpoints = { youtube: YouTubeService.endpoints };
        this.reactionsEndpoints = { discord: DiscordService.endpoints };
        this.actionsTriggers = { youtube: this.youtubeService.triggers };
        this.reactionsTriggers = { discord: this.discordService.triggers };
    }

    async create(userId: Pick<User, "id">["id"], createAreaDto: CreateAreaDto) {
        const [actionService, actionMethod] =
            createAreaDto.actionId.split(/\./);
        const [reactionService, reactionMethod] =
            createAreaDto.reactionId.split(/\./);

        if (!Object.keys(this.actionsTriggers).includes(actionService))
            throw new NotFoundException(
                `Invalid action service ID : ${actionService}.`
            );

        const action = this.actionsTriggers[actionService][actionMethod];
        if (undefined === action)
            throw new NotFoundException(
                `Invalid action method : ${actionMethod}.`
            );

        if (!Object.keys(this.reactionsTriggers).includes(reactionService))
            throw new NotFoundException(
                `Invalid reaction service ID : ${reactionService}.`
            );

        const reaction =
            this.reactionsTriggers[reactionService][reactionMethod];
        if (undefined === reaction)
            throw new NotFoundException(
                `Invalid reaction method : ${reactionMethod}.`
            );

        const credentialsManager =
            this.oauthService.getOAuthCredentialsManager(actionService);

        this.schedulerService.startPolling(
            {
                action: {
                    service: actionService,
                    method: actionMethod
                },
                reaction: {
                    service: reactionService,
                    method: reactionMethod
                }
            },
            {
                userId,
                oauthManager: credentialsManager,
                action,
                reaction,
                webhookUrl: createAreaDto.reactionWebhookUrl,
                fields: createAreaDto.fields,
                delay: 10 * 1000
            }
        );
    }
}
