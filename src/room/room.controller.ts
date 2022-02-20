import { JwtGuard } from './../auth/jwt.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { customAlphabet, nanoid, random } from 'nanoid';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('room')
@UseGuards(JwtGuard)
@ApiTags('Room Api')
export class RoomController {
  @Get('/create')
  @ApiOperation({ summary: 'url 생성', description: 'room url을 생성한다' })
  @ApiCreatedResponse({ description: 'url 리턴', type: String })
  createRoom() {
    const id = nanoid(10);
    return id;
  }
}
