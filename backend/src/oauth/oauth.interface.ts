import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiProperty,
    ApiQuery,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { User } from "../users/interfaces/user.interface";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import {
    applyDecorators,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards
} from "@nestjs/common";
import { SessionData } from "express-session";
import { Request, Response } from "express";
import { OAuthDBService } from "./oauthDb.service";
import { hash } from "node:crypto";

export class OAuthCredential {
    @ApiProperty({ description: "The ID of the Google OAuth authorization." })
    readonly id?: number;

    @ApiProperty({
        description: "The access token used to interact with the Google API."
    })
    readonly access_token: string;

    @ApiProperty({
        description: "The token used to refresh the access token once expired."
    })
    readonly refresh_token: string;

    @ApiProperty({
        description: "The date at which the access token will expire."
    })
    readonly expires_at: Date;

    @ApiProperty({
        description:
            "The scopes granted to the access token. It's a list of scope joined by spaces."
    })
    readonly scope: string;
}

export abstract class OAuthManager extends OAuthDBService {
    readonly OAUTH_TOKEN_URL: string;

    readonly OAUTH_REVOKE_URL: string;

    abstract getOAuthUrl(state: string, scope: string): string;

    abstract getCredentials(code: string): Promise<OAuthCredential>;

    abstract refreshCredential(
        oauthCredential: OAuthCredential
    ): Promise<OAuthCredential>;

    abstract revokeCredential(oauthCredential: OAuthCredential): Promise<void>;
}

export function OAuthController_getOAuthUrl(): MethodDecorator &
    ClassDecorator {
    return applyDecorators(
        UseGuards(JwtGuard),
        Get("/"),
        HttpCode(HttpStatus.OK),
        ApiBearerAuth("bearer"),
        ApiOkResponse({
            description:
                "Returns the OAuth2.0 URL to which the user will have to log in to the service."
        }),
        ApiUnauthorizedResponse({
            description:
                "This route is protected. The client must supply a Bearer token."
        }),
        ApiQuery({
            name: "redirect_uri",
            description:
                "The URI to which the user will be redirected once the authentication flow is successful.",
            example: "http://localhost:5173/dashboard"
        }),
        ApiQuery({
            name: "scope",
            description:
                "The scopes required for the OAuth2.0 credential. It's a whitespace-joined string list.",
            example:
                "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.force-ssl"
        })
    );
}

export function OAuthController_callback(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        Get("/callback"),
        HttpCode(HttpStatus.OK),
        ApiOkResponse({
            description:
                "The auth flow has been completed successfully. The Google OAuth2.0 credentials are stored in database and the client is redirected to the root page."
        }),
        ApiForbiddenResponse({
            description:
                "The 'state' attribute stored in the user' session is either invalid or does not match the one sent by Google. This may happen during a CSRF attack."
        })
    );
}

export function OAuthController_credentials(): MethodDecorator &
    ClassDecorator {
    return applyDecorators(
        UseGuards(JwtGuard),
        Get("/credentials"),
        ApiExtraModels(OAuthCredential),
        ApiBearerAuth("bearer"),
        ApiOkResponse({
            description:
                "Returns all the OAuth2.0 credentials related to the user.",
            schema: {
                $ref: getSchemaPath(OAuthCredential)
            }
        }),
        ApiUnauthorizedResponse({
            description:
                "This route is protected. The client must supply a Bearer token."
        })
    );
}

export abstract class OAuthController {
    static prepareOAuthSession(
        req: Request,
        userId: User["id"],
        redirectUri: string
    ): string {
        req.session["created_at"] = Date.now();
        req.session["user_id"] = userId;
        const stateData = `${req.session["user_id"]}:${req.session["created_at"]}`;
        const state = hash("SHA-512", stateData, "hex");

        req.session["state"] = state;
        req.session["redirect_uri"] = redirectUri;
        req.session.save((err) => {
            if (err) console.error(err);
        });
        console.log(JSON.stringify(req.session));

        return state;
    }

    static verifyState(req: Request, state: string): void {
        if (
            undefined === req.session["user_id"] ||
            undefined === req.session["created_at"]
        )
            throw new ForbiddenException("Session expired.");
        const stateData = `${req.session["user_id"]}:${req.session["created_at"]}`;
        const currentState = hash("SHA-512", stateData, "hex");
        if (state !== currentState)
            throw new ForbiddenException(
                "Invalid state. Possibly due to a CSRF attack attempt."
            );
    }

    abstract getOAuthUrl(
        req: Request,
        redirectUri: string,
        scope: string
    ): { redirect_uri: string };

    abstract callback(
        req: Request,
        code: string,
        state: string,
        res: Response
    ): Promise<void>;
}
