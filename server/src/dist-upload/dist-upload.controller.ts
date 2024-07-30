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
  Res,
  UploadedFile,
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
import { Response } from "express";
import { DistUploadService } from "./dist-upload.service";
import { DistUpload } from "./entities/dist-upload.entity";
import { CustomHttpException } from "src/common/exception";
import { DistUploadLog } from "./entities/dist-upload-log.entity";
import { Auth } from "src/decorator/Auth";

@ApiTags("DistUpload")
@Controller("dist-upload")
export class DistUploadController {
  constructor(private readonly distUploadService: DistUploadService) { }


  @Get('getUploadBatch')
  @ApiOperation({ summary: "获取上传批次信息" })
  @Auth()
  async getUploadBatch(
    @Query('appId') appId: string,
    @Query('projectEnv') projectEnv: string,
    @Query('projectVersion') projectVersion: string,
    @Query('isSourceMap') isSourceMap: boolean,
    @Query('userId') userId: string,
    @Query('filesNumber') filesNumber: string,
    @Query('filesSize') filesSize: string
  ): Promise<{ logId: string }> {
    try {
      return await this.distUploadService.getUploadBatch(appId, projectEnv, projectVersion, isSourceMap, userId, filesNumber, filesSize);
    } catch (error) {
      throw new CustomHttpException(error.status, error.message);
    }
  }

  @Post("upload")
  @ApiOperation({ summary: "上传dist包" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        appId: { type: "string" },
        projectEnv: { type: "string" },
        logId: { type: "string" },
        rootPath: { type: "string" },
        projectVersion: { type: "string" },
        isSourceMap: { type: "boolean" },
        userId: { type: "string" },
        fileName: { type: "string" },
        file: { type: "string", format: "binary" },
      },
    },
  })
  @Auth()
  async uploadDistPackage(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DistUpload> {
    try {
      const {
        appId,
        projectEnv,
        projectVersion,
        webkitRelativePath,
        isSourceMap,
        userId,
        rootPath,
        logId,
        fileName,
        fileSize,
      } = body;
      return await this.distUploadService.uploadDistPackage(
        appId,
        file,
        webkitRelativePath,
        projectEnv,
        projectVersion,
        isSourceMap,
        userId,
        rootPath,
        logId,
        fileName,
        fileSize
      );
    } catch (error) {
      throw new CustomHttpException(
        error.status,
        `${error.message}`
      );
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "更新指定的dist包" })
  @ApiParam({ name: "id", type: "number", description: "dist包ID" })
  @Auth()
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
  @Auth()
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
  @ApiQuery({ name: "webkitRelativePath", required: false, type: "string" })
  @ApiQuery({ name: "userId", required: false, type: "string" })
  async findDistPackages(
    @Res() res: Response,
    @Query("appId") appId?: string,
    @Query("projectEnv") projectEnv?: string,
    @Query("projectVersion") projectVersion?: string,
    @Query("fileName") fileName?: string,
    @Query("webkitRelativePath") webkitRelativePath?: string,
    @Query("userId") userId?: string
  ): Promise<DistUpload[]> {
    try {
      return await this.distUploadService.findDistPackages(
        {
          appId,
          projectEnv,
          projectVersion,
          fileName,
          webkitRelativePath,
          userId,
        },
        res
      );
    } catch (error) {
      throw new CustomHttpException(error.status, error.message);
    }
  }
}
