import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';

import { LinkType } from 'src/domain/enums';

export class CreateLinkDTO {
  @ApiProperty({ type: String, example: '', description: '축약할 URL' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ type: String, enum: LinkType, description: '링크 생성 속성' })
  @IsEnum(LinkType)
  @IsNotEmpty()
  type: LinkType;
}
