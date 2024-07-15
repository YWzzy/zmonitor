import React from 'react';
// import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
// import { Dispatch } from '@/src/models/store';
import { Loading } from '@/src/components/loading';
import { useAppStore, useUserStore } from '@/src/hooks';

export const checkAppStatus = (Page: React.FunctionComponent) => () => {
  // const dispatch = useDispatch<Dispatch>();

  const location = useLocation();

  const { appDispatch, apps, isLoading } = useAppStore();
  const { userInfo, userDispatch } = useUserStore();

  React.useEffect(() => {
    userDispatch.getUserInfo();
  }, [userDispatch]);

  React.useEffect(() => {
    if (userInfo.account) {
      appDispatch.getAppListOnce(userInfo.account);
    }
  }, [userInfo.id, appDispatch]);

  if (!userInfo.id) {
    return <Loading />;
  }

  if (!isLoading && apps.length === 0 && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  return <Page />;
};
