import { User } from "../users/interfaces/user.interface";
export declare class OAuthCredential {
    readonly id?: number;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_at: Date;
    readonly scope: string;
}
export declare abstract class OAuth {
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
