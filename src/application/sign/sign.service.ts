import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { AuthService } from 'src/common/auth/auth.service';
import { KakaoAccount } from 'src/domain/entities/kakao-account.entity';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class SignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly kakaoApiService: KakaoApiService,
  ) {}

  async signInWithKakao(code: string) {
    const tokenResponse = await this.kakaoApiService.getToken(code);
    const kakaoProfile = await this.kakaoApiService.getProfile(tokenResponse.access_token);

    const kakaoAccountRepository = this.dataSource.getRepository(KakaoAccount);

    let kakaoAccount = await kakaoAccountRepository.findOne({
      relations: { user: true },
      select: { id: true },
      where: { id: kakaoProfile.id },
    });

    if (!kakaoAccount?.user) {
      kakaoAccount = kakaoAccountRepository.create({
        id: kakaoProfile.id,
        nickname: kakaoProfile.properties.nickname,
        profileImage: kakaoProfile.properties.profile_image,
      });

      const userSpecificationRepository = this.dataSource.getRepository(UserSpecification);
      const userSpecification = userSpecificationRepository.create();

      const userRepository = this.dataSource.getRepository(User);
      const user = userRepository.create({ kakaoAccount, specification: userSpecification });
      await userRepository.save(user);

      kakaoAccount.user = user;
    }

    const accessToken = this.authService.issueAccessToken(kakaoAccount.user.id);
    const refreshToken = this.authService.issueRefreshToken(accessToken);

    return this.authService.saveAuth(accessToken, refreshToken);
  }
}
