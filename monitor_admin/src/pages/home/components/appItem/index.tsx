import React from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
// import cls from 'classnames';
import { useNavigate } from 'react-router';
import { PeropleCounter, Loading, NewUserLine } from '@/src/components';
import { updateAppStatus } from '@/src/api';
import { copyTextToClipboard } from '@/src/utils';
import { useAppStore, useAppInfo, useUserStore } from '@/src/hooks';

interface AppItemIn {
  appInfo: AppInfo;
}

export const AppItem: React.FC<AppItemIn> = ({ appInfo }) => {
  const { appDispatch } = useAppStore();
  const { appStatus, loading } = useAppInfo(appInfo.appId);
  const { userInfo } = useUserStore();
  const navigate = useNavigate();

  const { activeUsers, allUsers, newUsers, lastWeekActiveUers } = appStatus;

  const updateApp = async () => {
    await updateAppStatus({
      appId: appInfo.appId,
      id: appInfo.id,
      appStatus: appInfo.appStatus === 1 ? 0 : 1,
    });
    await appDispatch.updateNeedFetch(true);
    await appDispatch.getAppList(userInfo.account);
    message.success(appInfo.appStatus === 1 ? '已停用' : '已启用');
  };

  return (
    <div className="w-full md:w-[45%] bg-[url('../../../../images/card-bg.png')] bg-no-repeat bg-top bg-[#fcfcfc] bg-[length:100%_auto] bg-white rounded-lg shadow-md border border-[#f0f0f0] mb-4 md:mr-4 p-2 pt-0 box-border relative overflow-hidden">
      {loading ? (
        <Loading style={{ width: '100%', height: 150, margin: 'auto 0' }} />
      ) : (
        <>
          <div className="h-12 leading-[50px] text-[#363b52] text-base font-bold">
            {appInfo.appName}
            <Tooltip placement="top" title="复制AppId">
              <CopyOutlined
                className="mt-5 ml-2 text-orange-500 cursor-pointer"
                onClick={() => {
                  copyTextToClipboard(appInfo.appId);
                }}
              />
            </Tooltip>
            <span
              className="float-right px-2 mt-3 ml-2 text-sm leading-6 text-green-500 border border-green-500 rounded cursor-pointer"
              onClick={() => {
                appDispatch.updateConfigApp(appInfo.appId)
              }}
            >
              配置
            </span>
            <span
              className="float-right mt-3 cursor-pointer px-2 border border-[#1677ff] text-[#1677ff] text-sm rounded ml-2 leading-6"
              onClick={async () => {
                await appDispatch.updateActive(appInfo.appId);
                navigate('/jsError');
              }}
            >
              进入
            </span>
            {appInfo.appStatus === 1 && (
              <span
                className="float-right px-2 mt-3 ml-2 text-sm leading-6 text-red-500 border border-red-500 rounded cursor-pointer"
                onClick={() => {
                  updateApp();
                }}
              >
                停用
              </span>
            )}
          </div>
            <div className="box-border flex flex-wrap p-4 h-[180px] md:h-[100px]">
              <div className="flex flex-col w-1/3 h-[60px] md:h-full md:w-1/5 mb-2 md:mb-0">
                <span className="text-[#a3a5b0] text-sm h-4 mb-1">用户总数</span>
                <span className="flex-1">
                  <PeropleCounter count={allUsers} />
                </span>
              </div>
              <div className="flex flex-col w-1/3 h-[60px] md:h-full md:w-1/5 mb-2 md:mb-0">
                <span className="text-[#a3a5b0] text-sm h-4 mb-1">今日活跃</span>
                <span className="flex-1">
                  <PeropleCounter count={activeUsers} />
                </span>
              </div>
              <div className="flex flex-col w-1/3 h-[60px] md:h-full md:w-1/5">
                <span className="text-[#a3a5b0] text-sm h-4 mb-1">新用户数</span>
                <span className="flex-1">
                  <PeropleCounter count={newUsers} />
                </span>
              </div>
              <div className="flex flex-col w-full h-[60px] md:h-full mt-2 md:w-2/5 md:mt-0">
                <span className="text-[#a3a5b0] text-sm h-4 mb-1">一周活跃趋势</span>
                <span className="flex-1 pt-2">
                  <NewUserLine data={lastWeekActiveUers} />
                </span>
              </div>
            </div>
        </>
      )}
      {appInfo.appStatus !== 1 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-35">
          <span className="text-center text-white">
            <div className="mb-2 text-sm">应用已关闭，点击重新开启</div>
            <Button type="primary" onClick={updateApp}>
              立即开启
            </Button>
          </span>
        </div>
      )}
    </div>
  );
};