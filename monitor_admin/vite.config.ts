import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import tailwindcss from "tailwindcss"
// import autoprefixer from "autoprefixer"

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
      postcss: path.resolve(__dirname, './postcss.config.js'),
      // postcss: {
      //       plugins: [
      //           tailwindcss,
      //           autoprefixer,
      //       ]
      //   }
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
    build: {
      sourcemap: true, // 启用 source maps
    },
  };
});
