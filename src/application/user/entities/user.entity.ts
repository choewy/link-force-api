import { CreateDateColumn, DeleteDateColumn, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Link } from 'src/application/link/entities/link.entity';
import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { Membership } from 'src/application/membership/entities/membership.entity';

import { PlatformAccount } from './platform-account.entity';
import { UserSpecification } from './user-specification.entity';
import { Payment } from 'src/application/payment/entities/payment.entity';

@Entity({ name: 'user', comment: '사용자' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @OneToOne(() => PlatformAccount, (e) => e.user, { cascade: true })
  @JoinTable()
  platformAccount: PlatformAccount;

  @OneToOne(() => Membership, (e) => e.user, { cascade: true, nullable: true })
  @JoinTable()
  membership: Membership | null;

  @OneToOne(() => UserSpecification, (e) => e.user, { cascade: true })
  @JoinTable()
  specification: UserSpecification;

  @OneToMany(() => Link, (e) => e.user, { cascade: true })
  @JoinTable()
  links: Link[];

  @OneToMany(() => Payment, (e) => e.user, { cascade: true })
  @JoinTable()
  payments: Payment[];

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;
}
