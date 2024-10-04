import { Injectable } from "@nestjs/common";
import { GoogleOAuthService } from "./google/google.service";
import { OAuth } from "./oauth.interface";

@Injectable()
export class OAuthService {
    constructor(private readonly googleOAuthService: GoogleOAuthService) {}

    getOAuthCredentialsManager(name: string): OAuth {
        return { youtube: this.googleOAuthService }[name];
    }
}
