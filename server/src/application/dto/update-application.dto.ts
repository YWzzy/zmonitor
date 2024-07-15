import { PartialType } from "@nestjs/swagger";
import { CreateApplicationDto } from "./create-application.dto";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateApplicationDto {
  @IsOptional({ message: "id不能为空" })
  id: number;

  @IsString()
  @IsOptional()
  userKey: string;

  @IsString()
  @IsOptional()
  appId: string;

  @IsString()
  @IsOptional()
  appName: string;

  @IsString()
  @IsOptional()
  appSecret: string;

  @IsNumber()
  @IsOptional()
  appType: number;

  @IsString()
  @IsOptional({ message: "应用部署服务器地址不能为空" })
  @Length(1, 255, { message: "应用部署服务器地址长度必须在1到255个字符之间" })
  deployServer: string;

  @IsString()
  @IsOptional({ message: "应用包地址不能为空" })
  @Length(1, 255, { message: "应用包地址长度必须在1到255个字符之间" })
  packageUrl: string;

  @IsString()
  @IsOptional({ message: "录屏文件存放地址不能为空" })
  @Length(1, 255, { message: "录屏文件存放地址长度必须在1到255个字符之间" })
  recordingStorage: string;

  @IsBoolean()
  @IsOptional({ message: "是否开启录屏不能为空" })
  enableRecording: boolean;

  @IsBoolean()
  @IsOptional({ message: "是否只异常上报不能为空" })
  reportErrorsOnly: boolean;

  @IsOptional()
  appStatus: number;

  @IsOptional()
  appDesc?: string;
}
