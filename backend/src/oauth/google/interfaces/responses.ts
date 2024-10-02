import { ApiProperty } from "@nestjs/swagger";
import { OAuthCredentials } from "src/oauth/oauth.interface";

export class GoogleOAuthCredentials {
    @ApiProperty({
        description: "The list of Google OAuth authorizations for a user.",
        isArray: true,
        type: OAuthCredentials
    })
    readonly tokens: OAuthCredentials[];
}
