import { HttpStatus, Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MonitorService {
  private performanceList: any[] = [];
  private errorList: any[] = [];
  private recordScreenList: any[] = [];
  private whiteScreenList: any[] = [];

  // ... 其他方法与控制器中的方法相对应

  getMap(fileName: string, env: string, res: any): void {
    // ... 实现获取 map 文件的逻辑
  }

  getErrorList(res: any): void {
    // ... 实现获取错误列表的逻辑
    res.status(HttpStatus.OK).send({
      code: 200,
      data: this.errorList,
    });
  }

  getRecordScreenId(id: string, res: any): void {
    // ... 实现获取录屏数据的逻辑
  }

  reportData(res: any): void {
    // ... 实现数据上报的逻辑
    res.status(HttpStatus.OK).send({
      code: 200,
      message: "上报成功！",
    });
  }
}
