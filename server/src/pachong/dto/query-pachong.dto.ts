import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class QueryPachongDto {
  @IsString()
  query: string; // 查询关键词

  @IsNotEmpty()
  categories: string; // 类别

  order: string; // 纯度 eg: desc
}
