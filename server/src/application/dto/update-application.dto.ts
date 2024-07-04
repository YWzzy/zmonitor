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
