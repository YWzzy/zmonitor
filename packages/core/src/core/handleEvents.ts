import ErrorStackParser from 'error-stack-parser';
import {
  openWhiteScreen,
  transportData,
  breadcrumb,
  resourceTransform,
  httpTransform,
  options,
} from './index';
import { EVENTTYPES, STATUS_CODE } from '@zmonitor/common';
import {
  getErrorUid,
  hashMapExist,
  getTimestamp,
  parseUrlToObj,
  unknownToString,
} from '@zmonitor/utils';
import { ErrorTarget, RouteHistory, HttpData } from '@zmonitor/types';

const HandleEvents = {
  // 处理xhr、fetch回调
  handleHttp(data: HttpData, type: EVENTTYPES): void {
    const result = httpTransform(data);
    // 添加用户行为，去掉自身上报的接口行为
    if (!data.url.includes(options.dsn)) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(type),
        data: result,
        status: result.status,
        time: data.time,
      });
    }

    if (result.status === 'error') {
      // 上报接口错误
      transportData.send({ ...result, type, status: STATUS_CODE.ERROR });
    }
  },

  //  处理JavaScript 错误事件，包括资源加载错误和异步错误
  handleError(ev: ErrorTarget): void {
    const target = ev.target;
    // 如果是异步错误，target为空
    if (!target || (ev.target && !ev.target.localName)) {
      // vue和react捕获的报错使用ev解析，异步错误使用ev.error解析
      const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      const errorData = {
        type: EVENTTYPES.ERROR,
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        message: ev.message,
        fileName,
        line: lineNumber,
        column: columnNumber,
      };
      breadcrumb.push({
        type: EVENTTYPES.ERROR,
        category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        data: errorData,
        time: getTimestamp(),
        status: STATUS_CODE.ERROR,
      });
      const hash: string = getErrorUid(
        `${EVENTTYPES.ERROR}-${ev.message}-${fileName}-${columnNumber}`
      );
      // 开启repeatCodeError第一次报错才上报
      if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
        return transportData.send(errorData);
      }
    }

    // 资源加载报错
    if (target?.localName) {
      // 提取资源加载的信息
      const data = resourceTransform(target);
      breadcrumb.push({
        type: EVENTTYPES.RESOURCE,
        category: breadcrumb.getCategory(EVENTTYPES.RESOURCE),
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        data,
      });
      return transportData.send({
        ...data,
        type: EVENTTYPES.RESOURCE,
        status: STATUS_CODE.ERROR,
      });
    }
  },

  // 处理History路由变化
  handleHistory(data: RouteHistory): void {
    const { from, to } = data;
    // 定义parsedFrom变量，值为relative
    const { relative: parsedFrom } = parseUrlToObj(from);
    const { relative: parsedTo } = parseUrlToObj(to);
    breadcrumb.push({
      type: EVENTTYPES.HISTORY,
      category: breadcrumb.getCategory(EVENTTYPES.HISTORY),
      data: {
        from: parsedFrom ? parsedFrom : '/',
        to: parsedTo ? parsedTo : '/',
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK,
    });
  },

  // 处理hashchange路由变化
  handleHashchange(data: HashChangeEvent): void {
    const { oldURL, newURL } = data;
    const { relative: from } = parseUrlToObj(oldURL);
    const { relative: to } = parseUrlToObj(newURL);
    breadcrumb.push({
      type: EVENTTYPES.HASHCHANGE,
      category: breadcrumb.getCategory(EVENTTYPES.HASHCHANGE),
      data: {
        from,
        to,
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK,
    });
  },

  // 处理未捕获的Promise错误
  handleUnhandleRejection(ev: PromiseRejectionEvent): void {
    const stackFrame = ErrorStackParser.parse(ev.reason)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const message = unknownToString(ev.reason.message || ev.reason.stack);
    const data = {
      type: EVENTTYPES.UNHANDLEDREJECTION,
      status: STATUS_CODE.ERROR,
      time: getTimestamp(),
      message,
      fileName,
      line: lineNumber,
      column: columnNumber,
    };

    breadcrumb.push({
      type: EVENTTYPES.UNHANDLEDREJECTION,
      category: breadcrumb.getCategory(EVENTTYPES.UNHANDLEDREJECTION),
      time: getTimestamp(),
      status: STATUS_CODE.ERROR,
      data,
    });
    const hash: string = getErrorUid(
      `${EVENTTYPES.UNHANDLEDREJECTION}-${message}-${fileName}-${columnNumber}`
    );
    // 开启repeatCodeError第一次报错才上报
    if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
      transportData.send(data);
    }
  },

  // 处理白屏
  handleWhiteScreen(): void {
    openWhiteScreen((res: any) => {
      // 上报白屏检测信息
      transportData.send({
        type: EVENTTYPES.WHITESCREEN,
        time: getTimestamp(),
        ...res,
      });
    }, options);
  },
};
export { HandleEvents };
