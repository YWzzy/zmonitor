import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { UploadService } from "./upload.service";
import { CreateUploadDto } from "./dto/create-upload.dto";
import { UpdateUploadDto } from "./dto/update-upload.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { zip } from "compressing";
import { ApiTags } from "@nestjs/swagger";

@Controller("upload")
@ApiTags("文件传输")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("album")
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file) {
    return {
      code: 200,
      msg: "success",
    };
  }

  @Get("export")
  downLoad(@Res() res: Response) {
    const url = join(__dirname, "../images/1666848114939success.png");
    res.download(url);
  }

  @Get("stream")
  async down(@Res() res: Response) {
    console.log("stream", res);

    const url = join(__dirname, "../images/1666848114939success.png");
    const targetStream = new zip.Stream();
    await targetStream.addEntry(url);
    res.setHeader("x-tpye", `fileSream`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=jiji`);
    targetStream.pipe(res);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.uploadService.remove(+id);
  }
}
