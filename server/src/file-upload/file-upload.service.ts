import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as unzipper from "unzipper";
import * as multer from "multer";
import { promisify } from "util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "../application/entities/application.entity"; // 假设 Application 实体文件在此路径
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { UpdateFileUploadDto } from "./dto/update-file-upload.dto";

@Injectable()
export class FileUploadService {
  private readonly uploadPath = "/recordScreenFiles";
  private readonly publicPath = "/public";

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>
  ) {
    this.ensureUploadPath();
  }

  private ensureUploadPath() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private getTodayPath(): string {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const todayPath = path.join(__dirname, "..", this.uploadPath, today);
    if (!fs.existsSync(todayPath)) {
      fs.mkdirSync(todayPath, { recursive: true });
    }
    return todayPath;
  }

  // 从数据库中获取应用的 recordingStorage 路径
  async getAppRecordingStoragePath(appId: string): Promise<string> {
    const application = await this.applicationRepository.findOne({
      where: { appId },
    });
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (application && application.recordingStorage) {
      const appPath = path.join(
        __dirname,
        "..",
        this.uploadPath,
        application.recordingStorage,
        today
      );
      return appPath; // 返回应用程序的录屏存储路径
    } else {
      const publicPath = path.join(
        __dirname,
        "..",
        this.uploadPath,
        this.publicPath,
        today
      );
      return publicPath; // 默认使用公共目录
    }
  }

  // 保存录屏数据
  async saveRecordingFile(
    base64Data: string,
    fileName: string,
    appId: string
  ): Promise<{ fileName: string; filePath: string }> {
    const recordingStoragePath = await this.getAppRecordingStoragePath(appId);
    const filePath = path.join(recordingStoragePath, fileName);

    // 确保目录存在
    if (!fs.existsSync(recordingStoragePath)) {
      fs.mkdirSync(recordingStoragePath, { recursive: true });
    }

    // 将 base64 转为 buffer
    const buffer = Buffer.from(base64Data, "base64");
    try {
      fs.writeFileSync(filePath, buffer);
      // 返回 filePath 和 fileName 对应的 map
      return { fileName, filePath };
    } catch (error) {
      throw new Error(`Failed to save recording: ${error.message}`);
    }
  }

  async handleFileUpload(file, appId: string): Promise<string[]> {
    const recordingStoragePath = await this.getAppRecordingStoragePath(appId);
    const zipFilePath = path.join(recordingStoragePath, file.originalname);

    // 保存压缩文件到今日目录
    fs.writeFileSync(zipFilePath, file.buffer);

    // 解压文件
    const extractPath = path.join(
      recordingStoragePath,
      path.basename(file.originalname, path.extname(file.originalname))
    );
    const extract = promisify(unzipper.Extract({ path: extractPath }).promise);
    await extract(zipFilePath);

    // 返回解压后的文件路径
    const files = fs.readdirSync(extractPath);
    return files.map((fileName) => path.join(extractPath, fileName));
  }

  multerOptions() {
    return {
      storage: multer.memoryStorage(),
    };
  }
}
