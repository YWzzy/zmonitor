import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { DistUpload } from "./entities/dist-upload.entity";
import * as fs from "fs";
import * as path from "path";
import * as dayjs from "dayjs";
import { DistUploadLog } from "./entities/dist-upload-log.entity";
import { Application } from "src/application/entities/application.entity";
import { CustomHttpException } from "src/common/exception";
import { Response } from "express";

@Injectable()
export class DistUploadService {
  constructor(
    @InjectRepository(DistUpload)
    private readonly distUploadRepository: Repository<DistUpload>,
    @InjectRepository(DistUploadLog)
    private readonly distUploadLogRepository: Repository<DistUploadLog>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly connection: Connection,
  ) { }

  async getUploadBatch(
    appId: string,
    projectEnv: string,
    projectVersion: string,
    isSourceMap: boolean,
    userId: string,
    filesNumber: string,
    filesSize: string
  ): Promise<{ logId: string }> {
    try {
      const logs = await this.distUploadLogRepository.find({
        where: { appId, projectEnv, projectVersion },
      });
      if (logs.length > 0) {
        // throw new CustomHttpException(
        //   500,
        //   `Dist package with appId ${appId}, projectEnv ${projectEnv}, projectVersion ${projectVersion} already exists`
        // );
        return logs[0];
      }
      const application = await this.applicationRepository.findOne({
        where: { appId },
      });
      const currentDate = dayjs().format("YYYY-MM-DD");
      const directoryPath = path.join(
        // __dirname,
        application.packageUrl,
        `/distProject/${currentDate}/${appId}/${projectEnv}/${projectVersion}/${isSourceMap ? "sourceMap" : "NoSourceMap"
        }`
      );
      const logId = require("uuid").v4();
      const distUploadLog = new DistUploadLog();
      distUploadLog.appId = appId;
      distUploadLog.projectEnv = projectEnv;
      distUploadLog.projectVersion = projectVersion;
      distUploadLog.isSourceMap = isSourceMap ? 1 : 0;
      distUploadLog.userId = userId;
      distUploadLog.rootPath = directoryPath;
      distUploadLog.logId = logId;
      distUploadLog.filesNumber = parseInt(filesNumber);
      distUploadLog.filesSize = parseInt(filesSize);

      const savedDistUploadlog = await this.distUploadLogRepository.save(
        distUploadLog
      );

      return savedDistUploadlog;
    } catch (error) {
      throw new CustomHttpException(
        500,
        `Failed to get upload batch: ${error.message}`
      );
    }
  }

  // 上传dist包
  async uploadDistPackage(
    appId: string,
    file: Express.Multer.File,
    webkitRelativePath: string,
    projectEnv: string,
    projectVersion: string,
    isSourceMap: boolean,
    userId: string,
    rootPath: string,
    logId: string,
    fileName: string,
    fileSize: string
  ): Promise<DistUpload> {

    // 创建一个queryRunner，用于事务处理
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (file.size > MAX_FILE_SIZE) {
        throw new CustomHttpException(
          500,
          `File ${fileName} is too large`
        );

      }

      const distUpload = new DistUpload();
      const filePath = path.join(
        rootPath,
        webkitRelativePath || fileName
      );
      // 确保文件的目录存在
      const directoryPath = path.dirname(filePath);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      } else if (!fs.statSync(directoryPath).isDirectory()) {
        throw new Error(`路径应该是目录，但它不是: ${directoryPath}`);
      }

      // 确保 filePath 不是目录
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        throw new Error(`路径是一个目录而不是文件: ${filePath}`);
      }

      fs.writeFileSync(filePath, file.buffer);
      distUpload.appId = appId;
      distUpload.fileName = fileName;
      distUpload.rootPath = rootPath;
      distUpload.projectEnv = projectEnv;
      distUpload.projectVersion = projectVersion;
      distUpload.isSourceMap = isSourceMap ? 1 : 0;
      distUpload.userId = userId;
      distUpload.path = filePath;
      distUpload.logId = logId;
      distUpload.webkitRelativePath = webkitRelativePath;

      const savedDistUpload = await queryRunner.manager.save(distUpload);

      await queryRunner.commitTransaction();
      return savedDistUpload;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error.message);
      // 如果存在上传记录但是不存在对应文件，删除本次上传记录和文件
      throw new CustomHttpException(
        500,
        `Failed to upload dist package: ${error.message}`
      );
    } finally {
      // 释放queryRunner
      await queryRunner.release();
    }
  }

  // 更新dist包
  async updateDistPackage(
    id: number,
    updateDistDto: Partial<DistUpload>
  ): Promise<DistUpload> {
    try {
      await this.distUploadRepository.update(id, updateDistDto);
      const updatedDistUpload = await this.distUploadRepository.findOne({
        where: { id },
      });
      if (!updatedDistUpload) {
        throw new NotFoundException(`Dist package with ID ${id} not found`);
      }
      return updatedDistUpload;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update dist package: ${error.message}`
      );
    }
  }

  async deleteDistPackage(id: number): Promise<void> {
    try {
      const deleteResult = await this.distUploadRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Dist package with ID ${id} not found`);
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete dist package: ${error.message}`
      );
    }
  }

  async findDistPackages(
    query: Partial<DistUpload>,
    res: Response
  ): Promise<any> {
    try {
      // 过滤掉空的字段
      const queryParams = Object.entries(query).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});
      const logs = await this.distUploadRepository.find({ where: queryParams });
      // 取第一条
      const distLog = logs[0];
      const distChildPackagePath = distLog.path;
      try {
        const data = await fs.promises.readFile(distChildPackagePath);
        return res.status(HttpStatus.OK).send(data);
      } catch (err) {
        throw new CustomHttpException(500, err.message);
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to find dist packages: ${error.message}`
      );
    }
  }
}
