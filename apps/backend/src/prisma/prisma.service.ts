import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly configService: ConfigService) {
        const postgres = {
            user: configService.getOrThrow("POSTGRES_USER"),
            password: configService.getOrThrow("POSTGRES_PASSWORD"),
            db: configService.getOrThrow("POSTGRES_DB"),
            host: configService.getOrThrow("POSTGRES_HOST")
        };
        const url = `postgres://${postgres.user}:${postgres.password}@${postgres.host}:5432/${postgres.db}`;
        super({
            datasourceUrl: url
        });
    }

    onModuleInit() {
        return this.$connect();
    }

    onModuleDestroy() {
        return this.$disconnect();
    }
}
