import { Injectable } from '@nestjs/common';

import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';

@Injectable()
export class AuthService {
  constructor(private readonly kakaoApiService: KakaoApiService) {}
}
