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
import { SearchErrorMonitorDto } from "./dto/search-error-monitor.dto";
import { ApiOperation, ApiQuery, ApiTags, ApiBody } from "@nestjs/swagger";

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
  @ApiOperation({
    summary: "查找所有错误日志",
    description: "查找所有错误日志",
  })
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
          apikey: "apikey123",
          pageUrl: "http://example.com",
          isDeleted: false,
          pageSize: 10,
          page: 1,
        },
      },
    },
  })
  findListPage(@Body() searchErrorMonitorDto: SearchErrorMonitorDto) {
    return this.errorMonitorService.findListPage(searchErrorMonitorDto);
  }

  @Get(":id")
  @ApiOperation({
    summary: "通过id查找错误日志",
    description: "通过id查找错误日志",
  })
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
