import { Injectable } from "@nestjs/common";
import { OAuthManager } from "./oauth.interface";
import { GoogleOAuthService } from "./google/google.service";
import { DiscordOAuthService } from "./discord/discord.service";

@Injectable()
export class OAuthService {
    constructor(
        private readonly googleOAuthService: GoogleOAuthService,
        private readonly discordOAuthService: DiscordOAuthService
    ) {}

    getOAuthCredentialsManager(name: string): OAuthManager {
        return {
            youtube: this.googleOAuthService,
            discord: this.discordOAuthService
        }[name];
    }
}
