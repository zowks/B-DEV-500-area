import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { Actions, Reactions } from "./interfaces/services.interface";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateAreaDto } from "./dto/create_area.dto";
import { User } from "src/users/interfaces/user.interface";
import { Request } from "express";
import { AreaService } from "./area.service";

@ApiTags("AREA")
@Controller("area")
export class AreaController {
    constructor(private readonly areaService: AreaService) {}

    @Get("/actions")
    @HttpCode(HttpStatus.OK)
    @ApiExtraModels(Actions)
    @ApiOkResponse({
        description: "Returns the table of available actions",
        schema: {
            $ref: getSchemaPath(Actions)
        }
    })
    availableActions(): Actions {
        return this.areaService.actionsEndpoints;
    }

    @Get("/reactions")
    @HttpCode(HttpStatus.OK)
    @ApiExtraModels(Reactions)
    @ApiOkResponse({
        description: "Returns the table of available reactions",
        schema: {
            $ref: getSchemaPath(Reactions)
        }
    })
    availableReactions(): Reactions {
        return this.areaService.reactionsEndpoints;
    }

    @UseGuards(JwtGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth("bearer")
    @ApiExtraModels(CreateAreaDto)
    @ApiCreatedResponse({
        description: "Creates a new AREA"
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async createArea(
        @Req() req: Request,
        @Body() createAreaDto: CreateAreaDto
    ): Promise<null> {
        const { id } = req.user as Pick<User, "id">;
        await this.areaService.create(id, createAreaDto);
        return null;
    }
}
