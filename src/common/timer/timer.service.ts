import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerService {
  async sleep(seconds: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }
}
