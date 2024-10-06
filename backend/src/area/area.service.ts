import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { User } from "../users/interfaces/user.interface";
import { CreateAreaDto } from "./dto/createArea.dto";
import { OAuthService } from "../oauth/oauth.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { YOUTUBE_ACTIONS } from "./services/youtube/youtube.actions";
import { YOUTUBE_REACTIONS } from "./services/youtube/youtube.reactions";
import { DISCORD_ACTIONS } from "./services/discord/discord.actions";
import { DISCORD_REACTIONS } from "./services/discord/discord.reactions";
import {
    ActionDescription,
    ReactionDescription
} from "./services/interfaces/service.interface";
import { PrismaService } from "../prisma/prisma.service";
import { Area, AreaAction, AreaReaction } from "./interfaces/area.interface";
import { AreaStatus, Area as PrismaArea } from "@prisma/client";
import { UpdateAreaDto } from "./dto/updateArea.dto";

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
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => SchedulerService))
        private readonly schedulerService: SchedulerService,
        private readonly oauthService: OAuthService
    ) {}

    getAction(actionId: string): AreaAction {
        const [actionService, actionMethod] = actionId.split(/\./);

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

    getReaction(reactionId: string): AreaReaction {
        const [reactionService, reactionMethod] = reactionId.split(/\./);

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

    private prismaAreaToArea({
        id,
        name,
        description,
        actionId,
        reactionId,
        reactionBody,
        reactionFields,
        delay,
        status
    }: Partial<PrismaArea>): Area {
        return {
            id,
            action_id: actionId,
            reaction_id: reactionId,
            delay,
            description,
            name,
            reaction_body: reactionBody as object,
            reaction_fields: reactionFields as object,
            status
        };
    }

    async findMany(userId: Pick<User, "id">["id"]): Promise<Area[]> {
        const areas = await this.prismaService.area.findMany({
            select: {
                oauthCredential: {
                    where: {
                        userId
                    }
                },
                id: true,
                name: true,
                description: true,
                actionId: true,
                reactionId: true,
                reactionBody: true,
                reactionFields: true,
                delay: true,
                oauthCredentialId: true,
                status: true
            }
        });
        return areas.map(this.prismaAreaToArea);
    }

    private async findUnique(
        areaId: Pick<Area, "id">["id"]
    ): Promise<PrismaArea> {
        const area = await this.prismaService.area.findUnique({
            where: {
                id: areaId
            },
            select: {
                oauthCredential: true,
                id: true,
                name: true,
                description: true,
                actionId: true,
                reactionId: true,
                reactionBody: true,
                reactionFields: true,
                delay: true,
                oauthCredentialId: true,
                status: true
            }
        });
        if (null === area) throw new NotFoundException();
        return area;
    }

    async schedule(areaId: PrismaArea["id"]) {
        const area = await this.findUnique(areaId);
        const action = this.getAction(area.actionId);
        const reaction = this.getReaction(area.reactionId);
        const taskName = `${area.id}|${action.service}.${action.method}|${reaction.service}.${reaction.method}`;

        if (
            AreaStatus.ERROR === area.status ||
            AreaStatus.STOPPED === area.status
        ) {
            this.schedulerService.stopPolling(taskName);
            return;
        }

        const credentialsManager = this.oauthService.getOAuthCredentialsManager(
            action.service
        );

        this.schedulerService.startPolling({
            areaId,
            name: taskName,
            credentialsManager,
            oauthCredentialId: area.oauthCredentialId,
            action,
            reaction,
            reactionBody: area.reactionBody as object,
            reactionFields: area.reactionFields as object,
            delay: area.delay
        });
    }

    async create(
        userId: Pick<User, "id">["id"],
        createAreaDto: CreateAreaDto
    ): Promise<Area> {
        const action = this.getAction(createAreaDto.actionId);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const reaction = this.getReaction(createAreaDto.reactionId);

        const credentialsManager = this.oauthService.getOAuthCredentialsManager(
            action.service
        );

        const oauthCredentialId = (
            await credentialsManager.loadCredentials(userId)
        )[0].id;

        const area = await this.prismaService.area.create({
            data: {
                name: createAreaDto.name,
                description: createAreaDto.description,
                actionId: createAreaDto.actionId,
                reactionId: createAreaDto.reactionId,
                reactionFields: createAreaDto.reactionFields,
                reactionBody: createAreaDto.reactionBody,
                delay: createAreaDto.delay,
                oauthCredentialId
            },
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                reactionId: true,
                reactionBody: true,
                reactionFields: true,
                delay: true,
                status: true
            }
        });

        return this.prismaAreaToArea(area);
    }

    async update(
        areaId: Area["id"],
        updateAreaDto: UpdateAreaDto
    ): Promise<Area> {
        const updated = await this.prismaService.area.update({
            where: {
                id: areaId
            },
            data: updateAreaDto,
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                reactionId: true,
                reactionBody: true,
                reactionFields: true,
                delay: true,
                status: true
            }
        });

        await this.schedule(areaId);

        return this.prismaAreaToArea(updated);
    }
}
