import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";

import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { Argon2Module } from "src/argon2/argon2.module";
import { JwtModule } from "src/jwt/jwt.module";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CacheModule } from "@nestjs/cache-manager";

import { AreaModule } from "./area/area.module";
import { CronModule } from "src/cron/cron.module";
import { UsersModule } from "src/users/users.module";

import { OAuthModule } from "./oauth/oauth.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { RedisOptions } from "./app.config";

@Module({
    imports: [
        CacheModule.registerAsync(RedisOptions),
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        CronModule,
        AuthModule,
        Argon2Module,
        JwtModule,
        PrismaModule,
        UsersModule,
        OAuthModule,
        AreaModule,
        SchedulerModule
    ],
    providers: [JwtGuard],
    controllers: [AppController]
})
export class AppModule {}
