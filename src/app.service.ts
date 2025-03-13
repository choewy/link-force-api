import { Injectable } from '@nestjs/common';

import { AppConfigFactory } from './common/config/providers/app-config.factory';
import { AppProfileDTO } from './dto/app-profile.dto';

@Injectable()
export class AppService {
  constructor(private readonly appConfigFatory: AppConfigFactory) {}

  getAppProfile() {
    return new AppProfileDTO(this.appConfigFatory.getAppName(), this.appConfigFatory.getAppVersion(), this.appConfigFatory.getNodeEnv());
  }
}
