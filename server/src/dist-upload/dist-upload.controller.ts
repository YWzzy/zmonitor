import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { DistUploadService } from "./dist-upload.service";
import { DistUpload } from "./entities/dist-upload.entity";
import { CustomHttpException } from "src/common/exception";
import { DistUploadLog } from "./entities/dist-upload-log.entity";

@ApiTags("DistUpload")
@Controller("dist-upload")
export class DistUploadController {
  constructor(private readonly distUploadService: DistUploadService) {}

  @Post("upload")
  @ApiOperation({ summary: "上传dist包" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files"))
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        appId: { type: "string" },
        projectEnv: { type: "string" },
        projectVersion: { type: "string" },
        isSourceMap: { type: "boolean" },
        userId: { type: "string" },
        files: { type: "array", items: { type: "string", format: "binary" } },
      },
    },
  })
  async uploadDistPackage(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<DistUploadLog> {
    try {
      const { appId, projectEnv, projectVersion, isSourceMap, userId } = body;
      return await this.distUploadService.uploadDistPackage(
        appId,
        files,
        projectEnv,
        projectVersion,
        isSourceMap,
        userId
      );
    } catch (error) {
      throw new CustomHttpException(
        error.status,
        `Failed to upload dist package: ${error.message}`
      );
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "更新指定的dist包" })
  @ApiParam({ name: "id", type: "number", description: "dist包ID" })
  async updateDistPackage(
    @Param("id") id: number,
    @Body() updateDistDto: Partial<DistUpload>
  ): Promise<DistUpload> {
    try {
      return await this.distUploadService.updateDistPackage(id, updateDistDto);
    } catch (error) {
      throw new CustomHttpException(error.status, error.message);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除dist包" })
  @ApiParam({ name: "id", type: "number", description: "dist包ID" })
  async deleteDistPackage(@Param("id") id: number): Promise<void> {
    try {
      await this.distUploadService.deleteDistPackage(id);
    } catch (error) {
      throw new CustomHttpException(error.status, error.message);
    }
  }

  @Get("findDistPackages")
  @ApiOperation({ summary: "查询指定条件下的dist包" })
  @ApiQuery({ name: "appId", required: false, type: "string" })
  @ApiQuery({ name: "projectEnv", required: false, type: "string" })
  @ApiQuery({ name: "projectVersion", required: false, type: "string" })
  @ApiQuery({ name: "fileName", required: false, type: "string" })
  @ApiQuery({ name: "userId", required: false, type: "string" })
  async findDistPackages(
    @Query("appId") appId?: string,
    @Query("projectEnv") projectEnv?: string,
    @Query("projectVersion") projectVersion?: string,
    @Query("fileName") fileName?: string,
    @Query("userId") userId?: string
  ): Promise<DistUpload[]> {
    try {
      return await this.distUploadService.findDistPackages({
        appId,
        projectEnv,
        projectVersion,
        fileName,
        userId,
      });
    } catch (error) {
      throw new CustomHttpException(error.status, error.message);
    }
  }
}
