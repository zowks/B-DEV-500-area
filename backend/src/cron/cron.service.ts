import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { Poller } from './interfaces/poller.interface';
import { Pusher } from './interfaces/pusher.interface';

@Injectable()
export class CronService {
  createCron<T>(poller: Poller<T>, pusher: Pusher<T>) {
    const cron = CronJob.from({
      cronTime: `*/${poller.delay} * * * * *`,
      onTick: async () => {
        const data = await poller.method();
        if (null !== data) {
          await pusher.method(data);
          console.log('Data has been pushed.');
        }
      },
      timeZone: 'Europe/Paris',
    });
    cron.start();
  }
}
