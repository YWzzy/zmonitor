import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like } from "typeorm";
import { Analyse } from "./entities/analyse.entity";
import { CreateAnalyseDto } from "./dto/create-analyse.dto";
import { UpdateAnalyseDto } from "./dto/update-analyse.dto";
import * as dayjs from "dayjs";
import { ErrorMonitor } from "src/error-monitor/entities/error-monitor.entity";

@Injectable()
export class AnalyseService {
  private readonly logger = new Logger(AnalyseService.name);

  constructor(
    @InjectRepository(Analyse)
    private readonly analyseRepository: Repository<Analyse>,
    @InjectRepository(ErrorMonitor)
    private readonly errorMonitorRepository: Repository<ErrorMonitor>
  ) {}

  async create(createAnalyseDto: CreateAnalyseDto): Promise<Analyse> {
    const newAnalyse = this.analyseRepository.create(createAnalyseDto);
    return this.analyseRepository.save(newAnalyse);
  }

  async findAll(): Promise<Analyse[]> {
    return this.analyseRepository.find();
  }

  async findOne(id: number): Promise<Analyse> {
    const analyse = await this.analyseRepository.findOne({ where: { id } });
    if (!analyse) {
      throw new NotFoundException(`Analyse with ID ${id} not found`);
    }
    return analyse;
  }

  async update(updateAnalyseDto: UpdateAnalyseDto): Promise<Analyse> {
    const { id, ...updateData } = updateAnalyseDto;
    const analyse = await this.analyseRepository.preload({
      id,
      ...updateData,
      updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    if (!analyse) {
      throw new NotFoundException(`Analyse with ID ${id} not found`);
    }
    return this.analyseRepository.save(analyse);
  }

  async remove(id: number): Promise<void> {
    const analyse = await this.findOne(id);
    await this.analyseRepository.remove(analyse);
  }

  /**
   * 获取指定日期范围内不同用户ID的总数
   * @param appId - 应用程序ID
   * @param date - 指定日期（格式：YYYY-MM-DD）
   * @return {Promise<number>} - 不同用户ID的总数
   */
  private async getUsersCount(appId: string, date: string): Promise<number> {
    const formattedBeginTime = dayjs(date).format("YYYY-MM-DD 00:00:00");
    const formattedEndTime = dayjs(date).format("YYYY-MM-DD 23:59:59");

    const countResult = await this.analyseRepository
      .createQueryBuilder("analyse")
      .select("COUNT(DISTINCT analyse.userId)", "count")
      .where("analyse.appId = :appId", { appId })
      .andWhere("analyse.createTime BETWEEN :start AND :end", {
        start: formattedBeginTime,
        end: formattedEndTime,
      })
      .getRawOne();

    return parseInt(countResult.count, 10);
  }

  async getDayActiveUsers(appId: string, date: string): Promise<number> {
    try {
      const activeUsersCount = await this.getUsersCount(appId, date);
      return activeUsersCount;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取指定应用程序的网页访问排行榜数据
   * @param appId - 应用程序ID
   * @param top - 获取前N名的数据
   * @return {Promise<any[]>} - 指定排行榜类型的前N名数据
   */
  async getWebVisitTop(
    appId: string,
    type: string,
    top: number
  ): Promise<any[]> {
    try {
      if (type === "browser") {
        return await this.analyseRepository
          .createQueryBuilder("analyse")
          .select("analyse.browser", "label")
          .addSelect("COUNT(analyse.browser)", "count")
          .where("analyse.appId = :appId", { appId })
          .groupBy("analyse.browser")
          .orderBy("count", "DESC")
          .limit(top)
          .getRawMany();
      } else if (type === "osName") {
        return await this.analyseRepository
          .createQueryBuilder("analyse")
          .select("analyse.os", "label")
          .addSelect("COUNT(analyse.os)", "count")
          .where("analyse.appId = :appId", { appId })
          .groupBy("analyse.os")
          .orderBy("count", "DESC")
          .limit(top)
          .getRawMany();
      } else if (type === "webVisit") {
        return await this.analyseRepository
          .createQueryBuilder("analyse")
          .select("analyse.pageUrl", "label")
          .addSelect("COUNT(analyse.pageUrl)", "count")
          .where("analyse.appId = :appId", { appId })
          .groupBy("analyse.pageUrl")
          .orderBy("count", "DESC")
          .limit(top)
          .getRawMany();
      } else if (type === "deviceVendor") {
        return await this.analyseRepository
          .createQueryBuilder("analyse")
          .select("analyse.device_type", "label")
          .addSelect("COUNT(analyse.device_type)", "count")
          .where("analyse.appId = :appId", { appId })
          .groupBy("analyse.device_type")
          .orderBy("count", "DESC")
          .limit(top)
          .getRawMany();
      }
    } catch (error) {
      this.logger.error(`Error in getWebVisitTop: ${error.message}`);
      throw error;
    }
  }

  async getNewUsers(appId: string, date: string): Promise<number> {
    return this.getUsersCount(appId, date);
  }

  async getActiveUsers(appId: string, beginTime: string, endTime: string) {
    const startDate = dayjs(beginTime).startOf("day");
    const endDate = dayjs(endTime).endOf("day");
    const days = [];
    let currentDate = startDate;

    // 提取日期范围内的每一天
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      days.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    const result = [];

    for (const day of days) {
      const dayStart = dayjs(day).startOf("day").format("YYYY-MM-DD HH:mm:ss");
      const dayEnd = dayjs(day).endOf("day").format("YYYY-MM-DD HH:mm:ss");

      const users = await this.analyseRepository
        .createQueryBuilder("analyse")
        .select("analyse.userId")
        .distinct(true)
        .where("analyse.appId = :appId", { appId })
        .andWhere("analyse.createTime BETWEEN :dayStart AND :dayEnd", {
          dayStart,
          dayEnd,
        })
        .getRawMany();

      result.push({
        date: day,
        userCount: users.length,
      });
    }

    return result;
  }

  async getActiveUsersBetween(
    appId: string,
    beginTime: string,
    endTime: string
  ): Promise<any[]> {
    const formattedBeginTime = dayjs(beginTime).format("YYYY-MM-DD");
    const formattedEndTime = dayjs(endTime).format("YYYY-MM-DD");
    return this.analyseRepository.find({
      where: {
        appId,
        createTime: Between(formattedBeginTime, formattedEndTime),
      },
    });
  }

  /**
   * 获取指定应用程序不同用户ID的总数
   * @param appId - 应用程序ID
   * @return {Promise<number>} - 不同用户ID的总数
   */
  async getAllUsers(appId: string): Promise<number> {
    const count = await this.analyseRepository
      .createQueryBuilder("analyse")
      .select("COUNT(DISTINCT analyse.userId)", "count")
      .where("analyse.appId = :appId", { appId })
      .getRawOne();

    return parseInt(count.count, 10);
  }

  async getTodayTraffic(appId: string): Promise<any> {
    const today = dayjs().format("YYYY-MM-DD");
    const lastDay = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const allUsers = await this.getAllUsers(appId);
    const [activeUsers, activeUsers2] = await Promise.all([
      this.getDayActiveUsers(appId, today),
      this.getDayActiveUsers(appId, lastDay),
    ]);
    const [newUsers, newUsers2] = await Promise.all([
      this.getNewUsers(appId, today),
      this.getNewUsers(appId, lastDay),
    ]);

    const pv = await this.analyseRepository.count({
      where: { appId, createTime: Like(`${today}%`) }, // 使用 Like 操作符匹配以 '2024-07-23' 开头的所有记录
    });

    const pv2 = await this.analyseRepository.count({
      where: { appId, createTime: Like(`${lastDay}%`) },
    });
    const ip = await this.analyseRepository.count({
      where: { appId, createTime: Like(`${today}%`) },
    });
    const ip2 = await this.analyseRepository.count({
      where: { appId, createTime: Like(`${lastDay}%`) },
    });

    return {
      allUsers,
      activeUsers: [activeUsers, activeUsers2],
      newUsers: [newUsers, newUsers2],
      pv: [pv, pv2],
      ip: [ip, ip2],
    };
  }
}
