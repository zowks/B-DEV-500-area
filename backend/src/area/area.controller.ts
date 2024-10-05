import {
    Body,
    Controller,
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
    @ApiCreatedResponse({
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
        @Param("areaId") areaId: string,
        @Body() UpdateAreaDto: UpdateAreaDto
    ): Promise<Area> {
        return await this.areaService.update(areaId, UpdateAreaDto);
    }
}
