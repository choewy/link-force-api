import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SetRequiredRequestUserID } from 'src/persistent/decorators';

import { UserService } from './user.service';
import { UseAuthGuard } from '../auth/auth.guard';
import { MyProfileDTO } from './dto/my-profile.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '내 프로필 정보 조회' })
  @ApiOkResponse({ type: MyProfileDTO })
  async getMyProfile() {
    return this.userService.getMyProfile();
  }
}
