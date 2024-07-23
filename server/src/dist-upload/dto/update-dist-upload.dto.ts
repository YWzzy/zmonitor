import { PartialType } from '@nestjs/swagger';
import { CreateDistUploadDto } from './create-dist-upload.dto';

export class UpdateDistUploadDto extends PartialType(CreateDistUploadDto) {}
