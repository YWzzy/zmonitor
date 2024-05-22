import { Injectable } from '@nestjs/common';
import { CreateRecordScreenDto } from './dto/create-record-screen.dto';
import { UpdateRecordScreenDto } from './dto/update-record-screen.dto';

@Injectable()
export class RecordScreenService {
  create(createRecordScreenDto: CreateRecordScreenDto) {
    return 'This action adds a new recordScreen';
  }

  findAll() {
    return `This action returns all recordScreen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordScreen`;
  }

  update(id: number, updateRecordScreenDto: UpdateRecordScreenDto) {
    return `This action updates a #${id} recordScreen`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordScreen`;
  }
}
