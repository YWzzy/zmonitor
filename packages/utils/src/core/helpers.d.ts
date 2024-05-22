import { Callback, IAnyObject } from '@zmonitor/types';
export declare function getLocationHref(): string;
/**
 * 添加事件监听器
 * ../export
 * ../param {{ addEventListener: Function }} target
 * ../param {keyof TotalEventName} eventName
 * ../param {Function} handler
 * ../param {(boolean | Object)} opitons
 * ../returns
 */
export declare function on(target: any, eventName: string, handler: Callback, opitons?: boolean): void;
/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export declare function replaceAop(source: IAnyObject, name: string, replacement: Callback, isForced?: boolean): void;
/**
 * 函数节流
 * fn 需要节流的函数
 * delay 节流的时间间隔
 * 返回一个包含节流功能的函数
 */
export declare const throttle: (fn: any, delay: number) => (this: any, ...args: any[]) => void;
export declare function getTimestamp(): number;
export declare function getYMDHMS(): string;
export declare function typeofAny(target: any): string;
export declare function toStringAny(target: any, type: string): boolean;
export declare function validateOption(target: any, targetName: string, expectType: string): any;
export declare function generateUUID(): string;
export declare function unknownToString(target: unknown): string;
export declare function interceptStr(str: string, interceptLength: number): string;
