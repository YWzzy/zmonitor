import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "./file-upload.service";
import { RecordingService } from "../recording/recording.service";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { UpdateFileUploadDto } from "./dto/update-file-upload.dto";

@Controller("upload")
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly recordingService: RecordingService
  ) {}

  @Post()
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
