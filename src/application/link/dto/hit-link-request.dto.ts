import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class HitLinkRequestDTO {
  @ApiProperty({ type: String })
  @IsString()
  @Length(7, 7)
  linkId: string;
}
