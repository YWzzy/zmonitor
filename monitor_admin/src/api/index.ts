/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { message } from 'antd';
// import { config } from '@/src/config';

let isShowNoLogin = false;

enum BluBiuResponseCode {
  SUCCESS = 200, // 非异常请求
  QUERYERROR = 1001, // 请求参数错误
  APPIDNOUSE = 1002, // APPID错误或者AppID未启用
  LOGINERROR = 1003, // 登录账号或密码错误
  ACCOUNTEXIST = 1004, // 该账号已被注
  NOLOGIN = 1005, // 登录已过期
  NOTFOUNDACCOUNT = 1006, // 没有找到用户信息
  BUSSNIESS = 400, // 业务异常400
}

export const http = axios.create({
  baseURL: `/api/`,
  // baseURL: `${config.apiHost}/`,
  withCredentials: true,
});

http.interceptors.response.use(({ data, status }) => {
  const statusCode = data['code'] || status;
  if (statusCode !== 200) {
    message.error('网络异常');
    return data;
  }
  const res = data as BluBiuRes<any>;
  if (!data['code'] && (status == 200 || status == 304)) {
    return res;
  }

  if (res.code === BluBiuResponseCode.NOLOGIN || res.code === BluBiuResponseCode.NOTFOUNDACCOUNT) {
    if (!isShowNoLogin) {
      window.location.href = '/login';
      message.error(res.message);
      isShowNoLogin = true;
      throw Error(res.message);
    }
  }

  if (res.code !== BluBiuResponseCode.SUCCESS) {
    message.error(res.message);
    throw Error(res.message);
  }

  return res;
});

export const login = async (params: LoginRegsiterIn): BluBiuResponse<any> =>
  await http.post('/login', params);

export const loginOut = async (): BluBiuResponse<any> => await http.post('/loginOut');

export const register = async (params: LoginRegsiterIn): BluBiuResponse<any> =>
  await http.post('/register', params);

export const getUserInfo = async (): BluBiuResponse<UserInfo> => await http.get('/getUserInfo');

export const getAppList = async (): BluBiuResponse<AppInfo[]> =>
  await http.get('/applications/getAppList');

export const createApp = async (params: CreateAppIn): BluBiuResponse<any> =>
  await http.post('/applications/createApp', params);

export const updateAppStatus = async (params: UpdateAppInfo): BluBiuResponse<any> =>
  await http.post('/applications/updateAppStatus', params);

export const getWebVisitTop = async (params: TopReq): BluBiuResponse<Options[]> =>
  await http.get('/analyse/getWebVisitTop', { params });

export const getNewUsers = async (params: AnalyseReq): BluBiuResponse<number> =>
  await http.get('/analyse/getNewUsers', { params });

export const getAllUsers = async (params: AnalyseReq): BluBiuResponse<number> =>
  await http.get('/analyse/getAllUsers', { params });

export const getTodayTraffic = async (appId: string): BluBiuResponse<TodayTrafficRes> =>
  await http.get('/analyse/getTodayTraffic', { params: { appId } });

export const getTrafficTimes = async (params: TrafficTimesReq): BluBiuResponse<TrafficTimesRes> =>
  await http.get('/traffic/getTrafficTimes', { params });

export const getTrafficDays = async (params: TrafficDaysReq): BluBiuResponse<TrafficTimesRes> =>
  await http.get('/traffic/getTrafficDays', { params });

export const getDayActiveUsers = async (params: AnalyseReq): BluBiuResponse<number> =>
  await http.get('/analyse/getDayActiveUsers', { params });

export const getActiveUsers = async (params: AnalyseReq): BluBiuResponse<Options[]> =>
  await http.get('/analyse/getActiveUsers', { params });

export const getAppAvgPerformance = async (appId: string): BluBiuResponse<PerformanceInValue> =>
  await http.get(`/performance/getAppAvgPerformance?appId=${appId}`);

export const getPageAvgPerformance = async (
  params: AnalyseReq
): BluBiuResponse<PerformanceInPage & PerformanceInValue[][]> =>
  await http.get('/performance/getPageAvgPerformance', { params });

export const getPerformance = async (
  params: GetPerformanceReq
): BluBiuResponse<GetPerformanceRes> => await http.get('/performance/getPerformance', { params });

// 根据ids查询资源
export const getResourcesByPerformanceIds = async (data) =>
  await http.post('/performance/resources', data);

export const getHttpErrorRank = async (params: AnalyseReq): BluBiuResponse<HttpErrorRankRes[]> =>
  await http.get('/httpError/getHttpErrorRank', { params });

export const getHttpDoneRank = async (params: AnalyseReq): BluBiuResponse<HttpErrorRankRes[]> =>
  await http.get('/httpError/getHttpDoneRank', { params });

export const getHttpErrorRang = async (params: AnalyseReq): BluBiuResponse<Options[]> =>
  await http.get('/httpError/getHttpErrorRang', { params });

export const getHttpList = async (params: GetHttpListReq): BluBiuResponse<GetHttpListRes> =>
  await http.get('/httpError/getHttpList', { params });

export const getJsErrorRang = async (params: AnalyseReq): BluBiuResponse<Options[]> =>
  await http.get('/jsError/getJsErrorRang', { params });

export const getZMonitorJsErrorRang = async (params: AnalyseReq): BluBiuResponse<Options[]> =>
  await http.get('/error-monitor/getJsErrorRange', { params });

export const getJsErrorList = async (params: AnalyseReq): BluBiuResponse<JsErrorMsgItem[]> =>
  await http.get('/jsError/getJsErrorList', { params });

// 查询所有错误
export const getIssueErrorList = async (params: any): BluBiuResponse<ErrorMsgItem[]> =>
  await http.get('/monitor/getErrorList', { params });

// 查询错误列表 -分页
export const getIssueErrorListPage = async (params: any): BluBiuResponse<IssuesListPageRes> =>
  await http.get('/monitor/getErrorListPage', { params });

// 查询错误源码
export const getCodeBySourceMap = async (params: any): BluBiuResponse<any> =>
  await http.get('/monitor/getmap', { params });

// 查询录屏文件
export const getRecordScreenFile = async (params: any): BluBiuResponse<any> =>
  await http.get('/monitor/getRecordScreenId', { params });

export const getNearbyCode = async (formateData: FormData): BluBiuResponse<NearbyCodeMsg> =>
  await http.post('/jsError/getNearbyCode', formateData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
