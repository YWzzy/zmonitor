declare interface Performance extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare interface Window {
  chrome?: {
    app: {
      [key: string]: any;
    };
  };
  __zMonitor__: {
    [key: string]: any;
  };
}
