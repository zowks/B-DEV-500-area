import { Request, Response } from "express";
import { SessionData } from "express-session";
import { Controller, Query, Req, Res, Session } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GoogleOAuthService } from "./google.service";
import { User } from "../../users/interfaces/user.interface";
import {
    OAuthController,
    OAuthController_callback,
    OAuthController_credentials,
    OAuthController_oauthService,
    OAuthCredential
} from "../oauth.interface";

@ApiTags("Google OAuth")
@Controller("oauth/google")
export class GoogleOAuthController implements OAuthController {
    constructor(private readonly googleOAuthService: GoogleOAuthService) {}

    @OAuthController_oauthService()
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
            redirect_uri: this.googleOAuthService.getOAuthUrl(state, scope)
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

        const tokens = await this.googleOAuthService.getCredentials(code);

        await this.googleOAuthService.saveCredential(
            session["user_id"],
            tokens
        );

        return res.redirect(session["redirect_uri"] || "/");
    }

    @OAuthController_credentials()
    async credentials(@Req() req: Request): Promise<OAuthCredential[]> {
        const { id } = req.user as Pick<User, "id">;
        return await this.googleOAuthService.loadCredentialsByUserId(id);
    }
}
