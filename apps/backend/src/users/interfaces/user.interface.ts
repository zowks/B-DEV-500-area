import { ApiProperty } from "@nestjs/swagger";

export interface User {
    readonly id: string;
    readonly email: string;
    readonly hashed_password: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly is_admin: boolean;
}

export class UserInfo {
    @ApiProperty({
        description: "The user's email."
    })
    readonly email: string;

    @ApiProperty({
        description: "The user's firstname."
    })
    readonly firstname: string;

    @ApiProperty({
        description: "The user's lastname."
    })
    readonly lastname: string;
}
