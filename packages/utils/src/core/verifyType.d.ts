/**
 * 检测变量类型
 * @param type
 */
export declare const variableTypeDetection: {
    isNumber: (value: any) => boolean;
    isString: (value: any) => boolean;
    isBoolean: (value: any) => boolean;
    isNull: (value: any) => boolean;
    isUndefined: (value: any) => boolean;
    isSymbol: (value: any) => boolean;
    isFunction: (value: any) => boolean;
    isObject: (value: any) => boolean;
    isArray: (value: any) => boolean;
    isProcess: (value: any) => boolean;
    isWindow: (value: any) => boolean;
};
export declare function isError(error: Error): boolean;
/**
 * 检查是否是空对象
 */
export declare function isEmptyObject(obj: object): boolean;
export declare function isEmpty(wat: any): boolean;
export declare function isExistProperty(obj: any, key: any): boolean;
