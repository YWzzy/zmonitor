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
  update(
    @Param("id") id: string,
    @Body() updateErrorMonitorDto: UpdateErrorMonitorDto
  ) {
    return this.errorMonitorService.update(+id, updateErrorMonitorDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.errorMonitorService.remove(+id);
  }
}
