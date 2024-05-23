import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import * as coBody from "co-body";
import { Monitor } from "./entities/monitor.entity";
import { ErrorMonitorService } from "../error-monitor/error-monitor.service";
import { CreateErrorMonitorDto } from "../error-monitor/dto/create-error-monitor.dto";
import { RecordingService } from "../recording/recording.service";
import { FileUploadService } from "../file-upload/file-upload.service";

@Injectable()
export class MonitorService {
  private performanceList: any[] = [];
  private recordScreenList: any[] = [];
  private whiteScreenList: any[] = [];

  constructor(
    @InjectRepository(Monitor) private readonly monitor: Repository<Monitor>,
    private readonly errorMonitorService: ErrorMonitorService,
    private readonly recordingService: RecordingService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // 存储录屏数据
  async saveRecordScreen(data: any): Promise<void> {
    try {
      const extractedFiles = await this.fileUploadService.saveRecordingFile(
        data.events,
        data.recordScreenId
      );
      console.log("====================================");
      console.log("File uploaded successfully", extractedFiles);
      console.log("====================================");

      await this.recordingService.saveRecording(
        extractedFiles.filePath,
        extractedFiles.fileName
      );
    } catch (err) {
      console.error(err);
    }
  }

  // 存储上报信息
  async saveLogByType(type: string, data: any): Promise<void> {
    try {
      if (type === "performance") {
        this.performanceList.push(data);
      } else if (type === "recordScreen") {
        this.saveRecordScreen(data);
      } else if (type === "whiteScreen") {
        this.whiteScreenList.push(data);
      } else {
        const createErrorMonitorDto: CreateErrorMonitorDto = data;
        await this.errorMonitorService.create(createErrorMonitorDto);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 获取js.map源码文件
  async getMap(fileName: string, env: string, res: any): Promise<void> {
    let mapPath: string;
    if (env === "development") {
      mapPath = path.join(__dirname, "..", fileName);
    } else {
      mapPath = path.join(__dirname, "..", "client/js", `${fileName}.map`);
    }
    // console.log("源码路径 mapPath:", mapPath);

    try {
      const data = await fs.promises.readFile(mapPath);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error reading the map file.");
    }
  }

  // 获取错误列表
  async getErrorList(res: any): Promise<void> {
    try {
      const errors = await this.errorMonitorService.findAll();
      res.status(200).send({
        code: 200,
        data: errors,
      });
    } catch (err) {
      res.status(500).send({
        code: 500,
        message: "Error retrieving error list.",
        error: err,
      });
    }
  }

  // 根据ID获取录屏数据
  async getRecordScreenById(recordScreenId: string, res: any): Promise<void> {
    const recordingInfo = await this.recordingService.findOneByOriginalFileName(
      recordScreenId
    );
    if (recordingInfo.storedFilePath) {
      const data = fs.readFileSync(recordingInfo.storedFilePath, "base64");
      res.status(200).send({
        code: 200,
        data,
      });
    } else {
      res.status(404).send({
        code: 404,
        message: "Recording file not found.",
      });
    }
  }

  // 数据上报
  async reportData(req: any, res: any): Promise<void> {
    try {
      const length = Object.keys(req.body).length;
      if (length) {
        // this.recordScreenList.push(req.body);
        this.saveRecordScreen(req.body);
      } else {
        const data = await coBody.json(req);
        if (!data) return;

        await this.saveLogByType(data.type, data);
      }
      res.status(200).send({
        code: 200,
        message: "Report successful!",
      });
    } catch (err) {
      res.status(203).send({
        code: 203,
        message: "Report failed!",
        error: err,
      });
    }
  }
}
