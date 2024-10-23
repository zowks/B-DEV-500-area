import { ApiProperty } from "@nestjs/swagger";

export class OAuthCallbackResponseDto {
    @ApiProperty({
        description: "The URI to which the user must be redirected to."
    })
    readonly redirect_uri: string;
}
