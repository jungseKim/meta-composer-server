import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Signup } from './signup.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Signup, (signup) => signup.payment)
  signup: Signup;

  @Column()
  payment_number: number;

  @Column()
  affiliation: string;

  @Column()
  refund: string;
}
