import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/application/user/entities/user.entity';
import { DateTimeColumnTransformer } from 'src/common/transformers/datetime-column.transformer';

import { LINK_ID_LENGTH } from '../persistencts/constants';
import { LinkStatus, LinkType } from '../persistencts/enums';

import { LinkHitHistory } from './link-hit-history.entity';
import { LinkStatistics } from './link-statistics.entity';

@Entity({ name: 'link', comment: '링크' })
export class Link {
  @PrimaryColumn({ type: 'varchar', comment: '링크 PK' })
  id: string;

  @Column({ type: 'varchar', length: 10, comment: '구분' })
  type: LinkType;

  @Column({ type: 'varchar', length: 2048, comment: 'URL' })
  url: string;

  @Column({ type: 'varchar', length: 10, default: LinkStatus.Activated, comment: '활성 상태' })
  status: LinkStatus;

  @Column({ type: 'timestamp', default: null, comment: '만료일시' })
  expiredAt: Date | null;

  @Column({ type: 'varchar', nullable: true, comment: '사용자 PK' })
  userId: string | null;

  @ManyToOne(() => User, (e) => e.links, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User | null;

  @OneToOne(() => LinkStatistics, (e) => e.link, { cascade: true })
  @JoinTable()
  statistics: LinkStatistics;

  @OneToMany(() => LinkHitHistory, (e) => e.link, { cascade: true })
  @JoinTable()
  hitHistories: LinkHitHistory[];

  @CreateDateColumn({ comment: '생성일시', transformer: new DateTimeColumnTransformer() })
  readonly createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시', transformer: new DateTimeColumnTransformer() })
  readonly updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시', transformer: new DateTimeColumnTransformer() })
  readonly deletedAt: Date | null;

  public static createId() {
    const numbers = '0123456789';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';

    const targets = [uppers, lowers, numbers].join('');
    const targetLength = targets.length;

    let id = '';

    while (id.length < LINK_ID_LENGTH) {
      const i = Math.floor(Math.random() * targetLength);

      id += targets[i];
    }

    return id;
  }
}
