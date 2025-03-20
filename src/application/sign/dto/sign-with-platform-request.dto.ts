import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { KakaoLoginCallbackParam } from 'src/external/kakao-api/types';
import { NaverLoginCallbackParam } from 'src/external/naver-api/types';

import { SignPlatform } from '../enums';

export class SignWithPlatformRequestParamDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  @IsEnum(SignPlatform)
  @IsNotEmpty()
  platform: SignPlatform;
}

export class SignWithPlatformRequestBodyDTO {
  @ApiPropertyOptional({ type: String, example: 'http://127.0.0.1:3000' })
  @IsString()
  @IsOptional()
  state: string;
}

export class SignWithPlatformRequestQueryParamDTO implements KakaoLoginCallbackParam, NaverLoginCallbackParam {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  error?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  error_description?: string;
}
