import { PartialType } from '@nestjs/swagger';
import { CreateReportPerformanceEDto } from './create-report-performance-e.dto';

export class UpdateReportPerformanceEDto extends PartialType(CreateReportPerformanceEDto) {}
