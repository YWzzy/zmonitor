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
  @IsNotEmpty({ message: "id不能为空" })
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

  @IsOptional()
  appStatus: number;

  @IsOptional()
  appDesc?: string;
}
