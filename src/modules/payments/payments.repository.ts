import { Payment } from "src/entities/payment.entity";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  async createPayment(updateData, user: User): Promise<Payment> {
    const payments = this.create({
      payment_number: updateData.merchant_uid,
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

  async deletePayment(updateData, user: User): Promise<Payment> {
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
