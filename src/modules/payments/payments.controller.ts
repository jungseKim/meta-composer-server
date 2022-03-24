import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Payment } from "src/entities/payment.entity";
import { User } from "src/entities/user.entity";
import { PaymentsService } from "./payments.service";

@Controller("api/payments")
@ApiTags("결제내역 API")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOperation({
    summary: "나의결제내역 조회",
    description: "결제내역을 조회한다",
  })
  @ApiResponse({
    status: 200,
    description: "결제내역을 조회완료",
    type: Payment,
  })
  getMyAllPayments(
    @Body() updateData,
    @UserDecorator() user: User,
  ): Promise<Payment[]> {
    return this.paymentsService.getMyAllPayments(updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createPayment(@Body() updateData, @UserDecorator() user: User) {
    return this.paymentsService.createPayment(updateData, user);
  }
}
