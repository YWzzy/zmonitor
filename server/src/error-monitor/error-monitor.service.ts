import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateErrorMonitorDto } from "./dto/create-error-monitor.dto";
import { UpdateErrorMonitorDto } from "./dto/update-error-monitor.dto";
import { SearchErrorMonitorDto } from "./dto/search-error-monitor.dto";
import { ErrorMonitor } from "./entities/error-monitor.entity";
import { Breadcrumb } from "./entities/breadcrumb.entity";

type ErrorMonitorList = {
  data: ErrorMonitor[];
  total: number;
  currentPage: number;
  pageSize: number;
};

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
      // 处理 breadcrumb 中的 data 字段
      const processedBreadcrumbs = createErrorMonitorDto.breadcrumb.map((b) => {
        const dataStr =
          typeof b.data === "object" ? JSON.stringify(b.data) : b.data;
        return {
          ...b,
          data: dataStr.length > 2048 ? dataStr.substring(0, 2048) : dataStr,
        };
      });

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
      // 查询所有 isDeleted 为 false 的错误日志
      const errorMonitors = await this.errorMonitorRepository.find({
        where: { isDeleted: false },
        relations: ["breadcrumb"],
      });
      return errorMonitors.map((errorMonitor) => ({
        ...errorMonitor,
        breadcrumb: errorMonitor.breadcrumb.map((b) => ({
          ...b,
          data: this.parseDataField(b.data),
        })),
      }));
    } catch (error) {
      console.error("Error finding all ErrorMonitors:", error);
      throw error;
    }
  }

  async findListPage(
    searchErrorMonitorDto: SearchErrorMonitorDto
  ): Promise<ErrorMonitorList> {
    try {
      const { pageSize, page, ...searchDto } = searchErrorMonitorDto;
      // 查询条件为searchDto的错误日志，分页查询，返回当前page和total数量
      const [errorMonitors, total] =
        await this.errorMonitorRepository.findAndCount({
          where: { ...searchDto, isDeleted: false },
          relations: ["breadcrumb"],
          order: { createTime: "DESC" },
          take: pageSize,
          skip: (page - 1) * pageSize,
        });

      const data = errorMonitors.map((errorMonitor) => ({
        ...errorMonitor,
        breadcrumb: errorMonitor.breadcrumb.map((b) => ({
          ...b,
          data: this.parseDataField(b.data),
        })),
      }));

      return {
        data,
        total,
        currentPage: page,
        pageSize,
      };
    } catch (error) {
      console.error("Error finding all ErrorMonitors:", error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ErrorMonitor> {
    try {
      const errorMonitor = await this.errorMonitorRepository.findOne({
        where: { id },
        relations: ["breadcrumb"],
      });
      if (errorMonitor) {
        return {
          ...errorMonitor,
          breadcrumb: errorMonitor.breadcrumb.map((b) => ({
            ...b,
            data: this.parseDataField(b.data),
          })),
        };
      }
      return null;
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
      const updatedBreadcrumbs = updateErrorMonitorDto.breadcrumb.map((b) => ({
        ...b,
        data: this.processDataField(b.data),
      }));

      await this.errorMonitorRepository.update(id, {
        ...updateErrorMonitorDto,
        breadcrumb: updatedBreadcrumbs,
      });

      const updatedErrorMonitor = await this.errorMonitorRepository.findOne({
        where: { id },
        relations: ["breadcrumb"],
      });

      return {
        ...updatedErrorMonitor,
        breadcrumb: updatedErrorMonitor.breadcrumb.map((b) => ({
          ...b,
          data: this.parseDataField(b.data),
        })),
      };
    } catch (error) {
      console.error(`Error updating ErrorMonitor with id ${id}:`, error);
      throw error;
    }
  }

  // 标记错误为已删除
  async shieldError(id: number): Promise<void> {
    try {
      await this.errorMonitorRepository.update(id, { isDeleted: true });
    } catch (error) {
      console.error(`Error shielding ErrorMonitor with id ${id}:`, error);
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

  // 处理 data 字段，根据内容判断是否需要序列化，并截断
  private processDataField(data: any): string {
    let dataStr: string;

    if (typeof data === "object") {
      dataStr = JSON.stringify(data);
    } else {
      dataStr = data;
    }

    // 截断数据，以确保其长度不超过 2048 字符
    if (dataStr.length > 2048) {
      dataStr = dataStr.substring(0, 2048);
    }

    return dataStr;
  }

  // 反序列化 data 字段，如果可能
  private parseDataField(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return data; // 返回原始字符串
    }
  }
}
