import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

import { UserDTO } from './user.dto';

export class UserListDTO {
  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: [UserDTO] })
  rows: UserDTO[];

  constructor(users: User[], count: number) {
    this.count = count;
    this.rows = users.map((user) => new UserDTO(user));
  }
}
