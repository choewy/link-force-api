import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'kakao_account', comment: '카카오계정' })
export class KakaoAccount {
  @PrimaryColumn({ type: 'bigint', unsigned: true, comment: '카카오 ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '닉네임' })
  nickname: string;

  @Column({ type: 'varchar', length: 1024, comment: '프로필 이미지 URL' })
  profileImage: string;

  @OneToOne(() => User, (e) => e.kakaoAccount, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User | null;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;
}
