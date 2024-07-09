import { message } from 'antd';

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
