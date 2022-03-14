import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  //enum?

  @Column({ type: 'datetime' })
  readTime: number;
  //nullbale

  @Column()
  notifiable: string;

  @Column()
  data: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
