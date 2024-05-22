import { PartialType } from "@nestjs/mapped-types";

export class CreatePerformanceDto {
  type: string;
  status: string;
  time: number;
  name: string;
  rating: string;
  value: number;
  userId: string;
  sdkVersion: string;
  apikey: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

export class UpdatePerformanceDto extends PartialType(CreatePerformanceDto) {}
