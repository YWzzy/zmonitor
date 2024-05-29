import { EVENTTYPES, BREADCRUMBTYPES } from '@zmonitor/common';
import { validateOption, getTimestamp, _support } from '@zmonitor/utils';
import { BreadcrumbData, InitOptions } from '@zmonitor/types';

export class Breadcrumb {
  maxBreadcrumbs = 20; // 用户行为存放的最大长度
  beforePushBreadcrumb: unknown = null;
  stack: BreadcrumbData[];
  constructor() {
    this.stack = [];
  }
  /**
   * 添加用户行为栈
   */
  push(data: BreadcrumbData): void {
    // 如果存在 beforePushBreadcrumb 钩子函数，则在添加行为前执行该函数，并将返回的数据添加到堆栈中；否则直接将数据添加到堆栈中
    if (typeof this.beforePushBreadcrumb === 'function') {
      // 执行用户自定义的hook
      const result = this.beforePushBreadcrumb(data) as BreadcrumbData;
      if (!result) return;
      this.immediatePush(result);
      return;
    }
    this.immediatePush(data);
  }
  // 立即将用户行为添加到堆栈中; 该方法不会触发 beforePushBreadcrumb 钩子函数
  immediatePush(data: BreadcrumbData): void {
    data.time || (data.time = getTimestamp());
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
    this.stack.sort((a, b) => a.time - b.time);
  }
  // 删除最旧的用户行为
  shift(): boolean {
    return this.stack.shift() !== undefined;
  }
  // 清空用户行为堆栈
  clear(): void {
    this.stack = [];
  }
  // 获取用户行为堆栈
  getStack(): BreadcrumbData[] {
    return this.stack;
  }
  // 根据事件类型获取用户操作面包屑类型
  getCategory(type: EVENTTYPES): BREADCRUMBTYPES {
    switch (type) {
      // 接口请求
      case EVENTTYPES.XHR:
      case EVENTTYPES.FETCH:
        return BREADCRUMBTYPES.HTTP;

      // 用户点击
      case EVENTTYPES.CLICK:
        return BREADCRUMBTYPES.CLICK;

      // 路由变化
      case EVENTTYPES.HISTORY:
      case EVENTTYPES.HASHCHANGE:
        return BREADCRUMBTYPES.ROUTE;

      // 加载资源
      case EVENTTYPES.RESOURCE:
        return BREADCRUMBTYPES.RESOURCE;

      // Js代码报错
      case EVENTTYPES.UNHANDLEDREJECTION:
      case EVENTTYPES.ERROR:
        return BREADCRUMBTYPES.CODEERROR;

      // 用户自定义
      default:
        return BREADCRUMBTYPES.CUSTOM;
    }
  }
  // 绑定初始化选项
  bindOptions(options: InitOptions): void {
    // maxBreadcrumbs 用户行为存放的最大容量
    // beforePushBreadcrumb 添加用户行为前的处理函数
    const { maxBreadcrumbs, beforePushBreadcrumb } = options;
    validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number') &&
      (this.maxBreadcrumbs = maxBreadcrumbs || 20);
    validateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', 'function') &&
      (this.beforePushBreadcrumb = beforePushBreadcrumb);
  }
}
const breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());
export { breadcrumb };
