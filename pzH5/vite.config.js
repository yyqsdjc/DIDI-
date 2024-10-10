import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'; // 自动导入对应的 Vant API 以及样式
import Components from 'unplugin-vue-components/vite'; // 解析模板并自动注册对应的组件
import { VantResolver } from '@vant/auto-import-resolver'; // 自动引入对应的组件样式

export default {
  server: {
    port: 4500
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
};

