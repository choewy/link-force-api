import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { KakaoLoginCallbackParam } from 'src/external/kakao-api/types';
import { NaverLoginCallbackParam } from 'src/external/naver-api/types';

export class PlatformLoginCallbackQueryDTO implements KakaoLoginCallbackParam, NaverLoginCallbackParam {
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

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  scope?: string;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  authuser?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  prompt?: string;
}
