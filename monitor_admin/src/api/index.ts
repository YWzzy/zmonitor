/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { message } from 'antd';
// import { config } from '@/src/config';

let isShowNoLogin = false;

enum CustomResponseCode {
  SUCCESS = 200, // 非异常请求
  QUERYERROR = 1001, // 请求参数错误
  APPIDNOUSE = 1002, // APPID错误或者AppID未启用
  LOGINERROR = 1003, // 登录账号或密码错误
  ACCOUNTEXIST = 1004, // 该账号已被注
  NOLOGIN = 1005, // 登录已过期
  NOTFOUNDACCOUNT = 1006, // 没有找到用户信息
  BUSSNIESS = 800, // 业务异常800
}

export const http = axios.create({
  baseURL: `/api/`,
  // baseURL: `${config.apiHost}/`,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => {
    const { data, status } = response;
    if (status !== 200 && status !== 304 && status !== 201) {
      message.error('网络异常');
      return data;
    }
    const res = data as BluBiuRes<any>;
    if (!data['code'] && (status == 200 || status == 304)) {
      return res;
    }

    if (res.code !== CustomResponseCode.SUCCESS) {
      message.error(res.message);
      throw new Error(res.message);
    }

    return res;
  },
  (error) => {
    const { response } = error;
    if (response) {
      response?.data?.message ? message.error(`请求错误: ${response.status} - ${response.statusText} - ${response?.data?.message}`) : message.error(`请求错误: ${response.status} - ${response.statusText}`);
      const res = response.data as BluBiuRes<any>;
      if (res.code === CustomResponseCode.NOLOGIN || res.code === CustomResponseCode.NOTFOUNDACCOUNT) {
        if (!isShowNoLogin) {
          window.location.href = '/login';
          message.error(res.message);
          isShowNoLogin = true;
          throw new Error(res.message);
        }
      }
      return Promise.reject(res);
    } else {
      message.error('网络异常');
      return Promise.reject(error);
    }
  }
);

export const login = async (params: LoginRegsiterIn): CustomResponse<any> =>
  await http.post('/user/login', params);

export const loginOut = async (): CustomResponse<any> => await http.post('/user/loginOut');

export const register = async (params: LoginRegsiterIn): CustomResponse<any> =>
  await http.post('/user/register', params);

export const getUserInfo = async (): CustomResponse<UserInfo> => await http.get('/user/getUserInfo');

export const getAppList = async (params): CustomResponse<AppInfo[]> => {
  const data = {
    userKey: params,
  }
  return await http.get('/applications/getAppList', {params: data});
}

export const createApp = async (params: CreateAppIn): CustomResponse<any> =>
  await http.post('/applications/createApp', params);

export const updateAppStatus = async (params: UpdateAppInfo): CustomResponse<any> =>
  await http.post('/applications/updateAppStatus', params);

export const getWebVisitTop = async (params: TopReq): CustomResponse<Options[]> =>
  await http.get('/analyse/getWebVisitTop', { params });

export const getNewUsers = async (params: AnalyseReq): CustomResponse<number> =>
  await http.get('/analyse/getNewUsers', { params });

export const getAllUsers = async (params: AnalyseReq): CustomResponse<number> =>
  await http.get('/analyse/getAllUsers', { params });

export const getTodayTraffic = async (appId: string): CustomResponse<TodayTrafficRes> =>
  await http.get('/analyse/getTodayTraffic', { params: { appId } });

export const getTrafficTimes = async (params: TrafficTimesReq): CustomResponse<TrafficTimesRes> =>
  await http.get('/traffic/getTrafficTimes', { params });

export const getTrafficDays = async (params: TrafficDaysReq): CustomResponse<TrafficTimesRes> =>
  await http.get('/traffic/getTrafficDays', { params });

export const getDayActiveUsers = async (params: AnalyseReq): CustomResponse<number> =>
  await http.get('/analyse/getDayActiveUsers', { params });

export const getActiveUsers = async (params: AnalyseReq): CustomResponse<Options[]> =>
  await http.get('/analyse/getActiveUsers', { params });

export const getAppAvgPerformance = async (appId: string): CustomResponse<PerformanceInValue> =>
  await http.get(`/performance/getAppAvgPerformance?appId=${appId}`);

export const getPageAvgPerformance = async (
  params: AnalyseReq
): CustomResponse<PerformanceInPage & PerformanceInValue[][]> =>
  await http.get('/performance/getPageAvgPerformance', { params });

export const getPerformance = async (
  params: GetPerformanceReq
): CustomResponse<GetPerformanceRes> => await http.get('/performance/getPerformance', { params });

// 根据ids查询资源
export const getResourcesByPerformanceIds = async data =>
  await http.post('/performance/resources', data);

export const getHttpErrorRank = async (params: AnalyseReq): CustomResponse<HttpErrorRankRes[]> =>
  await http.get('/httpError/getHttpErrorRank', { params });

export const getHttpDoneRank = async (params: AnalyseReq): CustomResponse<HttpErrorRankRes[]> =>
  await http.get('/httpError/getHttpDoneRank', { params });

export const getHttpErrorRang = async (params: AnalyseReq): CustomResponse<Options[]> =>
  await http.get('/httpError/getHttpErrorRang', { params });

export const getHttpList = async (params: GetHttpListReq): CustomResponse<GetHttpListRes> =>
  await http.get('/httpError/getHttpList', { params });

//接口查询 - 异常请求数据
export const getZMonitorHttpList = async (params): CustomResponse<GetHttpListRes> =>
  await http.get('/monitor/getHttpErrorListPage', { params });

export const getJsErrorRang = async (params: AnalyseReq): CustomResponse<Options[]> =>
  await http.get('/jsError/getJsErrorRang', { params });

export const getZMonitorJsErrorRang = async (params: AnalyseReq): CustomResponse<Options[]> =>
  await http.get('/error-monitor/getJsErrorRange', { params });

export const getJsErrorList = async (params: AnalyseReq): CustomResponse<JsErrorMsgItem[]> =>
  await http.get('/jsError/getJsErrorList', { params });

// 查询所有错误
export const getIssueErrorList = async (params: any): CustomResponse<ErrorMsgItem[]> =>
  await http.get('/monitor/getErrorList', { params });

// 查询错误列表 -分页
export const getIssueErrorListPage = async (params: any): CustomResponse<IssuesListPageRes> =>
  await http.get('/monitor/getErrorListPage', { params });

// 查询错误源码
export const getCodeBySourceMap = async (params: any): CustomResponse<any> =>
  await http.get('/monitor/getmap', { params });

// 查询录屏文件
export const getRecordScreenFile = async (params: any): CustomResponse<any> =>
  await http.get('/monitor/getRecordScreenId', { params });

export const getNearbyCode = async (formateData: FormData): CustomResponse<NearbyCodeMsg> =>
  await http.post('/jsError/getNearbyCode', formateData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
