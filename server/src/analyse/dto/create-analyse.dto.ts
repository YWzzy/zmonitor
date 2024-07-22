import {
  IsInt,
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsIn,
  IsUUID,
} from "class-validator";

export class CreateAnalyseDto {
  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  @IsOptional()
  activeUsers?: number;

  @IsInt()
  @IsOptional()
  newUsers?: number;

  @IsInt()
  @IsOptional()
  pv?: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  browser: string;

  @IsString()
  @IsNotEmpty()
  browserVersion: string;

  @IsString()
  @IsNotEmpty()
  device: string;

  @IsString()
  @IsNotEmpty()
  device_type: string;

  @IsString()
  @IsNotEmpty()
  os: string;

  @IsString()
  @IsNotEmpty()
  osVersion: string;

  @IsString()
  @IsNotEmpty()
  ua: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsUUID()
  @IsOptional()
  errorMonitorId?: string;
}
