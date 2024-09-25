import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CredentialsService } from 'src/credentials/credentials.service';
import { DiscordCredentials } from 'src/credentials/interfaces/discord.interface';
import { YouTubeVideo } from 'src/youtube/interfaces/youtube-video.interface';
import { Pusher } from 'src/cron/interfaces/pusher.interface';

@Injectable()
export class DiscordService {
  private credentials: DiscordCredentials;

  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly httpService: HttpService,
  ) {
    this.credentials = this.credentialsService.getDiscordCredentials();
  }

  pushNewYouTubeLikedVideo(data: YouTubeVideo): Promise<void> {
    return this.httpService.axiosRef.post(
      `https://discord.com/api/webhooks/${this.credentials.clientID}/${this.credentials.clientSecret}`,
      {
        embeds: [
          {
            title: `Une nouvelle vidéo a été aimée`,
            description: `Une personne a aimé la vidéo ${data.snippet.title} de la chaîne ${data.snippet.channelTitle}.`,
            url: `https://youtube.com/watch?v=${data.id}`,
            image: data.snippet.thumbnails.maxres,
            type: 'rich',
          },
        ],
      },
    );
  }

  getPusherNewYouTubeLikedVideo(): Pusher<YouTubeVideo> {
    return {
      method: (data: YouTubeVideo) => this.pushNewYouTubeLikedVideo(data),
    };
  }
}
