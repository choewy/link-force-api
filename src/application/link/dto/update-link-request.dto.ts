import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { LinkStatus, LinkStatusCode } from 'src/domain/enums';

export class UpdateLinkRequestParamDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateLinkRequestBodyDTO {
  @ApiPropertyOptional({ type: String, enum: LinkStatus })
  @IsEnum(LinkStatus)
  @IsOptional()
  status: LinkStatus;

  @ApiPropertyOptional({ type: Number, enum: [LinkStatusCode.Found, LinkStatusCode.Permanently] })
  @IsEnum(LinkStatusCode)
  @IsOptional()
  statusCode: LinkStatusCode;
}
