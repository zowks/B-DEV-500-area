import { Module } from "@nestjs/common";
import { DiscordModule } from "./discord/discord.module";

@Module({
    imports: [DiscordModule],
    exports: [DiscordModule]
})
export class WebhookModule {}
