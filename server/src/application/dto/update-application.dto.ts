/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2024-05-24 15:14:52
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2024-05-27 15:52:38
 * @FilePath: \zjiang-web-monitor\server\src\application\dto\update-application.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateApplicationDto } from "./create-application.dto";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateApplicationDto {
  @IsNotEmpty({ message: "id不能为空" })
  id: number;

  @IsString()
  @IsOptional()
  appName: string;

  @IsString()
  @IsOptional()
  appSecret: string;

  @IsString()
  @IsOptional()
  appType: string;

  @IsOptional()
  appStatus: number;

  @IsOptional()
  appDesc?: string;
}
