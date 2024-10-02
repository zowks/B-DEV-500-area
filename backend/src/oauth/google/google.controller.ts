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
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from "@nestjs/swagger";
import { GoogleOAuthService } from "./google.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { User } from "src/users/interfaces/user.interface";
import { GoogleOAuthCredentials } from "./interfaces/responses";

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
    oauthService(@Req() req: Request) {
        const { id } = req.user as Pick<User, "id">;

        const stateArrayView = new Uint32Array(16);
        getRandomValues(stateArrayView);
        const state = Buffer.from(stateArrayView.buffer).toString("hex");

        req.session["state"] = state;
        req.session["user_id"] = id;
        req.session.save(console.error);

        return {
            redirect_uri: this.googleOAuthService.getOAuthUrl(state)
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

        await this.googleOAuthService.saveCredentials(
            session["user_id"],
            tokens
        );

        return res.redirect("/");
    }

    @UseGuards(JwtGuard)
    @Get("/credentials")
    @ApiExtraModels(GoogleOAuthCredentials)
    @ApiBearerAuth("bearer")
    @ApiOkResponse({
        description:
            "Returns all the OAuth2.0 credentials related to the user.",
        schema: {
            $ref: getSchemaPath(GoogleOAuthCredentials)
        }
    })
    @ApiUnauthorizedResponse({
        description:
            "This route is protected. The client must supply a Bearer token."
    })
    async credentials(@Req() req: Request): Promise<GoogleOAuthCredentials> {
        const { id } = req.user as Pick<User, "id">;
        const tokens = await this.googleOAuthService.loadCredentials(id);

        return { tokens };
    }
}
