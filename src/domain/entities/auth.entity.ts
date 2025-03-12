import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth', comment: '인증' })
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 255 })
  accessToken: string;

  @Column({ type: 'varchar', length: 255 })
  refreshToken: string;

  @CreateDateColumn({ comment: '생성일시' })
  readonly createdAt: Date;
}
