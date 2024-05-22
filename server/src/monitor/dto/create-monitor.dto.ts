import { PartialType } from "@nestjs/mapped-types";

export class CreateMonitorDto {
  type: string;
  status: string;
  time: number;
  sdkVersion: string;
  apikey: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

export class UpdateMonitorDto extends PartialType(CreateMonitorDto) {}
