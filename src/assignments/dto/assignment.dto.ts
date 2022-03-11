import { PickType } from "@nestjs/swagger";
import { Assignment } from "src/entities/assignment.entity";


export class AssignmentDTO extends PickType(Assignment, [
    'startedTime',
    'endTime',
    'contents',
    'title',
    'isFinished',
    'accuracy',
    'time_length',
    'finished_times',
    'userId',
    'lessonId'
]as const){}
