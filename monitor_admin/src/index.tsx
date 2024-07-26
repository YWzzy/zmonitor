import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/src/app';
import zMonitor from '@zmonitor/core';
import performance from '@zmonitor/performance';
import recordscreen from '@zmonitor/recordscreen';
import './index.css';

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

const root = ReactDOM.createRoot(document.getElementById('root'));

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
