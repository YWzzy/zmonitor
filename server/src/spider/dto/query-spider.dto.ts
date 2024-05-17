import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class QueryDto {
  @IsString()
  query: string; // 查询关键词

  @IsNotEmpty()
  categories: string; // 类别

  @IsNotEmpty()
  @IsNumber()
  purity: number; // 纯度

  atleast: string; // 分辨率

  @IsNotEmpty()
  topRange: string; // 最近多久内 eg: 最近一月：1M  ,最近一周: 1w

  @IsNotEmpty()
  sorting: string; // 排序 eg: 1.hot 2.toplist 3.favorites 4.views 5.date_added 6.random 7.relevance

  order: string; // 纯度 eg: desc

  @IsNumber()
  page: number; // 当前页
}
