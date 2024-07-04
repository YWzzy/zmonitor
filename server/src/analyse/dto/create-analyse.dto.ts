import { IsString, IsInt, IsDateString, IsNotEmpty } from "class-validator";

export class CreateAnalyseDto {
  @IsString()
  @IsNotEmpty({ message: "应用ID不能为空" })
  appId: string;

  @IsString()
  @IsNotEmpty({ message: "类型不能为空" })
  type: string;

  @IsInt()
  @IsNotEmpty({ message: "每日活跃用户数不能为空" })
  activeUsers: number;

  @IsInt()
  @IsNotEmpty({ message: "每日新增用户数不能为空" })
  newUsers: number;

  @IsInt()
  @IsNotEmpty({ message: "每日页面访问量不能为空" })
  pv: number;

  @IsInt()
  @IsNotEmpty({ message: "每日IP数不能为空" })
  ip: number;

  @IsDateString()
  @IsNotEmpty({ message: "日期不能为空" })
  date: string;
}
