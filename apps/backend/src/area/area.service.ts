import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";
import { User } from "../users/interfaces/user.interface";
import { CreateAreaDto } from "./dto/createArea.dto";
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
import {
    Area,
    AreaAction,
    AreaReaction,
    AreaTask
} from "./interfaces/area.interface";
import { AreaStatus, Area as PrismaArea } from "@prisma/client";
import { UpdateAreaDto } from "./dto/updateArea.dto";
import { AreaServiceAuthDto } from "./dto/areaServiceAuth.dto";

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
        private readonly schedulerService: SchedulerService
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
        actionAuthId,
        reactionId,
        reactionBody,
        reactionAuthId,
        delay,
        status
    }: Partial<PrismaArea>): Area {
        return {
            id,
            name,
            description,
            action_id: actionId,
            action_auth_id: actionAuthId,
            reaction_id: reactionId,
            reaction_body: reactionBody as object,
            reaction_auth_id: reactionAuthId,
            delay,
            status
        };
    }

    async findMany(userId: User["id"]): Promise<Area[]> {
        const areas = await this.prismaService.area.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                actionAuthId: true,
                reactionId: true,
                reactionBody: true,
                reactionAuthId: true,
                delay: true,
                status: true
            }
        });
        return areas.map(this.prismaAreaToArea);
    }

    private async _findUnique(
        areaId: Area["id"],
        userId?: User["id"]
    ): Promise<PrismaArea> {
        const area = await this.prismaService.area.findUnique({
            where: userId
                ? {
                      id: areaId,
                      userId
                  }
                : {
                      id: areaId
                  },
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                actionAuthId: true,
                reactionId: true,
                reactionBody: true,
                reactionAuthId: true,
                delay: true,
                status: true,
                userId: true
            }
        });
        if (null === area) throw new NotFoundException();
        return area;
    }

    async findUnique(userId: User["id"], areaId: Area["id"]): Promise<Area> {
        return this.prismaAreaToArea(await this._findUnique(areaId, userId));
    }

    async getAreaTask(area: PrismaArea): Promise<AreaTask> {
        const action = this.getAction(area.actionId);
        const reaction = this.getReaction(area.reactionId);
        const taskName = `${area.id}|${action.service}.${action.method}|${reaction.service}.${reaction.method}`;

        const actionAuth =
            await this.prismaService.areaServiceAuthentication.findUnique({
                where: {
                    id: area.actionAuthId
                },
                select: {
                    apiKey: true,
                    oauth: true,
                    webhook: true
                }
            });

        const reactionAuth =
            await this.prismaService.areaServiceAuthentication.findUnique({
                where: {
                    id: area.reactionAuthId
                },
                select: {
                    apiKey: true,
                    oauth: true,
                    webhook: true
                }
            });
        return {
            areaId: area.id,
            name: taskName,
            action,
            actionAuth,
            reaction,
            reactionBody: area.reactionBody as object,
            reactionAuth,
            delay: area.delay,
            userId: area.userId
        };
    }

    async schedule(areaId: PrismaArea["id"], _area: PrismaArea = null) {
        const area = null !== _area ? _area : await this._findUnique(areaId);
        const task = await this.getAreaTask(area);

        this.schedulerService.stopPolling(task.name);
        if (area.status === AreaStatus.RUNNING)
            this.schedulerService.startPolling(task);
    }

    private checkServiceAuthRequirements(
        actionAuth: AreaServiceAuthDto,
        action: AreaAction,
        reactionAuth: AreaServiceAuthDto,
        reaction: AreaReaction
    ): boolean {
        const actionField = Object.keys(actionAuth).filter(
            (key) => key === action.config.auth
        )[0] as keyof string;

        const reactionField = Object.keys(reactionAuth).filter(
            (key) => key === reaction.config.auth
        )[0] as keyof string;
        return (
            (action.config.auth as string) === actionField &&
            (reaction.config.auth as string) === reactionField
        );
    }

    async create(
        userId: User["id"],
        createAreaDto: CreateAreaDto
    ): Promise<Area> {
        const action = this.getAction(createAreaDto.actionId);
        const reaction = this.getReaction(createAreaDto.reactionId);

        if (
            !this.checkServiceAuthRequirements(
                createAreaDto.actionAuth,
                action,
                createAreaDto.reactionAuth,
                reaction
            )
        )
            throw new UnprocessableEntityException(
                "The authentication methods for the AREA are invalid. Check the requirements at /about.json ."
            );

        const area = await this.prismaService.area.create({
            data: {
                user: { connect: { id: userId } },
                name: createAreaDto.name,
                description: createAreaDto.description,
                actionId: createAreaDto.actionId,
                actionAuth: {
                    create: createAreaDto.actionAuth
                },
                reactionId: createAreaDto.reactionId,
                reactionAuth: {
                    create: createAreaDto.reactionAuth
                },
                reactionBody: createAreaDto.reactionBody,
                delay: createAreaDto.delay
            },
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                actionAuthId: true,
                reactionId: true,
                reactionBody: true,
                reactionAuthId: true,
                delay: true,
                status: true
            }
        });

        return this.prismaAreaToArea(area);
    }

    async update(
        userId: User["id"],
        areaId: Area["id"],
        updateAreaDto: UpdateAreaDto
    ): Promise<Area> {
        const area = await this.prismaService.area.findUnique({
            where: {
                id: areaId,
                userId
            },
            select: {
                actionId: true,
                reactionId: true,
                actionAuth: true,
                reactionAuth: true
            }
        });
        const action = this.getAction(area.actionId);
        const reaction = this.getReaction(area.reactionId);

        if (
            !this.checkServiceAuthRequirements(
                updateAreaDto.actionAuth ?? area.actionAuth,
                action,
                updateAreaDto.reactionAuth ?? area.reactionAuth,
                reaction
            )
        )
            throw new UnprocessableEntityException(
                "The authentication methods for the AREA are invalid. Check the requirements at /about.json ."
            );

        const updated = await this.prismaService.area.update({
            where: {
                id: areaId
            },
            data: {
                name: updateAreaDto.name,
                description: updateAreaDto.description,
                actionAuth: {
                    update: updateAreaDto.actionAuth
                },
                reactionAuth: {
                    update: updateAreaDto.reactionAuth
                },
                reactionBody: updateAreaDto.reactionBody,
                delay: updateAreaDto.delay,
                status: updateAreaDto.status
            },
            select: {
                userId: true,
                id: true,
                name: true,
                description: true,
                actionId: true,
                actionAuthId: true,
                reactionId: true,
                reactionBody: true,
                reactionAuthId: true,
                delay: true,
                status: true
            }
        });

        await this.schedule(areaId, updated);

        return this.prismaAreaToArea(updated);
    }

    async delete(userId: User["id"], areaId: Area["id"]) {
        const area = await this._findUnique(areaId, userId);
        const task = await this.getAreaTask(area);
        this.schedulerService.stopPolling(task.name);
        return this.prismaService.area.delete({
            where: {
                id: areaId,
                userId
            },
            include: {
                actionAuth: true,
                reactionAuth: true
            }
        });
    }
}
