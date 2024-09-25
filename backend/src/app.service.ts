import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type LoginResponse } from "@common/types/API/login/LoginResponse";

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    getHello(): string {
        return "Hello World!";
    }

    login(@Req() request: Request): LoginResponse {
        // TODO: add swagger with validator
        return {
            code: 200,
            message: "Success",
            data: {
                token: this.configService.get("JWT_SECRET")
            }
        };
    }
}
