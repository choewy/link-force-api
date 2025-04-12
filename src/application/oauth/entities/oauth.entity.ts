import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { User } from 'src/application/user/entities/user.entity';

import { OAuthPlatform } from '../persistents/enums';

@Entity({ name: 'oauth', comment: 'OAuth' })
@Unique('oauth_unique_key', ['platform', 'accountId'])
export class OAuth {
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '플랫폼' })
  platform: OAuthPlatform;

  @PrimaryColumn({ type: 'varchar', length: 100, comment: '플랫폼 ID' })
  accountId: string;

  @Column({ type: 'varchar', length: 50, default: null, comment: '닉네임' })
  name: string | null;

  @Column({ type: 'varchar', length: 50, default: null, comment: '닉네임' })
  nickname: string | null;

  @Column({ type: 'varchar', length: 340, default: null, comment: '이메일' })
  email: string | null;

  @Column({ type: 'varchar', length: 1024, default: null, comment: '프로필 이미지 URL' })
  profileImage: string | null;

  @Column({ type: 'varchar', comment: '사용자 PK' })
  userId: string;

  @ManyToOne(() => User, (e) => e.oauths, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;
}
