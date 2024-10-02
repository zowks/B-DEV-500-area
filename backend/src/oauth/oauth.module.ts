import { Module } from '@nestjs/common';
import { GoogleOAuthModule } from './google/google.module';
import { GoogleOAuthController } from './google/google.controller';
import { OAuthService } from './oauth.service';

@Module({
  imports: [GoogleOAuthModule],
  controllers: [GoogleOAuthController],
  providers: [OAuthService],
  exports: [OAuthService]
})
export class OAuthModule {}
