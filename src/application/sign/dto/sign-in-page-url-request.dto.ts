import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { SignPlatform } from '../enums';

export class SignInPageURLRequestParamDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  @IsEnum(SignPlatform)
  @IsNotEmpty()
  platform: SignPlatform;
}

export class SignInPageURLRequestBodyDTO {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  state: string;
}
