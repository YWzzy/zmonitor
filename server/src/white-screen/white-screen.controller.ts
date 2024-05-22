import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhiteScreenService } from './white-screen.service';
import { CreateWhiteScreenDto } from './dto/create-white-screen.dto';
import { UpdateWhiteScreenDto } from './dto/update-white-screen.dto';

@Controller('white-screen')
export class WhiteScreenController {
  constructor(private readonly whiteScreenService: WhiteScreenService) {}

  @Post()
  create(@Body() createWhiteScreenDto: CreateWhiteScreenDto) {
    return this.whiteScreenService.create(createWhiteScreenDto);
  }

  @Get()
  findAll() {
    return this.whiteScreenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whiteScreenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhiteScreenDto: UpdateWhiteScreenDto) {
    return this.whiteScreenService.update(+id, updateWhiteScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whiteScreenService.remove(+id);
  }
}
