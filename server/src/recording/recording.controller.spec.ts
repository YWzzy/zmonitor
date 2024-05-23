import { Test, TestingModule } from '@nestjs/testing';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';

describe('RecordingController', () => {
  let controller: RecordingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordingController],
      providers: [RecordingService],
    }).compile();

    controller = module.get<RecordingController>(RecordingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
