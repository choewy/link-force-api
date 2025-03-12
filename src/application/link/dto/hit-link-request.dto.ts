import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class HitLinkRequestDTO {
  @ApiProperty({ type: String, example: '', description: '링크 ID' })
  @IsString()
  @Length(7, 7)
  linkId: string;
}
