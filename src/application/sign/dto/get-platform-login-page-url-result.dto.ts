import { ApiProperty } from '@nestjs/swagger';

export class GetPlatformLoginPageUrlResultDTO {
  @ApiProperty({ type: String })
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}
