import { Module } from '@nestjs/common';
import { YoutubesController } from './youtubes.controller';
import { YoutubesService } from './youtubes.service';

@Module({
  controllers: [YoutubesController],
  providers: [YoutubesService]
})
export class YoutubesModule {}
