import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';

import { User } from './user.entity';

@Entity({ name: 'user_specification', comment: '사용자 상세' })
export class UserSpecification {
  @PrimaryColumn({ type: 'varchar', comment: '사용자 PK' })
  userId: string;

  @Column({ type: 'int', unsigned: true, default: 0, comment: '링크수' })
  linkCount: number;

  @OneToOne(() => User, (e) => e.specification, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;
}
