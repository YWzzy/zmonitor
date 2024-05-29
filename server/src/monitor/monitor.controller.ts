import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  Version,
  Res,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { MonitorService } from "./monitor.service";
// import { CreateMonitorDto } from "./dto/create-monitor.dto";
// import { UpdateMonitorDto } from "./dto/update-monitor.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("monitor")
@ApiTags("系统监控")
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  // @Post()
  // create(@Body() createMonitorDto: CreateMonitorDto) {
  //   return this.monitorService.create(createMonitorDto);
  // }

  @Get("getmap")
  @ApiOperation({
    summary: "获取map文件",
    description: "获取服务器上的map文件",
  })
  // @Version("2")
  getMap(
    @Query("fileName") fileName: string,
    @Query("env") env: string,
    @Res() res: Response
  ): void {
    this.monitorService.getMap(fileName, env, res);
  }

  @Get("getErrorList")
  @ApiOperation({
    summary: "获取错误日志列表",
    description: "获取错误日志列表",
  })
  getErrorList(@Res() res: Response): void {
    this.monitorService.getErrorList(res);
  }

  @Get("getRecordScreenId")
  @ApiOperation({
    summary: "根据id获取录屏",
    description: "根据id获取录屏",
  })
  getRecordScreenId(@Query("id") id: string, @Res() res: Response): void {
    this.monitorService.getRecordScreenById(id, res);
  }

  @Post("reportData")
  @ApiOperation({
    summary: "上报数据",
    description: "上报数据",
  })
  reportData(@Req() req: any, @Res() res: any): void {
    this.monitorService.reportData(req, res);
  }

  // @Get()
  // findAll() {
  //   return this.monitorService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.monitorService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
  //   return this.monitorService.update(+id, updateMonitorDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.monitorService.remove(+id);
  // }
}
