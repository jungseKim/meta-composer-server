import { PickType } from "@nestjs/swagger";
import { Teacher } from "src/entities/teacher.entity";

export class TeacherDTO extends PickType(Teacher, [
 'career',
 'introduce',
 'self_video',
 'userId'
 
]as const){}
