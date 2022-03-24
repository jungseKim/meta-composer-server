import { PickType } from "@nestjs/swagger";
import { Sheet } from "src/entities/sheet.entity";
import { Signup } from "src/entities/signup.entity";

export class SheetDto extends PickType(Sheet, [
  "sheetName",
  "isOpen",
  "storedURL",
  "userId",
  "lessonId",
  // 'assignmentId'
] as const) {}
