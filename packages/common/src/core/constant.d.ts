/**
 * 接口错误状态
 */
export declare enum SpanStatus {
    Ok = "ok",
    DeadlineExceeded = "deadline_exceeded",
    Unauthenticated = "unauthenticated",
    PermissionDenied = "permission_denied",
    NotFound = "not_found",
    ResourceExhausted = "resource_exhausted",
    InvalidArgument = "invalid_argument",
    Unimplemented = "unimplemented",
    Unavailable = "unavailable",
    InternalError = "internal_error",
    UnknownError = "unknown_error",
    Cancelled = "cancelled",
    AlreadyExists = "already_exists",
    FailedPrecondition = "failed_precondition",
    Aborted = "aborted",
    OutOfRange = "out_of_range",
    DataLoss = "data_loss"
}
/**
 * 用户行为
 */
export declare enum BREADCRUMBTYPES {
    HTTP = "Http",
    CLICK = "Click",
    RESOURCE = "Resource_Error",
    CODEERROR = "Code_Error",
    ROUTE = "Route",
    CUSTOM = "Custom"
}
/**
 * 状态
 */
export declare enum STATUS_CODE {
    ERROR = "error",
    OK = "ok"
}
/**
 * 事件类型
 */
export declare enum EVENTTYPES {
    XHR = "xhr",
    FETCH = "fetch",
    CLICK = "click",
    HISTORY = "history",
    ERROR = "error",
    HASHCHANGE = "hashchange",
    UNHANDLEDREJECTION = "unhandledrejection",
    RESOURCE = "resource",
    DOM = "dom",
    VUE = "vue",
    REACT = "react",
    CUSTOM = "custom",
    PERFORMANCE = "performance",
    RECORDSCREEN = "recordScreen",
    WHITESCREEN = "whiteScreen"
}
export declare enum HTTPTYPE {
    XHR = "xhr",
    FETCH = "fetch"
}
export declare enum HTTP_CODE {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401
}
export declare enum EMethods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}
