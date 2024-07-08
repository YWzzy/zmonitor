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
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { PerformanceService } from "./performance.service";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { UpdatePerformanceDto } from "./dto/update-performance.dto";

@Controller("performance")
@ApiTags("性能日志")
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post()
  create(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performanceService.create(createPerformanceDto);
  }

  @Get("allPerformance")
  async getAllPerformance(
    @Query("appId") appId: string,
    @Query("beginTime") beginTime: string,
    @Query("endTime") endTime: string,
    @Res() res: Response
  ): Promise<void> {
    if (!appId) {
      res.status(400).json({ message: "appId is required", code: 400 });
      return;
    }
    const data = await this.performanceService.getAllPerformance(
      appId,
      beginTime,
      endTime
    );
    res.status(200).json(data);
  }

  @Get("getAppAvgPerformance")
  @ApiOperation({
    summary: "Get average performance of the application",
    description: "获取应用的平均性能",
  })
  async getAppAvgPerformance(
    @Query("appId") appId: string,
    @Res() res: Response
  ): Promise<void> {
    const data = await this.performanceService.getAppAvgPerformance(appId);
    const [all, fast, slow] = await Promise.all([
      this.performanceService.getPageOpenRate(appId),
      this.performanceService.getPageOpenRate(appId, [0, 1000]),
      this.performanceService.getPageOpenRate(appId, [5000, 100000]),
    ]);
    res.status(HttpStatus.OK).json({
      ...data,
      fastRote: { value: fast / all },
      slowRote: { value: slow / all },
    });
  }

  @Get("getPageAvgPerformance")
  @ApiOperation({
    summary: "Get average performance of the pages",
    description: "获取页面的平均性能",
  })
  async getPageAvgPerformance(
    @Query("appId") appId: string,
    @Query("beginTime") beginTime: string,
    @Query("endTime") endTime: string,
    @Res() res: Response
  ): Promise<void> {
    const data = await this.performanceService.getPageAvgPerformance(
      appId,
      new Date(beginTime),
      new Date(endTime)
    );
    res.status(HttpStatus.OK).json(data);
  }

  @Get("getPerformance")
  @ApiOperation({
    summary: "Get performance data",
    description: "获取性能数据",
  })
  async getPerformance(@Query() query, @Res() res: Response): Promise<void> {
    const data = await this.performanceService.getPerformance(query);
    res.status(HttpStatus.OK).json(data);
  }

  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.performanceService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePerformanceDto: UpdatePerformanceDto
  ) {
    return this.performanceService.update(+id, updatePerformanceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.performanceService.remove(+id);
  }
}
