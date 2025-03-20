import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseType } from './persistent/dtos';
import { AppProfileDTO } from './dto/app-profile.dto';

import { AppService } from './app.service';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '앱 프로필' })
  @ApiOkResponse({ type: ResponseType(AppProfileDTO) })
  getAppProfile() {
    return this.appService.getAppProfile();
  }
}
