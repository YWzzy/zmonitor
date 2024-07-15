import { createModel } from '@rematch/core';
import type { RootModel } from '.';
import { getAppList } from '@/src/api';

const appModel = createModel<RootModel>()({
  state: {
    apps: [] as AppInfo[],  // 存储应用程序列表
    isLoading: true,        // 指示是否正在加载数据
    showAddModal: false,    // 控制是否显示添加应用的模态框
    active: '',             // 当前活跃的应用程序 ID
  },
  // 同步操作
  reducers: {
    updateAppModel(state, newState) {
      return {
        ...state,
        ...newState,
      };
    },
    updateActive(state, active) {
      return {
        ...state,
        active,
      };
    },
    updateAddModalStatus(state, show) {
      return {
        ...state,
        showAddModal: show,
      };
    },
  },
  // 异步操作
  effects: dispatch => ({
    // 获取应用列表
    async getAppList(userKey: string) {
      dispatch.app.updateAppModel({
        isLoading: true,
      });
      const cachedAppData = localStorage.getItem('app');
      const parsedData = JSON.parse(cachedAppData || '{}');
      if(parsedData && parsedData.apps.length > 0) {
        const parsedData = JSON.parse(cachedAppData);
        dispatch.app.updateAppModel({
          isLoading: false,
          apps: parsedData.apps,
          active: parsedData.active,
        });
        return;
      } else {
        const { code, data } = await getAppList(userKey);
        if (data.length === 1) {
          dispatch.app.updateAppModel({
            isLoading: false,
            apps: code === 200 ? data : [],
            active: data[0].appId,
          });
        } else {
          dispatch.app.updateAppModel({
            isLoading: false,
            apps: code === 200 ? data : [],
          });
        }
      }
    },
    // 首次进入应用时调用，异步获取应用程序列表
    async getAppListOnce(userKey: string) {
      dispatch.app.updateAppModel({
        isLoading: true,
      });
      const cachedAppData = localStorage.getItem('app');
      const parsedData = JSON.parse(cachedAppData || '{}');
      if(parsedData && parsedData.apps.length > 0) {
        dispatch.app.updateAppModel({
          isLoading: false,
          apps: parsedData.apps,
          active: parsedData.active,
        });
        return;
      } else {
        const { code, data } = await getAppList(userKey);
        dispatch.app.updateAppModel({
          isLoading: false,
          apps: code === 200 ? data : [],
          active: data.length > 0 ? data[0].appId : '',
        });
      }
    },
  }),
});

export default appModel;
