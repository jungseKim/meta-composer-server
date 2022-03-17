import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

/**
 * @description SRP를 위반하는 구조이지만 테스트용으로 한 파일에 두 클래스를 선언했다.
 *
 * SRP란: 한 클래스는 하나의 책임만 가져야한다. (단일 책임의 원칙)
 */
export class SendMessageDto {
  @ApiProperty({ example: 1, description: "룸아이디" })
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @ApiProperty({ example: "heelow", description: "전달할 메세지" })
  @IsString()
  @IsNotEmpty()
  message: string; // 유저 이름
}
