import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Signup } from 'src/entities/signup.entity';
import { SignupsRepository } from 'src/signups/signups.repository';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  
  
   
  

    async getMyAllPayments(updateData) :Promise<Payment>{

      return;

    }


    async createPayment(updateData) :Promise<Payment>{


    
        

        const payments = this.create({
            payment_number : updateData.merchant_uid,
            affiliation : updateData.card_name,
            signupId : updateData.signupId,
            refund : "",


         
        })
        this.save(payments);

        return payments;
    }

    
}
