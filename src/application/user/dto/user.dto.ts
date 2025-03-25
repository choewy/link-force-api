import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

import { UserPlatformAccountDTO } from './user-platform-account.dto';

export class UserDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: UserPlatformAccountDTO })
  platformAccount: UserPlatformAccountDTO;

  constructor(user: User) {
    this.id = user.id;
    this.platformAccount = new UserPlatformAccountDTO(user.platformAccount);
  }
}
