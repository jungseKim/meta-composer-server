import { Module } from '@nestjs/common';
import { RoomController } from '../room/room.controller';

@Module({
  controllers: [RoomController]
})
export class RoomModule {}
