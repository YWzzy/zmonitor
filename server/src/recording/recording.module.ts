import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordingService } from "./recording.service";
import { RecordingController } from "./recording.controller";
import { Recording } from "./entities/recording.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Recording])],
  controllers: [RecordingController],
  providers: [RecordingService],
  exports: [RecordingService], // 确保导出 FileUploadService
})
export class RecordingModule {}
