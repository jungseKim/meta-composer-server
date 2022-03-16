import { PickType } from "@nestjs/swagger";
import { Signup } from "src/entities/signup.entity";

export class SignupDto extends PickType(Signup, [
'merchant_uid',
'lessonId',
'userId'
 
]as const){}
