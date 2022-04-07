import { PickType } from "@nestjs/swagger";
import { Part } from "src/entities/part.entity";
import { Payment } from "src/entities/payment.entity";

export class PartDto extends PickType(Part, [
  "lesson",
  "sequence",
  "handTracking",
  "audio",
  "pianoEvent",
] as const) {}
