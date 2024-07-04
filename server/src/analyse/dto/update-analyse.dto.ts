import { PartialType } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
} from "class-validator";
import { CreateAnalyseDto } from "./create-analyse.dto";

export class UpdateAnalyseDto extends PartialType(CreateAnalyseDto) {
  @IsNotEmpty({ message: "ID不能为空" })
  id: number;

  @IsString()
  @IsOptional()
  appId?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsInt()
  @IsOptional()
  activeUsers?: number;

  @IsInt()
  @IsOptional()
  newUsers?: number;

  @IsInt()
  @IsOptional()
  pv?: number;

  @IsInt()
  @IsOptional()
  ip?: number;

  @IsDateString()
  @IsOptional()
  date?: string;
}
