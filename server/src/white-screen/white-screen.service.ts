import { Injectable } from '@nestjs/common';
import { CreateWhiteScreenDto } from './dto/create-white-screen.dto';
import { UpdateWhiteScreenDto } from './dto/update-white-screen.dto';

@Injectable()
export class WhiteScreenService {
  create(createWhiteScreenDto: CreateWhiteScreenDto) {
    return 'This action adds a new whiteScreen';
  }

  findAll() {
    return `This action returns all whiteScreen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whiteScreen`;
  }

  update(id: number, updateWhiteScreenDto: UpdateWhiteScreenDto) {
    return `This action updates a #${id} whiteScreen`;
  }

  remove(id: number) {
    return `This action removes a #${id} whiteScreen`;
  }
}
