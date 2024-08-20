import { PartialType } from '@nestjs/swagger';
import { CreateBookmarkDto } from './create-bookmark.dto';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}
