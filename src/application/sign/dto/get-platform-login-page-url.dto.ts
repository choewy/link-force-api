import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class GetPlatformLoginPageUrlDTO {
  @ApiProperty({ type: String, example: 'http://127.0.0.1:3000' })
  @IsString()
  @IsNotEmpty()
  state: string;
}
