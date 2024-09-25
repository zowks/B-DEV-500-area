import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CredentialsService } from "./credentials.service";

@Module({
    imports: [ConfigModule],
    providers: [CredentialsService],
    exports: [CredentialsService]
})
export class CredentialsModule {}
