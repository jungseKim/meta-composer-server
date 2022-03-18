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
  transform(value: any, { metatype }: ArgumentMetadata) {
    if (value >= 1 && metatype === Number) {
      return value;
    } else {
      throw new BadRequestException("Please add a number greater than 0.");
    }
  }
}
