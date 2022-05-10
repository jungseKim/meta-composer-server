import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Payment } from "src/entities/payment.entity";
import { User } from "src/entities/user.entity";
import { PaymentsService } from "./payments.service";
import axios, { AxiosResponse } from "axios";
import { delay } from "rxjs";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
@Controller("api/payments")
@ApiTags("결제내역 API")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(TransformResponseInterceptor)
  @Get()
  @ApiOperation({
    summary: "나의결제내역 조회 payment적용 X",
    description: "결제내역을 조회한다",
  })
  @ApiResponse({
    status: 200,
    description: "결제내역을 조회완료",
    type: Payment,
  })
  async getMyAllPayments(
    @Body() updateData,
    @UserDecorator() user: User,
  ): Promise<Payment[]> {
    return this.paymentsService.getMyAllPayments(updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({
    summary: "사용금지",
    description: "결제내역 생성시 쓰는api 사용금지",
  })
  async createPayment(@Body() updateData, @UserDecorator() user: User) {
    return this.paymentsService.createPayment(updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete()
  @ApiOperation({
    summary: "결제취소",
    description: `결제취소한다, 필요한 데이터는 구매한 강의의 merchant_uid. 나의 결제내역 조회를 통해 가져오면 된다. json 으로 보내주세요. ex {"merchant_uid":"nobody_1649132403573"} `,
  })
  @ApiResponse({
    status: 200,
    description: "결제취소완료",
  })
  async deletePayment(@Body() updateData, @UserDecorator() user: User) {
    axios
      .post("https://api.iamport.kr/users/getToken", {
        imp_key: process.env.IAMPORT_API_KEY + "",
        imp_secret: process.env.IAMPORT_API_SECRET,
        merchant_uid: updateData.merchant_uid,
      })
      .then((res) => {
        console.log(res);
        axios({
          method: "post",
          url: "https://api.iamport.kr/payments/cancel",
          data: {
            checksum: null,
            reason: "내맘",
            merchant_uid: updateData.merchant_uid,
          },
          headers: {
            Authorization: res.data.response.access_token,
            // "Content-Type": `application/json`,
          },
        })
          .then((res) => {
            console.log(res);
            console.log(res.data.merchant_uid + "zz");
          })
          .catch((error) => {
            console.log("등록 취소되었습니다.");
          });
      });

    return this.paymentsService.deletePayment(updateData, user);
  }
}
