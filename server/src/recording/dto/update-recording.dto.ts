import { PartialType } from '@nestjs/swagger';
import { CreateRecordingDto } from './create-recording.dto';

export class UpdateRecordingDto extends PartialType(CreateRecordingDto) {}
