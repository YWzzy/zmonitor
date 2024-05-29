import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './verifyType';
import { ZMonitor, Window } from '@zmonitor/types';

export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== 'undefined' ? window : 0
);

// 获取全局变量
export function getGlobal(): Window {
  // 如果当前环境是浏览器环境，则直接返回 window；否则返回一个空对象
  return window as unknown as Window;
}
// _global常量: 全局变量window的引用
const _global = getGlobal();
// _support常量: 全局变量__zMonitor__的引用地址,如果不存在则初始化为一个空对象。这个对象用于存储监控 SDK 的支持信息和状态
const _support = getGlobalSupport();
const uaResult = new UAParser().getResult();

// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

_support.hasError = false;

// errorMap 存储代码错误的集合
_support.errorMap = new Map();

// _support.replaceFlag 对象和 setFlag()、getFlag() 函数：用于设置和获取错误替换的标志
_support.replaceFlag = _support.replaceFlag || {};
const replaceFlag = _support.replaceFlag;
export function setFlag(replaceType: string, isSet: boolean) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType: string) {
  return replaceFlag[replaceType] ? true : false;
}

// 获取全部变量__zMonitor__的引用地址
export function getGlobalSupport() {
  _global.__zMonitor__ = _global.__zMonitor__ || ({} as ZMonitor);
  return _global.__zMonitor__;
}

// 检测浏览器是否支持 HTML5 History API，主要是检查浏览器是否支持 history.pushState() 和 history.replaceState() 方法
export function supportsHistory(): boolean {
  const chrome = _global.chrome;
  // 检查当前环境是否是 Chrome 打包应用
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi =
    'history' in _global &&
    !!(_global.history as History).pushState &&
    !!(_global.history as History).replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

export { _global, _support };
