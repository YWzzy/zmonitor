/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Dispatch } from '@/src/models/store';

type CacheOptions = {
  key: string; // localStorage 的 key
  selector: (state: RootState) => any; // 从 Redux state 中选择需要缓存的部分
  updateAction: (data: any) => any; // 更新 Redux state 的 action creator
};

export const useCache = ({ key, selector, updateAction }: CacheOptions) => {
  const dispatch = useDispatch<Dispatch>();
  const data = useSelector(selector);

  // 加载本地缓存数据
  useEffect(() => {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      dispatch(updateAction(parsedData));
    }
  }, [dispatch, key, updateAction]);

  // 保存数据到本地缓存
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);
};

// // 使用示例：缓存 app 模块的数据
// export const useAppCache = () => {
//   useCache({
//     key: 'app',
//     selector: (state: RootState) => state.app,
//     updateAction: (data) => ({ type: 'app/updateAppModel', payload: data }),
//   });
// };

// // 使用示例：缓存 user 模块的数据
// export const useUserCache = () => {
//   useCache({
//     key: 'user',
//     selector: (state: RootState) => state.user,
//     updateAction: (data) => ({ type: 'user/updateUserModel', payload: data }),
//   });
// };
