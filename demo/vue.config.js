module.exports = {
  devServer: {
    proxy: {
      // '/reportData': {
      //   target: 'http://localhost:8083/',
      //   changeOrigin: false, //  target是域名的话，需要这个参数，
      //   secure: false, //  设置支持https协议的代理,
      // },
      // '/getmap': {
      //   target: 'http://localhost:8083/',
      //   changeOrigin: false,
      //   secure: false,
      // },
      // '/getmgetRecordScreenIdp': {
      //   target: 'http://localhost:8083/',
      //   changeOrigin: false,
      //   secure: false,
      // },
      '/dev': {
        target: 'http://localhost:8083/',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/dev': '', // 将路径中的/dev替换为空字符串
        },
      },
    },
  },
  configureWebpack: {
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
};
