/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from "@nestjs/common";
import { LessonClassService } from "./lesson-class.service";

@Controller("api/lessson")
export class LessonClassController {
  constructor(private lessonClassService: LessonClassService) {}
}
