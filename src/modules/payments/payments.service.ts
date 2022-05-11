import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { PaymentsRepository } from "./payments.repository";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private paymentsRepository: PaymentsRepository,
  ) {}

  async getMyAllPayments(updateData, user): Promise<Payment[]> {
    //유저의 결제내역

    return this.paymentsRepository
      .createQueryBuilder("payment")
      .innerJoinAndSelect("payment.signup", "signup")
      .innerJoinAndSelect("signup.lesson", "lesson")
      .leftJoinAndSelect("signup.timetable", "timetable")
      .leftJoinAndSelect("signup.signuptimetables", "signuptimetables")
      .where("payment.userId = :id", { id: user.id })
      .getMany();

    // return this.paymentsRepository.find();
  }
  async createPayment(updateData, user): Promise<Payment> {
    return this.paymentsRepository.createPayment(updateData, user);
  }

  async deletePayment(updateData, user): Promise<Payment> {
    const pay = await this.paymentsRepository.findOne({
      payment_number: updateData.merchant_uid,
    });
    pay.refund = true;
    return await pay.save();
    // return this.paymentsRepository.deletePayment(updateData, user);
  }
}
