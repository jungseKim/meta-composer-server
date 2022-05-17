import { ConsoleLogger } from "@nestjs/common";
import { Teacher } from "src/entities/teacher.entity";
import { User } from "src/entities/user.entity";

import { ViewCount } from "src/entities/viewCount.entity";
import { Brackets, EntityRepository, getRepository, Repository } from "typeorm";

@EntityRepository(ViewCount)
export class ViewcountsRepository extends Repository<ViewCount> {
  async counting(updateData): Promise<ViewCount> {
    console.log(updateData);
    console.log(updateData.id);
    console.log(updateData.user.id);

    const viewCount = await getRepository(ViewCount)
      .createQueryBuilder("view_count")
      .select("view_count.lessonId")

      .addSelect("view_count.viewCount")
      .where("view_count.lessonId = :id", { id: +updateData.id })
      .andWhere("view_count.userId = :iid", {
        iid: +updateData.user.id,
      })
      .getOne();

    console.log(viewCount);

    if (!viewCount) {
      const view = this.create({
        userId: updateData.user.id,
        lessonId: updateData.id,
        viewCount: 1,
      });
      this.save(view);
      return view;
    } else if (viewCount) {
      this.createQueryBuilder()
        .update(ViewCount)
        .where("view_count.lessonId = :id", { id: +updateData.id })
        .andWhere("view_count.userId = :iid", {
          iid: +updateData.user.id,
        })
        .set({
          viewCount: +(+viewCount.viewCount) + 1,
        })
        .execute();
    }

    //+1한다
    //+1할게 없으면
    //만든다

    return viewCount;
  }

  async myViewHistory(user: User): Promise<any> {
    const myViewHistory = await this.createQueryBuilder("view_count")
      .where("view_count.userId = :userId", {
        userId: user.id,
      })
      .leftJoinAndSelect("view_count.lesson", "lesson")
      .getMany();

    // console.log(myViewHistory);

    const viewHistoryList = [];
    for (const types in myViewHistory) {
      const count = myViewHistory[types].viewCount;
      for (let a = 0; a < count; a++) {
        viewHistoryList.push(myViewHistory[types].lesson.type);
      }
    }

    return viewHistoryList;
    // const viewLists = [];

    // const typeList = [];
    // const viewCounts = [];
    // for (const types in myViewHistory) {
    //   // const type = myViewHistory[types].lesson.type;

    //   // const viewCounts = [];
    //   // const view = myViewHistory[types].viewCount;

    //   // viewList[0].push(myViewHistory[types].lesson.type);
    //   // viewList[1].push(myViewHistory[types]);

    //   const type = myViewHistory[types].lesson.type;
    //   const view = myViewHistory[types].viewCount;
    //   typeList.push(type);
    //   viewCounts.push(view);
    // }

    // return [typeList, viewCounts];
    // typesList;
  }
}
