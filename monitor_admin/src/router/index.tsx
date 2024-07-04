/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, lazy, ComponentType } from 'react';
import { RouteObject } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarChartOutlined,
  OrderedListOutlined,
  FileSearchOutlined,
  RadarChartOutlined,
  MedicineBoxOutlined,
  ThunderboltOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import { Loading } from '@/src/components/loading';
const lazyLoad = (dynamicImport: () => Promise<{ default: ComponentType<any> }>) => {
  const Component = lazy(dynamicImport);
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export const munuRouters = [
  {
    path: '/',
    name: '应用列表',
    icon: AppstoreOutlined,
    element: lazyLoad(() => import('../pages/home')),
  },
];

export const hasAppRouters = [
  {
    path: '/issues',
    name: '错误日志',
    icon: BarChartOutlined,
    element: lazyLoad(() => import('../pages/issues')),
  },
  {
    path: '/visitorStats',
    name: '流量分析',
    icon: BarChartOutlined,
    element: lazyLoad(() => import('../pages/visitorStats')),
  },
  {
    path: '/performance',
    name: '性能分析',
    icon: ThunderboltOutlined,
    element: lazyLoad(() => import('../pages/performance')),
  },
  {
    path: '/performanceSearch',
    name: '首屏查询',
    icon: FileSearchOutlined,
    element: lazyLoad(() => import('../pages/performanceSearch')),
  },
  {
    path: '/httpError',
    name: '接口分析',
    icon: NodeIndexOutlined,
    element: lazyLoad(() => import('../pages/httpError')),
  },
  {
    path: '/httpSearch',
    name: '接口查询',
    icon: FileSearchOutlined,
    element: lazyLoad(() => import('../pages/httpSearch')),
  },
  {
    path: '/jsError',
    name: '健康情况',
    icon: MedicineBoxOutlined,
    element: lazyLoad(() => import('../pages/jsError')),
  },
  {
    path: '/topAnalyse',
    name: 'Top分析',
    icon: OrderedListOutlined,
    element: lazyLoad(() => import('../pages/topAnalyse')),
  },
  {
    path: '/geographicalDistribution',
    name: '地域分布',
    icon: RadarChartOutlined,
    element: lazyLoad(() => import('../pages/geographicalDistribution')),
  },
];

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: lazyLoad(() => import('../pages/login')),
  },
  {
    path: '/',
    element: lazyLoad(() => import('../pages/content')),
    children: [
      ...munuRouters,
      ...hasAppRouters,
      {
        path: '/*',
        element: lazyLoad(() => import('@/src/pages/notFound')),
      },
    ],
  },
  {
    path: '/test',
    element: lazyLoad(() => import('../pages/home')),
  },
  {
    path: '*',
    element: lazyLoad(() => import('@/src/pages/notFound')),
  },
];
