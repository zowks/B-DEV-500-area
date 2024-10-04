import { Module } from "@nestjs/common";
import { GoogleOAuthService } from "./google.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { GoogleOAuthController } from "./google.controller";

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [GoogleOAuthService],
    exports: [GoogleOAuthService],
    controllers: [GoogleOAuthController]
})
export class GoogleOAuthModule {}
