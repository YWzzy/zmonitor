// postcss.config.js
import postcssNested from 'postcss-nested';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
	tailwindcss(),
    postcssNested(), // 允许在 CSS 中进行嵌套的类名写法
    autoprefixer(),
  ],
};
