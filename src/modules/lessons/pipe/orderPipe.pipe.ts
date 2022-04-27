import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

export class OrderValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): string[] {
    const value2 = value as string;
    // const desc = value.description as string
    const orderKeyword = {
      grade: ["AVG(comment.rating) AS count", "count"],
      price: [null, "lesson.price"],
      created_at: [null, "lesson.created_at"],
    };
    if (value2 === "" || value2 === undefined || !orderKeyword[value2]) {
      console.log("why?");
      return orderKeyword["created_at"];
    }
    return orderKeyword[value2];
  }
}
