import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'user_specification', comment: '사용자 상세' })
export class UserSpecification {
  @PrimaryColumn({ type: 'varchar', length: 36, comment: '사용자 PK' })
  userId: string;

  @Column({ type: 'int', unsigned: true, default: 0, comment: '링크수' })
  linkCount: number;

  @OneToOne(() => User, (e) => e.specification, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;
}
