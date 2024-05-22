import { PartialType } from '@nestjs/swagger';
import { CreateErrorMonitorDto } from './create-error-monitor.dto';

export class UpdateErrorMonitorDto extends PartialType(CreateErrorMonitorDto) {}
