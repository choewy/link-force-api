import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceTokenRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;
}
