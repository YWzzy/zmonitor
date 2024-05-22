import { Test, TestingModule } from '@nestjs/testing';
import { ErrorMonitorController } from './error-monitor.controller';
import { ErrorMonitorService } from './error-monitor.service';

describe('ErrorMonitorController', () => {
  let controller: ErrorMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorMonitorController],
      providers: [ErrorMonitorService],
    }).compile();

    controller = module.get<ErrorMonitorController>(ErrorMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
