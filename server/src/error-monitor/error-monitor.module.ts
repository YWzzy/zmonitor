import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ErrorMonitorService } from "./error-monitor.service";
import { ErrorMonitorController } from "./error-monitor.controller";
import { ErrorMonitor } from "./entities/error-monitor.entity";
import { Breadcrumb } from "./entities/breadcrumb.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ErrorMonitor, Breadcrumb])],
  controllers: [ErrorMonitorController],
  providers: [ErrorMonitorService],
  exports: [ErrorMonitorService],
})
export class ErrorMonitorModule {}
