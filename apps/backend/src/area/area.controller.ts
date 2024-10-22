import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { CreateAreaDto } from "./dto/createArea.dto";
import { User } from "../users/interfaces/user.interface";
import { Request } from "express";
import { AreaService } from "./area.service";
import { Area } from "./interfaces/area.interface";
import { UpdateAreaDto } from "./dto/updateArea.dto";

@ApiTags("AREA")
@Controller("area")
export class AreaController {
    constructor(private readonly areaService: AreaService) {}

    @UseGuards(JwtGuard)
    @Get("/")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("bearer")
    @ApiExtraModels(Area)
    @ApiOkResponse({
        description: "Returns the list of all AREAs for the current user",
        type: Area,
        isArray: true
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async findMany(@Req() req: Request): Promise<Area[]> {
        const { id } = req.user as Pick<User, "id">;
        return this.areaService.findMany(id);
    }

    @UseGuards(JwtGuard)
    @Get("/:areaId")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("bearer")
    @ApiExtraModels(Area)
    @ApiParam({ name: "areaId", description: "The AREA ID." })
    @ApiOkResponse({
        description: "Returns the action based on it's ID.",
        type: Area
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async findUnique(
        @Req() req: Request,
        @Param("areaId") areaId: Area["id"]
    ): Promise<Area> {
        const { id } = req.user as Pick<User, "id">;
        return this.areaService.findUnique(id, areaId);
    }

    @UseGuards(JwtGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth("bearer")
    @ApiExtraModels(CreateAreaDto, Area)
    @ApiCreatedResponse({
        description: "Creates a new AREA",
        schema: {
            $ref: getSchemaPath(Area)
        }
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async create(
        @Req() req: Request,
        @Body() createAreaDto: CreateAreaDto
    ): Promise<Area> {
        const { id } = req.user as Pick<User, "id">;
        return await this.areaService.create(id, createAreaDto);
    }

    @UseGuards(JwtGuard)
    @Patch("/:areaId")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("bearer")
    @ApiExtraModels(UpdateAreaDto, Area)
    @ApiOkResponse({
        description: "Updates the AREA",
        schema: {
            $ref: getSchemaPath(UpdateAreaDto)
        }
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async udpate(
        @Req() req: Request,
        @Param("areaId") areaId: string,
        @Body() UpdateAreaDto: UpdateAreaDto
    ): Promise<Area> {
        const { id } = req.user as Pick<User, "id">;
        return await this.areaService.update(id, areaId, UpdateAreaDto);
    }

    @UseGuards(JwtGuard)
    @Delete("/:areaId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth("bearer")
    @ApiNoContentResponse({
        description: "Deletes the AREA"
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    @ApiParam({
        name: "areaId",
        description: "The ID of the AREA to delete."
    })
    async delete(@Req() req: Request, @Param("areaId") areaId: string) {
        const { id } = req.user as Pick<User, "id">;
        await this.areaService.delete(id, areaId);
    }
}
