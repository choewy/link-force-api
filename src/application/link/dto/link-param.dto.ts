import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LinkParamDTO {
  @ApiProperty({ type: String, example: '', description: '링크 ID' })
  @IsString()
  @Length(7, 7)
  @IsNotEmpty()
  id: string;
}
