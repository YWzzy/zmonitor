import { Test, TestingModule } from '@nestjs/testing';
import { PachongService } from './pachong.service';

describe('PachongService', () => {
  let service: PachongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PachongService],
    }).compile();

    service = module.get<PachongService>(PachongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
