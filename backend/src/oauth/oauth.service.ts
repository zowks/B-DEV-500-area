import { Injectable } from "@nestjs/common";
import { GoogleOAuthService } from "./google/google.service";
import { OAuthManager } from "./oauth.interface";

@Injectable()
export class OAuthService {
    constructor(private readonly googleOAuthService: GoogleOAuthService) {}

    getOAuthCredentialsManager(name: string): OAuthManager {
        return { youtube: this.googleOAuthService }[name];
    }
}
