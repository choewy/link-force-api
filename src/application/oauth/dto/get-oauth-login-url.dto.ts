import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';

import { OAuthPlatform } from '../persistents/enums';

export class GetOAuthLoginUrlParamDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  @IsNotEmpty()
  platform: OAuthPlatform;
}

export class GetOAuthLoginUrlQueryDTO {
  @ApiProperty({ type: String, example: 'http://127.0.0.1:3000' })
  @IsUrl()
  @IsNotEmpty()
  callbackUrl: string;
}

export class GetOAuthLoginUrlResultDTO {
  @ApiProperty({ type: String })
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}
