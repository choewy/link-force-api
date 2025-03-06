import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getListenPort() {
    return +this.configService.getOrThrow('PORT');
  }

  public getCorsOrigin() {
    return new RegExp(this.configService.getOrThrow('ORIGIN'));
  }
}
