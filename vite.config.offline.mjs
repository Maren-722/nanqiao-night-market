import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 离线双击版配置：打包成 IIFE 单文件，可直接用 file:// 打开
// 用法：npm run build:offline
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist-offline',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 1024 * 1024,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
