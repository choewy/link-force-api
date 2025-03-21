import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GetLinksDTO {
  @ApiProperty({ type: Number })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  skip: number;

  @ApiProperty({ type: Number })
  @Max(1000)
  @IsInt()
  @IsNotEmpty()
  take: number;
}
