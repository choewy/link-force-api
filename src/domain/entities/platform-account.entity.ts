import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';
import { SignPlatform } from 'src/application/sign/enums';

@Entity({ name: 'platform_account', comment: '플랫폼 계정' })
@Unique('platform_account_unique_key', ['platform', 'accountId'])
export class PlatformAccount {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 20, comment: '플랫폼' })
  platform: SignPlatform;

  @Column({ type: 'varchar', length: 20, comment: '카카오 ID' })
  accountId: string;

  @Column({ type: 'varchar', length: 50, default: null, comment: '닉네임' })
  nickname: string | null;

  @Column({ type: 'varchar', length: 1024, default: null, comment: '프로필 이미지 URL' })
  profileImage: string | null;

  @OneToOne(() => User, (e) => e.platformAccount, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;
}
