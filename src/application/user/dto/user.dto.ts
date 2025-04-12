import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

import { UserPlatformAccountDTO } from './user-platform-account.dto';

export class UserDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: [UserPlatformAccountDTO] })
  oauths: UserPlatformAccountDTO[];

  constructor(user: User) {
    this.id = user.id;
    this.oauths = user.oauths.map((oauth) => new UserPlatformAccountDTO(oauth));
  }
}
