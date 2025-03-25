import { CreateDateColumn, DeleteDateColumn, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Link } from 'src/application/link/entities/link.entity';
import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';

import { PlatformAccount } from './platform-account.entity';
import { UserSpecification } from './user-specification.entity';

@Entity({ name: 'user', comment: '사용자' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @OneToOne(() => PlatformAccount, (e) => e.user, { cascade: true })
  @JoinTable()
  platformAccount: PlatformAccount;

  @OneToOne(() => UserSpecification, (e) => e.user, { cascade: true })
  @JoinTable()
  specification: UserSpecification;

  @OneToMany(() => Link, (e) => e.user, { cascade: true })
  @JoinTable()
  links: Link[];

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;
}
