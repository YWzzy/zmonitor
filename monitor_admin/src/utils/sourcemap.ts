/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import sourceMap from 'source-map-js';
import { message } from 'antd';

interface CodeDetail {
  source: string;
  line: number;
  column: number;
}

export default class SourceMapUtils {
  static matchStr(str: string): string | null {
    if (str.endsWith('.js')) return str.substring(str.lastIndexOf('/') + 1);
    return null;
  }

  static repalceAll(str: string): string {
    return str.replace(new RegExp(' ', 'gm'), '&nbsp;');
  }

  static getFileLink(str: string): string | null {
    const reg = /vue-loader-options!\.(.*)\?/;
    const res = str.match(reg);
    return res && Array.isArray(res) ? res[1] : null;
  }

  static async loadSourceMap(appId: string,fileName: string): Promise<string | null> {
    const file = fileName;
    const env = import.meta.env.VITE_ENV;

    // if (env === 'development') {
    //   file = this.getFileLink(fileName);
    // } else {
    //   file = this.matchStr(fileName);
    // }

    if (!file) return null;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/monitor/getmap?fileName=${file}&env=${env}&appId=${appId}`
      );
      console.log('response', response);
      
      return await response.json();
        // if (env == 'development') {
        //   return await response.text();
        // } else {
        //   return await response.json();
        // }
    } catch (error) {
      console.error('加载源码映射失败:', error);
      throw new Error(error);
    }
  }

  static async findCodeBySourceMap({
    appId,
    fileName,
    line,
    column,
  }: {
    appId: string;
    fileName: string;
    line: number;
    column: number;
  }): Promise<any> {
    try {
    const sourceData: any = await this.loadSourceMap(appId, fileName);

    if (!sourceData) return;

    let result: CodeDetail;
    let codeList: string[];

    if (import.meta.env.VITE_ENV == 'development') {
      const source = this.getFileLink(fileName);
      
      let isStart = false;
      result = {
        source,
        line: line + 1,
        column,
      };
      codeList = sourceData.split('\n').filter(item => {
        if (item.indexOf('<script') !== -1 || isStart) {
          isStart = true;
          return item;
        } else if (item.indexOf('</script') !== -1) {
          isStart = false;
        }
      });
    } else {
      const { sourcesContent, sources } = sourceData;
      const consumer = await new sourceMap.SourceMapConsumer(sourceData);
      result = consumer.originalPositionFor({
        line: Number(line),
        column: Number(column),
      });

      if (result.source && result.source.includes('node_modules')) {
        return message.error(`源码解析失败: 因为报错来自三方依赖，报错文件为 ${result.source}`);
      }

      let index = sources.indexOf(result.source);

      if (index === -1) {
        const copySources = JSON.parse(JSON.stringify(sources)).map(item =>
          item.replace(/\/.\//g, '/')
        );
        index = copySources.indexOf(result.source);
      }

      if (index === -1) {
        return message.error('源码解析失败');
      }

      const code = sourcesContent[index];
      codeList = code.split('\n');
    }

    const row = result.line;
    const len = codeList.length - 1;
    const start = row - 5 >= 0 ? row - 5 : 0;
    const end = start + 9 >= len ? len : start + 9;

    const newLines = [];
    let hightLine = 0;
    for (let i = start; i <= end; i++) {
      if (i + 1 === row) {
        hightLine = i;
      }
      newLines.push(codeList[i]);
    }

    const info = {
      code: newLines,
      originalPosition: {
        source: result.source,
        line: result.line - 1,
        column: result.column,
        name: '',
        hightLine: hightLine,
      },
      start: start,
      end: end,
    };

    if (result.hasOwnProperty('name')) {
      info.originalPosition.name = result['name'];
    }

    console.log('info', info);

    return info;
    } catch (error) {
      console.error('findCodeBySourceMap error:', error);
      throw new Error(error);
    }
  }
}
