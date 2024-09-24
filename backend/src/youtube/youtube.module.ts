import { Module } from '@nestjs/common';
import { YouTubeService } from './youtube.service';
import { HttpModule } from '@nestjs/axios';
import { CredentialsModule } from 'src/credentials/credentials.module';

@Module({
  imports: [CredentialsModule, HttpModule],
  providers: [YouTubeService],
  exports: [YouTubeService],
})
export class YoutubeModule {}
