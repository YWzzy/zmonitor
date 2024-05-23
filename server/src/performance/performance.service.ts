import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Performance } from "./entities/performance.entity";
import { Resource } from "./entities/resource.entity";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { UpdatePerformanceDto } from "./dto/update-performance.dto";

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  async create(
    createPerformanceDto: CreatePerformanceDto
  ): Promise<Performance> {
    try {
      const performance = this.performanceRepository.create({
        ...createPerformanceDto,
      });
      console.log("====================================");
      console.log("performance:", performance);
      console.log("====================================");
      return await this.performanceRepository.save(performance);
    } catch (error) {
      console.error("Error creating Performance:", error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all performance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} performance`;
  }

  update(id: number, updatePerformanceDto: UpdatePerformanceDto) {
    return `This action updates a #${id} performance`;
  }

  remove(id: number) {
    return `This action removes a #${id} performance`;
  }
}
