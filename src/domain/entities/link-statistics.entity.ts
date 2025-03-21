import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Link } from './link.entity';

@Entity({ name: 'link_statistics', comment: '링크 통계' })
export class LinkStatistics {
  @PrimaryColumn({ type: 'varchar', comment: '링크 PK' })
  linkId: string;

  @Column({ type: 'bigint', unsigned: true, default: 0, comment: '요청수' })
  hitCount: number;

  @OneToOne(() => Link, (e) => e.statistics, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  readonly deletedAt: Date | null;
}
