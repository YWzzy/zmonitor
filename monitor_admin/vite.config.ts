import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@/src': path.resolve(__dirname, './src'),
      },
    },
    css: {
      postcss: './postcss.config.js',
    },
    server: {
      // 设置开发服务器代理
      proxy: {
        '/api': {
          target: env.VITE_API_HOST, // 使用环境变量
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
