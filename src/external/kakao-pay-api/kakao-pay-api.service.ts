import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoPayApiService {
  constructor(private readonly httpService: HttpService) {}
}
