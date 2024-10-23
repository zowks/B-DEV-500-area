import { User } from "../users/interfaces/user.interface";
import { HttpRedirectResponse } from "@nestjs/common";
import { Request } from "express";
import { OAuthDBService } from "./oauthDb.service";
import { Cache } from "cache-manager";
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
export declare function OAuthController_revoke(): MethodDecorator & ClassDecorator;
export interface OAuthMetadata {
    state: string;
    requestedAt: number;
    redirectUri: string;
}
export declare abstract class OAuthController {
    static readonly OAUTH_METADATA_TTL: number;
    static createState(userId: User["id"], requestedAt: number): string;
    static prepareOAuthSession(cacheManager: Cache, userId: User["id"], redirectUri: string): Promise<string>;
    static verifyState(cacheManager: Cache, userId: User["id"], state: string): Promise<string>;
    abstract getOAuthUrl(req: Request, scope: string, redirectUri: string): Promise<{
        redirect_uri: string;
    }>;
    abstract callback(req: Request, code: string, state: string): Promise<HttpRedirectResponse>;
    abstract credentials(req: Request): Promise<OAuthCredential[]>;
    abstract revoke(req: Request, oauthCredentialId: OAuthCredential["id"]): Promise<void>;
}
