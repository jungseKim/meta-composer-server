import { userInfo } from "os";
import { Assignment } from "src/entities/assignment.entity";
import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(Assignment)
export class AssignmentsRepository extends Repository<Assignment>{



    async createAssignment(updatedData){
        const assignment = this.create({
            startedTime : updatedData.startedTime,
            endTime : updatedData.endTime,
            contents : updatedData.contents,
            title : updatedData.title,
            time_length: updatedData.time_length,
            isFinished : false,
            accuracy : 0,
            finished_times : 0,
            userId : updatedData.userId,
            lessonId : updatedData.lessonId
        })
        await this.save(assignment);
        return assignment;
    }


        async getAllMyAssignment(user :User){

            const myAssignment = this.createQueryBuilder("assignment").
            where("assignment.userId = :userId",{userId: user.id})
          .getMany()
            return myAssignment;
        }
}



