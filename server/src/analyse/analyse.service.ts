import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Analyse } from "./entities/analyse.entity";
import { CreateAnalyseDto } from "./dto/create-analyse.dto";
import { UpdateAnalyseDto } from "./dto/update-analyse.dto";
import * as dayjs from "dayjs";

@Injectable()
export class AnalyseService {
  private readonly logger = new Logger(AnalyseService.name);

  constructor(
    @InjectRepository(Analyse)
    private readonly analyseRepository: Repository<Analyse>
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
      updateTime: new Date(),
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

  private async getUsersCount(appId: string, date: string): Promise<number> {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    this.logger.log(`Formatted Date for getUsersCount: ${formattedDate}`);
    const users = await this.analyseRepository.find({
      where: { appId, date: formattedDate },
    });
    return users.length;
  }

  async getDayActiveUsers(appId: string, date: string): Promise<number> {
    try {
      this.logger.log(
        `getDayActiveUsers called with appId=${appId}, date=${date}`
      );
      const activeUsersCount = await this.getUsersCount(appId, date);
      return activeUsersCount;
    } catch (error) {
      this.logger.error(`Error in getDayActiveUsers: ${error.message}`);
      throw error;
    }
  }

  async getWebVisitTop(
    appId: string,
    type: string,
    top: number
  ): Promise<any[]> {
    return this.analyseRepository.find({
      where: { appId, type },
      take: top,
    });
  }

  async getNewUsers(appId: string, date: string): Promise<number> {
    return this.getUsersCount(appId, date);
  }

  async getActiveUsers(
    appId: string,
    beginTime: string,
    endTime: string
  ): Promise<any[]> {
    const formattedBeginTime = dayjs(beginTime).format("YYYY-MM-DD");
    const formattedEndTime = dayjs(endTime).format("YYYY-MM-DD");
    return this.analyseRepository.find({
      where: {
        appId,
        date: Between(formattedBeginTime, formattedEndTime),
      },
    });
  }

  async getAllUsers(appId: string): Promise<number> {
    const allUsers = await this.analyseRepository.find({ where: { appId } });
    return allUsers.length;
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
      where: { appId, date: today },
    });
    const pv2 = await this.analyseRepository.count({
      where: { appId, date: lastDay },
    });
    const ip = await this.analyseRepository.count({
      where: { appId, date: today },
    });
    const ip2 = await this.analyseRepository.count({
      where: { appId, date: lastDay },
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
