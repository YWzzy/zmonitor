import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { MonitorService } from "./monitor.service";
import { MonitorController } from "./monitor.controller";
import { Logger } from "src/middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Monitor } from "./entities/monitor.entity";
import { ErrorMonitorModule } from "../error-monitor/error-monitor.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { RecordingModule } from "../recording/recording.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Monitor]),
    ErrorMonitorModule,
    FileUploadModule,
    RecordingModule,
  ],
  controllers: [MonitorController],
  providers: [MonitorService],
  exports: [MonitorService],
})
export class MonitorModule {}
