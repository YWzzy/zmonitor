import { variableTypeDetection } from './verifyType';
import { Callback, IAnyObject } from '@zmonitor/types';

export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
}
/**
 * 添加事件监听器
 * ../export
 * ../param {{ addEventListener: Function }} target
 * ../param {keyof TotalEventName} eventName
 * ../param {Function} handler
 * ../param {(boolean | Object)} opitons
 * ../returns
 */
export function on(target: any, eventName: string, handler: Callback, opitons = false) {
  target.addEventListener(eventName, handler, opitons);
}

/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export function replaceAop(
  source: IAnyObject,
  name: string,
  replacement: Callback,
  isForced = false
) {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}
/**
 * 函数节流
 * fn 需要节流的函数
 * delay 节流的时间间隔
 * 返回一个包含节流功能的函数
 */
export const throttle = (fn: any, delay: number) => {
  let canRun = true;
  return function (this: any, ...args: any[]) {
    if (!canRun) return;
    fn.apply(this, args);
    canRun = false;
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
};

// 获取当前的时间戳
export function getTimestamp(): number {
  return Date.now();
}

// 获取当天的日期 2022-11-08
export function getYMDHMS(): string {
  const datetime = new Date();
  const year = datetime.getFullYear(),
    month = ('0' + (datetime.getMonth() + 1)).slice(-2),
    date = ('0' + datetime.getDate()).slice(-2);
  return `${year}-${month}-${date}`;
}

export function typeofAny(target: any): string {
  // 1. 获取目标值的字符串表示形式，例如 "[object Array]"
  // 2. 然后使用 .slice(8, -1) 来去除开头的 "[object " 和末尾的 "]"，从而得到实际的类型字符串，例如 "Array"
  // 3. 最后通过 .toLowerCase() 将类型字符串转换为小写字母形式
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
export function toStringAny(target: any, type: string): boolean {
  return Object.prototype.toString.call(target) === type;
}

// 验证选项的类型
export function validateOption(target: any, targetName: string, expectType: string): any {
  if (!target) return false;
  if (typeofAny(target) === expectType) return true;
  console.error(
    `z-monitor: ${targetName}期望传入${expectType}类型，目前是${typeofAny(target)}类型`
  );
}

export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string;
  }
  if (variableTypeDetection.isUndefined(target)) {
    return 'undefined';
  }
  return JSON.stringify(target);
}

export function interceptStr(str: string, interceptLength: number): string {
  if (variableTypeDetection.isString(str)) {
    return (
      str.slice(0, interceptLength) +
      (str.length > interceptLength ? `:截取前${interceptLength}个字符` : '')
    );
  }
  return '';
}
