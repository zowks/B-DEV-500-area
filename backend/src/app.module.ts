import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { Argon2Module } from "./argon2/argon2.module";
import { JwtModule } from "./jwt/jwt.module";
import { JwtGuard } from "./auth/guards/jwt.guard";
import { CacheModule } from "@nestjs/cache-manager";

import { AreaModule } from "./area/area.module";
import { UsersModule } from "./users/users.module";

import { OAuthModule } from "./oauth/oauth.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { RedisOptions } from "./app.config";
import { AboutModule } from "./about/about.module";
import { PrismaService } from "./prisma/prisma.service";
import { AreaService } from "./area/area.service";

@Module({
    imports: [
        CacheModule.registerAsync(RedisOptions),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        Argon2Module,
        JwtModule,
        PrismaModule,
        UsersModule,
        OAuthModule,
        AreaModule,
        ScheduleModule.forRoot(),
        SchedulerModule,
        AboutModule
    ],
    providers: [JwtGuard]
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly areaService: AreaService
    ) {}

    async onModuleInit() {
        console.log("init");
        const areas = await this.prismaService.area.findMany({
            select: {
                id: true
            }
        });

        areas.forEach(({ id }) => this.areaService.schedule(id));
    }
}
