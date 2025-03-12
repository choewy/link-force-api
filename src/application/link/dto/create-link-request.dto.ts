import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { LinkStatusCode } from 'src/domain/constants';

export class CreateLinkRequestDTO {
  @ApiProperty({ type: String })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ type: Number, enum: LinkStatusCode })
  @IsEnum(LinkStatusCode)
  @IsNotEmpty()
  httpStatus: LinkStatusCode;
}
