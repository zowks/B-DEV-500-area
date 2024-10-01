import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { Argon2Module } from "src/argon2/argon2.module";
import { JwtModule } from "src/jwt/jwt.module";
import { JwtGuard } from "src/auth/guards/jwt.guard";

import { YoutubeModule } from "src/youtube/youtube.module";
import { CronModule } from "src/cron/cron.module";
import { DiscordModule } from "src/discord/discord.module";
import { UsersModule } from "src/users/users.module";

import { YoutubeCredentialsService } from 'src/youtube/youtube_credentials.service';
import { DiscordCredentialsService } from 'src/discord/discord_credentials.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        HttpModule,
        YoutubeModule,
        CronModule,
        DiscordModule,
        AuthModule,
        Argon2Module,
        JwtModule,
        PrismaModule,
        UsersModule
    ],
    providers: [JwtGuard, YoutubeCredentialsService, DiscordCredentialsService]
})
export class AppModule {}
