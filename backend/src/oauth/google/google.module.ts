import { Module } from "@nestjs/common";
import { GoogleOAuthService } from "./google.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { GoogleOAuthController } from "./google.controller";

@Module({
    imports: [PrismaModule],
    providers: [GoogleOAuthService],
    exports: [GoogleOAuthService],
    controllers: [GoogleOAuthController]
})
export class GoogleOAuthModule {}
