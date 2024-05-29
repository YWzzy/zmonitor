import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as unzipper from "unzipper";
import * as multer from "multer";
import { promisify } from "util";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { UpdateFileUploadDto } from "./dto/update-file-upload.dto";

@Injectable()
export class FileUploadService {
  private readonly uploadPath = "/recordScreenFiles";

  constructor() {
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

  // 保存录屏数据
  async saveRecordingFile(
    base64Data: string,
    fileName: string
  ): Promise<{ fileName: string; filePath: string }> {
    const suffix = ".txt";
    const todayPath = this.getTodayPath();
    const filePath = path.join(todayPath, fileName);
    // 确保目录存在
    if (!fs.existsSync(todayPath)) {
      fs.mkdirSync(todayPath, { recursive: true });
    }
    // 将 base64 转为 buffer
    const buffer = Buffer.from(base64Data, "base64");
    try {
      fs.writeFileSync(filePath, buffer);
      // 返回filePath和fileName对应的map
      return { fileName, filePath };
    } catch (error) {
      throw new Error(`Failed to save recording: ${error.message}`);
    }
  }

  async handleFileUpload(file): Promise<string[]> {
    const todayPath = this.getTodayPath();
    const zipFilePath = path.join(todayPath, file.originalname);

    // 保存压缩文件到今日目录
    fs.writeFileSync(zipFilePath, file.buffer);

    // 解压文件
    const extractPath = path.join(
      todayPath,
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
