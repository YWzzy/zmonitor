import { EVENTTYPES, STATUS_CODE, BREADCRUMBTYPES } from '@zmonitor/common';

// Without将T中不包含U的属性 设置为可选属性
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

// 将T U 变成互斥的，至少有其中一个
export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string; // 接口地址
  elapsedTime: number; // 接口时长
  message: string; // 接口信息
  Status?: number; // 接口状态编码
  status?: string; // 接口状态
  requestData?: {
    httpType: string; // 请求类型 xhr fetch
    method: string; // 请求方式
    data: any;
  };
  response?: {
    Status: number; // 接口状态
    data?: any;
  };
}

/**
 * 资源加载失败
 */
export interface ResouceError {
  time: number;
  message: string; // 加载失败的信息
  name: string; // 脚本类型：js脚本
}

/**
 * 长任务列表
 */
export interface LongTask {
  time: number;
  name: string; // longTask
  longTask: any; // 长任务详情
}

/**
 * 性能指标
 */
export interface PerformanceData {
  name: string; // FCP
  value: number; // 数值
  rating: string; // 等级
}

/**
 * 内存信息
 */
export interface MemoryData {
  name: string; // memory
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
  fileName: string; // 发出错误的文件
}

/**
 * 用户行为
 */
export interface Behavior {
  type: EVENTTYPES;
  category: any;
  status: STATUS_CODE;
  time: number;
  // data: HttpData | CodeError | RouteHistory;
  data: XOR<HttpData, XOR<CodeError, RouteHistory>>;
  message: string;
  name?: string;
}

/**
 * 录屏信息
 */
export interface RecordScreen {
  recordScreenId: string; // 录屏id
  events: string; // 录屏内容
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
  type: string; // 事件类型
  pageUrl: string; // 页面地址
  time: number; // 发生时间
  uuid: string; // 页面唯一标识
  appId: string; // 项目id
  status: string; // 事件状态
  sdkVersion: string; // 版本信息
  breadcrumb?: BreadcrumbData[]; // 用户行为

  // 设备信息
  deviceInfo: {
    browserVersion: string | number; // 版本号
    browser: string; // Chrome
    osVersion: string | number; // 电脑系统 10
    os: string; // 设备系统
    ua: string; // 设备详情
    device: string; // 设备种类描述
    device_type: string; // 设备种类，如pc
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

// 通用信息
export interface AuthInfo {
  appId: string;
  sdkVersion: string;
  userId?: string;
}

export interface BreadcrumbData {
  type: EVENTTYPES; // 事件类型
  category: BREADCRUMBTYPES; // 用户行为类型
  status: STATUS_CODE; // 行为状态
  time: number; // 发生时间
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
  hasError: false; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  transportData: any; // 数据上报
  options: any; // 配置信息
  replaceFlag: {
    // 订阅消息
    [key: string]: any;
  };
  deviceInfo: {
    // 设备信息
    [key: string]: any;
  };
}

// sdk插件核心core
export interface SdkBase {
  transportData: any; // 数据上报
  breadcrumb: any; // 用户行为
  options: any; // 公共配置
  notify: any; // 发布消息
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

export abstract class BasePlugin {
  public type: string; // 插件类型
  constructor(type: string) {
    this.type = type;
  }
  abstract bindOptions(options: object): void; // 校验参数
  abstract core(sdkBase: SdkBase): void; // 核心方法
  abstract transform(data: any): void; // 数据转化
}
