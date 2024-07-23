import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { FileUploadService } from "./file-upload.service";
import { RecordingService } from "../recording/recording.service";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { UpdateFileUploadDto } from "./dto/update-file-upload.dto";

@ApiTags("File Upload")
@Controller("upload")
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly recordingService: RecordingService
  ) {}

  @Post()
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiQuery({ name: "appId", type: String, description: "Application ID" })
  @ApiBody({
    description: "File upload",
    type: CreateFileUploadDto,
  })
  @ApiResponse({ status: 201, description: "File uploaded successfully" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file, @Query("appId") appId: string) {
    const extractedFiles = await this.fileUploadService.handleFileUpload(
      file,
      appId
    );

    const savedRecordings = await Promise.all(
      extractedFiles.map(async (filePath) => {
        return this.recordingService.saveRecording(file.originalname, filePath);
      })
    );

    return {
      message: "File uploaded successfully",
      files: savedRecordings,
    };
  }
}
