import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/interfaces/user.interface";

export class OAuthCredentials {
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

    abstract getCredentials(code: string): Promise<OAuthCredentials>;

    abstract saveCredentials(
        userId: Pick<User, "id">["id"],
        credentials: OAuthCredentials
    ): Promise<number>;

    abstract loadCredentials(
        userId: Pick<User, "id">["id"]
    ): Promise<OAuthCredentials[]>;

    abstract refreshCredentials(
        oauthCredentials: OAuthCredentials
    ): Promise<OAuthCredentials>;

    abstract revokeCredentials(
        oauthCredentials: OAuthCredentials
    ): Promise<void>;
}
