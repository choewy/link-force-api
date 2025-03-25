import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ContextService } from 'src/common/context/context.service';

import { User } from './entities/user.entity';
import { UserProfileDTO } from './dto/user-profile.dto';
import { PlatformAccount } from './entities/platform-account.entity';
import { UserListDTO } from './dto/user-list.dto';
import { GetUserListDTO } from './dto/get-user-list.dto';

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

    return new UserProfileDTO(platformAccount);
  }

  async getUserList(queryParam: GetUserListDTO): Promise<UserListDTO> {
    const [users, count] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndMapOne('user.platformAccount', 'user.platformAccount', 'platformAccount')
      .orderBy('user.createdAt', 'DESC')
      .skip(queryParam.skip)
      .take(queryParam.take)
      .getManyAndCount();

    return new UserListDTO(users, count);
  }
}
