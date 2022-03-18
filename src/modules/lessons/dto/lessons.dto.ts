import { PickType } from "@nestjs/swagger";
import { Lesson } from "src/entities/lesson.entity";




export class LessonDTO extends PickType(Lesson, [
'introduce',
'length',
'price',
'name',
'type',
'teacherId'

]as const){}