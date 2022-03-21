import { Signup } from "src/entities/signup.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { CustomNotification } from "src/entities/custom-notification.entity";

export class NotificationInfoDto extends PickType(CustomNotification, [
  "id",
  "readTime",
  "signupId",
  "readTime",
  "created_at",
  "userId",
] as const) {
  @ApiProperty({ nullable: true, type: Signup })
  signup: Signup;
}
