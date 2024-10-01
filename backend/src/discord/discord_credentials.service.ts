import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiscordCredentialsService {
    readonly clientID: string;
    readonly clientSecret: string;

    constructor(private readonly configService: ConfigService) {
        this.clientID = this.throwIfNotFound("DISCORD_WEBHOOK_ID");
        this.clientSecret = this.throwIfNotFound("DISCORD_WEBHOOK_SECRET");
    }

    private throwIfNotFound(propertyName: string): string {
        const property = this.configService.get(propertyName, "");
        if ("" === property)
            throw new Error(
                `You must specify ${propertyName} in the '.env' file.`
            );
        return property;
    }

    async refreshToken(access_token: string): Promise<string> {
        return "";
    }
}
