import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ErrorMonitorService } from "./error-monitor.service";
import { CreateErrorMonitorDto } from "./dto/create-error-monitor.dto";
import { UpdateErrorMonitorDto } from "./dto/update-error-monitor.dto";
import { SearchErrorMonitorDto } from "./dto/search-error-monitor.dto";
import { ApiOperation, ApiQuery, ApiTags, ApiBody } from "@nestjs/swagger";
import { Auth } from "src/decorator/Auth";

@Controller("error-monitor")
@ApiTags("错误日志")
export class ErrorMonitorController {
  constructor(private readonly errorMonitorService: ErrorMonitorService) {}

  @Post("createError")
  @ApiOperation({
    summary: "存储错误日志",
    description: "存储错误日志",
  })
  @Auth()
  create(@Body() createErrorMonitorDto: CreateErrorMonitorDto) {
    return this.errorMonitorService.create(createErrorMonitorDto);
  }

  @Get()
  @ApiOperation({
    summary: "查找所有错误日志",
    description: "查找所有错误日志",
  })
  @Auth()
  findAll() {
    return this.errorMonitorService.findAll();
  }

  @Post("findListPage")
  @ApiOperation({
    summary: "分页查找错误日志",
    description: "分页查找错误日志",
  })
  @ApiBody({
    description: "查询条件",
    type: SearchErrorMonitorDto,
    examples: {
      example1: {
        summary: "分页查找示例",
        description: "这是一个查询条件示例",
        value: {
          type: "error",
          status: "active",
          time: 1620000000000,
          message: "Error message",
          fileName: "app.js",
          line: 10,
          column: 15,
          recordScreenId: "record123",
          userId: "user123",
          sdkVersion: "1.0.0",
          appId: "apikey123",
          pageUrl: "http://example.com",
          isDeleted: false,
          pageSize: 10,
          page: 1,
        },
      },
    },
  })
  @Auth()
  findListPage(@Body() searchErrorMonitorDto: SearchErrorMonitorDto) {
    return this.errorMonitorService.findListPage(searchErrorMonitorDto);
  }

  @Get("getJsErrorRange")
  @ApiOperation({
    summary: "获取指定时间区间内的JavaScript错误数据",
    description: "获取指定时间区间内的JavaScript错误数据",
  })
  @Auth()
  @ApiQuery({ name: "appId", type: String, description: "应用ID" })
  @ApiQuery({ name: "beginTime", type: String, description: "开始时间" })
  @ApiQuery({ name: "endTime", type: String, description: "结束时间" })
  async getJsErrorRange(
    @Query("appId") appId: string,
    @Query("beginTime") beginTime: string,
    @Query("endTime") endTime: string,
    @Res() res: Response
  ) {
    if (!appId || !beginTime || !endTime) {
      throw new BadRequestException("Missing required query parameters.");
    }

    // 验证日期格式
    if (isNaN(Date.parse(beginTime)) || isNaN(Date.parse(endTime))) {
      throw new BadRequestException(
        "Invalid date format for beginTime or endTime."
      );
    }

    const data = await this.errorMonitorService.getJsErrorRange(
      appId,
      beginTime,
      endTime
    );

    return res.status(HttpStatus.OK).json({ data });
  }

  @Get(":id")
  @ApiOperation({
    summary: "通过id查找错误日志",
    description: "通过id查找错误日志",
  })
  @Auth()
  findOne(@Param("id") id: number) {
    return this.errorMonitorService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "更新错误日志",
    description: "更新错误日志",
  })
  @Auth()
  update(
    @Param("id") id: string,
    @Body() updateErrorMonitorDto: UpdateErrorMonitorDto
  ) {
    return this.errorMonitorService.update(+id, updateErrorMonitorDto);
  }

  @Post("shield")
  @ApiOperation({
    summary: "屏蔽错误日志",
    description: "屏蔽错误日志",
  })
  @Auth()
  async shieldError(@Body("id") id: number) {
    console.log("shieldError", id);
    return this.errorMonitorService.shieldError(id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "删除错误日志",
    description: "删除错误日志",
  })
  @Auth()
  remove(@Param("id") id: string) {
    return this.errorMonitorService.remove(+id);
  }
}
