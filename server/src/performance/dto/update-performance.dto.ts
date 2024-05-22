import { PartialType } from '@nestjs/swagger';
import { CreatePerformanceDto } from './create-performance.dto';

export class UpdatePerformanceDto extends PartialType(CreatePerformanceDto) {}
