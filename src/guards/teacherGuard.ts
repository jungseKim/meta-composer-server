// //roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { TeachersRepository } from '../teachers/teachers.repository';

// @Injectable()
// export class TeacherGuard implements CanActivate {
//   constructor(private reflector: Reflector,
//                 private teachersRepository : TeachersRepository) {}

//  async canActivate(context: ExecutionContext): Promise<boolean> {

//     const request = context.switchToHttp().getRequest();
//     console.log(request)

//   //     const checkStart = await this.teachersRepository.
//   //     createQueryBuilder('teacher').
//   //     where('teacher.userId = :id', {
//   //        id: request.id,
//   //      })
//   //      .getOne();

      
      
//   // if(checkStart)
//   //   return true

//   //   else
//     return false
//   }
// }

// //아직안씀