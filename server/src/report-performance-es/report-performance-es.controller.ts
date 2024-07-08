import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportPerformanceEsService } from './report-performance-es.service';
import { CreateReportPerformanceEDto } from './dto/create-report-performance-e.dto';
import { UpdateReportPerformanceEDto } from './dto/update-report-performance-e.dto';

@Controller('report-performance-es')
export class ReportPerformanceEsController {
  constructor(private readonly reportPerformanceEsService: ReportPerformanceEsService) {}

  @Post()
  create(@Body() createReportPerformanceEDto: CreateReportPerformanceEDto) {
    return this.reportPerformanceEsService.create(createReportPerformanceEDto);
  }

  @Get()
  findAll() {
    return this.reportPerformanceEsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportPerformanceEsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportPerformanceEDto: UpdateReportPerformanceEDto) {
    return this.reportPerformanceEsService.update(+id, updateReportPerformanceEDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportPerformanceEsService.remove(+id);
  }
}
