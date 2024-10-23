import { Request } from "express";
import {
    Controller,
    Inject,
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
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { OAuthCallbackResponseDto } from "../dto/OAuthCallbackResponse.dto";

@ApiTags("Google OAuth")
@Controller("oauth/google")
export class GoogleOAuthController implements OAuthController {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly oauthManager: GoogleOAuthService
    ) {}

    @OAuthController_getOAuthUrl()
    async getOAuthUrl(
        @Req() req: Request,
        @Query("scope") scope: string,
        @Query("redirect_uri") redirectUri: string
    ) {
        const { id } = req.user as Pick<User, "id">;
        const state = await OAuthController.prepareOAuthSession(
            this.cacheManager,
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
    ): Promise<OAuthCallbackResponseDto> {
        const { id } = req.user as Pick<User, "id">;

        const redirectUri = await OAuthController.verifyState(
            this.cacheManager,
            id,
            state
        );

        const tokens = await this.oauthManager.getCredentials(code);

        await this.oauthManager.saveCredential(
            id,
            tokens,
            this.oauthManager.OAUTH_TOKEN_URL,
            this.oauthManager.OAUTH_REVOKE_URL
        );

        return {
            redirect_uri: redirectUri
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
