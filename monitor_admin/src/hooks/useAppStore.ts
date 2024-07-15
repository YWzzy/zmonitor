import { useDispatch, useSelector } from 'react-redux';
import { RootState, Dispatch } from '@/src/models/store';
import { useCache } from './useCache';

export const useAppStore = () => {
  const dispatch = useDispatch<Dispatch>();

  const { apps, isLoading, active, showAddModal, showConfigModal, curConfAppId } = useSelector((state: RootState) => state.app);

  // 使用缓存 hook
  useCache({
    key: 'app',
    selector: (state: RootState) => state.app,
    updateAction: (data) => ({ type: 'app/updateAppModel', payload: data }),
    cacheDuration: 3600000 * 24, // 1 小时 * 24
  });

  return {
    apps,
    isLoading,
    active,
    showAddModal,
    showConfigModal,
    curConfAppId,
    appDispatch: dispatch.app,
  };
};
