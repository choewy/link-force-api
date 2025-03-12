import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from './link.entity';

@Entity({ name: 'link_hit_history', comment: '링크 접속 히스토리' })
export class LinkHitHistory {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: 'PK' })
  readonly id: string;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;

  @ManyToOne(() => Link, (e) => e.hitHistories, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;
}
