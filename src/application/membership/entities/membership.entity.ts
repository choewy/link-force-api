import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { User } from 'src/application/user/entities/user.entity';

@Entity({ name: 'membership', comment: '멤버십' })
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'timestamp', comment: '다음 결제일시' })
  nextPaymentDate: Date;

  @CreateDateColumn({ comment: '최초 결제일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;

  @Column({ type: 'varchar', comment: '사용자 PK' })
  userId: string;

  @OneToOne(() => User, (e) => e.membership, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
