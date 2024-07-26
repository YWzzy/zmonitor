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

const dsn = import.meta.env.VITE_ZMONITOR_DSN;
const projectVersion = import.meta.env.VITE_VERSION;
const projectEnv = import.meta.env.VITE_ENV;
const userId = import.meta.env.VITE_USERID;
const isSourceMap = import.meta.env.VITE_ISSOURCEMAP === 'true' ? true : false;

zMonitor.init({
  dsn,
  appId: import.meta.env.VITE_APPID,
  appSecret: import.meta.env.VITE_APPSECRET,
  appSecretKey: import.meta.env.VITE_APPSECRET_KEY,
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  reportErrorsOnly: false,
  userId,
  getProjectConfig() {
    return {
      projectEnv,
      projectVersion,
      projectIp: import.meta.env.VITE_SERVER_IP,
      isSourceMap,
    }
  },
});

zMonitor.use(performance, null);
zMonitor.use(recordscreen, { recordScreentime: 20 });


// new Monitor({
//   appId: 'wgnfezuv1706513953473',
//   api: 'http://localhost:9001/report',
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
// xhr.open('post', 'http://localhost:9001/api/desktop/updateAppStatus', true);
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
