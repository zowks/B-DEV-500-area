import * as axios from "axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth, OAuthCredential } from "../../oauth/oauth.interface";
import { OAuthCredential as PrismaOAuthCredential } from "@prisma/client";
import { User } from "../../users/interfaces/user.interface";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GoogleOAuthService implements OAuth {
    private readonly OAUTH_TOKEN_URL: string = `https://oauth2.googleapis.com/token`;

    private readonly OAUTH_REVOKE_URL: string = `https://oauth2.googleapis.com/revoke`;

    private readonly clientId: string;

    private readonly clientSecret: string;

    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) {
        const restAPIPort = this.configService.get<number>(
            "REST_API_PORT",
            3000
        );
        const baseURL = `http://localhost:${restAPIPort}`;

        this.clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
        this.clientSecret = this.configService.get<string>(
            "GOOGLE_CLIENT_SECRET"
        );
        this.redirectUri = encodeURIComponent(
            `${baseURL}/oauth/google/callback`
        );
    }

    getOAuthUrl(state: string, scope: string): string {
        const queries = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope,
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

    async getCredentials(code: string): Promise<OAuthCredential> {
        const response = (
            await axios.default.post<{
                access_token: string;
                refresh_token: string;
                scope: string;
                expires_in: number;
                token_type: "Bearer";
            }>(
                this.OAUTH_TOKEN_URL,
                {
                    code,
                    client_id: this.clientId,
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

    async saveCredential(
        userId: User["id"],
        credentials: OAuthCredential
    ): Promise<number> {
        return (
            await this.prismaService.oAuthCredential.create({
                data: {
                    accessToken: credentials.access_token,
                    refreshToken: credentials.refresh_token,
                    expiresAt: credentials.expires_at,
                    scopes: credentials.scope.split(" "),
                    tokenUrl: this.OAUTH_TOKEN_URL,
                    revokeUrl: this.OAUTH_REVOKE_URL,
                    userId
                },
                select: {
                    id: true
                }
            })
        ).id;
    }

    private prismaCredentialToCredential({
        id,
        accessToken,
        refreshToken,
        expiresAt,
        scopes
    }: Partial<PrismaOAuthCredential>): OAuthCredential {
        return {
            id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            scope: scopes.join(" ")
        };
    }

    async loadCredentialsByUserId(
        userId: User["id"]
    ): Promise<OAuthCredential[]> {
        return (
            await this.prismaService.oAuthCredential.findMany({
                where: {
                    userId
                },
                select: {
                    id: true,
                    accessToken: true,
                    refreshToken: true,
                    expiresAt: true,
                    scopes: true
                }
            })
        ).map(this.prismaCredentialToCredential);
    }

    async loadCredentialsByScopes(
        scopes: string[]
    ): Promise<OAuthCredential[]> {
        return (
            await this.prismaService.oAuthCredential.findMany({
                where: {
                    scopes: { hasEvery: scopes }
                },
                select: {
                    id: true,
                    accessToken: true,
                    refreshToken: true,
                    expiresAt: true,
                    scopes: true
                }
            })
        ).map(this.prismaCredentialToCredential);
    }

    async loadCredentialById(
        oauthCredentialId: OAuthCredential["id"]
    ): Promise<OAuthCredential> {
        const credential = await this.prismaService.oAuthCredential.findUnique({
            where: {
                id: oauthCredentialId
            },
            select: {
                id: true,
                accessToken: true,
                refreshToken: true,
                expiresAt: true,
                scopes: true
            }
        });

        if (null === credential) throw new NotFoundException();
        return this.prismaCredentialToCredential(credential);
    }

    async refreshCredential(
        oauthCredential: OAuthCredential
    ): Promise<OAuthCredential> {
        const response = (
            await axios.default.post<{
                access_token: string;
                scope: string;
                expires_in: number;
                token_type: "Bearer";
            }>(
                this.OAUTH_TOKEN_URL,
                {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: oauthCredential.refresh_token
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )
        ).data;

        return {
            id: oauthCredential.id,
            access_token: response.access_token,
            refresh_token: oauthCredential.refresh_token,
            scope: response.scope,
            expires_at: new Date(
                new Date().getTime() + response.expires_in * 1000
            )
        };
    }

    async updateCredential(oauthCredential: OAuthCredential): Promise<void> {
        await this.prismaService.oAuthCredential.update({
            where: {
                id: oauthCredential.id
            },
            data: {
                accessToken: oauthCredential.access_token,
                refreshToken: oauthCredential.refresh_token,
                expiresAt: oauthCredential.expires_at,
                scopes: oauthCredential.scope.split(" ")
            }
        });
    }

    async revokeCredential(oauthCredential: OAuthCredential): Promise<void> {
        await axios.default.post(
            this.OAUTH_REVOKE_URL,
            {
                token: oauthCredential.access_token
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        await this.prismaService.oAuthCredential.delete({
            where: {
                id: oauthCredential.id
            }
        });
    }
}
