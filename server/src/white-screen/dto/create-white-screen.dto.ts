import { PartialType } from "@nestjs/mapped-types";

export class CreateWhiteScreenDto {
  type: string;
  time: number;
  status: string;
  userId: string;
  sdkVersion: string;
  apikey: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

export class UpdateWhiteScreenDto extends PartialType(CreateWhiteScreenDto) {}
