import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { Argon2Module } from "src/argon2/argon2.module";
import { JwtModule } from "src/jwt/jwt.module";
import { JwtGuard } from "src/auth/guards/jwt.guard";

import { AreaModule } from "./area/area.module";
import { CronModule } from "src/cron/cron.module";
import { UsersModule } from "src/users/users.module";

import { OAuthModule } from "./oauth/oauth.module";
import { PollingModule } from "./polling/polling.module";
import { WebhookModule } from "./webhook/webhook.module";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true }),
        ScheduleModule.forRoot(),
        PrismaModule,
        CronModule,
        AuthModule,
        Argon2Module,
        JwtModule,
        PrismaModule,
        UsersModule,
        OAuthModule,
        AreaModule,
        PollingModule,
        WebhookModule,
        SchedulerModule
    ],
    providers: [JwtGuard]
})
export class AppModule {}
