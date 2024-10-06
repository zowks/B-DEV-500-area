import { User } from "../users/interfaces/user.interface";
import { SessionData } from "express-session";
import { Request, Response } from "express";
export declare class OAuthCredential {
    readonly id?: number;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_at: Date;
    readonly scope: string;
}
export declare abstract class OAuthManager {
    abstract getOAuthUrl(state: string, scope: string): string;
    abstract getCredentials(code: string): Promise<OAuthCredential>;
    abstract saveCredential(userId: User["id"], credential: OAuthCredential): Promise<number>;
    abstract loadCredentialsByUserId(userId: User["id"]): Promise<OAuthCredential[]>;
    abstract loadCredentialsByScopes(scopes: string[]): Promise<OAuthCredential[]>;
    abstract loadCredentialById(oauthCredentialId: OAuthCredential["id"]): Promise<OAuthCredential>;
    abstract refreshCredential(oauthCredential: OAuthCredential): Promise<OAuthCredential>;
    abstract updateCredential(oauthCredential: OAuthCredential): Promise<void>;
    abstract revokeCredential(oauthCredential: OAuthCredential): Promise<void>;
}
export declare function OAuthController_getOAuthUrl(): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function OAuthController_callback(): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function OAuthController_credentials(): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare abstract class OAuthController {
    static prepareOAuthSession(session: Request["session"], userId: User["id"], redirectUri: string): string;
    static verifyState(session: SessionData, state: string): void;
    abstract getOAuthUrl(req: Request, redirectUri: string, scope: string): {
        redirect_uri: string;
    };
    abstract callback(session: SessionData, code: string, state: string, res: Response): Promise<void>;
    abstract credentials(req: Request): Promise<OAuthCredential[]>;
}
