import { Controller, Get, Post, HttpCode, Req } from "@nestjs/common";
import { type LoginResponse } from "@common/types/API/login/LoginResponse";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post("login")
    @HttpCode(200)
    login(@Req() request: Request): LoginResponse {
        return this.appService.login(request);
    }
}
