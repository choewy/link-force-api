import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class KakaoLoginPageRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  state: string;
}
