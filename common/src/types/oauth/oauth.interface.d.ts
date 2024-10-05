import { User } from "../users/interfaces/user.interface";
export declare class OAuthCredential {
    readonly id?: number;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_at: Date;
    readonly scope: string;
}
export declare abstract class OAuth {
    abstract readonly clientID: string;
    abstract readonly clientSecret: string;
    abstract readonly redirectUri: string;
    abstract getOAuthUrl(state: string): string;
    abstract getCredentials(code: string): Promise<OAuthCredential>;
    abstract saveCredential(userId: Pick<User, "id">["id"], credential: OAuthCredential): Promise<number>;
    abstract loadCredentials(userId: Pick<User, "id">["id"]): Promise<OAuthCredential[]>;
    abstract loadCredential(oauthCredentialId: OAuthCredential["id"]): Promise<OAuthCredential>;
    abstract refreshCredential(oauthCredential: OAuthCredential): Promise<OAuthCredential>;
    abstract updateCredential(oauthCredential: OAuthCredential): Promise<void>;
    abstract revokeCredential(oauthCredential: OAuthCredential): Promise<void>;
}
