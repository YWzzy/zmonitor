import { Test, TestingModule } from '@nestjs/testing';
import { PachongController } from './pachong.controller';
import { PachongService } from './pachong.service';

describe('PachongController', () => {
  let controller: PachongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PachongController],
      providers: [PachongService],
    }).compile();

    controller = module.get<PachongController>(PachongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
