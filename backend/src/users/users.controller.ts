import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Req,
    UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Request } from "express";
import { User, UserInfo } from "./interfaces/user.interface";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtGuard)
    @Get("/me")
    @HttpCode(HttpStatus.OK)
    @ApiExtraModels(UserInfo)
    @ApiBearerAuth("bearer")
    @ApiOkResponse({
        description: "Retrieves a user based on the JWT Bearer token.",
        schema: {
            $ref: getSchemaPath(UserInfo)
        }
    })
    @ApiUnauthorizedResponse({
        description:
            "Either the JWT is expired or invalid or the user has been deleted."
    })
    async getUser(@Req() req: Request): Promise<{ user: UserInfo }> {
        const { id } = req.user as Pick<User, "id">;
        const user = await this.usersService.getUser(id);
        return { user };
    }
}
