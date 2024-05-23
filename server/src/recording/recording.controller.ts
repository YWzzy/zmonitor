import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { UpdateRecordingDto } from './dto/update-recording.dto';

@Controller('recording')
export class RecordingController {
  constructor(private readonly recordingService: RecordingService) {}

  @Post()
  create(@Body() createRecordingDto: CreateRecordingDto) {
    return this.recordingService.create(createRecordingDto);
  }

  @Get()
  findAll() {
    return this.recordingService.findAll();
  }

  @Get(':id')
  findOne(@Param('findOne') id: string) {
    return this.recordingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordingDto: UpdateRecordingDto) {
    return this.recordingService.update(+id, updateRecordingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordingService.remove(+id);
  }
}
