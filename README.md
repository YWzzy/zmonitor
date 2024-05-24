<div align="center">
    <a href="#" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/48836340?v=4" alt="zmonitor-logo" height="80">
    </a>
    <p>前端监控SDK，可用来收集并上报：代码报错、性能数据、页面录屏、用户行为、白屏检测等个性化指标数据</p>
    <div align="left">
    <p>亮点1：支持多种错误还原方式：定位源码、播放录屏、记录用户行为</p>
    <p>亮点2：支持项目的白屏检测，兼容有骨架屏、无骨架屏这两种情况</p>
    <p>亮点3：支持错误上报去重，错误生成唯一的id，重复的代码错误只上报一次</p>
    <p>亮点4：支持多种上报方式，默认使用web beacon，也支持图片打点、http 上报</p>
    <div
</div>

## 功能

- [√] ✈️ 错误捕获：代码报错、资源加载报错、接口请求报错
- [√] ✈️ 性能数据：FP、FCP、LCP、CLS、TTFB、FID
- [√] ✈️ 用户行为：页面点击、路由跳转、接口调用、资源加载
- [√] ✈️ 个性化指标：Long Task、Memory 页面内存、首屏加载时间
- [√] ✈️ 白屏检测：检测页面打开后是否一直白屏
- [√] ✈️ 错误去重：开启缓存队列，存储报错信息，重复的错误只上报一次
- [√] 🚀 手动上报错误
- [√] 🚀 支持多种配置：自定义 hook 与选项
- [√] 🚀 支持的 Web 框架：vue2、vue3、React

## 安装

```javascript
// 安装核心模块
npm i @zmonitor/core

// 安装性能检测插件
npm i @zmonitor/performance

// 安装页面录屏插件
npm i @zmonitor/recordscreen
```

## Vue2 安装说明

```javascript
import zMonitor from '@zmonitor/core';
import performance from '@zmonitor/performance';
import recordscreen from '@zmonitor/recordscreen';

Vue.use(zMonitor, {
  dsn: 'http://text.com/reportData', // 上报的地址
  appId: 'project1', // 项目唯一的id
  userId: '89757', // 用户id
  repeatCodeError: true, // 开启错误上报去重，重复的代码错误只上报一次
  silentWhiteScreen: true, // 开启白屏检测
  skeletonProject: true, // 项目是否有骨架屏
  handleHttpStatus(data) {
    // 自定义hook, 根据接口返回的 response 判断请求是否正确
    let { url, response } = data;
    let { code } = typeof response === 'string' ? JSON.parse(response) : response;
    if (url.includes('/getErrorList')) {
      return code === 200 ? true : false;
    } else {
      return true;
    }
  },
});

// 注册性能检测插件
zMonitor.use(performance);
// 注册页面录屏插件，设置单次录屏时长为20s，默认是10s
zMonitor.use(recordscreen, { recordScreentime: 20 });
```

## Vue3 安装说明

```javascript
import zMonitor from '@zmonitor/core';
import performance from '@zmonitor/performance';
import recordscreen from '@zmonitor/recordscreen';

const app = createApp(App);
app.use(zMonitor, {
  dsn: 'http://text.com/reportData',
  appId: 'project1',
  userId: '89757',
});

zMonitor.use(performance);
zMonitor.use(recordscreen);
```

## React 安装说明

```javascript
import zMonitor from '@zmonitor/core';
import performance from '@zmonitor/performance';
import recordscreen from '@zmonitor/recordscreen';

zMonitor.init({
  dsn: 'http://text.com/reportData',
  appId: 'project1',
  userId: '89757',
});

zMonitor.use(performance);
zMonitor.use(recordscreen);
```

如果在 React 项目中使用了 ErrorBoundary，要在 componentDidCatch 中将报错上报给服务器

```javascript
import zMonitor from '@zmonitor/core';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 在componentDidCatch中将报错上报给服务器
    zMonitor.errorBoundary(err);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

从 react16 开始，官方提供了 ErrorBoundary 错误边界的功能，被该组件包裹的子组件，render 函数报错时会触发离当前组件最近父组件的 ErrorBoundary
生产环境，一旦被 ErrorBoundary 捕获的错误，不会触发全局的 window.onerror 和 error 事件

## 常规配置项

|          Name          | Type       | Default                             | Description                                                                                                                                                                                                             |
| :--------------------: | ---------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|         `dsn`          | `string`   | `""`                                | (必传项) 上报接口的地址，post 方法                                                                                                                                                                                      |
|        `appId`         | `string`   | `""`                                | (必传项) 每个项目对应一个 appId，唯一标识                                                                                                                                                                               |
|        `userId`        | `string`   | `""`                                | 用户 id                                                                                                                                                                                                                 |
|       `disabled`       | `boolean`  | `false`                             | 默认是开启 SDK，为 true 时，会将 sdk 禁用                                                                                                                                                                               |
|  `silentWhiteScreen`   | `boolean`  | `false`                             | 注意：默认不会开启白屏检测，为 true 时，开启检测                                                                                                                                                                        |
|   `skeletonProject`    | `boolean`  | `false`                             | 有骨架屏的项目建议设为 true，提高白屏检测准确性                                                                                                                                                                         |
|   `whiteBoxElements`   | `array`    | `['html', 'body', '#app', '#root']` | 白屏检测的容器列表，开启白屏检测后该设置才生效                                                                                                                                                                          |
|  `filterXhrUrlRegExp`  | `regExp`   | `null`                              | 默认为空，所有的接口请求都会被监听，不为空时，filterXhrUrlRegExp.test(xhr.url)为 true 时过滤指定的接口                                                                                                                  |
|     `useImgUpload`     | `boolean`  | `false`                             | 为 true 时，使用图片打点上报的方式，参数通过 data=encodeURIComponent(reportData) 拼接到 url 上，默认为 false                                                                                                            |
|  `throttleDelayTime`   | `number`   | `0`                                 | 设置全局 click 点击事件的节流时间                                                                                                                                                                                       |
|       `overTime`       | `number`   | `10`                                | 设置接口超时时长，默认 10s                                                                                                                                                                                              |
|    `maxBreadcrumbs`    | `number`   | `20`                                | 用户行为存放的最大容量，超过 20 条，最早的一条记录会被覆盖掉                                                                                                                                                            |
|   `repeatCodeError`    | `boolean`  | `false`                             | 是否开启去除重复的代码报错，开启的话重复的代码错误只上报一次                                                                                                                                                            |
| `beforePushBreadcrumb` | `function` | `null`                              | (自定义 hook) 添加到行为列表前的 hook，有值时，所有的用户行为都要经过该 hook 处理，若返回 false，该行为不会添加到列表中                                                                                                 |
|   `beforeDataReport`   | `function` | `null`                              | (自定义 hook) 数据上报前的 hook，有值时，所有的上报数据都要经过该 hook 处理，若返回 false，该条数据不会上报                                                                                                             |
|   `handleHttpStatus`   | `function` | `null`                              | (自定义 hook) 根据接口返回的 response 判断请求是否正确，返回 true 表示接口正常，反之表示接口报错(只有接口报错时才保留 response), 该函数的参数为 { url, response, requestData, elapsedTime, time, method, type, Status } |

## 默认监控配置项

|            Name            | Type      | Default | Description                                                           |
| :------------------------: | --------- | ------- | --------------------------------------------------------------------- |
|        `silentXhr`         | `boolean` | `true`  | 默认会监控 xhr，为 false 时，将不再监控                               |
|       `silentFetch`        | `boolean` | `true`  | 默认会监控 fetch，为 false 时，将不再监控                             |
|       `silentClick`        | `boolean` | `true`  | 默认会全局监听 click 点击事件，为 false                               |
|       `silentError`        | `boolean` | `true`  | 默认会监控 error，为 false 时，将不再监控                             |
| `silentUnhandledrejection` | `boolean` | `true`  | 默认会监控 unhandledrejection，为 false 时，将不再监控                |
|      `silentHistory`       | `boolean` | `true`  | 默认会监控 popstate、pushState、replaceState，为 false 时，将不再监控 |
|     `silentHashchange`     | `boolean` | `true`  | 默认会监控 hashchange，为 false 时，将不再监控                        |

## @zmonitor/recordscreen 录屏插件的配置项

|          Name          | Type     | Default                                                       | Description                                                                                                               |
| :--------------------: | -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|   `recordScreentime`   | `number` | `10`                                                          | 单次录屏时长，默认值为 10s                                                                                                |
| `recordScreenTypeList` | `array`  | `['error', 'unhandledrejection', 'resource', 'fetch', 'xhr']` | 上报录屏的错误列表，默认会上报所有错误发生时的录屏信息，如设置 ['error', 'unhandledrejection'] 则只会上报代码报错时的录屏 |

## z-monitor 前端监控文章

这几篇文章详细介绍了该 SDK 的项目架构、功能实现、前端录屏、白屏检测等技术点

[从 0 到 1 搭建前端监控平台，面试必备的亮点项目](https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md)  
[前端录屏+定位源码，帮你快速定位线上 bug](https://github.com/xy-sea/blog/blob/main/markdown/%E5%89%8D%E7%AB%AF%E5%BD%95%E5%B1%8F%2B%E5%AE%9A%E4%BD%8D%E6%BA%90%E7%A0%81%EF%BC%8C%E5%B8%AE%E4%BD%A0%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D%E7%BA%BF%E4%B8%8Abug.md)  
[前端白屏的检测方案，让你知道自己的页面白了](https://github.com/xy-sea/blog/blob/main/markdown/%E5%89%8D%E7%AB%AF%E7%99%BD%E5%B1%8F%E7%9A%84%E6%A3%80%E6%B5%8B%E6%96%B9%E6%A1%88%EF%BC%8C%E8%AE%A9%E4%BD%A0%E7%9F%A5%E9%81%93%E8%87%AA%E5%B7%B1%E7%9A%84%E9%A1%B5%E9%9D%A2%E7%99%BD%E4%BA%86.md)  
[npm + changesets 搭建 monorepo 架构的前端监控系统](https://github.com/xy-sea/blog/blob/main/markdown/pnpm%20%2B%20changesets%20%E6%90%AD%E5%BB%BA%20monorepo%20%E6%9E%B6%E6%9E%84%E7%9A%84%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F.md)

## 错误去重

repeatCodeError 设置为 true 时，将开启一个缓存 map，存入已发生错误的 hash，上报错误时先判断该错误是否已存在，不存在则上报

在用户的一次会话中，如果产生了同一个错误，那么将这同一个错误上报多次是没有意义的；
在用户的不同会话中，如果产生了同一个错误，那么将不同会话中产生的错误进行上报是有意义的；

为什么有上面的结论呢？

在用户的同一次会话中，如果点击一个按钮出现了错误，那么再次点击同一个按钮，必定会出现同一个错误，而这出现的多次错误，影响的是同一个用户、同一次访问；所以将其全部上报是没有意义的；
而在同一个用户的不同会话中，如果出现了同一个错误，那么这不同会话里的错误进行上报就显得有意义了

z-monitor 根据错误堆栈信息，将`错误信息、错误文件、错误行号`聚合生成一个 hash 值，是这个错误唯一的 ID

```javascript
// 对每一个错误详情，生成唯一的编码
export function getErrorUid(hash: string): string {
  return window.btoa(encodeURIComponent(hash));
}
const hash: string = getErrorUid(`${EVENTTYPES.ERROR}-${ev.message}-${fileName}-${columnNumber}`);
```

## 白屏检测功能说明

该功能用来检测页面打开后，是否一直处于白屏状态，通过 silentWhiteScreen 设为 true 来开启

白屏检测功能使用：关键点采样对比 + 白屏修正机制，来确保白屏功能的正确性

对于有骨架屏的项目，如果页面一直显示骨架屏，也算是白屏的一种，有骨架屏的项目建议 skeletonProject 设为 true，提高白屏检测准确性

## 自定义 hook 示例

handleHttpStatus

```javascript
// 根据接口返回的response判断请求是否正确
import zMonitor from 'zMonitor';

Vue.use(zMonitor, {
  dsn: 'http://test.com/reportData',
  appId: 'abcd',
  // handleHttpStatus 返回true表示接口正常，反之表示接口报错
  handleHttpStatus(data) {
    let { url, response } = data;
    // code为200，接口正常，反之亦然
    let { code } = typeof response === 'string' ? JSON.parse(response) : response;
    if (url.includes('/getErrorList')) {
      return code === 200 ? true : false;
    } else {
      return true;
    }
  },
});
```

beforePushBreadcrumb

```javascript
// 添加用户行为
push(data) {
  if (typeof this.beforePushBreadcrumb === 'function') {
    /**
      * 执行用户自定义的hook，若返回false，则这条数据不添加到列表中
      * @param { object } this 当前用户行为的实例
      * @param { object } data 要添加到用户行为列表的数据
      */
    let result = this.beforePushBreadcrumb(data);
    if (!result) return;
    this.immediatePush(result);
    return;
  }
  this.immediatePush(data);
}
```

beforeDataReport

```javascript
// 上报数据前的hook
async beforePost(data) {
  let transportData = this.getTransportData(data);
  /**
  * 执行用户自定义的hook，若返回false，则这条数据不会进行上报
  * @param { object } transportData 当前要上报的数据
  */
  if (typeof this.beforeDataReport === 'function') {
    transportData = this.beforeDataReport(transportData);
    if (!transportData) return false;
  }
  return transportData;
}
```

## 手动上报错误示例

```javascript
import zMonitor from 'z-monitor';

zMonitor.log({
  type: 'custom',
  message: '手动报错信息',
  error: new Error('报错'),
});
```
