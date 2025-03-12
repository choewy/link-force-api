import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class KakaoLoginPageRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  state: string;
}
