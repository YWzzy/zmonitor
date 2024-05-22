import { Test, TestingModule } from '@nestjs/testing';
import { ErrorMonitorService } from './error-monitor.service';

describe('ErrorMonitorService', () => {
  let service: ErrorMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorMonitorService],
    }).compile();

    service = module.get<ErrorMonitorService>(ErrorMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
