import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerService {
  getRandomSeconds(min: number, max: number) {
    return Math.floor(Math.random() * max + min);
  }

  async sleep(seconds: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }
}
