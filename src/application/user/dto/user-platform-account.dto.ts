import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SignPlatform } from '../persistents/enums';
import { PlatformAccount } from '../entities/platform-account.entity';

export class UserPlatformAccountDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  platform: SignPlatform;

  @ApiProperty({ type: String })
  accountId: string;

  @ApiPropertyOptional({ type: String })
  name: string | null;

  @ApiPropertyOptional({ type: String })
  nickname: string | null;

  @ApiPropertyOptional({ type: String })
  email: string | null;

  @ApiPropertyOptional({ type: String })
  profileImage: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(platformAccount: PlatformAccount) {
    this.platform = platformAccount.platform;
    this.accountId = platformAccount.accountId;
    this.name = platformAccount.name;
    this.nickname = platformAccount.nickname;
    this.email = platformAccount.email;
    this.profileImage = platformAccount.profileImage;
    this.createdAt = platformAccount.createdAt;
    this.updatedAt = platformAccount.updatedAt;
  }
}
