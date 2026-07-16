import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import path from "path"

export default defineConfig({
  plugins: [
    vue(),
    cesium()
  ],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/maps-for-free': {
        target: 'https://maps-for-free.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/maps-for-free/, '')
      }
    }
  },
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // 设置路径
      "~": path.resolve(__dirname, "./"),
      // 设置别名
      "@": path.resolve(__dirname, "./src")
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  }
})
