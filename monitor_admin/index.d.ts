declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';

type BluBiuRes<T> = {
  code: number;
  message: string;
  data: T;
  total?: number;
};

type CustomResponse<T> = Promise<BluBiuRes<T>>;

type PerformanceInKey =
  | 'dnsTime'
  | 'tcpTime'
  | 'whiteTime'
  | 'FCP'
  | 'TTFB'
  | 'LCP'
  | 'FID'
  | 'requestTime';
