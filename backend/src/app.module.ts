import { Module } from '@nestjs/common';
import { YouTubeService } from './youtube/youtube.service';
import { CredentialsService } from './credentials/credentials.service';
import { YoutubeController } from './youtube/youtube.controller';
import { CredentialsModule } from './credentials/credentials.module';
import { YoutubeModule } from './youtube/youtube.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { DiscordService } from './discord/discord.service';
import { DiscordModule } from './discord/discord.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { Argon2Service } from './argon2/argon2.service';
import { Argon2Module } from './argon2/argon2.module';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CredentialsModule,
    HttpModule,
    YoutubeModule,
    CronModule,
    DiscordModule,
    AuthModule,
    Argon2Module,
    JwtModule,
  ],
  controllers: [YoutubeController, AuthController],
  providers: [
    YouTubeService,
    CredentialsService,
    CronService,
    DiscordService,
    AuthService,
    Argon2Service,
    JwtService,
  ],
})
export class AppModule {}
