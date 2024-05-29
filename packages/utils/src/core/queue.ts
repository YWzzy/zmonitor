import { _global } from './global';
import { voidFun } from '@zmonitor/types';

export class Queue {
  private stack: any[] = [];
  private isFlushing = false;
  constructor() {}

  // 添加函数道执行队列
  addFn(fn: voidFun): void {
    if (typeof fn !== 'function') return;
    // 如果当前环境不支持requestIdleCallback和Promise，则直接执行函数
    if (!('requestIdleCallback' in _global || 'Promise' in _global)) {
      fn();
      return;
    }
    this.stack.push(fn);
    // 如果当前没有在刷新队列，则立即刷新队列
    if (!this.isFlushing) {
      this.isFlushing = true;
      // 优先使用requestIdleCallback
      if ('requestIdleCallback' in _global) {
        requestIdleCallback(() => this.flushStack());
      } else {
        // 其次使用微任务上报
        Promise.resolve().then(() => this.flushStack());
      }
    }
  }
  // 清空执行队列
  clear() {
    this.stack = [];
  }
  // 获取执行队列
  getStack() {
    return this.stack;
  }
  // 执行并清空队列
  flushStack(): void {
    // 浅拷贝一份队列
    const temp = this.stack.slice(0);
    this.stack = [];
    this.isFlushing = false;
    // 依次执行队列中的函数
    for (let i = 0; i < temp.length; i++) {
      temp[i]();
    }
  }
}
