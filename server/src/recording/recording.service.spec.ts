import { Test, TestingModule } from '@nestjs/testing';
import { RecordingService } from './recording.service';

describe('RecordingService', () => {
  let service: RecordingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordingService],
    }).compile();

    service = module.get<RecordingService>(RecordingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
