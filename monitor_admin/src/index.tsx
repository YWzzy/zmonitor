import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
// import { Monitor } from './sdk';
import App from '@/src/app';
import './index.css';
import zMonitor from '@zmonitor/core';
import performance from '@zmonitor/performance';
import recordscreen from '@zmonitor/recordscreen';

zMonitor.init({
  dsn: 'http://222.71.83.59:9001/api/monitor/reportData',
  appId: '7845254399804114',
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  userId: '88888888',
});

zMonitor.use(performance, null);
zMonitor.use(recordscreen, { recordScreentime: 20 });

// new Monitor({
//   appId: 'wgnfezuv1706513953473',
//   api: 'http://localhost:8083/report',
//   cacheMax: 1,
//   webVitalsTimeouts: 10000,
// });

const root = ReactDOM.createRoot(document.getElementById('root'));

// const xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
//   if (xhr.readyState === 4 && xhr.status === 200) {
//     // 在这里处理请求完成后的逻辑
//     console.log('请求参数：', xhr.responseText);
//   }
// };

// // 设置请求参数
// const params = {
//   a: 1,
// };
// xhr.open('post', 'http://localhost:8083/api/desktop/updateAppStatus', true);
// xhr.send(JSON.stringify(params));

root.render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      components: {
        Menu: {
          iconSize: 16,
          subMenuItemBg: '#4684ff',
          // 菜单项背景
          darkItemBg: '#4684ff',
          // 菜单项文字颜色
          darkItemColor: 'white',
          // 菜单项文字hover颜色
          darkItemHoverBg: 'rgba(255,255,255,0.2)',
          // 菜单项文字颜色Hover颜色
          darkItemHoverColor: 'rgba(255,255,255,0.8)',
          // 菜单项选中背景
          darkItemSelectedBg: 'rgba(255, 255, 255,0.5)',
          // 菜单项选中颜色
          darkItemSelectedColor: 'white',
          darkSubMenuItemBg: '#4684ff',
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
);
