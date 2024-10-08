import { User } from "../users/interfaces/user.interface";
import { SessionData } from "express-session";
import { Request, Response } from "express";
import { OAuthDBService } from "./oauthDb.service";
export declare class OAuthCredential {
    readonly id?: number;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_at: Date;
    readonly scope: string;
}
export declare abstract class OAuthManager extends OAuthDBService {
    readonly OAUTH_TOKEN_URL: string;
    readonly OAUTH_REVOKE_URL: string;
    abstract getOAuthUrl(state: string, scope: string): string;
    abstract getCredentials(code: string): Promise<OAuthCredential>;
    abstract refreshCredential(oauthCredential: OAuthCredential): Promise<OAuthCredential>;
    abstract revokeCredential(oauthCredential: OAuthCredential): Promise<void>;
}
export declare function OAuthController_getOAuthUrl(): MethodDecorator & ClassDecorator;
export declare function OAuthController_callback(): MethodDecorator & ClassDecorator;
export declare function OAuthController_credentials(): MethodDecorator & ClassDecorator;
export declare abstract class OAuthController {
    static prepareOAuthSession(session: Request["session"], userId: User["id"], redirectUri: string): string;
    static verifyState(session: SessionData, state: string): void;
    abstract getOAuthUrl(req: Request, redirectUri: string, scope: string): {
        redirect_uri: string;
    };
    abstract callback(session: SessionData, code: string, state: string, res: Response): Promise<void>;
}
