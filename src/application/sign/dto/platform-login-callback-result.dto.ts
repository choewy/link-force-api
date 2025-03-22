import { ApiProperty } from '@nestjs/swagger';

import { SignPlatform } from 'src/application/user/persistents/enums';

export class PlatformLoginCallbackResultDTO {
  @ApiProperty({ type: String, enum: SignPlatform })
  platform: SignPlatform;

  @ApiProperty({ type: String })
  authKey: string;
}
