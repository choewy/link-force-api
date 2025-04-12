import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OAuthPlatform } from 'src/application/oauth/persistents/enums';
import { OAuth } from 'src/application/oauth/entities/oauth.entity';

export class UserPlatformAccountDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

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

  constructor(oauth: OAuth) {
    this.platform = oauth.platform;
    this.accountId = oauth.accountId;
    this.name = oauth.name;
    this.nickname = oauth.nickname;
    this.email = oauth.email;
    this.profileImage = oauth.profileImage;
    this.createdAt = oauth.createdAt;
    this.updatedAt = oauth.updatedAt;
  }
}
