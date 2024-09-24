import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { YouTubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { CronModule } from '../cron/cron.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { DiscordModule } from '../discord/discord.module';

describe('YoutubeController', () => {
  let controller: YoutubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CronModule, CredentialsModule, DiscordModule, HttpModule],
      providers: [YouTubeService],
      controllers: [YoutubeController],
    }).compile();

    controller = module.get<YoutubeController>(YoutubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
