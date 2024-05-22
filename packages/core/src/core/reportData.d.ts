import { Queue } from '@zmonitor/utils';
import { ReportData, InitOptions } from '@zmonitor/types';
/**
 * 用来上报数据，包含图片打点上报、xhr请求
 */
export declare class TransportData {
    queue: Queue;
    apikey: string;
    errorDsn: string;
    userId: string;
    uuid: string;
    beforeDataReport: any;
    getUserId: any;
    useImgUpload: boolean;
    constructor();
    beacon(url: string, data: any): boolean;
    imgRequest(data: ReportData, url: string): void;
    beforePost(this: any, data: ReportData): Promise<ReportData | boolean>;
    xhrPost(data: ReportData, url: string): Promise<void>;
    getAuthInfo(): {
        userId: string | number;
        sdkVersion: string;
        apikey: string;
    };
    getAuthId(): string | number;
    getTransportData(data: any): ReportData;
    isSdkTransportUrl(targetUrl: string): boolean;
    bindOptions(options: InitOptions): void;
    send(data: ReportData): Promise<void>;
}
declare const transportData: any;
export { transportData };
