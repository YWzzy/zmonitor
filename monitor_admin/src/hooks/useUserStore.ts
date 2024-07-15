import { useDispatch, useSelector } from 'react-redux';
import { RootState, Dispatch } from '@/src/models/store';
import { useCache } from './useCache';

export const useUserStore = () => {
  const dispatch = useDispatch<Dispatch>();

  const { userInfo, isLoading } = useSelector((state: RootState) => state.user);

  // 使用缓存 hook
  useCache({
    key: 'user',
    selector: (state: RootState) => state.user,
    updateAction: (data) => ({ type: 'user/updateUserModel', payload: data }),
  });

  return {
    userInfo,
    isLoading,
    userDispatch: dispatch.user,
  };
};
