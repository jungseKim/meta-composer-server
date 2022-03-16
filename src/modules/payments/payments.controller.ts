import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private paymentsService : PaymentsService){}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getMyAllPayments(@Body() updateData){

        return this.paymentsService.getMyAllPayments(updateData);
    }

    

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPayment(@Body() updateData){

        return this.paymentsService.createPayment(updateData);
    }





}
