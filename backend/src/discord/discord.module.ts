import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DiscordService } from "./discord.service";
import { DiscordCredentialsService } from "./discord_credentials.service";

@Module({
    imports: [HttpModule],
    providers: [DiscordService, DiscordCredentialsService],
    exports: [DiscordService, DiscordCredentialsService]
})
export class DiscordModule {}
