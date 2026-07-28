import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import path from "path"

export default defineConfig({
  plugins: [
    vue(),
    cesium()
  ],
  base: "./",
  build: {
    // 应用输出路径，与Nginx配置一致
    outDir: "dist",
    // 静态资源存放路径
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/maps-for-free': {
        target: 'https://maps-for-free.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/maps-for-free/, ''),
        headers: {
          'Referer': 'https://maps-for-free.com/'
        }
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
