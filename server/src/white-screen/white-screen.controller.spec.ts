import { Test, TestingModule } from '@nestjs/testing';
import { WhiteScreenController } from './white-screen.controller';
import { WhiteScreenService } from './white-screen.service';

describe('WhiteScreenController', () => {
  let controller: WhiteScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhiteScreenController],
      providers: [WhiteScreenService],
    }).compile();

    controller = module.get<WhiteScreenController>(WhiteScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
