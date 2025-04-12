import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OAuthPlatform } from 'src/application/oauth/persistents/enums';
import { OAuth } from 'src/application/oauth/entities/oauth.entity';

export class UserProfileDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiPropertyOptional({ type: String })
  name: string | null;

  @ApiPropertyOptional({ type: String })
  nickname: string | null;

  @ApiPropertyOptional({ type: String, format: 'email' })
  email: string | null;

  @ApiPropertyOptional({ type: String })
  profileImage: string | null;

  constructor(oauth: OAuth) {
    this.platform = oauth.platform;
    this.name = oauth.name;
    this.nickname = oauth.nickname;
    this.email = oauth.email;
    this.profileImage = oauth.profileImage;
  }
}
