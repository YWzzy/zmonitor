import { Injectable } from "@nestjs/common";
import { CreateRecordingDto } from "./dto/create-recording.dto";
import { UpdateRecordingDto } from "./dto/update-recording.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Recording } from "./entities/recording.entity";

@Injectable()
export class RecordingService {
  constructor(
    @InjectRepository(Recording)
    private recordingRepository: Repository<Recording>
  ) {}

  async saveRecording(
    storedFilePath: string,
    originalFileName: string
  ): Promise<Recording> {
    try {
      const recording = this.recordingRepository.create({
        originalFileName,
        storedFilePath,
      });
      return this.recordingRepository.save(recording);
    } catch (error) {
      console.error("Error saving recording:", error);
      throw error;
    }
  }

  // 根据originalFileName查询录屏
  findOneByOriginalFileName(originalFileName: string) {
    try {
      return this.recordingRepository.findOne({
        where: { originalFileName },
      });
    } catch (error) {
      console.error("Error finding recording by originalFileName:", error);
      throw error;
    }
  }

  create(createRecordingDto: CreateRecordingDto) {
    return "This action adds a new recording";
  }

  findAll() {
    return `This action returns all recording`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recording`;
  }

  update(id: number, updateRecordingDto: UpdateRecordingDto) {
    return `This action updates a #${id} recording`;
  }

  remove(id: number) {
    return `This action removes a #${id} recording`;
  }
}
