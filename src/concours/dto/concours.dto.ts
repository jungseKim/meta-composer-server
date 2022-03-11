import { PickType } from "@nestjs/swagger";
import { Concours } from "src/entities/concours.entity";





export class ConcoursDTO extends PickType(Concours, [
'price',
'concoursSignupStartTime',
'concoursSignupFinishTime',
'startTime',
'finishTime',
'title',
'contents'
 
]as const){}
