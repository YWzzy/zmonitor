import { Module } from "@nestjs/common";
import { DistUploadService } from "./dist-upload.service";
import { DistUploadController } from "./dist-upload.controller";
import { DistUpload } from "./entities/dist-upload.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DistUploadLog } from "./entities/dist-upload-log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DistUpload, DistUploadLog])],
  controllers: [DistUploadController],
  providers: [DistUploadService],
  exports: [DistUploadService],
})
export class DistUploadModule {}
