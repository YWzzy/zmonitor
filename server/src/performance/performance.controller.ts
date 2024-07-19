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
import { CustomHttpException } from "src/common/exception";

@Controller("performance")
@ApiTags("性能日志")
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post()
  create(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performanceService.create(createPerformanceDto);
  }

  @Post("resources")
  @ApiOperation({
    summary: "Post resources by performance ids",
    description: "根据 performance ids 获取资源数据",
  })
  async getResourcesByPerformanceIds(
    @Body("ids") ids: number[],
    @Res() res: Response
  ): Promise<void> {
    const data = await this.performanceService.getResourcesByPerformanceIds(
      ids
    );
    res.status(HttpStatus.OK).json({ data, message: "success", code: 200 });
  }

  @Post("paginatedResources")
  @ApiOperation({
    summary: "Post paginated resources by performance ids",
    description: "根据 performance ids 获取分页的资源数据",
  })
  async getPaginatedResourcesByPerformanceIds(
    @Body("ids") ids: string,
    @Query("page") page = 1,
    @Query("pageSize") pageSize = 10,
    @Res() res: Response
  ): Promise<void> {
    const idArray = ids.split(",").map((id) => parseInt(id, 10));
    const { data, total } =
      await this.performanceService.getPaginatedResourcesByPerformanceIds(
        idArray,
        page,
        pageSize
      );
    res
      .status(HttpStatus.OK)
      .json({ data, total, currentPage: page, pageSize });
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
    try {
      const data = await this.performanceService.getPageAvgPerformance(
        appId,
        beginTime,
        endTime
      );
      const result = {
        data: data,
        message: "success",
        code: 200,
      };
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      throw new CustomHttpException(500, err.message);
    }
  }

  @Get("getPerformance")
  @ApiOperation({
    summary: "Get performance data",
    description: "获取性能数据",
  })
  async getPerformance(@Query() query, @Res() res: Response): Promise<void> {
    try {
      const data = await this.performanceService.getPerformance(query);
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      throw new CustomHttpException(500, err.message);
    }
  }

  @Get("getAppAvgPerformance")
  @ApiOperation({
    summary: "Get app avg performance data",
    description: "获取应用日均性能数据",
  })
  async getAppAvgPerformance(@Query("appId") appId: string) {
    try {
      const data = await this.performanceService.getAppAvgPerformance(appId);

      const [all, fast, slow] = await Promise.all([
        this.performanceService.getPageOpenRate(appId),
        this.performanceService.getPageOpenRate(appId, [0, 1000]),
        this.performanceService.getPageOpenRate(appId, [5000, 100000]),
      ]);

      return {
        ...data,
        fastRate: { value: fast / all },
        slowRate: { value: slow / all },
      };
    } catch (err) {
      throw new CustomHttpException(500, err.message);
    }
  }
}
