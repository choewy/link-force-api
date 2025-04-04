import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth_token', comment: '인증 토큰' })
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 512 })
  accessToken: string;

  @Column({ type: 'varchar', length: 512 })
  refreshToken: string;

  @CreateDateColumn()
  readonly createdAt: Date;
}
