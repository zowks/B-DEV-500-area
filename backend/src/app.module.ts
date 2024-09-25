import { Module } from "@nestjs/common";
import { YoutubeController } from "./youtube/youtube.controller";
import { CredentialsModule } from "./credentials/credentials.module";
import { YoutubeModule } from "./youtube/youtube.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { CronModule } from "./cron/cron.module";
import { DiscordModule } from "./discord/discord.module";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { Argon2Module } from "./argon2/argon2.module";
import { JwtModule } from "./jwt/jwt.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        CredentialsModule,
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
    controllers: [YoutubeController, AuthController]
})
export class AppModule {}
