import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SetRequiredRequestUserID } from 'src/persistent/decorators';

import { UserService } from './user.service';
import { UseAuthGuard } from '../auth/auth.guard';
import { UserProfileDTO } from './dto/user-profile.dto';
import { UserListDTO } from './dto/user-list.dto';
import { GetUserListDTO } from './dto/get-user-list.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '내 프로필 정보 조회' })
  @ApiOkResponse({ type: UserProfileDTO })
  async getMyProfile() {
    return this.userService.getMyProfile();
  }

  // TODO 관리자 권한
  @Get('list')
  // @UseAuthGuard()
  // @SetRequiredRequestUserID()
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiOkResponse({ type: UserListDTO })
  async getUserList(@Query() queryParam: GetUserListDTO) {
    return this.userService.getUserList(queryParam);
  }
}
