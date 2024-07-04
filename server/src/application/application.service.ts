import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "./entities/application.entity";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto
  ): Promise<Application> {
    const newApplication =
      this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(newApplication);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findOne(id: number): Promise<Application> {
    return this.applicationRepository.findOne({
      where: { appId: id },
    });
  }

  async update(
    updateApplicationDto: UpdateApplicationDto
  ): Promise<Application> {
    try {
      const id = updateApplicationDto.id;
      const application = await this.applicationRepository.findOne({
        where: { id: id },
      });
      if (!application) {
        throw new Error("Application not found");
      }
      if (updateApplicationDto.appType) {
        application.appType = updateApplicationDto.appType;
      }

      if (updateApplicationDto.appName) {
        application.appName = updateApplicationDto.appName;
      }

      if (updateApplicationDto.appSecret) {
        application.appSecret = updateApplicationDto.appSecret;
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
  async remove(id: number): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { appId: id },
    });
    if (!application) {
      throw new Error("Application not found");
    }
    await this.applicationRepository.remove(application);
  }
}
