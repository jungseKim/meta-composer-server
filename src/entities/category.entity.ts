import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Category, (category) => category.pid,{eager : true })
  ids: number[];

  @Column()
  tag: string;

  //   @ManyToOne((type) => Category, (category) => category.id)
  //   pid: number;
  @ManyToOne(() => Category, (category) => category.ids)
  pid: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
