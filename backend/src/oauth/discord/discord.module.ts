import { Module } from "@nestjs/common";
import { DiscordOAuthService } from "./discord.service";
import { DiscordOAuthController } from "./discord.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [DiscordOAuthService],
    exports: [DiscordOAuthService],
    controllers: [DiscordOAuthController]
})
export class DiscordOAuthModule {}
