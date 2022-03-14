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
  @OneToMany((type) => Category, (category) => category.pid)
  id: number;

  @Column()
  tag: string;

  //   @ManyToOne((type) => Category, (category) => category.id)
  //   pid: number;
  @ManyToOne((type) => Category, (category) => category.id)
  pid: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
