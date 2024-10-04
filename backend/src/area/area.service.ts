import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/users/interfaces/user.interface";
import { CreateAreaDto } from "./dto/create_area.dto";
import { OAuthService } from "src/oauth/oauth.service";
import { SchedulerService } from "src/scheduler/scheduler.service";
import { YOUTUBE_ACTIONS } from "./services/youtube/youtube.actions";
import { YOUTUBE_REACTIONS } from "./services/youtube/youtube.reactions";
import { DISCORD_ACTIONS } from "./services/discord/discord.actions";
import { DISCORD_REACTIONS } from "./services/discord/discord.reactions";
import {
    ActionDescription,
    ReactionDescription
} from "./services/interfaces/service.interface";

@Injectable()
export class AreaService {
    private readonly actions = {
        youtube: YOUTUBE_ACTIONS,
        discord: DISCORD_ACTIONS
    };

    private readonly reactions = {
        youtube: YOUTUBE_REACTIONS,
        discord: DISCORD_REACTIONS
    };

    constructor(
        private readonly schedulerService: SchedulerService,
        private readonly oauthService: OAuthService
    ) {}

    private getAction(createAreaDto: CreateAreaDto): {
        service: string;
        method: string;
        config: ActionDescription;
    } {
        const [actionService, actionMethod] =
            createAreaDto.actionId.split(/\./);

        if (!Object.keys(this.actions).includes(actionService))
            throw new NotFoundException(
                `Invalid action service ID : ${actionService}.`
            );

        const action: ActionDescription =
            this.actions[actionService][actionMethod];
        if (undefined !== action)
            return {
                service: actionService,
                method: actionMethod,
                config: action
            };
        throw new NotFoundException(`Invalid action method : ${actionMethod}.`);
    }

    private getReaction(createAreaDto: CreateAreaDto): {
        service: string;
        method: string;
        config: ReactionDescription;
    } {
        const [reactionService, reactionMethod] =
            createAreaDto.reactionId.split(/\./);

        if (!Object.keys(this.reactions).includes(reactionService))
            throw new NotFoundException(
                `Invalid reaction service ID : ${reactionService}.`
            );

        const reaction: ReactionDescription =
            this.reactions[reactionService][reactionMethod];
        if (undefined !== reaction)
            return {
                service: reactionService,
                method: reactionMethod,
                config: reaction
            };
        throw new NotFoundException(
            `Invalid reaction method : ${reactionMethod}.`
        );
    }

    async create(userId: Pick<User, "id">["id"], createAreaDto: CreateAreaDto) {
        const action = this.getAction(createAreaDto);
        const reaction = this.getReaction(createAreaDto);

        const credentialsManager = this.oauthService.getOAuthCredentialsManager(
            action.service
        );

        await this.schedulerService.startPolling(
            {
                action,
                reaction
            },
            {
                userId,
                oauthManager: credentialsManager,
                action: action.config.trigger,
                reaction: reaction.config.produce,
                fields: createAreaDto.fields,
                reactionBody: createAreaDto.reactionBody,
                delay: createAreaDto.delay
            }
        );
    }
}
