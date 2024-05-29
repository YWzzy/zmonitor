interface DeviceInfo {
  browserVersion: string;
  browser: string;
  osVersion: string;
  os: string;
  ua: string;
  device: string;
  device_type: string;
}

interface WhiteScreenDto {
  type: string;
  time: number;
  status: string;
  userId: string;
  sdkVersion: string;
  appId: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

interface PerformanceDto {
  type: string;
  status: string;
  time: number;
  name: string;
  rating: string;
  value: number;
  userId: string;
  sdkVersion: string;
  appId: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}

interface BreadcrumbItem {
  type: string;
  category: string;
  data: any;
  status: string;
  time: number;
}

interface ErrorDto {
  type: string;
  status: string;
  time: number;
  message: string;
  fileName: string;
  line: number;
  column: number;
  recordScreenId: string;
  userId: string;
  sdkVersion: string;
  appId: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
  breadcrumb: BreadcrumbItem[];
}

interface RecordScreenDto {
  type: string;
  status: string;
  time: number;
  recordScreenId: string;
  events: string;
  column: number;
  userId: string;
  sdkVersion: string;
  appId: string;
  uuid: string;
  pageUrl: string;
  deviceInfo: DeviceInfo;
}
