import { ApiProperty } from '@nestjs/swagger';

import { Auth } from 'src/domain/entities/auth.entity';

export class AuthDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;

  constructor(auth: Auth) {
    this.id = auth.id;
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
  }
}
