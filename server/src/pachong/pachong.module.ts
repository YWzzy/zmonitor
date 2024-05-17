import { Module } from '@nestjs/common';
import { PachongService } from './pachong.service';
import { PachongController } from './pachong.controller';

@Module({
  controllers: [PachongController],
  providers: [PachongService]
})
export class PachongModule {}
