import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

/**
 * @description
 *
 * SRP란: 한 클래스는 하나의 책임만 가져야한다. (단일 책임의 원칙)
 */
export class SendMessageDto {
  @ApiProperty({ example: "heelow", description: "전달할 메세지" })
  @IsString()
  @IsNotEmpty()
  message: string; // 유저 이름

  @ApiProperty({
    example: "true or flase",
    description: "조인 되면 true 안되면 flase",
  })
  @IsBoolean()
  @IsNotEmpty()
  is_read: boolean;
}
