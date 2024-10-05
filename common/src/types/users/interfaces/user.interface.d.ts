export interface User {
    readonly id: string;
    readonly email: string;
    readonly hashed_password: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly is_admin: boolean;
}
export declare class UserInfo {
    readonly email: string;
    readonly firstname: string;
    readonly lastname: string;
}
