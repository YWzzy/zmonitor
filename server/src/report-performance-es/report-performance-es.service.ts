import { Injectable } from '@nestjs/common';
import { CreateReportPerformanceEDto } from './dto/create-report-performance-e.dto';
import { UpdateReportPerformanceEDto } from './dto/update-report-performance-e.dto';

@Injectable()
export class ReportPerformanceEsService {
  create(createReportPerformanceEDto: CreateReportPerformanceEDto) {
    return 'This action adds a new reportPerformanceE';
  }

  findAll() {
    return `This action returns all reportPerformanceEs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportPerformanceE`;
  }

  update(id: number, updateReportPerformanceEDto: UpdateReportPerformanceEDto) {
    return `This action updates a #${id} reportPerformanceE`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportPerformanceE`;
  }
}
