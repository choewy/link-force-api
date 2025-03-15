import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NodeEnv } from '../classes/node-env';

@Injectable()
export class AppConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getProcessID() {
    return process.pid;
  }

  public getNodeEnv(): NodeEnv {
    return new NodeEnv(this.configService.getOrThrow('NODE_ENV'));
  }

  public getAppName(): string {
    return this.configService.getOrThrow('npm_package_name');
  }

  public getAppVersion(): string {
    return this.configService.getOrThrow('npm_package_version');
  }

  public getLinkBaseURL(): string {
    return this.configService.getOrThrow('LINK_BASE_URL');
  }
}
