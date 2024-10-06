import { Request, Response } from "express";
import { SessionData } from "express-session";
import { Controller, Query, Req, Res, Session } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DiscordOAuthService } from "./discord.service";
import { User } from "../../users/interfaces/user.interface";
import {
    OAuthController,
    OAuthController_callback,
    OAuthController_credentials,
    OAuthController_getOAuthUrl,
    OAuthCredential
} from "../oauth.interface";

@ApiTags("Discord OAuth")
@Controller("oauth/discord")
export class DiscordOAuthController implements OAuthController {
    constructor(private readonly discordOAuthService: DiscordOAuthService) {}

    @OAuthController_getOAuthUrl()
    getOAuthUrl(
        @Req() req: Request,
        @Query("redirect_uri") redirectUri: string,
        @Query("scope") scope: string
    ) {
        const { id } = req.user as Pick<User, "id">;
        const state = OAuthController.prepareOAuthSession(
            req.session,
            id,
            redirectUri
        );
        return {
            redirect_uri: this.discordOAuthService.getOAuthUrl(state, scope)
        };
    }

    @OAuthController_callback()
    async callback(
        @Session() session: SessionData,
        @Query("code") code: string,
        @Query("state") state: string,
        @Res() res: Response
    ) {
        OAuthController.verifyState(session, state);

        const tokens = await this.discordOAuthService.getCredentials(code);

        await this.discordOAuthService.saveCredential(
            session["user_id"],
            tokens,
            this.discordOAuthService.OAUTH_TOKEN_URL,
            this.discordOAuthService.OAUTH_REVOKE_URL
        );

        return res.redirect(session["redirect_uri"] || "/");
    }

    @OAuthController_credentials()
    async credentials(@Req() req: Request): Promise<OAuthCredential[]> {
        const { id } = req.user as Pick<User, "id">;
        return await this.discordOAuthService.loadCredentialsByUserId(
            id,
            this.discordOAuthService.OAUTH_TOKEN_URL,
            this.discordOAuthService.OAUTH_REVOKE_URL
        );
    }
}
