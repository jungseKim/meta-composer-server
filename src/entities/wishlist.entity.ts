import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';
@Entity()
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.wishlist)
  user: User;
//ddtest
  @ManyToOne((type) => Lesson, (lesson) => lesson.wishlist)
  lesson: Lesson;
}
//asd