import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { Application } from "./entities/application.entity";
import { Auth } from "src/decorator/Auth";

@ApiTags("监控应用")
@Controller("applications")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiOperation({ summary: "创建新的应用" })
  @ApiCreatedResponse({ description: "应用创建成功", type: Application })
  @ApiBadRequestResponse({ description: "请求参数错误" })
  @Post("createApp")
  @Auth()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @ApiOperation({ summary: "获取所有应用列表" })
  @ApiOkResponse({ description: "成功获取所有应用列表", type: [Application] })
  @Get("getAppList")
  @Auth()
  findByUserKey(@Query("userKey") userKey: string) {
    return this.applicationService.findByUserKey(userKey);
  }

  @ApiOperation({ summary: "根据应用ID获取应用信息" })
  @ApiOkResponse({ description: "成功获取应用信息", type: Application })
  @ApiNotFoundResponse({ description: "未找到对应的应用" })
  @Get("getAppByAppId")
  @Auth()
  findOne(@Query("appId") appId: string) {
    return this.applicationService.findOne(appId);
  }

  @ApiOperation({ summary: "更新应用信息" })
  @ApiOkResponse({ description: "成功更新应用信息", type: Application })
  @ApiNotFoundResponse({ description: "未找到对应的应用" })
  @Post("updateAppStatus")
  @Auth()
  update(@Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(updateApplicationDto);
  }

  @ApiOperation({ summary: "删除应用" })
  @ApiOkResponse({ description: "成功删除应用" })
  @ApiNotFoundResponse({ description: "未找到对应的应用" })
  @Delete(":appId")
  @Auth()
  remove(@Param("appId") appId: string) {
    return this.applicationService.remove(appId);
  }
}
