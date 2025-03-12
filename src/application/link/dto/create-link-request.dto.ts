import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';

import { LinkStatusCode, LinkType } from 'src/domain/constants';

export class CreateLinkRequestDTO {
  @ApiProperty({ type: String, example: '', description: '축약할 URL' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ type: String, enum: LinkType, description: '링크 생성 속성' })
  @IsEnum(LinkType)
  @IsNotEmpty()
  type: LinkType;

  @ApiProperty({ type: Number, enum: LinkStatusCode, description: '링크 Redirect 메소드' })
  @IsEnum(LinkStatusCode)
  @IsNotEmpty()
  httpStatus: LinkStatusCode;
}
