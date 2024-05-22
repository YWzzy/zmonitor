import { IsString, IsNotEmpty, IsInt, IsJSON } from "class-validator";

export class CreateBreadcrumbDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsJSON()
  @IsNotEmpty()
  data: any;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsInt()
  @IsNotEmpty()
  time: number;

  @IsNotEmpty()
  createTime: Date;
}
