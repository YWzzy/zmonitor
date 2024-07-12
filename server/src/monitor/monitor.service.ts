import { HttpStatus, Injectable } from "@nestjs/common";
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
import { PerformanceService } from "../performance/performance.service";
import { CreatePerformanceDto } from "src/performance/dto/create-performance.dto";
import { SearchErrorMonitorDto } from "src/error-monitor/dto/search-error-monitor.dto";

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Monitor) private readonly monitor: Repository<Monitor>,
    private readonly errorMonitorService: ErrorMonitorService,
    private readonly recordingService: RecordingService,
    private readonly fileUploadService: FileUploadService,
    private readonly performanceService: PerformanceService
  ) {}

  // 存储录屏数据
  async saveRecordScreen(data: any): Promise<void> {
    try {
      const extractedFiles = await this.fileUploadService.saveRecordingFile(
        data.events,
        data.recordScreenId
      );
      // console.log("====================================");
      // console.log("File uploaded successfully", extractedFiles);
      // console.log("====================================");

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
      if (data.apikey) {
        data.appId = data.apikey;
      }
      if (type === "performance") {
        const createPerformanceDto: CreatePerformanceDto = data;
        await this.performanceService.create(createPerformanceDto);
      } else if (type === "recordScreen") {
        this.saveRecordScreen(data);
      } else if (type === "whiteScreen") {
        // this.whiteScreenList.push(data);
        const createErrorMonitorDto: CreateErrorMonitorDto = data;
        await this.errorMonitorService.create(createErrorMonitorDto);
      } else {
        const createErrorMonitorDto: CreateErrorMonitorDto = data;
        if (data.apikey) {
          createErrorMonitorDto.appId = data.apikey;
        }
        await this.errorMonitorService.create(createErrorMonitorDto);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 获取js.map源码文件
  async getMap(fileName: string, env: string, res: any): Promise<void> {
    let mapPath: string;
    let originalFileName;
    const regex = /\/([^\/]+)$/; // 匹配最后一个斜杠后的内容作为文件名
    const match = regex.exec(fileName);
    if (match) {
      originalFileName = match[1]; // 返回匹配到的文件名部分
    } else {
      originalFileName = fileName; // 如果未匹配到，返回null或其他默认值
    }
    if (env === "development") {
      mapPath = path.join(
        __dirname,
        "..",
        originalFileName ? originalFileName : fileName
      );
    } else {
      mapPath = path.join(
        __dirname,
        "..",
        "client/js",
        `${originalFileName ? originalFileName : fileName}.map`
      );
    }
    // console.log("源码路径 mapPath:", mapPath);

    try {
      const data = await fs.promises.readFile(mapPath);
      res.status(HttpStatus.OK).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error reading the map file.");
    }
  }

  // 获取错误列表
  async getErrorList(res: any): Promise<void> {
    try {
      const errors = await this.errorMonitorService.findAll();
      res.status(HttpStatus.OK).send({
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

  // 获取分页错误列表
  async findPaginatedAndFiltered(
    appId: string,
    beginTime: string,
    endTime: string,
    page: string,
    pageSize: string,
    res: any
  ): Promise<any> {
    try {
      if (!appId)
        return res.status(400).send({
          code: 400,
          message: "App ID is required.",
        });
      const pageNumber = parseInt(page, 10) || 1;
      const pageSizeNumber = parseInt(pageSize, 10) || 10;

      const { list, total } = await this.errorMonitorService.findListPage({
        appId,
        beginTime,
        endTime,
        pageNo: pageNumber,
        pageSize: pageSizeNumber,
      } as SearchErrorMonitorDto);

      res.status(HttpStatus.OK).send({
        code: 200,
        data: {
          data: list,
          total,
        },
        message: "Issues list retrieved successfully.",
      });
    } catch (err) {
      res.status(500).send({
        code: 500,
        message: "Error retrieving error list.",
        error: err,
      });
    }
  }

  // 获取分页错误列表 -- 请求类
  async getHttpErrorListPage(
    appId: string,
    beginTime: string,
    endTime: string,
    url: string,
    from: string,
    size: string,
    sorterKey: string,
    sorterName: string,
    res: any
  ): Promise<any> {
    try {
      if (!appId)
        return res.status(400).send({
          code: 400,
          message: "App ID is required.",
        });
      const pageNumber = parseInt(from, 10) || 1;
      const pageSizeNumber = parseInt(size, 10) || 10;

      const { list, total } = await this.errorMonitorService.findListPage({
        appId,
        beginTime,
        endTime,
        url,
        pageNo: pageNumber,
        pageSize: pageSizeNumber,
        sorterKey,
        sorterName,
        types: [
          "fetch",
          "xmlhttprequest",
          "send",
          "xhr",
          "fetch",
          "post",
          "get",
          "put",
          "delete",
          "options",
          "head",
          "patch",
          "trace",
          "connect",
        ],
      } as SearchErrorMonitorDto);

      res.status(HttpStatus.OK).send({
        code: 200,
        data: {
          data: list,
          total,
        },
        message: "Issues list retrieved successfully.",
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
    try {
      const recordingInfo =
        await this.recordingService.findOneByOriginalFileName(recordScreenId);
      // 如果recordingInfo存在，并且有存储路径
      if (!this.isEmptyObject(recordingInfo)) {
        const data = fs.readFileSync(recordingInfo?.storedFilePath, "base64");
        res.status(HttpStatus.OK).send({
          code: 200,
          data,
        });
      } else {
        res.status(400).send({
          code: 400,
          message: "Recording file not found.",
        });
      }
    } catch (err) {
      res.status(500).send({
        code: 500,
        message: "Error retrieving recording file.",
        error: err,
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
      res.status(HttpStatus.OK).send({
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

  // 判断对象是否为空
  isEmptyObject(obj: any): boolean {
    if (typeof obj !== "object" || obj == null || obj == undefined) return true;
    return Object.keys(obj).length === 0;
  }
}
