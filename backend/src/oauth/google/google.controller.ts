import { getRandomValues } from "node:crypto";
import { Request, Response } from "express";
import { SessionData } from "express-session";
import {
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    Req,
    Res,
    Session,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { GoogleOAuthService } from "./google.service";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { User } from "../../users/interfaces/user.interface";
import { OAuthCredential } from "../oauth.interface";

@ApiTags("Google OAuth")
@Controller("oauth/google")
export class GoogleOAuthController {
    constructor(private readonly googleOAuthService: GoogleOAuthService) {}

    @UseGuards(JwtGuard)
    @Get("/")
    @ApiBearerAuth("bearer")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description:
            "Returns the OAuth2.0 URL to which the user will have to log in to the service."
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    @ApiQuery({
        name: "redirect_uri",
        description:
            "The URI to which the user will be redirected once the authentication flow is successful.",
        example: "http://localhost:5173/dashboard"
    })
    @ApiQuery({
        name: "scope",
        description:
            "The scopes required for the OAuth2.0 credential. It's a whitespace-joined string list.",
        example:
            "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.force-ssl"
    })
    oauthService(
        @Query("redirect_uri") redirect_uri: string,
        @Query("scope") scope: string,
        @Req() req: Request
    ) {
        const { id } = req.user as Pick<User, "id">;

        const stateArrayView = new Uint32Array(16);
        getRandomValues(stateArrayView);
        const state = Buffer.from(stateArrayView.buffer).toString("hex");

        req.session["state"] = state;
        req.session["user_id"] = id;
        req.session["redirect_uri"] = redirect_uri;
        req.session.save((err) => {
            if (err) console.error(err);
        });

        return {
            redirect_uri: this.googleOAuthService.getOAuthUrl(state, scope)
        };
    }

    @Get("/callback")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description:
            "The auth flow has been completed successfully. The Google OAuth2.0 credentials are stored in database and the client is redirected to the root page."
    })
    @ApiForbiddenResponse({
        description:
            "The 'state' attribute stored in the user' session is either invalid or does not match the one sent by Google. This may happen during a CSRF attack."
    })
    async callback(
        @Session() session: SessionData,
        @Query("code") code: string,
        @Query("state") state: string,
        @Res() res: Response
    ) {
        if (state !== session["state"])
            throw new ForbiddenException(
                "Invalid state. Possibly due to a CSRF attack attempt."
            );

        const tokens = await this.googleOAuthService.getCredentials(code);

        await this.googleOAuthService.saveCredential(
            session["user_id"],
            tokens
        );

        return res.redirect(session["redirect_uri"] || "/");
    }

    @UseGuards(JwtGuard)
    @Get("/credentials")
    @ApiExtraModels(OAuthCredential)
    @ApiBearerAuth("bearer")
    @ApiOkResponse({
        description:
            "Returns all the OAuth2.0 credentials related to the user.",
        schema: {
            $ref: getSchemaPath(OAuthCredential)
        }
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async credentials(@Req() req: Request): Promise<OAuthCredential[]> {
        const { id } = req.user as Pick<User, "id">;
        return await this.googleOAuthService.loadCredentialsByUserId(id);
    }
}
