import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppProfileDTO } from './dto/app-profile.dto';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '앱 프로필' })
  @ApiOkResponse({ type: AppProfileDTO })
  getAppProfile() {
    return this.appService.getAppProfile();
  }
}
