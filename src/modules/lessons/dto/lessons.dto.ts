import { Teacher } from "./../../../entities/teacher.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { Lesson } from "src/entities/lesson.entity";
import { Comment } from "src/entities/comment.entity";
import { TeacherResponseDTO } from "src/modules/teachers/dto/teachers.dto";

export class LessonDTO extends PickType(Lesson, [
  "introduce",
  "length",
  "price",
  "name",
  "type",
  "teacherId",
  "imageURL",
  "difficulty",
  "weLearnThis",
  "checkPlease",
] as const) {}

export class LessonResponseDTO extends PickType(Lesson, [
  "introduce",
  "length",
  "price",
  "name",
  "type",
  "teacherId",
  "imageURL",
  "difficulty",
  "weLearnThis",
  "checkPlease",
] as const) {
  @ApiProperty({
    type: Comment,
  })
  commnets: Comment[];
  @ApiProperty({
    type: TeacherResponseDTO,
  })
  teacher: Teacher;
}
