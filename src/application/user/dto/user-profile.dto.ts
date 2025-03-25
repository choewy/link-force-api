import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SignPlatform } from '../persistents/enums';
import { PlatformAccount } from '../entities/platform-account.entity';

export class UserProfileDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  platform: SignPlatform;

  @ApiPropertyOptional({ type: String })
  name: string | null;

  @ApiPropertyOptional({ type: String })
  nickname: string | null;

  @ApiPropertyOptional({ type: String, format: 'email' })
  email: string | null;

  @ApiPropertyOptional({ type: String })
  profileImage: string | null;

  constructor(platformAccount: PlatformAccount) {
    this.platform = platformAccount.platform;
    this.name = platformAccount.name;
    this.nickname = platformAccount.nickname;
    this.email = platformAccount.email;
    this.profileImage = platformAccount.profileImage;
  }
}
