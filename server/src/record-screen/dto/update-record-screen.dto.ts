import { PartialType } from '@nestjs/swagger';
import { CreateRecordScreenDto } from './create-record-screen.dto';

export class UpdateRecordScreenDto extends PartialType(CreateRecordScreenDto) {}
