import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Signup } from "./entities/signup.entity";
import { SignupsRepository } from "./modules/signups/signups.repository";
import { TasksService } from "./modules/tasks/tasks.service";
import moment from "moment";
import { createQueryBuilder, getRepository } from "typeorm";
import { Controller, Get, Param, Query, Res } from "@nestjs/common";

import { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";
import { UserDecorator } from "./decorators/user.decorator";
import { User } from "./entities/user.entity";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { Concours } from "./entities/concours.entity";
import { ConcoursSignup } from "./entities/concoursSignup.entity";
import axios, { AxiosResponse } from "axios";
import { Payment } from "./entities/payment.entity";
// import * as tf from "@tensorflow/tfjs-node";
import { readFile } from "fs";
import { ViewCount } from "./entities/viewCount.entity";
import { Wishlist } from "./entities/wishlist.entity";
@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return "1234";
  }

  async handleCorn() {
    const format1 = "YYYY-MM-DD HH:mm:ss";

    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(now);

    // const dateTime1 = moment(date1).format(format1);
    // console.log(dateTime1);

    // if (dateTime1 > "2022-04-06 15:44:05") {
    //   console.log("시간지남");
    // } else {
    //   console.log("아직안시간지남");
    // }

    const concours = await createQueryBuilder()
      .select("concours.concoursSignupFinishTime")
      .from(Concours, "concours")
      .getMany();

    for (const con in concours) {
      console.log(
        moment(Object.values(concours[con]).toString())
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
      );
      const eachdate = moment(Object.values(concours[con]).toString())
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      if (
        now >
        moment(Object.values(concours[con]).toString())
          .utc()
          .format("YYYY-MM-DD HH:mm:ss")
      ) {
        console.log("지남");

        const concoursFinishTimeIds = await createQueryBuilder()
          .select("concours.id")
          .from(Concours, "concours")
          .where("concoursSignupFinishTime = :time", {
            time: eachdate,
          })

          .getMany();
        console.log(concoursFinishTimeIds);
        console.log("for loop 앞");
        for (let a = 0; a < concoursFinishTimeIds.length; a++) {
          const concoursFinishTimeId = Object.values(concoursFinishTimeIds[a]);
          console.log("체크체크");
          console.log(concoursFinishTimeId + "콩쿠르완료시간");
          const finishedConcoursMerchantUid = await createQueryBuilder()
            .select("concours_signup.merchant_uid")
            .from(ConcoursSignup, "concours_signup")
            .where("concoursId = :id", {
              id: concoursFinishTimeId,
            })
            .getMany();
          console.log(finishedConcoursMerchantUid);

          const concoursNowCount = await createQueryBuilder()
            .select("concours_signup")
            .from(ConcoursSignup, "concours_signup")
            .where("concoursId = :id", {
              id: concoursFinishTimeId,
            })
            .getCount();
          console.log(concoursNowCount);
          console.log("선택된 콩쿠르의 현재엔트리현황");

          const concoursMaxCount = await createQueryBuilder()
            .select("concours.minimum_starting_people")
            .from(Concours, "concours")
            .where("id = :id", {
              id: concoursFinishTimeId,
            })
            .getOne();

          console.log(Object.values(concoursMaxCount)[0]);
          console.log("멕시멈인원수");

          if (concoursNowCount < Object.values(concoursMaxCount)[0]) {
            console.log("엔트리 인원 부족");
            for (let c = 0; c < finishedConcoursMerchantUid.length; c++) {
              console.log(Object.values(finishedConcoursMerchantUid[c])[0]);

              // const finishedConcoursMerchantUidArray = [];
              // finishedConcoursMerchantUidArray.push(finishedConcoursMerchantUid);

              for (let b = 0; b < finishedConcoursMerchantUid.length; b++) {
                console.log(
                  Object.values(finishedConcoursMerchantUid[b])[0] + "안됀다",
                );
                axios
                  .post("https://api.iamport.kr/users/getToken", {
                    imp_key: process.env.IAMPORT_API_KEY + "",
                    imp_secret: process.env.IAMPORT_API_SECRET + "",
                    merchant_uid: Object.values(
                      finishedConcoursMerchantUid[b],
                    )[0],
                  })
                  .then((res) => {
                    // console.log(res);
                    axios({
                      method: "post",
                      url: "https://api.iamport.kr/payments/cancel",
                      data: {
                        checksum: null,
                        reason: "내맘",
                        merchant_uid: Object.values(
                          finishedConcoursMerchantUid[b],
                        )[0],
                      },
                      headers: {
                        Authorization: res.data.response.access_token,
                        // "Content-Type": `application/json`,
                      },
                    })
                      .then((res) => {
                        console.log(res.data.merchant_uid);
                      })
                      .catch((error) => {
                        console.log("등록 취소되었습니다.");
                      });
                  });
                await createQueryBuilder()
                  .update(Payment)
                  .set({
                    refund: true,
                  })
                  .where("payment_number = :number", {
                    number: Object.values(finishedConcoursMerchantUid[b])[0],
                  })
                  .execute();

                console.log(Object.values(finishedConcoursMerchantUid[b])[0]);
              }

              console.log(Object.values(finishedConcoursMerchantUid[c])[0]);
            }
          } else {
            console.log("인원충분");
          }
        }
        // console.log(Object.values(finishedConcoursMerchantUid)[0] + "크아악");

        // axios
        //   .post("https://api.iamport.kr/users/getToken", {
        //     imp_key: "0501959503151293",
        //     imp_secret:
        //       "493baa18b82f32c26b6f538216303edf1c250ce0f93558ff83859bd8728669d0b86f4f95e3c39985",
        //     merchant_uid: Object.values(finishedConcoursMerchantUid)[0],
        //   })
        //   .then((res) => {
        //     console.log(res);
        //     axios({
        //       method: "post",
        //       url: "https://api.iamport.kr/payments/cancel",
        //       data: {
        //         checksum: null,
        //         reason: "내맘",
        //         merchant_uid: Object.values(finishedConcoursMerchantUid)[0],
        //       },
        //       headers: {
        //         Authorization: res.data.response.access_token,
        //         // "Content-Type": `application/json`,
        //       },
        //     })
        //       .then((res) => {
        //         console.log(res.data.merchant_uid);
        //       })
        //       .catch((error) => {
        //         console.log("등록 취소되었습니다.");
        //       });
        //   });
        // await createQueryBuilder()
        //   .update(Payment)
        //   .set({
        //     refund: true,
        //   })
        //   .where("payment_number = :number", {
        //     number: Object.values(finishedConcoursMerchantUid)[0],
        //   })
        //   .execute();

        // console.log(Object.values(finishedConcoursMerchantUid)[0]);
      } else {
        console.log("안지남");
      }
    }

    // for (const con in concours) {
    //   console.log(Object.values(concours[con]));
    // }

    // if (
    //   dateTime1 >
    //   moment(Object.values(concours[con]).toString())
    //     .utc()
    //     .format("YYYY-MM-DD HH:mm:ss")
    // ) {
    //   console.log("지났다");
    // } else {
    //   console.log("안지났다");
    // }
    // }
  }

  // async tensorflow(user) {
  //   const viewCount = await getRepository(ViewCount)
  //     .createQueryBuilder("view_count")
  //     .select("viewCount")
  //     .addSelect("lessonId")
  //     .where("view_count.userId = :id", { id: user.id })
  //     .getRawMany();

  //   console.log(viewCount);
  //   //1. [레슨아이디:조회수],[레슨아이디:조회수] 로 형식 변경
  //   //2. 위에형식에서 조회수 순서대로정렬

  //   // viewCount int 값의 크기순으로 정렬
  //   const result = viewCount.sort(function (a, b) {
  //     if (a.viewCount < b.viewCount) {
  //       return 1;
  //     }
  //     if (a.viewCount > b.viewCount) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   console.log(result);
  //   console.log("조회수 출력완료");
  //   // viewCount.sort(function (a, b) {
  //   //   if (a > b) return 1;
  //   //   if (a === b) return 0;
  //   //   if (a < b) return -1;
  //   // });
  //   // console.log(viewCount);
  //   // for (const viewCount0 in viewCount) {
  //   //   console.log(viewCount0);
  //   // }

  //   //2.1 레슨 아이디별로 배열에 가중치 적용 ex) 어떤거 90퍼 어떤거 10퍼

  //   //3. 조회수 높은쪽이 결과 순위 높게 ex) 1

  //   //4. 좋아요리스트

  //   const wishListCount = await getRepository(Wishlist)
  //     .createQueryBuilder("wishlist")
  //     .select("lessonId")
  //     .where("wishlist.userId = :id", { id: user.id })
  //     .getRawMany();

  //   console.log(wishListCount);

  //   return;
  //   const model = tf.sequential();
  //   model.add(
  //     tf.layers.dense({ units: 100, activation: "relu", inputShape: [2] }),
  //   );
  //   model.add(tf.layers.dense({ units: 1, activation: "linear" }));
  //   model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  //   const xxs = tf.tensor([
  //     [1, 2],
  //     [1, 2],
  //   ]);
  //   const yys = tf.tensor([[1], [1]]);

  //   await model
  //     .fit(xxs, yys, {
  //       epochs: 1000,
  //       callbacks: {
  //         onEpochEnd: (epoch, log) =>
  //           console.log(`Epoch ${epoch}: loss = ${log.loss}`),
  //       },
  //     })
  //     .then(function (res) {
  //       const result = model.predict(xxs);
  //       console.log(result);
  //     });

  //   const xxxs = [
  //     [1, 3],
  //     [1, 3],
  //   ];
  //   const xxxy = tf.tensor(xxxs);
  //   const ranResult = model.predict(xxxy);
  //   console.log(ranResult.toString());
  // }
}
