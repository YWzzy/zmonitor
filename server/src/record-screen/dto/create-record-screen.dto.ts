import { PartialType } from "@nestjs/mapped-types";

export class CreateRecordScreenDto {
  type: string;
  status: string;
  time: number;
  recordScreenId: string;
  events: string;
  column: number;
  userId: string;
  sdkVersion: string;
  apikey: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

export class UpdateRecordScreenDto extends PartialType(CreateRecordScreenDto) {}
