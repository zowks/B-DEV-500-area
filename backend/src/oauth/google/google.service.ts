import * as axios from "axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth, OAuthCredentials } from "../../oauth/oauth.interface";
import { User } from "../../users/interfaces/user.interface";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GoogleOAuthService implements OAuth {
    readonly clientID: string;

    readonly clientSecret: string;

    readonly redirectUri: string;

    readonly scope: string = encodeURIComponent(
        ["https://www.googleapis.com/auth/youtube.readonly"].join(" ")
    );

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) {
        const restAPIPort = this.configService.get<number>(
            "REST_API_PORT",
            3000
        );
        const baseURL = `http://localhost:${restAPIPort}`;

        this.clientID = this.configService.get<string>("GOOGLE_CLIENT_ID");
        this.clientSecret = this.configService.get<string>(
            "GOOGLE_CLIENT_SECRET"
        );
        this.redirectUri = encodeURIComponent(
            `${baseURL}/oauth/google/callback`
        );
    }

    getOAuthUrl(state: string): string {
        const queries = {
            client_id: this.clientID,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            state,
            response_type: "code",
            access_type: "offline",
            include_granted_scopes: true
        };

        return `https://accounts.google.com/o/oauth2/v2/auth?${Object.entries(
            queries
        )
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`;
    }

    async getCredentials(code: string): Promise<OAuthCredentials> {
        const response = (
            await axios.default.post<{
                access_token: string;
                refresh_token: string;
                scope: string;
                expires_in: number;
                token_type: "Bearer";
            }>(
                `https://oauth2.googleapis.com/token`,
                {
                    code,
                    client_id: this.clientID,
                    client_secret: this.clientSecret,
                    grant_type: "authorization_code",
                    redirect_uri: decodeURIComponent(this.redirectUri)
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )
        ).data;

        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            scope: response.scope,
            expires_at: new Date(
                new Date().getTime() + response.expires_in * 1000
            )
        };
    }

    async saveCredentials(
        userId: Pick<User, "id">["id"],
        credentials: OAuthCredentials
    ): Promise<number> {
        return (
            await this.prismaService.google_oauth.create({
                data: {
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token,
                    expires_at: credentials.expires_at,
                    scope: credentials.scope,
                    usersId: userId
                },
                select: {
                    id: true
                }
            })
        ).id;
    }

    loadCredentials(
        userId: Pick<User, "id">["id"]
    ): Promise<OAuthCredentials[]> {
        return this.prismaService.google_oauth.findMany({
            where: {
                usersId: userId
            },
            select: {
                id: true,
                access_token: true,
                refresh_token: true,
                expires_at: true,
                scope: true
            }
        });
    }

    async refreshCredentials(
        oauthCredentials: OAuthCredentials
    ): Promise<OAuthCredentials> {
        const response = (
            await axios.default.post<{
                access_token: string;
                scope: string;
                expires_in: number;
                token_type: "Bearer";
            }>(
                `https://oauth2.googleapis.com/token`,
                {
                    client_id: this.clientID,
                    client_secret: this.clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: oauthCredentials.refresh_token
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )
        ).data;

        return {
            access_token: response.access_token,
            refresh_token: oauthCredentials.refresh_token,
            scope: response.scope,
            expires_at: new Date(
                new Date().getTime() + response.expires_in * 1000
            )
        };
    }

    updateCredentials(oauthCredentials: OAuthCredentials) {
        return this.prismaService.google_oauth.update({
            where: {
                id: oauthCredentials.id
            },
            data: {
                access_token: oauthCredentials.access_token,
                refresh_token: oauthCredentials.refresh_token,
                expires_at: oauthCredentials.expires_at,
                scope: oauthCredentials.scope
            }
        });
    }

    async revokeCredentials(oauthCredentials: OAuthCredentials): Promise<void> {
        await axios.default.post(
            `https://oauth2.googleapis.com/revoke`,
            {
                token: oauthCredentials.access_token
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
    }
}
