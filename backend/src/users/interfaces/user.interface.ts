export interface User {
    readonly id: string;
    readonly email: string;
    readonly hashed_password: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly is_admin: boolean;
}
