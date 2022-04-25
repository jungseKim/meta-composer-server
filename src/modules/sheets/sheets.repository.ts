import { Sheet } from "src/entities/sheet.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Sheet)
export default class SheetsRepository extends Repository<Sheet> {
  async uploadSheets(user: User, sheet: any, updateData): Promise<Sheet> {
    const createdSheet = this.create({
      sheetName: updateData.sheetName,
      isOpen: updateData.isOpen,
      storedURL: sheet.filename,
      userId: user.id,
      lessonId: updateData.lessonId,
      //   assignmentId: updateData.assignmentId,
    });

    await this.save(createdSheet);
    return createdSheet;
  }
}
