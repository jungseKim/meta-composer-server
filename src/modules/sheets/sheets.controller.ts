import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Sheet } from 'src/entities/sheet.entity';
import { User } from 'src/entities/user.entity';
import SheetsRepository from './sheets.repository';
import { SheetsService } from './sheets.service';

@Controller('api/sheets')
@ApiTags('악보 업로드 API')
export class SheetsController {
    constructor(private sheetsService :SheetsService,
                private sheetsRepository : SheetsRepository){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: '악보 업로드', description: '악보를 업로드 한다.' })
    async uploadSheets(@Body() updateData, @UserDecorator()user:User) : Promise<Sheet>{
        return this.sheetsService.uploadSheets(updateData,user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ summary: '공개 악보 모두 조회', description: 'isOpen이 true 인 악보만 모두 조회한다.' })
    async showPublicSheets() : Promise<Sheet[]>{
        return this.sheetsRepository.find({where : [{isOpen : true}]}); 
    }
}
