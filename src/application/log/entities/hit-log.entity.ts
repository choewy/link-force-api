import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';
import { Link } from 'src/application/link/entities/link.entity';

@Entity({ name: 'hit_log', comment: '링크 접속 로그' })
export class HitLog {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 20, comment: '요청 IP' })
  ip: string;

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;

  @Column({ type: 'varchar', comment: '링크 ID' })
  linkId: string;

  @ManyToOne(() => Link, (e) => e.logs, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;
}
