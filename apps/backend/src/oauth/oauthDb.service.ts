import { Injectable, NotFoundException } from "@nestjs/common";
import { User, OAuthCredential as PrismaOAuthCredential } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { OAuthCredential } from "./oauth.interface";

@Injectable()
export class OAuthDBService {
    constructor(protected readonly prismaService: PrismaService) {}

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

    async saveCredential(
        userId: User["id"],
        credential: OAuthCredential,
        oauthTokenUrl: string,
        oauthRevokeUrl: string
    ): Promise<number> {
        return (
            await this.prismaService.oAuthCredential.create({
                data: {
                    accessToken: credential.access_token,
                    refreshToken: credential.refresh_token,
                    expiresAt: credential.expires_at,
                    scopes: credential.scope.split(" "),
                    tokenUrl: oauthTokenUrl,
                    revokeUrl: oauthRevokeUrl,
                    userId
                },
                select: {
                    id: true
                }
            })
        ).id;
    }

    async loadCredentialsByUserId(
        userId: User["id"],
        oauthTokenUrl: string,
        oauthRevokeUrl: string
    ): Promise<OAuthCredential[]> {
        return (
            await this.prismaService.oAuthCredential.findMany({
                where: {
                    userId,
                    tokenUrl: oauthTokenUrl,
                    revokeUrl: oauthRevokeUrl
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
        userId: User["id"],
        scopes: string[],
        oauthTokenUrl: string,
        oauthRevokeUrl: string
    ): Promise<OAuthCredential[]> {
        return (
            await this.prismaService.oAuthCredential.findMany({
                where: {
                    scopes: { hasEvery: scopes },
                    tokenUrl: oauthTokenUrl,
                    revokeUrl: oauthRevokeUrl,
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

    async loadCredentialById(
        userId: User["id"],
        oauthCredentialId: OAuthCredential["id"]
    ): Promise<OAuthCredential> {
        const credential = await this.prismaService.oAuthCredential.findUnique({
            where: {
                id: oauthCredentialId,
                userId
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

    async deleteCredential(
        userId: User["id"],
        oauthCredential: OAuthCredential
    ) {
        await this.prismaService.oAuthCredential.delete({
            where: {
                id: oauthCredential.id,
                userId
            }
        });
    }
}
