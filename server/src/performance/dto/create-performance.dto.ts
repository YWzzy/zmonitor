import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateResourceDto } from "./create-resource.dto";

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rating: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sdkVersion: string;

  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  pageUrl: string;

  @IsObject()
  @IsNotEmpty()
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
