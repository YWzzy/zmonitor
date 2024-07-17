module.exports = {
  apps: [
    {
      name: "nest-monitor", // 应用程序名称
      script: "dist/main.js", // 启动脚本路径，确保是编译后的文件路径
      watch: false, // 是否监听文件变化，建议在生产环境下设为 false
      instances: 1, // 应用程序实例数量，根据需要调整
      exec_mode: "cluster", // 执行模式，可选 'cluster' 或 'fork'
      env: {
        NODE_ENV: "development", // 默认环境变量配置
      },
      env_production: {
        NODE_ENV: "production", // 生产环境环境变量配置
      },
    },
  ],
};
