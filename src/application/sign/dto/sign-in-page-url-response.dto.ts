import { ApiProperty } from '@nestjs/swagger';

export class SignInPageURLResponseDTO {
  @ApiProperty({ type: String })
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}
