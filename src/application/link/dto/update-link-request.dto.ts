import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { LinkStatus } from 'src/domain/enums';

export class UpdateLinkRequestDTO {
  @ApiPropertyOptional({ type: String, enum: LinkStatus })
  @IsEnum(LinkStatus)
  @IsOptional()
  status: LinkStatus;
}
