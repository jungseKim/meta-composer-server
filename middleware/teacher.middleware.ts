import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
import { TeachersRepository } from 'src/teachers/teachers.repository';
  
  @Injectable()
  export class TeacherMiddleware implements NestMiddleware {
      constructor(private teachersRepository : TeachersRepository){

      }
    use(req: Request, res: Response, next: NextFunction) {
     
      const idid : string = req.query.id || req.body.id;
  
            const checkTeacher =  this.teachersRepository.
      createQueryBuilder('teacher').
      where('teacher.userId = :id', {
         id: idid,
       })
       .getOne();

      if (checkTeacher) {
        next();
      } else {
      
        throw new UnauthorizedException();
      }
    }
  }
  