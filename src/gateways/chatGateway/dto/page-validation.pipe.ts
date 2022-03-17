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

@Injectable()
export class PageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === "number" && value >= 1) {
      return value;
    } else {
      throw new BadRequestException("Wrong input value");
    }
  }
}
