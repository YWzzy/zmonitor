import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Performance } from "./entities/performance.entity";
import { Resource } from "./entities/resource.entity";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { UpdatePerformanceDto } from "./dto/update-performance.dto";

interface PerformanceList {
  list: any[];
  message: string;
}

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  // 创建性能日志
  async create(
    createPerformanceDto: CreatePerformanceDto
  ): Promise<Performance> {
    try {
      const createPerformanceVo = {
        ...createPerformanceDto,
        performanceValue: createPerformanceDto.value,
      };
      const performance = this.performanceRepository.create({
        ...createPerformanceVo,
      });
      return await this.performanceRepository.save(performance);
    } catch (error) {
      console.error("Error creating Performance:", error);
      throw error;
    }
  }

  async getAvgPerformanceByType(
    appId: string,
    type: string,
    beginTime: string,
    endTime: string
  ): Promise<number> {
    const result = await this.performanceRepository
      .createQueryBuilder("performance")
      .select("AVG(performance.performanceValue)", "avgValue")
      .where("performance.appId = :appId", { appId })
      .andWhere("performance.name = :type", { type })
      .andWhere("performance.time BETWEEN :beginTime AND :endTime", {
        beginTime,
        endTime,
      })
      .getRawOne();

    return result.avgValue;
  }

  async getAllPerformance(
    appId: string,
    beginTime: string,
    endTime: string
  ): Promise<PerformanceList> {
    const result = await this.performanceRepository
      .createQueryBuilder("performance_monitor")
      .select([
        "performance_monitor.appId",
        "performance_monitor.uuid",
        "performance_monitor.name",
        "performance_monitor.pageUrl",
        "performance_monitor.createTime",
        "performance_monitor.type",
        "performance_monitor.longTaskId",
        "performance_monitor.performanceValue",
      ])
      .where("performance_monitor.appId = :appId", { appId })
      .andWhere(
        "performance_monitor.createTime BETWEEN :beginTime AND :endTime",
        {
          beginTime,
          endTime,
        }
      )
      .getMany();

    const groupedData = result.reduce((acc, curr) => {
      if (!acc[curr.uuid]) {
        acc[curr.uuid] = {
          uuid: curr.uuid,
          name: curr.name,
          type: curr.type,
          appId: curr.appId,
          pageUrl: curr.pageUrl,
          createTime: curr.createTime,
        };
      }
      acc[curr.uuid][curr.name] = curr.performanceValue;
      return acc;
    }, {});

    return {
      list: Object.values(groupedData),
      message: "success",
    };
  }

  async getAppAvgPerformance(appId: string): Promise<any> {
    const avgResult = await this.performanceRepository
      .createQueryBuilder("performance_monitor")
      .select([
        "AVG(performance_monitor.dnsTime) as dnsTime",
        "AVG(performance_monitor.tcpTime) as tcpTime",
        "AVG(performance_monitor.whiteTime) as whiteTime",
        "AVG(performance_monitor.fcp) as fcp",
        "AVG(performance_monitor.ttfb) as ttfb",
        "AVG(performance_monitor.lcp) as lcp",
        "AVG(performance_monitor.fid) as fid",
      ])
      .where("performance_monitor.appId = :appId", { appId })
      .getRawOne();
    return avgResult;
  }

  async getPageAvgPerformance(
    appId: string,
    beginTime: Date,
    endTime: Date
  ): Promise<any> {
    const avgResult = await this.performanceRepository
      .createQueryBuilder("performance_monitor")
      .select([
        "performance.pageUrl as pageUrl",
        "AVG(performance.dnsTime) as dnsTime",
        "AVG(performance.tcpTime) as tcpTime",
        "AVG(performance.whiteTime) as whiteTime",
        "AVG(performance.fcp) as fcp",
        "AVG(performance.ttfb) as ttfb",
        "AVG(performance.lcp) as lcp",
        "AVG(performance.fid) as fid",
      ])
      .where(
        "performance.appId = :appId AND performance.createTime BETWEEN :beginTime AND :endTime",
        { appId, beginTime, endTime }
      )
      .groupBy("performance_monitor.pageUrl")
      .getRawMany();
    return avgResult;
  }

  async getPerformance(query: any): Promise<any> {
    const {
      pageUrl,
      beginTime,
      endTime,
      whiteTime,
      from,
      size,
      appId,
      sorterName,
      sorterKey,
    } = query;

    if (!appId) {
      throw new Error("appId is required");
    }

    const qb = this.performanceRepository
      .createQueryBuilder("pm")
      .select([
        "pm.uuid",
        "pm.type",
        "pm.appId",
        "pm.pageUrl",
        "pm.createTime",
        // Add other fields needed for grouping or sorting
      ])
      .where("pm.appId = :appId", { appId });

    if (pageUrl) {
      qb.andWhere("pm.pageUrl LIKE :pageUrl", {
        pageUrl: `%${pageUrl}%`,
      });
    }

    if (beginTime && endTime) {
      qb.andWhere("pm.createTime BETWEEN :beginTime AND :endTime", {
        beginTime: new Date(beginTime),
        endTime: new Date(endTime),
      });
    }

    if (whiteTime) {
      const whiteTimeRanges = {
        1: [0, 1000],
        2: [1001, 2000],
        3: [2001, 3000],
        4: [3001, 3000000],
      };
      const [whiteTimeStart, whiteTimeEnd] = whiteTimeRanges[whiteTime];
      qb.andWhere("pm.whiteTime BETWEEN :whiteTimeStart AND :whiteTimeEnd", {
        whiteTimeStart,
        whiteTimeEnd,
      });
    }

    // 获取总数
    const total = await qb.getCount();

    // 查询不重复的 uuid
    const distinctUuidsQuery = this.performanceRepository
      .createQueryBuilder("pm")
      .select("DISTINCT(pm.uuid)")
      .where("pm.appId = :appId", { appId });

    // 获取分页后的 uuid
    const offset = (from - 1) * size;
    const distinctUuids = await distinctUuidsQuery
      .orderBy("pm.uuid", "ASC")
      .offset(offset)
      .limit(size)
      .getRawMany();

    // 根据获取的 uuid 查询数据
    const uuids = distinctUuids.map((item) => item.uuid);
    const results = await this.performanceRepository
      .createQueryBuilder("pm")
      .select([
        "pm.uuid",
        "pm.type",
        "pm.appId",
        "pm.pageUrl",
        "pm.createTime",
        // Add other fields needed for grouping or sorting
      ])
      .where("pm.appId = :appId", { appId })
      .andWhere("pm.uuid IN (:...uuids)", { uuids })
      .orderBy(`pm.${sorterName}`, sorterKey.toUpperCase())
      .getMany();

    // 根据 uuid 分组合并数据，并转换格式
    const groupedData = results.reduce((acc, curr) => {
      if (!acc[curr.uuid]) {
        acc[curr.uuid] = {
          uuid: curr.uuid,
          type: curr.type,
          appId: curr.appId,
          pageUrl: curr.pageUrl,
          createTime: curr.createTime.toISOString(),
        };
      }
      // 只保留第一个非空的性能数据
      if (!acc[curr.uuid][curr.name]) {
        acc[curr.uuid][curr.name] =
          curr.performanceValue !== null
            ? curr.performanceValue.toFixed(2)
            : null;
      }
      return acc;
    }, {});

    // 转换为数组形式
    const formattedData = Object.values(groupedData);

    return { data: formattedData, total };
  }

  async getPageOpenRate(appId: string, whiteRange?: number[]): Promise<number> {
    const qb = this.performanceRepository
      .createQueryBuilder("performance_monitor")
      .where("performance_monitor.appId = :appId", { appId });

    if (whiteRange) {
      qb.andWhere("performance_monitor.whiteTime BETWEEN :start AND :end", {
        start: whiteRange[0],
        end: whiteRange[1],
      });
    }

    const count = await qb.getCount();
    return count;
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
