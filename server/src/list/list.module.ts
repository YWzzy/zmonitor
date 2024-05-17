import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';

@Module({
  controllers: [ListController],
  providers: [ListService]
})
export class ListModule {}
