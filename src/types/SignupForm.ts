import { weekDays } from "src/entities/signup.entity";

export interface SingupForm {
  merchant_uid: string;
  startdate: Date;
  howManyMonth: number;
  lessonTime: Date[];
  weekdays: weekDays[];
}
