import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Req,
    UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { Request } from "express";
import { User, UserInfo } from "./interfaces/user.interface";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtGuard)
    @Get("/me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Retrieves a user based on the JWT Bearer token."
    })
    @ApiNotFoundResponse({
        description:
            "Either the JWT is expired or invalid or the user has been deleted."
    })
    async getUser(@Req() req: Request): Promise<{ user: UserInfo }> {
        const { id } = req.user as Pick<User, "id">;
        const user = await this.usersService.getUser(id);
        return { user };
    }
}
