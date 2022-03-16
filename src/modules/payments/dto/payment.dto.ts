import { PickType } from "@nestjs/swagger";
import { Payment } from "src/entities/payment.entity";



export class PaymentDto extends PickType(Payment, [
'signupId',
'affiliation',
'refund',
'payment_number'
 
]as const){}
