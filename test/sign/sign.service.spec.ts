import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { DataSource } from 'typeorm';

import { AuthService } from 'src/application/auth/auth.service';
import { SignService } from 'src/application/sign/sign.service';
import { ContextService } from 'src/common/context/context.service';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { NaverApiService } from 'src/external/naver-api/naver-api.service';
import { GoogleApiService } from 'src/external/google-api/google-api.service';
import { ConfigFactoryModule } from 'src/common/config/config-factory.module';

describe('SignService', () => {
  let signService: SignService;
  let authService: AuthService;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigFactoryModule],
      providers: [
        {
          provide: ContextService,
          useValue: {
            getRequest: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
        {
          provide: 'AuthTokenRepository',
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: 'UserSpecificationRepository',
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: 'PlatformAccountRepository',
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: KakaoApiService,
          useValue: {
            getLoginPageURL: jest.fn(),
            getToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
        {
          provide: NaverApiService,
          useValue: {
            getLoginPageURL: jest.fn(),
            getToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
        {
          provide: GoogleApiService,
          useValue: {
            getLoginPageURL: jest.fn(),
            getToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
        SignService,
        JwtService,
        AuthService,
      ],
    }).compile();

    signService = module.get<SignService>(SignService);
    authService = module.get<AuthService>(AuthService);
    contextService = module.get<ContextService>(ContextService);
  });

  describe('인증 토큰', () => {
    it('인증 토큰을 갱신해야 한다.', () => {
      const accessToken = authService.issueAccessToken('test-id', 'test-platform-account-id');
      const refreshToken = authService.issueRefreshToken(accessToken);

      jest.spyOn(contextService, 'getRequest').mockReturnValue({
        headers: { authorization: `Bearer ${accessToken}` },
      } as Partial<Request> as Request);

      const result = signService.refreshSignToken({ refreshToken });

      expect(result).toBeDefined();
    });
  });
});
