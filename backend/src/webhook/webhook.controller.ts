import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { WebhookService } from "./webhook.service";
import { Area } from "src/area/interfaces/area.interface";
import { ActionResource } from "src/area/services/interfaces/service.interface";

@ApiTags("Webhooks")
@Controller("webhooks")
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Get("/:areaId")
    @ApiOkResponse({
        description: "Returns the area for that webhook."
    })
    @ApiNotFoundResponse({
        description: "The webhook ID is invalid."
    })
    retrieve(@Param("areaId") areaId: string): Promise<Partial<Area>> {
        return this.webhookService.findUnique(areaId);
    }

    @Post("/:areaId")
    @ApiOkResponse({
        description:
            "Executes the webhook. The data received by the webhook will be dispatched to all it's linked services."
    })
    @ApiNotFoundResponse({
        description: "The webhook ID is invalid."
    })
    execute(
        @Param("areaId") areaId: string,
        @Body() data: ActionResource["data"]
    ) {
        return this.webhookService.execute(areaId, data);
    }
}
