import { Callback, InitOptions } from '@zmonitor/types';
/**
 * 检测页面是否白屏
 * @param {function} callback - 回到函数获取检测结果
 * @param {boolean} skeletonProject - 页面是否有骨架屏
 * @param {array} whiteBoxElements - 容器列表，默认值为['html', 'body', '#app', '#root']
 */
export declare function openWhiteScreen(callback: Callback, { skeletonProject, whiteBoxElements }: InitOptions): void;
