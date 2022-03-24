import { Payment } from "src/entities/payment.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  async createPayment(updateData, user): Promise<Payment> {
    const payments = this.create({
      payment_number: updateData.merchant_uid,
      affiliation: updateData.card_name,
      signupId: updateData.signupId,
      concoursSignupId: updateData.concoursSignupId,
      refund: "",
      userId: user.id,
    });
    this.save(payments);

    return payments;
  }
}
