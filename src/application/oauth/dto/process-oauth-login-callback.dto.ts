import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OAuthPlatform } from '../persistents/enums';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProcessOAuthLoginCallbackParamDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  @IsNotEmpty()
  platform: OAuthPlatform;
}

export class ProcessOAuthLoginCallbackQueryDTO {
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

export class ProcessOAuthLoginCallbackResultQueryDTO {
  @ApiProperty({ type: String, enum: OAuthPlatform })
  platform: OAuthPlatform;

  @ApiProperty({ type: String })
  authKey: string;
}
