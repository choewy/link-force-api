import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ContextService } from 'src/common/context/context.service';

import { OAuth } from '../oauth/entities/oauth.entity';

import { User } from './entities/user.entity';
import { UserProfileDTO } from './dto/user-profile.dto';
import { UserListDTO } from './dto/user-list.dto';
import { GetUserListDTO } from './dto/get-user-list.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OAuth)
    private readonly oauthRepository: Repository<OAuth>,
  ) {}

  async getMyProfile() {
    const userId = this.contextService.getRequestUserID();
    const oauthKey = this.contextService.getRequestOAuthKey();

    if (!userId || !oauthKey.platform || !oauthKey.accountId) {
      throw new UnauthorizedException();
    }

    const oauth = await this.oauthRepository
      .createQueryBuilder('oauth')
      .innerJoinAndMapOne('oauth.user', 'oauth.user', 'user')
      .where('1 = 1')
      .andWhere('oauth.platform = :platform', { platform: oauthKey.platform })
      .andWhere('oauth.accountId = :accountId', { accountId: oauthKey.accountId })
      .andWhere('user.id = :userId', { userId })
      .take(1)
      .getOne();

    if (!oauth) {
      throw new UnauthorizedException();
    }

    return new UserProfileDTO(oauth);
  }

  async getUserList(queryParam: GetUserListDTO): Promise<UserListDTO> {
    const [users, count] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndMapMany('user.oauths', 'user.oauths', 'oauths')
      .orderBy('user.createdAt', 'DESC')
      .skip(queryParam.skip)
      .take(queryParam.take)
      .getManyAndCount();

    return new UserListDTO(users, count);
  }
}
