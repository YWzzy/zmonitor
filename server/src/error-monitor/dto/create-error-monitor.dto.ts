import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsUrl,
  IsJSON,
  IsArray,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateBreadcrumbDto } from "./create-breadcrumb.dto";

export class CreateErrorMonitorDto {
  type: string;
  status: string;
  time: number;
  message: string;
  fileName?: string; // 可选字段
  line?: number; // 可选字段
  errorColumn?: number; // 可选字段
  recordScreenId: string;
  userId: string;
  sdkVersion: string;
  appId: string;
  uuid: string;
  pageUrl: string;
  url: string;
  requestData: {
    [key: string]: any;
  };
  response: {
    [key: string]: any;
  };
  elapsedTime?: number;
  deviceInfo: {
    browserVersion: string;
    browser: string;
    osVersion: string;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };
  analyse: {
    browserVersion: string;
    browser: string;
    osVersion: string;
    os: string;
    ua: string;
    device: string;
    device_type: string;
    ip: string;
    appId: string;
    activeUsers?: number;
    pageUrl?: string;
    newUsers?: number;
    pv?: number;
    time?: number;
  };
  @IsBoolean()
  isDeleted: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBreadcrumbDto)
  breadcrumb: CreateBreadcrumbDto[];

  @IsNotEmpty()
  createTime: Date;
}
