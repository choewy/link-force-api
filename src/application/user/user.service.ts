import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ContextService } from 'src/common/context/context.service';

import { User } from './entities/user.entity';
import { MyProfileDTO } from './dto/my-profile.dto';
import { PlatformAccount } from './entities/platform-account.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PlatformAccount)
    private readonly platformAccountRepository: Repository<PlatformAccount>,
  ) {}

  async getMyProfile() {
    const userId = this.contextService.getRequestUserID();
    const platformAccountId = this.contextService.getRequestPlatformAccountID();

    console.log({ userId, platformAccountId });

    if (!userId || !platformAccountId) {
      throw new UnauthorizedException();
    }

    const platformAccount = await this.platformAccountRepository
      .createQueryBuilder('platformAccount')
      .innerJoinAndMapOne('platformAccount.user', 'platformAccount.user', 'user')
      .where('1 = 1')
      .andWhere('platformAccount.id = :platformAccountId', { platformAccountId })
      .andWhere('user.id = :userId', { userId })
      .take(1)
      .getOne();

    if (!platformAccount) {
      throw new UnauthorizedException();
    }

    return new MyProfileDTO(platformAccount);
  }
}
