import { PartialType } from '@nestjs/swagger';
import { CreateWhiteScreenDto } from './create-white-screen.dto';

export class UpdateWhiteScreenDto extends PartialType(CreateWhiteScreenDto) {}
