import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "./entities/application.entity";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { CustomHttpException } from "src/common/exception";
import { Request } from "express";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) {}

  private generateUniqueAppId(): string {
    // 生成一个唯一的16位数字appId
    const min = 1000000000000000; // 最小值
    const max = 9999999999999999; // 最大值

    let newAppId: string;
    do {
      newAppId = Math.floor(Math.random() * (max - min + 1) + min).toString();
    } while (!this.isAppIdUnique(newAppId)); // 确保appId唯一性

    return newAppId;
  }

  private isAppIdUnique(appId: string): boolean {
    // 检查数据库中是否已存在该appId，如果存在返回false，否则返回true
    // 这里需要根据具体的数据库操作来实现
    return true; // 假设简单实现，始终返回true
  }

  getAppIp(req: Request): string {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor || req.socket.remoteAddress;
    return ip as string;
  }

  async create(
    createApplicationDto: CreateApplicationDto
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { appName: createApplicationDto.appName },
    });
    if (application) {
      throw new CustomHttpException(500, "Application name already exists");
    }
    // 如果createApplicationDto中没有appSecret，则生成一个uuid
    if (!createApplicationDto.appSecret) {
      createApplicationDto.appSecret = require("uuid").v4();
    }

    // 生成一个唯一appId, 16位数字，确保不会重复
    createApplicationDto.appId = this.generateUniqueAppId();

    // 手动创建一个Application对象
    const newApplication = new Application();
    newApplication.appId = createApplicationDto.appId;
    newApplication.appName = createApplicationDto.appName;
    newApplication.appSecret = createApplicationDto.appSecret;
    newApplication.appType = createApplicationDto.appType;
    newApplication.userKey = createApplicationDto.userKey;
    newApplication.appStatus = 1; // 默认打开
    newApplication.appDesc = createApplicationDto.appDesc;
    newApplication.createTime = new Date();
    newApplication.updateTime = new Date();

    // 保存到数据库
    return await this.applicationRepository.save(newApplication);
  }
  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findByUserKey(userKey: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { userKey: userKey },
    });
  }

  async findOne(appId: string): Promise<Application> {
    return this.applicationRepository.findOne({
      where: { appId: appId },
    });
  }

  async update(
    updateApplicationDto: UpdateApplicationDto
  ): Promise<Application> {
    try {
      const appId = updateApplicationDto.appId;
      const application = await this.applicationRepository.findOne({
        where: { appId: appId },
      });
      if (!application) {
        throw new CustomHttpException(500, "Application not found");
      }
      if (updateApplicationDto.appSecret) {
        throw new CustomHttpException(500, "Cannot update appSecret");
      }
      if (updateApplicationDto.appType) {
        application.appType = updateApplicationDto.appType;
      }
      if (updateApplicationDto.appName) {
        application.appName = updateApplicationDto.appName;
      }
      if (updateApplicationDto.deployServer) {
        application.deployServer = updateApplicationDto.deployServer;
      }
      if (updateApplicationDto.packageUrl) {
        application.packageUrl = updateApplicationDto.packageUrl;
      }
      if (updateApplicationDto.recordingStorage) {
        application.recordingStorage = updateApplicationDto.recordingStorage;
      }
      if (updateApplicationDto.enableRecording) {
        application.enableRecording = updateApplicationDto.enableRecording;
      }
      if (updateApplicationDto.reportErrorsOnly) {
        application.reportErrorsOnly = updateApplicationDto.reportErrorsOnly;
      }

      // 更新应用状态
      if (
        updateApplicationDto.appStatus !== null ||
        updateApplicationDto.appStatus !== undefined
      ) {
        application.appStatus = updateApplicationDto.appStatus;
      }

      // 更新应用描述
      if (updateApplicationDto.appDesc) {
        application.appDesc = updateApplicationDto.appDesc;
      }

      application.updateTime = new Date(); // 更新 updateTime
      return this.applicationRepository.save(application);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除应用
  async remove(appId: string): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { appId },
    });
    if (!application) {
      throw new Error("Application not found");
    }
    await this.applicationRepository.remove(application);
  }
}
