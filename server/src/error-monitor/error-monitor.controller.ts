import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ErrorMonitorService } from "./error-monitor.service";
import { CreateErrorMonitorDto } from "./dto/create-error-monitor.dto";
import { UpdateErrorMonitorDto } from "./dto/update-error-monitor.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("error-monitor")
@ApiTags("错误日志")
export class ErrorMonitorController {
  constructor(private readonly errorMonitorService: ErrorMonitorService) {}

  @Post("createError")
  @ApiOperation({
    summary: "存储错误日志",
    description: "存储错误日志",
  })
  create(@Body() createErrorMonitorDto: CreateErrorMonitorDto) {
    return this.errorMonitorService.create(createErrorMonitorDto);
  }

  @Get()
  findAll() {
    return this.errorMonitorService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.errorMonitorService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "更新错误日志",
    description: "更新错误日志",
  })
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
  async shieldError(@Body("id") id: number) {
    console.log("shieldError", id);
    return this.errorMonitorService.shieldError(id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "删除错误日志",
    description: "删除错误日志",
  })
  remove(@Param("id") id: string) {
    return this.errorMonitorService.remove(+id);
  }
}
