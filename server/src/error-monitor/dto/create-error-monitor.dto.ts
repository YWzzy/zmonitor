import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsUrl,
  IsJSON,
  IsArray,
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
  apikey: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: {
    browserVersion: string;
    browser: string;
    osVersion: string;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBreadcrumbDto)
  breadcrumb: CreateBreadcrumbDto[];

  @IsNotEmpty()
  createTime: Date;
}
