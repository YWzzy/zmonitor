import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty({ message: "创建人不能为空" })
  @Length(1, 128, { message: "创建人长度必须在1到128个字符之间" })
  userKey: string;

  @IsString()
  @IsOptional()
  appId: string;

  @IsString()
  @IsNotEmpty({ message: "应用名称不能为空" })
  @Length(1, 255, { message: "应用名称长度必须在1到255个字符之间" })
  appName: string;

  @IsString()
  @IsOptional()
  @Length(1, 255, { message: "应用密钥长度必须在1到255个字符之间" })
  appSecret: string;

  @IsNumber()
  @IsNotEmpty({ message: "应用类型不能为空" })
  appType: number;

  @IsString()
  @IsOptional()
  @Length(1, 48, { message: "应用名称长度必须在1到48个字符之间" })
  projectEnv?: string;

  @IsOptional()
  appStatus: number;

  @IsString()
  @IsOptional()
  @Length(0, 65535, { message: "应用描述长度必须在0到65535个字符之间" })
  appDesc?: string;

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
  @IsOptional({ message: "是否是sourceMap包" })
  isSourceMap: boolean;

  @IsBoolean()
  @IsOptional({ message: "是否开启录屏不能为空" })
  enableRecording: boolean;

  @IsBoolean()
  @IsOptional({ message: "是否只异常上报不能为空" })
  reportErrorsOnly: boolean;
}
