import ErrorStackParser from 'error-stack-parser';
import { transportData } from './reportData';
import { breadcrumb } from './breadcrumb';
import { EVENTTYPES, STATUS_CODE } from '@zmonitor/common';
import { isError, getTimestamp, unknownToString } from '@zmonitor/utils';

// 自定义上报事件-手动上报
export function log({ message = 'customMsg', error = '', type = EVENTTYPES.CUSTOM }: any): void {
  try {
    let errorInfo = {};
    if (isError(error)) {
      const result = ErrorStackParser.parse(!error.target ? error : error.error || error.reason)[0];
      errorInfo = { ...result, line: result.lineNumber, column: result.columnNumber };
    }
    // 记录用户行为
    breadcrumb.push({
      type,
      status: STATUS_CODE.ERROR,
      category: breadcrumb.getCategory(EVENTTYPES.CUSTOM),
      data: unknownToString(message),
      time: getTimestamp(),
    });

    // 上报自定义事件
    transportData.send({
      type,
      status: STATUS_CODE.ERROR,
      message: unknownToString(message),
      time: getTimestamp(),
      ...errorInfo,
    });
  } catch (err) {
    console.log('上报自定义事件时报错：', err);
  }
}
