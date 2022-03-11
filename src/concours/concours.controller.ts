import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Concours } from 'src/entities/concours.entity';
import { ConcoursService } from './concours.service';

@Controller('api/concours')
@ApiTags('콩쿠르 API')
export class ConcoursController {
    constructor(private concoursService : ConcoursService) {
    }

    @Get()
    @ApiOperation({summary: '콩쿠르 전체 조회', description: '콩쿠르 전체 조회'})
    @ApiResponse({status: 200, description: '콩쿠르 전체 조회완료', type: Concours})
    showAllConcours(){
        return this.concoursService.showAllConcours();
    }

    @Get('/:id')
    @ApiOperation({summary: '특정 콩쿠르 ID로 조회', description: '특정 콩쿠르 ID로 조회'})
    @ApiResponse({status: 200, description: '특정 콩쿠르 조회완료', type: Concours})
    getConcoursById(@Param('id')id : number){
        return this.concoursService.getConcoursById(id);
    }

    @Post()
    @ApiOperation({summary: '콩쿠르 생성', description: '콩쿠르 생성'})
    @ApiResponse({status: 200, description: '콩쿠르 생성완료', type: Concours})
    createConcours(@Body() updateData): Promise<Concours>{
        return this.concoursService.createConcours(updateData);
    }

    @Delete('/:id')    
    @ApiOperation({summary: '콩쿠르 삭제', description: '콩쿠르 삭제한다'})
    @ApiResponse({status: 200, description: '콩쿠르 삭제완료', type: Concours})
    deleteConcours(@Param('id')id : number){
        return this.concoursService.deleteConcours(id);
    }

    @Put('/:id')    
    @ApiOperation({summary: '콩쿠르 정보 수정', description: '콩쿠르 정보 수정'})
    @ApiResponse({status: 200, description: '콩쿠르 정보 업데이트완료', type: Concours})
    updateConcours(@Param('id')id : number,@Body() updateData){
        return this.concoursService.updateConcours(id,updateData);
    }
    
}
