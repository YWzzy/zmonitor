import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordScreenService } from './record-screen.service';
import { CreateRecordScreenDto } from './dto/create-record-screen.dto';
import { UpdateRecordScreenDto } from './dto/update-record-screen.dto';

@Controller('record-screen')
export class RecordScreenController {
  constructor(private readonly recordScreenService: RecordScreenService) {}

  @Post()
  create(@Body() createRecordScreenDto: CreateRecordScreenDto) {
    return this.recordScreenService.create(createRecordScreenDto);
  }

  @Get()
  findAll() {
    return this.recordScreenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordScreenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordScreenDto: UpdateRecordScreenDto) {
    return this.recordScreenService.update(+id, updateRecordScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordScreenService.remove(+id);
  }
}
