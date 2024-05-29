/*
 * @Author: yinhan 1738348915@qq.com
 * @Date: 2024-05-24 13:48:06
 * @LastEditors: yinhan 1738348915@qq.com
 * @LastEditTime: 2024-05-24 14:30:53
 * @FilePath: \zjiang-web-monitor\desktop\src\sdk\utils.ts
 * @Description:
 */
export const generateShortUUID = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let shortUUID = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUUID += characters.charAt(randomIndex);
  }

  return shortUUID + Date.now();
};

export const getUrlQuery = () => {
  const isHash = location.hash;
  if (isHash) {
    const link = location.hash.replace('#', '');
    const [pageUrl, query] = link.split('?');
    return {
      pageUrl,
      query: query || '',
      domain: location.host,
    };
  } else {
    return {
      query: location.search.replace('?', '') || '',
      pageUrl: location.pathname,
      domain: location.host,
    };
  }
};
