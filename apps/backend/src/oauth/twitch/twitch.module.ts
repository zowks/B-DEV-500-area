import { Module } from "@nestjs/common";
import { TwitchOAuthService } from "./twitch.service";
import { TwitchOAuthController } from "./twitch.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [TwitchOAuthService],
    exports: [TwitchOAuthService],
    controllers: [TwitchOAuthController]
})
export class TwitchOAuthModule {}
