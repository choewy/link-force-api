import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { KakaoLoginCallbackParam } from 'src/external/kakao-api/types';

export class KakaoLoginCallbackRequestDTO implements KakaoLoginCallbackParam {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  error?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  error_description?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  state?: string;
}
