import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { Link } from 'src/application/link/entities/link.entity';

@Entity({ name: 'daliy_statistics', comment: '링크 일별 통계' })
export class DaliyStatistics {
  @PrimaryColumn({ type: 'varchar', comment: '링크 ID' })
  linkId: string;

  @PrimaryColumn({ type: 'date', comment: '일자' })
  date: Date;

  @Column({ type: 'bigint', unsigned: true, default: 0, comment: '요청수' })
  hitCount: number;

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;

  @ManyToOne(() => Link, (e) => e.histories, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;
}
