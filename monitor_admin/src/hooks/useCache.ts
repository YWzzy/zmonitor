/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Dispatch } from '@/src/models/store';

type CacheOptions = {
  key: string;
  selector: (state: RootState) => any;
  updateAction: (data: any) => any;
  cacheDuration: number; // 以毫秒为单位的缓存有效时间
};

export const useCache = ({ key, selector, updateAction, cacheDuration }: CacheOptions) => {
  const dispatch = useDispatch<Dispatch>();
  const data = useSelector(selector);
  const isInitialLoad = useRef(true);

  // 加载本地缓存数据
  useEffect(() => {
    if (isInitialLoad.current) {
      const cachedData = localStorage.getItem(key);
      const cachedTimestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (cachedData && cachedTimestamp) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < cacheDuration) {
          dispatch(updateAction(parsedData));
        } else {
          // 缓存过期，清除缓存
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_timestamp`);
        }
      }

      isInitialLoad.current = false;
    }
  }, [dispatch, key, updateAction, cacheDuration]);

  // 保存数据到本地缓存
  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
    }
  }, [key, data]);
};
