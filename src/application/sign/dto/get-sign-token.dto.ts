import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class GetSignTokenDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  authKey: string;
}
