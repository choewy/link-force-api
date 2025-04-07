import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshSignTokenBodyDTO {
  @ApiProperty({ type: String, description: 'Refresh Token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshSignTokenResultDTO {
  @ApiProperty({ type: String, description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ type: String, description: 'Refresh Token' })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
