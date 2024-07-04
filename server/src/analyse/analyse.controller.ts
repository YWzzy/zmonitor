import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { AnalyseService } from "./analyse.service";
import { CreateAnalyseDto } from "./dto/create-analyse.dto";
import { UpdateAnalyseDto } from "./dto/update-analyse.dto";
import { Analyse } from "./entities/analyse.entity";
import dayjs from "dayjs";

@ApiTags("分析")
@Controller("analyse")
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @ApiOperation({ summary: "创建新的分析记录" })
  @ApiCreatedResponse({ description: "分析记录创建成功", type: Analyse })
  @ApiBadRequestResponse({ description: "请求参数错误" })
  @Post("createAnalyse")
  create(@Body() createAnalyseDto: CreateAnalyseDto) {
    return this.analyseService.create(createAnalyseDto);
  }

  @ApiOperation({ summary: "获取所有分析记录列表" })
  @ApiOkResponse({ description: "成功获取所有分析记录列表", type: [Analyse] })
  @Get("getAllAnalyses")
  findAll() {
    return this.analyseService.findAll();
  }

  @ApiOperation({ summary: "更新分析记录" })
  @ApiOkResponse({ description: "成功更新分析记录", type: Analyse })
  @ApiNotFoundResponse({ description: "未找到对应的分析记录" })
  @Post("updateAnalyse")
  update(@Body() updateAnalyseDto: UpdateAnalyseDto) {
    return this.analyseService.update(updateAnalyseDto);
  }

  @ApiOperation({ summary: "删除分析记录" })
  @ApiOkResponse({ description: "成功删除分析记录" })
  @ApiNotFoundResponse({ description: "未找到对应的分析记录" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.analyseService.remove(+id);
  }

  @ApiOperation({ summary: "获取每天活跃用户" })
  @ApiOkResponse({ description: "成功获取每天活跃用户" })
  @Get("getDayActiveUsers")
  getDayActiveUsers(
    @Query("appId") appId: string,
    @Query("date") dateString: string
  ) {
    console.log("====================================");
    console.log("appId", appId);
    console.log("dateString", dateString);
    console.log("====================================");
    return this.analyseService.getDayActiveUsers(appId, dateString);
  }

  @ApiOperation({ summary: "获取Web访问Top数据" })
  @ApiOkResponse({ description: "成功获取Web访问Top数据" })
  @Get("getWebVisitTop")
  getWebVisitTop(
    @Query("appId") appId: string,
    @Query("type") type: string,
    @Query("top") top: number
  ) {
    return this.analyseService.getWebVisitTop(appId, type, top);
  }

  @ApiOperation({ summary: "获取新用户数" })
  @ApiOkResponse({ description: "成功获取新用户数" })
  @Get("getNewUsers")
  getNewUsers(@Query("appId") appId: string, @Query("date") date: string) {
    return this.analyseService.getNewUsers(appId, date);
  }

  @ApiOperation({ summary: "获取活跃用户数" })
  @ApiOkResponse({ description: "成功获取活跃用户数" })
  @Get("getActiveUsers")
  getActiveUsers(
    @Query("appId") appId: string,
    @Query("beginTime") beginTime: string,
    @Query("endTime") endTime: string
  ) {
    return this.analyseService.getActiveUsers(appId, beginTime, endTime);
  }

  @ApiOperation({ summary: "获取所有用户数" })
  @ApiOkResponse({ description: "成功获取所有用户数" })
  @Get("getAllUsers")
  getAllUsers(@Query("appId") appId: string) {
    return this.analyseService.getAllUsers(appId);
  }

  @ApiOperation({ summary: "获取今日流量数据" })
  @ApiOkResponse({ description: "成功获取今日流量数据" })
  @Get("getTodayTraffic")
  getTodayTraffic(@Query("appId") appId: string) {
    return this.analyseService.getTodayTraffic(appId);
  }
}
