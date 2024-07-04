/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import sourceMap from 'source-map-js';
import { message } from 'antd';
import { getCodeBySourceMap } from '@/src/api';

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

  static async loadSourceMap(fileName: string): Promise<any> {
    let file;
    file = fileName;
    // const env = process.env.NODE_ENV;

    // if (env === 'development') {
    //   file = this.getFileLink(fileName);
    // } else {
    //   file = this.matchStr(fileName);
    // }

    if (!file) return null;

    try {
      return await getCodeBySourceMap({
        fileName: file,
        env: 'production',
      });
    } catch (error) {
      console.error('加载源码映射失败:', error);
      return null;
    }
  }

  static async findCodeBySourceMap({
    fileName,
    line,
    column,
  }: {
    fileName: string;
    line: number;
    column: number;
  }): Promise<any> {
    console.log('fileName', fileName, 'line', line, 'column', column);

    const sourceData: any = await this.loadSourceMap(fileName);
    console.log('sourceData', sourceData);
    if (!sourceData) return;

    let result: CodeDetail;
    let codeList: string[];

    if (process.env.NODE_ENV === 'development') {
      const source = this.matchStr(fileName);
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
    for (let i = start; i <= end; i++) {
      newLines.push(
        `<div class="code-line ${i + 1 === row ? 'heightlight' : ''}" title="${
          i + 1 === row ? result.source : ''
        }">
          ${i + 1}. ${this.repalceAll(codeList[i])}
        </div>`
      );
    }

    const innerHTML = `
      <div class="errdetail">
        <div class="errheader">${result.source} at line ${result.column}:${row}</div>
        <div class="errdetail">${newLines.join('')}</div>
      </div>
    `;

    return innerHTML;
  }
}
