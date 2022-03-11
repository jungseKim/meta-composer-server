
import { Sheet } from "src/entities/sheet.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Sheet)
export default class SheetsRepository extends Repository<Sheet>{



    async uploadSheets(updateData,user:User):Promise<Sheet>{
        
        const sheet = this.create({
            sheetName: updateData.sheetName,
            isOpen: updateData.isOpen,
            storedURL: updateData.storedURL,
            userId: user.id,
            lessonId: updateData.lessonId,
            assignmentId: updateData.assignmentId,        
        })
        await this.save(sheet);
        return sheet;
    }
}