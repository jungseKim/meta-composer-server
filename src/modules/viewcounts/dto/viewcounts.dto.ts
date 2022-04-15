import { PickType } from "@nestjs/swagger";
import { ViewCount } from "src/entities/viewCount.entity";

export class ViewcountDTO extends PickType(ViewCount, [
  "lessonId",
  "userId",
  "viewCount",
] as const) {}
