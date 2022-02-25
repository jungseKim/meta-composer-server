import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
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
}
//asd