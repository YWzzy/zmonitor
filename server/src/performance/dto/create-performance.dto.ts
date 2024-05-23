import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsInt,
  IsJSON,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateResourceDto } from "./create-resource.dto";

export class CreatePerformanceDto {
  type: string;
  status: string;
  time: number;
  name: string;
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
  @Type(() => CreateResourceDto)
  resourceList: CreateResourceDto[];

  @IsNotEmpty()
  createTime: Date;
}
