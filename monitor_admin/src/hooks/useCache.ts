/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Dispatch } from '@/src/models/store';

type CacheOptions = {
  key: string;
  selector: (state: RootState) => any;
  updateAction: (data: any) => any;
};

export const useCache = ({ key, selector, updateAction }: CacheOptions) => {
  const dispatch = useDispatch<Dispatch>();
  const data = useSelector(selector);
  const isInitialLoad = useRef(true);

  // 加载本地缓存数据
  useEffect(() => {
    if (isInitialLoad.current) {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        dispatch(updateAction(parsedData));
      }
      isInitialLoad.current = false;
    }
  }, [dispatch, key, updateAction]);

  // 保存数据到本地缓存
  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [key, data]);
};
