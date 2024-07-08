import { Test, TestingModule } from '@nestjs/testing';
import { ReportPerformanceEsController } from './report-performance-es.controller';
import { ReportPerformanceEsService } from './report-performance-es.service';

describe('ReportPerformanceEsController', () => {
  let controller: ReportPerformanceEsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportPerformanceEsController],
      providers: [ReportPerformanceEsService],
    }).compile();

    controller = module.get<ReportPerformanceEsController>(ReportPerformanceEsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
