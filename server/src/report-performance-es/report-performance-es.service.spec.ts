import { Test, TestingModule } from '@nestjs/testing';
import { ReportPerformanceEsService } from './report-performance-es.service';

describe('ReportPerformanceEsService', () => {
  let service: ReportPerformanceEsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportPerformanceEsService],
    }).compile();

    service = module.get<ReportPerformanceEsService>(ReportPerformanceEsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
