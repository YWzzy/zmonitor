import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DistUpload } from "./entities/dist-upload.entity";
import * as fs from "fs";
import * as path from "path";
import * as dayjs from "dayjs";
import { DistUploadLog } from "./entities/dist-upload-log.entity";
import { Application } from "src/application/entities/application.entity";
import { CustomHttpException } from "src/common/exception";

@Injectable()
export class DistUploadService {
  constructor(
    @InjectRepository(DistUpload)
    private readonly distUploadRepository: Repository<DistUpload>,
    @InjectRepository(DistUploadLog)
    private readonly distUploadLogRepository: Repository<DistUploadLog>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) {}

  async uploadDistPackage(
    appId: string,
    files: Express.Multer.File[],
    projectEnv: string,
    projectVersion: string,
    isSourceMap: boolean,
    userId: string
  ): Promise<DistUploadLog> {
    try {
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100M
      const application = await this.applicationRepository.findOne({
        where: { appId },
      });
      const currentDate = dayjs().format("YYYY-MM-DD");
      const directoryPath = path.join(
        application.packageUrl,
        `/distProject/${currentDate}/${appId}/${projectEnv}/${projectVersion}/${
          isSourceMap ? "sourceMap" : "NoSourceMap"
        }`
      );

      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      const distUploads: DistUpload[] = [];
      const distUploadLog = new DistUploadLog();
      // 生成一个uuid作为logId
      const logId = require("uuid").v4();

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new CustomHttpException(
            500,
            `File ${file.originalname} is too large`
          );
        }
        const filePath = path.join(directoryPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        const distUpload = new DistUpload();
        distUpload.appId = appId;
        distUpload.projectEnv = projectEnv;
        distUpload.projectVersion = projectVersion;
        distUpload.isSourceMap = isSourceMap ? 1 : 0;
        distUpload.userId = userId;
        distUpload.path = filePath;
        distUpload.logId = logId;

        const savedDistUpload = await this.distUploadRepository.save(
          distUpload
        );
        distUploads.push(savedDistUpload);
      }
      distUploadLog.appId = appId;
      distUploadLog.projectEnv = projectEnv;
      distUploadLog.projectVersion = projectVersion;
      distUploadLog.isSourceMap = isSourceMap ? 1 : 0;
      distUploadLog.userId = userId;
      distUploadLog.rootPath = directoryPath;
      distUploadLog.logId = logId;

      const savedDistUploadlog = await this.distUploadLogRepository.save(
        distUploadLog
      );

      return savedDistUploadlog;
    } catch (error) {
      throw new CustomHttpException(
        500,
        `Failed to upload dist package: ${error.message}`
      );
    }
  }

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

  async findDistPackages(query: Partial<DistUpload>): Promise<DistUpload[]> {
    try {
      return await this.distUploadRepository.find({ where: query });
    } catch (error) {
      throw new BadRequestException(
        `Failed to find dist packages: ${error.message}`
      );
    }
  }
}
