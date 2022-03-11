import { PickType } from "@nestjs/swagger";
import { ConcoursSignup } from "src/entities/concoursSignup.entity";





export class ConcoursSignupsDTO extends PickType(ConcoursSignup, [
'concoursId',
'userId',
'youtubeURL',
'merchant_uid',
'participated_date'
 
]as const){}
