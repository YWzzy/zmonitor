import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateErrorMonitorDto } from "./dto/create-error-monitor.dto";
import { UpdateErrorMonitorDto } from "./dto/update-error-monitor.dto";
import { ErrorMonitor } from "./entities/error-monitor.entity";
import { Breadcrumb } from "./entities/breadcrumb.entity";

@Injectable()
export class ErrorMonitorService {
  constructor(
    @InjectRepository(ErrorMonitor)
    private readonly errorMonitorRepository: Repository<ErrorMonitor>,
    @InjectRepository(Breadcrumb)
    private readonly breadcrumbRepository: Repository<Breadcrumb>
  ) {}

  async create(
    createErrorMonitorDto: CreateErrorMonitorDto
  ): Promise<ErrorMonitor> {
    try {
      // 处理 breadcrumb 中的 data 字段序列化
      const processedBreadcrumbs = createErrorMonitorDto.breadcrumb.map(
        (b) => ({
          ...b,
          data: JSON.stringify(b.data),
        })
      );
      const errorMonitor = this.errorMonitorRepository.create({
        ...createErrorMonitorDto,
        breadcrumb: processedBreadcrumbs,
      });
      return await this.errorMonitorRepository.save(errorMonitor);
    } catch (error) {
      console.error("Error creating ErrorMonitor:", error);
      throw error;
    }
  }

  async findAll(): Promise<ErrorMonitor[]> {
    try {
      return await this.errorMonitorRepository.find({
        relations: ["breadcrumb"],
      });
    } catch (error) {
      console.error("Error finding all ErrorMonitors:", error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ErrorMonitor> {
    try {
      return await this.errorMonitorRepository.findOne({
        where: { id },
        relations: ["breadcrumb"],
      });
    } catch (error) {
      console.error(`Error finding ErrorMonitor with id ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: number,
    updateErrorMonitorDto: UpdateErrorMonitorDto
  ): Promise<ErrorMonitor> {
    try {
      await this.errorMonitorRepository.update(id, updateErrorMonitorDto);
      return await this.errorMonitorRepository.findOne({
        where: { id },
        relations: ["breadcrumb"],
      });
    } catch (error) {
      console.error(`Error updating ErrorMonitor with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.errorMonitorRepository.delete(id);
    } catch (error) {
      console.error(`Error removing ErrorMonitor with id ${id}:`, error);
      throw error;
    }
  }
}
