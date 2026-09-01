import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import path from "path"

export default defineConfig({
  plugins: [
    vue(),
    cesium({
      baseUrl: 'cesium',
    })
  ],
  // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
  // 例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 base 为 /admin/。
  base: "/basemap/",
  build: {
    // 应用输出路径，与Nginx配置一致
    outDir: "basemap",
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
