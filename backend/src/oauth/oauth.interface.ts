import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/interfaces/user.interface";

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

export abstract class OAuth {
    abstract readonly clientID: string;

    abstract readonly clientSecret: string;

    abstract readonly redirectUri: string;

    abstract getOAuthUrl(state: string): string;

    abstract getCredentials(code: string): Promise<OAuthCredential>;

    abstract saveCredential(
        userId: Pick<User, "id">["id"],
        credential: OAuthCredential
    ): Promise<number>;

    abstract loadCredentials(
        userId: Pick<User, "id">["id"]
    ): Promise<OAuthCredential[]>;

    abstract loadCredential(
        oauthCredentialId: OAuthCredential["id"]
    ): Promise<OAuthCredential>;

    abstract refreshCredential(
        oauthCredential: OAuthCredential
    ): Promise<OAuthCredential>;

    abstract updateCredential(oauthCredential: OAuthCredential): Promise<void>;

    abstract revokeCredential(oauthCredential: OAuthCredential): Promise<void>;
}
