import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '../constants';

@Injectable()
export class AppConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getNodeEnv(): NodeEnv {
    return new NodeEnv(this.configService.getOrThrow('NODE_ENV'));
  }

  public getAppName(): string {
    return this.configService.getOrThrow('npm_package_name');
  }

  public getAppVersion(): string {
    return this.configService.getOrThrow('npm_package_version');
  }
}
