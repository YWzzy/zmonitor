import { Test, TestingModule } from '@nestjs/testing';
import { WhiteScreenService } from './white-screen.service';

describe('WhiteScreenService', () => {
  let service: WhiteScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhiteScreenService],
    }).compile();

    service = module.get<WhiteScreenService>(WhiteScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
