import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'auth_token', comment: '인증 토큰' })
export class AuthToken {
  @PrimaryColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 225 })
  accessToken: string;

  @Column({ type: 'varchar', length: 225 })
  refreshToken: string;

  @CreateDateColumn()
  readonly createdAt: Date;
}
