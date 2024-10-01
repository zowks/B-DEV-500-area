import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class YoutubeCredentialsService {
    private readonly baseURL: string;
    private readonly clientID: string;
    private readonly clientSecret: string;
    private readonly scope: string;
    private readonly redirectURI: string;
    readonly pollingDelay: number;

    constructor(private readonly configService: ConfigService) {
        const restAPIPort = this.configService.get<number>(
            "REST_API_PORT",
            3000
        );
        this.baseURL = `http://localhost:${restAPIPort}`;
        this.clientID = this.throwIfNotFound("YOUTUBE_CLIENT_ID");
        this.clientSecret = this.throwIfNotFound("YOUTUBE_CLIENT_SECRET");
        this.scope = encodeURIComponent(
            ["https://www.googleapis.com/auth/youtube.readonly"].join(" ")
        );
        this.redirectURI = encodeURIComponent(
            `${this.baseURL}/youtube/callback`
        );
        this.pollingDelay = parseInt(
            this.throwIfNotFound("YOUTUBE_POLLING_DELAY")
        );
    }

    private throwIfNotFound(propertyName: string): string {
        const property = this.configService.get(propertyName, "");
        if ("" === property)
            throw new Error(
                `You must specify ${propertyName} in the '.env' file.`
            );
        return property;
    }

    getOAuthURL(state: string): string {
        const queries = {
            client_id: this.clientID,
            redirect_uri: this.redirectURI,
            scope: this.scope,
            state,
            response_type: "token",
            include_granted_scopes: true
        };

        return `https://accounts.google.com/o/oauth2/v2/auth?${Object.entries(
            queries
        )
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`;
    }

}
