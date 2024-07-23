import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { CreateErrorMonitorDto } from "./dto/create-error-monitor.dto";
import { UpdateErrorMonitorDto } from "./dto/update-error-monitor.dto";
import { SearchErrorMonitorDto } from "./dto/search-error-monitor.dto";
import { ErrorMonitor } from "./entities/error-monitor.entity";
import { Breadcrumb } from "./entities/breadcrumb.entity";
import { getCurrentFormattedDate, getIp } from "src/utils";
import { Request } from "express";

type ErrorMonitorList = {
  list: ErrorMonitor[];
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

  // 上报错误日志
  async create(
    req: Request,
    createErrorMonitorDto: CreateErrorMonitorDto
  ): Promise<ErrorMonitor> {
    try {
      const analyse = {
        ...createErrorMonitorDto.deviceInfo,
        appId: createErrorMonitorDto.appId,
        time: createErrorMonitorDto.time,
        ip: getIp(req),
        userId: createErrorMonitorDto.userId,
        pageUrl: createErrorMonitorDto.pageUrl,
        projectVersion: createErrorMonitorDto.projectVersion,
        projectEnv: createErrorMonitorDto.projectEnv,
        projectIp: createErrorMonitorDto.projectIp,
        isSourceMap: createErrorMonitorDto.isSourceMap,
        createTime: getCurrentFormattedDate(),
        updateTime: getCurrentFormattedDate(),
      };
      createErrorMonitorDto.analyse = analyse;
      // 处理 breadcrumb 中的 data 字段
      if (
        createErrorMonitorDto.hasOwnProperty("breadcrumb") &&
        createErrorMonitorDto.breadcrumb.length >= 0
      ) {
        const processedBreadcrumbs = createErrorMonitorDto.breadcrumb.map(
          (b) => {
            const dataStr =
              typeof b.data === "object" ? JSON.stringify(b.data) : b.data;
            return {
              ...b,
              data:
                dataStr.length > 2048 ? dataStr.substring(0, 2048) : dataStr,
            };
          }
        );

        const errorMonitor = this.errorMonitorRepository.create({
          ...createErrorMonitorDto,
          breadcrumb: processedBreadcrumbs,
        });

        return await this.errorMonitorRepository.save(errorMonitor);
      } else {
        const errorMonitor = this.errorMonitorRepository.create({
          ...createErrorMonitorDto,
        });
        return await this.errorMonitorRepository.save(errorMonitor);
      }
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

  async getHttpDoneRank(appId: string, beginTime: string, endTime: string) {
    const allowedTypes = ["xhr", "fetch", "request"];
    const results = await this.errorMonitorRepository
      .createQueryBuilder("request")
      .select("request.url", "url")
      .addSelect(
        "JSON_UNQUOTE(JSON_EXTRACT(request.requestData, '$.method'))",
        "method"
      )
      .addSelect("GROUP_CONCAT(request.requestData SEPARATOR '|')", "key") // 使用 GROUP_CONCAT 聚合 requestData
      .addSelect("AVG(request.elapsedTime)", "avg_cost")
      .where("request.type IN (:...types)", { types: allowedTypes })
      .andWhere("request.appId = :appId", { appId })
      .addSelect("COUNT(request.id)", "errorCount") // 统计每个 URL 的数量
      .andWhere("request.status = :requestType", { requestType: "error" })
      .andWhere("request.time BETWEEN :beginTime AND :endTime", {
        beginTime,
        endTime,
      })
      .groupBy("request.url")
      .addGroupBy("JSON_UNQUOTE(JSON_EXTRACT(request.requestData, '$.method'))")
      .orderBy("avg_cost", "DESC")
      .limit(50)
      .getRawMany();

    return results;
  }

  // 分页查询错误日志
  async findListPage(
    searchErrorMonitorDto: SearchErrorMonitorDto
  ): Promise<ErrorMonitorList> {
    try {
      const {
        pageSize,
        pageNo,
        url,
        beginTime,
        endTime,
        requestType,
        sorterKey,
        sorterName,
        types,
        ...searchDto
      } = searchErrorMonitorDto;

      // 检查分页参数是否合法
      if (pageSize < 1 || pageNo < 1) {
        throw new Error("Invalid pageNo or pageSize");
      }

      // 过滤掉空字符串的查询条件
      Object.keys(searchDto).forEach(
        (key) => searchDto[key] === "" && delete searchDto[key]
      );

      // 构建查询条件
      const whereConditions: any = { ...searchDto, isDeleted: false };

      // 添加时间区间过滤条件
      if (beginTime && endTime) {
        whereConditions.time = Between(beginTime, endTime);
      } else if (beginTime) {
        whereConditions.time = MoreThanOrEqual(beginTime);
      } else if (endTime) {
        whereConditions.time = LessThanOrEqual(endTime);
      }

      // 根据url进行模糊查询
      if (url) {
        whereConditions.url = Like(`%${url}%`);
      }

      if (requestType) {
        whereConditions.status = requestType === "error" ? "error" : "ok";
      }
      // type 等于types数组中任意一种
      if (types && types.length > 0) {
        whereConditions.type = In(types);
      }

      const [errorMonitors, total] =
        await this.errorMonitorRepository.findAndCount({
          where: whereConditions,
          relations: ["breadcrumb"],
          order: { createTime: "DESC" },
          take: pageSize,
          skip: (pageNo - 1) * pageSize,
        });

      const data = errorMonitors.map((errorMonitor) => ({
        ...errorMonitor,
        breadcrumb: errorMonitor.breadcrumb.map((b) => ({
          ...b,
          data: this.parseDataField(b.data),
        })),
      }));

      let resData = data;
      // 内存中排序
      if (sorterName && sorterKey) {
        resData = data.sort((a: any, b: any) => {
          const aValue = a[sorterName];
          const bValue = b[sorterName];
          if (sorterKey.toUpperCase() === "ASC") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
      }

      return {
        list: resData,
        total,
        currentPage: pageNo,
        pageSize,
      };
    } catch (error) {
      console.error("Error finding all ErrorMonitors:", error);
      throw error;
    }
  }

  async getHttpErrorRank(appId: string, beginTime: string, endTime: string) {
    const queryBuilder = this.errorMonitorRepository
      .createQueryBuilder("error")
      .select([
        "error.url",
        "JSON_UNQUOTE(JSON_EXTRACT(error.requestData, '$.method')) AS method",
        "COUNT(*) AS errorCount",
      ])
      .where("error.appId = :appId", { appId })
      .andWhere("error.time BETWEEN :beginTime AND :endTime", {
        beginTime,
        endTime,
      })
      .andWhere("error.type IN (:...types)", { types: ["xhr", "fetch"] })
      .andWhere("error.status = :status", { status: "error" })
      .groupBy("error.url, method")
      .orderBy("errorCount", "DESC");

    const result = await queryBuilder.getRawMany();

    const data = result.map((item) => ({
      url: item.error_url,
      method: item.method,
      errorCount: item.errorCount,
      key: `${item.error_url}-${item.method}-${item.errorCount}`,
    }));
    return data;
  }

  // 获取时间区间内的异常数量
  async getJsErrorRange(appId: string, beginTime: string, endTime: string) {
    const data = await this.errorMonitorRepository
      .createQueryBuilder("error_monitor")
      .select("DATE_FORMAT(FROM_UNIXTIME(time / 1000), '%Y-%m-%d') AS label")
      .addSelect("COUNT(*) AS value")
      .where("appId = :appId", { appId })
      .andWhere("status = 'error'")
      .andWhere("type != 'whiteScreen'")
      .andWhere("time BETWEEN :beginTime AND :endTime", {
        beginTime: new Date(beginTime).getTime(),
        endTime: new Date(endTime).getTime(),
      })
      .groupBy("label")
      .orderBy("label", "ASC")
      .getRawMany();

    return data;
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
