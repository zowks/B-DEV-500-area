import { Injectable, NotFoundException } from "@nestjs/common";
import { AreaStatus } from "@prisma/client";
import { AreaService } from "src/area/area.service";
import { transformer } from "src/area/generic.transformers";
import { Area } from "src/area/interfaces/area.interface";
import { ActionResource } from "src/area/services/interfaces/service.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SchedulerService } from "src/scheduler/scheduler.service";

@Injectable()
export class WebhookService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly areaService: AreaService,
        private readonly schedulerService: SchedulerService
    ) {}

    async findUnique(areaId: string): Promise<Partial<Area>> {
        const area = await this.prismaService.area.findUnique({
            where: {
                id: areaId,
                actionAuth: {
                    apiKey: null,
                    oauth: null
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                actionId: true,
                reactionId: true,
                status: true
            }
        });

        if (null === area) throw new NotFoundException();

        return area;
    }

    async execute(areaId: string, data: ActionResource["data"]) {
        const area = await this.prismaService.area.findUnique({
            where: {
                id: areaId,
                status: AreaStatus.RUNNING
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

        if (null === area || AreaStatus.STOPPED === area.status)
            throw new NotFoundException();

        const task = await this.areaService.getAreaTask(area);

        const transformedData = transformer(data, {
            ...task.reactionBody
        });

        const success = await this.schedulerService.postData(
            task,
            transformedData
        );
        if (!success)
            await this.areaService.update(area.userId, area.id, {
                status: AreaStatus.ERROR
            });
    }
}
