import { PartialType } from '@nestjs/swagger';
import { CreatePachongDto } from './create-pachong.dto';

export class UpdatePachongDto extends PartialType(CreatePachongDto) {}
