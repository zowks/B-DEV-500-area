import { OAuthCredential } from "@prisma/client";
export declare class AreaServiceAuthDto {
    readonly apiKey?: string;
    readonly oauth?: OAuthCredential["id"];
    readonly webhook?: string;
}
