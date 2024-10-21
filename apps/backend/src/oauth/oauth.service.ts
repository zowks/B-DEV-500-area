import { Injectable } from "@nestjs/common";
import { OAuthManager } from "./oauth.interface";
import { GoogleOAuthService } from "./google/google.service";
import { DiscordOAuthService } from "./discord/discord.service";
import { TwitchOAuthService } from "./twitch/twitch.service";

@Injectable()
export class OAuthService {
    constructor(
        private readonly googleOAuthService: GoogleOAuthService,
        private readonly discordOAuthService: DiscordOAuthService,
        private readonly twitchOAuthService: TwitchOAuthService
    ) {}

    getOAuthCredentialsManager(name: string): OAuthManager {
        return {
            youtube: this.googleOAuthService,
            discord: this.discordOAuthService,
            twitch: this.twitchOAuthService
        }[name];
    }
}
