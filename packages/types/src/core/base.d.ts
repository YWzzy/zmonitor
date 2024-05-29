import { EVENTTYPES, STATUS_CODE, BREADCRUMBTYPES } from '@zmonitor/common';
export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);
/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string;
  elapsedTime: number;
  message: string;
  Status?: number;
  status?: string;
  requestData?: {
    httpType: string;
    method: string;
    data: any;
  };
  response?: {
    Status: number;
    data?: any;
  };
}
/**
 * 资源加载失败
 */
export interface ResouceError {
  time: number;
  message: string;
  name: string;
}
/**
 * 长任务列表
 */
export interface LongTask {
  time: number;
  name: string;
  longTask: any;
}
/**
 * 性能指标
 */
export interface PerformanceData {
  name: string;
  value: number;
  rating: string;
}
/**
 * 内存信息
 */
export interface MemoryData {
  name: string;
  memory: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}
/**
 * 代码错误
 */
export interface CodeError {
  column: number;
  line: number;
  message: string;
  fileName: string;
}
/**
 * 用户行为
 */
export interface Behavior {
  type: EVENTTYPES;
  category: any;
  status: STATUS_CODE;
  time: number;
  data: XOR<HttpData, XOR<CodeError, RouteHistory>>;
  message: string;
  name?: string;
}
/**
 * 录屏信息
 */
export interface RecordScreen {
  recordScreenId: string;
  events: string;
}
/**
 * 上报的数据接口
 */
export interface ReportData
  extends HttpData,
    ResouceError,
    LongTask,
    PerformanceData,
    MemoryData,
    CodeError,
    RecordScreen {
  type: string;
  pageUrl: string;
  time: number;
  uuid: string;
  appId: string;
  status: string;
  sdkVersion: string;
  breadcrumb?: BreadcrumbData[];
  deviceInfo: {
    browserVersion: string | number;
    browser: string;
    osVersion: string | number;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };
}
export interface Callback {
  (...args: any[]): any;
}
export interface IAnyObject {
  [key: string]: any;
}
export type voidFun = (...args: any[]) => void;
export interface ReplaceHandler {
  type: EVENTTYPES;
  callback: Callback;
}
export type ReplaceCallback = (data: any) => void;
export interface ResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}
export interface AuthInfo {
  appId: string;
  sdkVersion: string;
  userId?: string;
}
export interface BreadcrumbData {
  type: EVENTTYPES;
  category: BREADCRUMBTYPES;
  status: STATUS_CODE;
  time: number;
  data: any;
}
export interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}
export interface RouteHistory {
  from: string;
  to: string;
}
export interface ZMonitor {
  hasError: false;
  events: string[];
  recordScreenId: string;
  _loopTimer: number;
  transportData: any;
  options: any;
  replaceFlag: {
    [key: string]: any;
  };
  deviceInfo: {
    [key: string]: any;
  };
}
export interface SdkBase {
  transportData: any;
  breadcrumb: any;
  options: any;
  notify: any;
}
export interface Window {
  chrome: {
    app: {
      [key: string]: any;
    };
  };
  history: any;
  addEventListener: any;
  innerWidth: any;
  innerHeight: any;
  onpopstate: any;
  performance: any;
  __zMonitor__: {
    [key: string]: any;
  };
}
export declare abstract class BasePlugin {
  type: string;
  constructor(type: string);
  abstract bindOptions(options: object): void;
  abstract core(sdkBase: SdkBase): void;
  abstract transform(data: any): void;
}
