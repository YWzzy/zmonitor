import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileUploadService } from "./file-upload.service";
import { FileUploadController } from "./file-upload.controller";
import { FileUpload } from "./entities/file-upload.entity";
import { RecordingModule } from "../recording/recording.module";
import { ApplicationModule } from "src/application/application.module";
import { Application } from "src/application/entities/application.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload, Application]),
    RecordingModule,
    ApplicationModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService], // 确保导出 FileUploadService
})
export class FileUploadModule {}
