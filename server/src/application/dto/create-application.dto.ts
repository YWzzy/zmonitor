import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsBoolean,
} from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty({ message: "应用名称不能为空" })
  @Length(1, 255, { message: "应用名称长度必须在1到255个字符之间" })
  appName: string;

  @IsString()
  @IsNotEmpty({ message: "应用密钥不能为空" })
  @Length(1, 255, { message: "应用密钥长度必须在1到255个字符之间" })
  appSecret: string;

  @IsString()
  @IsNotEmpty({ message: "应用类型不能为空" })
  @Length(1, 255, { message: "应用类型长度必须在1到255个字符之间" })
  appType: string;

  @IsNotEmpty({ message: "应用状态不能为空" })
  appStatus: number;

  @IsString()
  @IsOptional()
  @Length(0, 65535, { message: "应用描述长度必须在0到65535个字符之间" })
  appDesc?: string;
}
