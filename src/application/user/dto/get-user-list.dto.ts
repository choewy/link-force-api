import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GetUserListDTO {
  @ApiProperty({ type: Number })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  skip: number;

  @ApiProperty({ type: Number })
  @Max(1000)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  take: number;
}
