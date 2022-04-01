import { IsNumber } from "class-validator";
/*
https://docs.nestjs.com/pipes
*/

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class StringValidationPipe implements PipeTransform {
  transform(value: any, { metatype }: ArgumentMetadata) {
    console.log({ metatype }, typeof value);
    if (metatype === Number) {
      return value;
    } else {
      throw new WsException("Please add a number greater than 0.");
    }
  }
}
