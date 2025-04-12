import { ApiProperty } from '@nestjs/swagger';
import { AuthToken } from '../entities/auth-token.entity';

export class GetAuthTokenBodyDTO {
  @ApiProperty({ type: String })
  authKey: string;
}

export class GetAuthTokenResultDTO {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;

  constructor(authToken: AuthToken) {
    this.accessToken = authToken.accessToken;
    this.refreshToken = authToken.refreshToken;
  }
}
