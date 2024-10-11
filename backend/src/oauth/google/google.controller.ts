import { Request } from "express";
import {
    Controller,
    HttpRedirectResponse,
    HttpStatus,
    Param,
    ParseIntPipe,
    Query,
    Req
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GoogleOAuthService } from "./google.service";
import { User } from "../../users/interfaces/user.interface";
import {
    OAuthController,
    OAuthController_callback,
    OAuthController_credentials,
    OAuthController_getOAuthUrl,
    OAuthController_revoke,
    OAuthCredential
} from "../oauth.interface";

@ApiTags("Google OAuth")
@Controller("oauth/google")
export class GoogleOAuthController implements OAuthController {
    constructor(private readonly oauthManager: GoogleOAuthService) {}

    @OAuthController_getOAuthUrl()
    getOAuthUrl(
        @Req() req: Request,
        @Query("scope") scope: string,
        @Query("redirect_uri") redirectUri: string,
    ) {
        const { id } = req.user as Pick<User, "id">;
        const state = OAuthController.prepareOAuthSession(
            req.session,
            id,
            redirectUri
        );

        return {
            redirect_uri: this.oauthManager.getOAuthUrl(state, scope)
        };
    }

    @OAuthController_callback()
    async callback(
        @Req() req: Request,
        @Query("code") code: string,
        @Query("state") state: string
    ): Promise<HttpRedirectResponse> {
        OAuthController.verifyState(req.session, state);

        const tokens = await this.oauthManager.getCredentials(code);

        await this.oauthManager.saveCredential(
            req.session["user_id"],
            tokens,
            this.oauthManager.OAUTH_TOKEN_URL,
            this.oauthManager.OAUTH_REVOKE_URL
        );

        const redirectUri = req.session["redirect_uri"] || "/";

        req.session.destroy((err) => {
            if (err) console.error(err);
        });

        return {
            url: redirectUri,
            statusCode: HttpStatus.SEE_OTHER
        };
    }

    @OAuthController_credentials()
    async credentials(@Req() req: Request): Promise<OAuthCredential[]> {
        const { id } = req.user as Pick<User, "id">;
        return await this.oauthManager.loadCredentialsByUserId(
            id,
            this.oauthManager.OAUTH_TOKEN_URL,
            this.oauthManager.OAUTH_REVOKE_URL
        );
    }

    @OAuthController_revoke()
    async revoke(
        @Req() req: Request,
        @Param("oauthCredentialId", ParseIntPipe)
        oauthCredentialId: OAuthCredential["id"]
    ): Promise<void> {
        const { id } = req.user as Pick<User, "id">;
        const oauthCredential = await this.oauthManager.loadCredentialById(
            id,
            oauthCredentialId
        );
        await this.oauthManager.revokeCredential(oauthCredential);
        await this.oauthManager.deleteCredential(id, oauthCredential);
    }
}
