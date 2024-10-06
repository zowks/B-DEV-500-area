import { User } from "../users/interfaces/user.interface";
export declare class OAuthCredentials {
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
    abstract getCredentials(code: string): Promise<OAuthCredentials>;
    abstract saveCredentials(userId: Pick<User, "id">["id"], credentials: OAuthCredentials): Promise<number>;
    abstract loadCredentials(userId: Pick<User, "id">["id"]): Promise<OAuthCredentials[]>;
    abstract refreshCredentials(oauthCredentials: OAuthCredentials): Promise<OAuthCredentials>;
    abstract revokeCredentials(oauthCredentials: OAuthCredentials): Promise<void>;
}
