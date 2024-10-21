import { Module } from "@nestjs/common";
import { GoogleOAuthModule } from "./google/google.module";
import { GoogleOAuthController } from "./google/google.controller";
import { OAuthService } from "./oauth.service";
import { DiscordOAuthModule } from "./discord/discord.module";
import { TwitchOAuthModule } from "./twitch/twitch.module";
import { OAuthDBService } from "./oauthDb.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [
        PrismaModule,
        GoogleOAuthModule,
        DiscordOAuthModule,
        TwitchOAuthModule
    ],
    controllers: [GoogleOAuthController],
    providers: [OAuthService, OAuthDBService],
    exports: [OAuthService]
})
export class OAuthModule {}
