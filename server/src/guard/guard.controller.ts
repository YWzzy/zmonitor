import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from "@nestjs/common";
import { GuardService } from "./guard.service";
import { CreateGuardDto } from "./dto/create-guard.dto";
import { UpdateGuardDto } from "./dto/update-guard.dto";
import { RoleGuard } from "./role.guard";
import { ReqUrl, Role } from "./role.decorator";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@Controller("guard")
@ApiTags("守卫demo")
@UseGuards(RoleGuard)
@ApiBearerAuth()
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post()
  @ApiOperation({ summary: "create接口", description: "描述xxx" })
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardService.create(createGuardDto);
  }

  @Get()
  // @SetMetadata("role", ["admin"])
  @Role("admin")
  @ApiOperation({ summary: "get接口", description: "描述xxx" })
  @ApiQuery({ name: "page", description: "分页信息" })
  @ApiResponse({ status: 403, description: "暂无权限" })
  findAll(@ReqUrl("123") url: string) {
    console.log("url", url);
    return this.guardService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "testParam", description: "描述xxx", required: true })
  findOne(@Param("id") id: string) {
    return this.guardService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(+id, updateGuardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.guardService.remove(+id);
  }
}
