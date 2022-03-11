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
  signupId : number;

  @Column()
  payment_number: string;
    //결제 번호  , merchant_id 임.

  @Column()
  affiliation: string;
  @Column()
  refund: string;
}