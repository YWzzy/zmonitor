/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2024-05-24 09:59:26
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2024-07-05 16:17:45
 * @FilePath: \server\src\error-monitor\dto\search-error-monitor.dto.ts
 * @Description:
 */
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsUrl,
  IsJSON,
  IsArray,
  IsBoolean,
  IsOptional,
  IsDate,
} from "class-validator";

export class SearchErrorMonitorDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsArray()
  @IsOptional()
  types?: string[];

  @IsString()
  @IsOptional()
  sorterKey: string;

  @IsString()
  @IsOptional()
  sorterName: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsInt()
  @IsOptional()
  time: number;

  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  fileName?: string; // 可选字段

  @IsInt()
  @IsOptional()
  line?: number; // 可选字段

  @IsInt()
  @IsOptional()
  column?: number; // 可选字段

  @IsString()
  @IsOptional()
  recordScreenId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  sdkVersion: string;

  @IsString()
  @IsOptional()
  appId: string;

  @IsUUID()
  @IsOptional()
  uuid: string;

  @IsUrl()
  @IsOptional()
  pageUrl: string;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean = false;

  @IsString()
  @IsOptional()
  beginTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsDate()
  @IsOptional()
  createTime: Date;

  @IsInt()
  @IsOptional()
  pageSize: number = 10;

  @IsInt()
  @IsOptional()
  pageNo: number = 1;
}
