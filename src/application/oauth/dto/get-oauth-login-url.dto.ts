import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { OAuthPlatform } from '../persistents/enums';
import { IsUrlWithPort } from 'src/common/validators/is-url-with-port';

export class GetOAuthLoginUrlParamDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  @IsNotEmpty()
  platform: OAuthPlatform;
}

export class GetOAuthLoginUrlBodyDTO {
  @ApiProperty({ type: String, example: 'http://127.0.0.1:3000' })
  @IsUrlWithPort()
  @IsNotEmpty()
  redirectUrl: string;

  @ApiPropertyOptional({ type: String, example: '' })
  @IsString()
  @IsOptional()
  linkId: string | null;
}

export class GetOAuthLoginUrlResultDTO {
  @ApiProperty({ type: String })
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}
