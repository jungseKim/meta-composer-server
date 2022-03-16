import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(PaymentsRepository) private paymentsRepository : PaymentsRepository,
    ) {}


    
    async getMyAllPayments(updateData): Promise<Payment>{
        
        return this.paymentsRepository.getMyAllPayments(updateData);
      
      }
      async createPayment(updateData): Promise<Payment>{
        
        return this.paymentsRepository.createPayment(updateData);
      
      }

      
}

