import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { User } from 'src/application/user/entities/user.entity';

import { PaymentStatus } from '../persistents/enums';

@Entity({ name: 'payment', comment: '결제' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 10, comment: '결제상태' })
  status: PaymentStatus;

  @CreateDateColumn({ comment: '결제시도일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '결제완료/실패 일시', default: null, transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date | null;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;

  @Column({ type: 'varchar', comment: '사용자 PK' })
  userId: string;

  @ManyToOne(() => User, (e) => e.payments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
