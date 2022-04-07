import { PickType } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";

export class JoinFacebookDto extends PickType(User, [
  "email",
  // 'password',
  "provider",
  "provider_id",
  // 'password',
  "username",
  "profile_image",
] as const) {}

//바꾸기
