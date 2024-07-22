/* eslint-disable @typescript-eslint/no-explicit-any */
interface LoginRegsiterIn {
  account: string;
  password: string;
  name?: string;
  code?: string;
}

interface UserInfo {
  /** 用户ID */
  id?: number;
  /** 登录账号 */
  account: string;
  /** 加密登录密码 */
  encPassword: string;
  /** 账号状态 */
  status: 0 | 1;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateAppIn {
  appType: number;
  appName: string;
}

interface UpdateAppInfo {
  appId: string;
  id: number;
  appStatus: number;
}

interface UpdateAppInfo {
  appId: string;
  id: number;
  appStatus: number;
}

interface AppConfig {
  id: number;
  appId: string; // 应用ID
  appName: string; // 应用名称
  appStatus: number; // 应用开关
  deployServer: string; // 应用部署服务器地址
  packageUrl: string; // 应用包地址
  recordingStorage: string; // 录屏文件存放地址
  enableRecording: boolean; // 是否开启录屏
  reportErrorsOnly: boolean; // 是否只异常上报
}

interface AppInfo {
  id: number;
  appId: string;
  appName: string;
  createId: number;
  appType: number;
  appStatus: number;
}

type TopKeys = 'webVisit' | 'browser' | 'deviceVendor' | 'city' | 'osName';

interface AnalyseReq {
  ids?: number[];
  appId?: string;
  date?: string;
  beginTime?: string;
  endTime?: string;
}
interface TopReq {
  appId: string;
  type?: TopKeys;
  top?: number;
}

interface Options {
  label: string;
  value: string | number;
}

interface TodayTrafficRes {
  allUsers: number;
  newUsers: [number, number];
  pv: [number, number];
  ip: [number, number];
  activeUsers: [number, number];
}

interface TrafficTimesReq {
  appId: string;
  date: string;
  pageUrl: string;
}

interface TrafficDaysReq {
  appId: string;
  pageUrl: string;
  beginTime: string;
  endTime: string;
}

interface TrafficTimesRes {
  pageViews: Record<string, number>;
  uniqueIPsCount: Record<string, number>;
  uniqueVisitors: Record<string, number>;
}

interface PerformanceInPage {
  key: string;
  errorCount: number;
}

type PerformanceInValue = Record<
  string,
  {
    value: number;
  }
>;

interface GetPerformanceReq {
  appId: string;
  from: number | undefined;
  size: number | undefined;
  pageUrl?: string | undefined;
  beginTime?: string | undefined;
  endTime?: string | undefined;
  /** 1:1s以内 2:1~2s 3:2~3s 4:3s以上 */
  whiteTime?: 1 | 2 | 3 | 4 | undefined;
  sorterName?: string;
  sorterKey?: string;
}

type PaginationData<T> = {
  [x: string]: any;
  _id: 'NIa1H40Bx791ks39qTfs';
  _source: T;
};
interface Pagination<T> {
  total: number;
  data: PaginationData<T>[];
}

interface PaginationHttp<T> {
  total: number;
  list: PaginationData<T>[];
}

type GetPerformanceRes = Pagination<PerfamceReportMsg & PublicMsg>;

interface HttpErrorRankRes {
  errorCount: number;
  avg_cost: {
    value: number;
  };
  url: string;
  key: {
    method: string;
    requestType: string;
    type: string;
    url: string;
  };
}

interface GetHttpListReq {
  appId: string;
  from: number | undefined;
  size: number | undefined;
  url?: string | undefined;
  link?: string | undefined;
  beginTime?: string | undefined;
  endTime?: string | undefined;
  requestType?: 'done' | 'error' | string;
  sorterName?: string;
  sorterKey?: string;
}

type GetHttpListRes = PaginationHttp<RequestReportMsg & PublicMsg>;

type JsErrorMsgItem = JsErrorReportMsg & {
  errorCount: number;
  userIds: string[];
  id: number;
};

type DeviceInfo = {
  os: string;
  browser: string;
  browserVersion: string;
  device: string;
  device_type: string;
  osVersion: string;
  ua: string;
};

type IssuesListPage = {
  data: ErrorMsgItem[];
  total: number;
};

type IssuesListPageRes = Pagination<IssuesListPage & PublicMsg>;

type ErrorMsgItem = {
  appId: string;
  breadcrumb: any[]; // 可以根据具体内容进一步定义
  column: number;
  createTime: string;
  deviceInfo: DeviceInfo;
  fileName: string;
  id: number;
  isDeleted: boolean;
  line: number;
  message: string;
  pageUrl: string;
  recordScreenId: string;
  sdkVersion: string;
  status: string;
  time: string;
  type: string;
  userId: string;
  uuid: string;
};

type NearbyCodeMsg = {
  code: string[];
  originalPosition: {
    source: string | null;
    line: number | null;
    column: number | null;
    name: string | null;
  };
  source: string;
  start: number;
};
