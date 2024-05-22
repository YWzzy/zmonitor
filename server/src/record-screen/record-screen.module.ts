import { Module } from '@nestjs/common';
import { RecordScreenService } from './record-screen.service';
import { RecordScreenController } from './record-screen.controller';

@Module({
  controllers: [RecordScreenController],
  providers: [RecordScreenService]
})
export class RecordScreenModule {}
