/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2022-11-01 09:28:45
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2023-07-04 14:01:09
 * @FilePath: \demo\src\spider\spider.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SpiderService } from "./spider.service";
import { CreateSpiderDto } from "./dto/create-spider.dto";
import { HttpService } from "@nestjs/axios";
import { ApiTags } from "@nestjs/swagger";
import { QueryDto } from "./dto/query-spider.dto";

@Controller("spider")
@ApiTags("爬虫")
export class SpiderController {
  constructor(
    private readonly spiderService: SpiderService,
    private readonly httpService: HttpService
  ) {}

  @Post()
  create(@Body() createSpiderDto: CreateSpiderDto) {
    return this.spiderService.create(createSpiderDto);
  }

  @Get("getPosters")
  // findAll(@Body() queryDto: QueryDto) {
  getPosters() {
    //wallhaven.cc/search?categories=110&purity=100&atleast=1920x1080&topRange=1M&sorting=random&order=desc&ai_art_filter=1
    const queryDto = {
      categories: 110,
      purity: 100,
      atleast: "1920x1080",
      topRange: "1M",
      sorting: "random", // toplist
      order: "desc",
      page: 2,
    };
    return this.spiderService.getPosters(this.httpService, queryDto);
  }

  @Get("getImgs")
  // findAll(@Body() queryDto: QueryDto) {
  findAll() {
    //wallhaven.cc/search?categories=110&purity=100&atleast=1920x1080&topRange=1M&sorting=toplist&order=desc&ai_art_filter=1
    const queryDto = {
      categories: 110,
      purity: 100,
      atleast: "1920x1080",
      topRange: "1M",
      sorting: "hot",
      order: "desc",
      page: 22,
    };
    return this.spiderService.findAll(this.httpService, queryDto);
  }
}
