import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { Link } from 'src/application/link/entities/link.entity';

@Entity({ name: 'statistics', comment: '링크 통계' })
export class Statistics {
  @PrimaryColumn({ type: 'varchar', comment: '링크 PK' })
  linkId: string;

  @Column({ type: 'bigint', unsigned: true, default: 0, comment: '요청수' })
  hitCount: number;

  @OneToOne(() => Link, (e) => e.statistics, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;
}
