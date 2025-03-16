import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { LinkStatus, LinkStatusCode } from 'src/domain/enums';

export class UpdateLinkRequestDTO {
  @ApiPropertyOptional({ type: String, enum: LinkStatus })
  @IsEnum(LinkStatus)
  @IsOptional()
  status: LinkStatus;

  @ApiPropertyOptional({ type: Number, enum: [LinkStatusCode.Found, LinkStatusCode.Permanently] })
  @IsEnum(LinkStatusCode)
  @IsOptional()
  statusCode: LinkStatusCode;
}
