import { Module } from "@nestjs/common";
import { AnalyseService } from "./analyse.service";
import { AnalyseController } from "./analyse.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Analyse } from "./entities/analyse.entity";
import { ErrorMonitor } from "src/error-monitor/entities/error-monitor.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Analyse, ErrorMonitor])],
  controllers: [AnalyseController],
  providers: [AnalyseService],
  exports: [AnalyseService], // 确保导出 FileUploadService
})
export class AnalyseModule {}
