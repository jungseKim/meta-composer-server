import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonsService } from './lessons.service';

@Controller('lessons')
@ApiTags('레슨 API')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  @ApiOperation({ summary: '레슨 생성', description: '레슨을 생성한다' })
  @ApiResponse({status:200, description:'레슨 생성완료',type:Lesson})
  //type 를 entity 로
  create(@Body() updateData): Promise<Lesson> {
    return this.lessonsService.createLesson(updateData);
  }

  @Get('/:id')
  @ApiOperation({ summary: '특정 레슨 조회', description: '레슨의 ID값으로 특정레슨을 조회한다' })
  @ApiResponse({status:200, description:'특정 레슨 조회완료',type:Lesson})
  getLessonById(@Param('id') id:number):Promise<Lesson>{
    return this.lessonsService.getLessonById(id);
  }

}
//