import { ReportData, BreadcrumbData } from './base';
export interface InitOptions {
    dsn: string;
    appId: string;
    userId?: string;
    disabled?: boolean;
    silentXhr?: boolean;
    silentFetch?: boolean;
    silentClick?: boolean;
    silentError?: boolean;
    silentUnhandledrejection?: boolean;
    silentHashchange?: boolean;
    silentHistory?: boolean;
    silentPerformance?: boolean;
    silentRecordScreen?: boolean;
    recordScreentime?: number;
    recordScreenTypeList?: string[];
    silentWhiteScreen?: boolean;
    skeletonProject?: boolean;
    whiteBoxElements?: string[];
    filterXhrUrlRegExp?: RegExp;
    useImgUpload?: boolean;
    throttleDelayTime?: number;
    overTime?: number;
    maxBreadcrumbs?: number;
    beforePushBreadcrumb?(data: BreadcrumbData): BreadcrumbData;
    beforeDataReport?(data: ReportData): Promise<ReportData | boolean>;
    getUserId?: () => string | number;
    handleHttpStatus?: (data: any) => boolean;
    repeatCodeError?: boolean;
}
export interface RecordScreenOption {
    recordScreenTypeList: string[];
    recordScreentime: number;
}
