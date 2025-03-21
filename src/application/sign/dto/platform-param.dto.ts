import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty } from 'class-validator';

import { SignPlatform } from '../enums';

export class PlatformParamDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  @IsEnum(SignPlatform)
  @IsNotEmpty()
  platform: SignPlatform;
}
