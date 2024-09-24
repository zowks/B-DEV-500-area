import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { YouTubeCredentials } from './interfaces/youtube';
import { DiscordCredentials } from './interfaces/discord';

@Injectable()
export class CredentialsService {
  private baseURL: string;

  constructor(private readonly configService: ConfigService) {
    const restAPIPort = this.configService.get<number>('REST_API_PORT', 3000);
    this.baseURL = `http://localhost:${restAPIPort}`;
  }

  private throwIfNotFound(propertyName: string): string {
    const property = this.configService.get(propertyName, '');
    if ('' === property)
      throw new ForbiddenException(
        `You must specify ${propertyName} in the '.env' file.`,
      );
    return property;
  }

  getYouTubeCredentials(): YouTubeCredentials {
    const clientID = this.throwIfNotFound('YOUTUBE_CLIENT_ID');
    const clientSecret = this.throwIfNotFound('YOUTUBE_CLIENT_SECRET');
    const scope = encodeURIComponent(
      ['https://www.googleapis.com/auth/youtube.readonly'].join(' '),
    );
    const redirectUri = encodeURIComponent(`${this.baseURL}/youtube/callback`);
    const oauthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    const pollingDelay = parseInt(
      this.throwIfNotFound('YOUTUBE_POLLING_DELAY'),
    );

    return {
      clientID,
      clientSecret,
      oauthURL,
      pollingDelay,
    };
  }

  getDiscordCredentials(): DiscordCredentials {
    const clientID = this.throwIfNotFound('DISCORD_WEBHOOK_ID');
    const clientSecret = this.throwIfNotFound('DISCORD_WEBHOOK_SECRET');

    return {
      clientID,
      clientSecret,
    };
  }
}
