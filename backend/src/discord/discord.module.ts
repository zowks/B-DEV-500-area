import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [CredentialsModule, HttpModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
