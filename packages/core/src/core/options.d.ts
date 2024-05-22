import { InitOptions } from '@zmonitor/types';
export declare class Options {
    dsn: string;
    throttleDelayTime: number;
    overTime: number;
    whiteBoxElements: string[];
    silentWhiteScreen: boolean;
    skeletonProject: boolean;
    filterXhrUrlRegExp: any;
    handleHttpStatus: any;
    repeatCodeError: boolean;
    constructor();
    bindOptions(options: InitOptions): void;
}
declare const options: any;
export declare function handleOptions(paramOptions: InitOptions): void;
export { options };
