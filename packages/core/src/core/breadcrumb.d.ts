import { EVENTTYPES, BREADCRUMBTYPES } from '@zmonitor/common';
import { BreadcrumbData, InitOptions } from '@zmonitor/types';
export declare class Breadcrumb {
    maxBreadcrumbs: number;
    beforePushBreadcrumb: unknown;
    stack: BreadcrumbData[];
    constructor();
    /**
     * 添加用户行为栈
     */
    push(data: BreadcrumbData): void;
    immediatePush(data: BreadcrumbData): void;
    shift(): boolean;
    clear(): void;
    getStack(): BreadcrumbData[];
    getCategory(type: EVENTTYPES): BREADCRUMBTYPES;
    bindOptions(options: InitOptions): void;
}
declare const breadcrumb: any;
export { breadcrumb };
