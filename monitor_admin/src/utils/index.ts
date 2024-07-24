import { message } from 'antd';
import { getAppIp } from '@/src/api';

export function copyTextToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand('copy');

  document.body.removeChild(textarea);
  message.success('已复制');
}

// 解析url域名
export function parseUrl(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

// 解析url路径，不附带hostname和请求参数
export function parseUrlPath(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.pathname;
}

// 获取当前项目的IP地址
export const getProjectIp = async () => {
  const ip = await getAppIp();
  return ip.data? ip.data.ip : 'unkown';
};

/**
 * 从URL中提取文件名
 * @param {string} url - 完整的URL
 * @returns {string} - 提取的文件名
 */
export const extractFileName =(url: string, isSourceMap: boolean) => {
  // 使用URL构造函数解析URL
  const parsedUrl = new URL(url);
  // 获取路径名
  const pathname = parsedUrl.pathname;
  // 返回最后一个斜杠之后的部分，即文件名
  const nodeFileName = pathname.substring(pathname.lastIndexOf('/') + 1);
  return isSourceMap ? nodeFileName + '.map' : nodeFileName;
}