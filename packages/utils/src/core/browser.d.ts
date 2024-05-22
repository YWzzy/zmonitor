/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export declare function htmlElementAsString(target: HTMLElement): string;
/**
 * 将地址字符串转换成对象，
 * 输入：'https://github.com/xy-sea/web-see?token=123&name=11'
 * 输出：{
 *  "host": "github.com",
 *  "path": "/xy-sea/web-see",
 *  "protocol": "https",
 *  "relative": "/xy-sea/web-see?token=123&name=11"
 * }
 */
export declare function parseUrlToObj(url: string): {
    host?: undefined;
    path?: undefined;
    protocol?: undefined;
    relative?: undefined;
} | {
    host: string;
    path: string;
    protocol: string;
    relative: string;
};
export declare function setSilentFlag({ silentXhr, silentFetch, silentClick, silentHistory, silentError, silentHashchange, silentUnhandledrejection, silentWhiteScreen, }: {
    silentXhr?: boolean | undefined;
    silentFetch?: boolean | undefined;
    silentClick?: boolean | undefined;
    silentHistory?: boolean | undefined;
    silentError?: boolean | undefined;
    silentHashchange?: boolean | undefined;
    silentUnhandledrejection?: boolean | undefined;
    silentWhiteScreen?: boolean | undefined;
}): void;
export declare function getErrorUid(input: string): string;
export declare function hashMapExist(hash: string): boolean;
