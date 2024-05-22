import { ReplaceHandler } from '@zmonitor/types';
import { EVENTTYPES } from '@zmonitor/common';
export declare function subscribeEvent(handler: ReplaceHandler): boolean;
export declare function notify(type: EVENTTYPES, data?: any): void;
