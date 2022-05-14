import { ApiProperty, PickType } from "@nestjs/swagger";
import { Teacher } from "src/entities/teacher.entity";
import { User } from "src/entities/user.entity";

export class TeacherDTO extends PickType(Teacher, [
  "career",
  "introduce",
  "self_video",
  "userId",
] as const) {}

export class TeacherResponseDTO extends PickType(Teacher, [
  "career",
  "introduce",
  "self_video",
  "userId",
] as const) {
  @ApiProperty({
    type: User,
  })
  user: User;
}
