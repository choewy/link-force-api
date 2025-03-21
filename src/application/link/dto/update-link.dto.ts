import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { LinkStatus } from 'src/domain/enums';

export class UpdateLinkDTO {
  @ApiPropertyOptional({ type: String, enum: LinkStatus })
  @IsEnum(LinkStatus)
  @IsOptional()
  status: LinkStatus;
}
