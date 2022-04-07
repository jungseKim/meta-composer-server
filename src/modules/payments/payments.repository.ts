import { Payment } from "src/entities/payment.entity";
import { Signup } from "src/entities/signup.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  async createPayment(updateData, user): Promise<Payment> {
    const payments = this.create({
      payment_number: updateData.payment_number,
      affiliation: updateData.card_name,
      signupId: updateData.signupId,
      concoursSignupId: updateData.concoursSignupId,
      refund: false,
      userId: user.id,
      receipt_url: updateData.receipt_url,
    });
    this.save(payments);

    return payments;
  }

  async deletePayment(updateData, user): Promise<Payment> {
    this.createQueryBuilder()
      .update(Payment)
      .set({
        refund: true,
      })
      .where("payment_number = :number", { number: updateData.merchant_uid })
      .execute();

    // this.createQueryBuilder()
    //   .delete()
    //   .from(Signup)
    //   .where("merchant_uid = :id", { id: updateData.merchant_uid })
    //   .execute();

    return;
  }
}
