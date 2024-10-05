import { ApiProperty } from "@nestjs/swagger";
import { OAuthCredential } from "../../../oauth/oauth.interface";

export class GoogleOAuthCredentials {
    @ApiProperty({
        description: "The list of Google OAuth authorizations for a user.",
        isArray: true,
        type: OAuthCredential
    })
    readonly tokens: OAuthCredential[];
}
