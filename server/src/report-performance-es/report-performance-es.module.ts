import { Module } from '@nestjs/common';
import { ReportPerformanceEsService } from './report-performance-es.service';
import { ReportPerformanceEsController } from './report-performance-es.controller';

@Module({
  controllers: [ReportPerformanceEsController],
  providers: [ReportPerformanceEsService]
})
export class ReportPerformanceEsModule {}
