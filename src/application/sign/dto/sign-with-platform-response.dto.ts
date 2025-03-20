import { ApiProperty } from '@nestjs/swagger';

import { SignPlatform } from '../enums';

export class SignWithPlatformResponseDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  platform: SignPlatform;

  @ApiProperty({ type: String })
  authKey: string;
}
