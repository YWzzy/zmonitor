import { Test, TestingModule } from '@nestjs/testing';
import { RecordScreenController } from './record-screen.controller';
import { RecordScreenService } from './record-screen.service';

describe('RecordScreenController', () => {
  let controller: RecordScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordScreenController],
      providers: [RecordScreenService],
    }).compile();

    controller = module.get<RecordScreenController>(RecordScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
