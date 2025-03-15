import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteLinkRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}
