import { Test, TestingModule } from '@nestjs/testing';
import { RecordScreenService } from './record-screen.service';

describe('RecordScreenService', () => {
  let service: RecordScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordScreenService],
    }).compile();

    service = module.get<RecordScreenService>(RecordScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
