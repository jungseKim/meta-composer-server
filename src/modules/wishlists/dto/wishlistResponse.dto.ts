import { ApiProperty, PickType } from "@nestjs/swagger";
import { Lesson } from "src/entities/lesson.entity";
import { Wishlist } from "src/entities/wishlist.entity";
import { LessonResponseDTO } from "src/modules/lessons/dto/lessons.dto";

export class WishListResponseDto extends PickType(Wishlist, [
  "id",
  "lesson",
  "userId",
  "lessonId",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty({
    type: LessonResponseDTO,
  })
  lesson: Lesson;
}
