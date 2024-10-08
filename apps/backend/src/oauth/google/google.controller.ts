import { Request, Response } from "express";
import { Controller, Query, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GoogleOAuthService } from "./google.service";
import { User } from "../../users/interfaces/user.interface";
import {
    OAuthController,
    OAuthController_callback,
    OAuthController_credentials,
    OAuthController_getOAuthUrl,
    OAuthCredential
} from "../oauth.interface";

@ApiTags("Google OAuth")
@Controller("oauth/google")
export class GoogleOAuthController implements OAuthController {
    constructor(private readonly googleOAuthService: GoogleOAuthService) {}

    @OAuthController_getOAuthUrl()
    getOAuthUrl(
        @Req() req: Request,
        @Query("redirect_uri") redirectUri: string,
        @Query("scope") scope: string,
        @Res() res: Response
    ) {
        const { id } = req.user as Pick<User, "id">;
        const state = OAuthController.prepareOAuthSession(req, id, redirectUri);
        return res.json({
            redirect_uri: this.googleOAuthService.getOAuthUrl(state, scope)
        });
    }

    @OAuthController_callback()
    async callback(
        @Req() req: Request,
        @Query("code") code: string,
        @Query("state") state: string,
        @Res() res: Response
    ) {
        OAuthController.verifyState(req, state);

        const tokens = await this.googleOAuthService.getCredentials(code);

        await this.googleOAuthService.saveCredential(
            req.session["user_id"],
            tokens,
            this.googleOAuthService.OAUTH_TOKEN_URL,
            this.googleOAuthService.OAUTH_REVOKE_URL
        );

        return res.redirect(req.session["redirect_uri"] || "/");
    }

    @OAuthController_credentials()
    async credentials(@Req() req: Request): Promise<OAuthCredential[]> {
        const { id } = req.user as Pick<User, "id">;
        return await this.googleOAuthService.loadCredentialsByUserId(
            id,
            this.googleOAuthService.OAUTH_TOKEN_URL,
            this.googleOAuthService.OAUTH_REVOKE_URL
        );
    }
}
