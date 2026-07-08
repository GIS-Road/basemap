# basemap 项目目录结构

```
basemap/
│
├── .git/
├── .gitignore
├── index.html                     # 入口 HTML
├── package.json                   # 依赖配置
├── package-lock.json
├── vite.config.js                 # Vite 构建配置
├── README.md
│
├── public/
│   └── vite.svg
│
└── src/
    ├── main.js                    # Vue 应用入口
    ├── App.vue                    # 根组件
    │
    ├── assets/
    │   └── styles.css             # 全局样式 + CSS 变量
    │
    ├── components/
    │   ├── DrawingToolbar.vue     # 绘制工具栏
    │   ├── LayerTree.vue          # 图层面板
    │   └── MapToggle.vue          # 2D/3D 切换按钮
    │
    ├── composables/
    │   ├── useMap2D.js            # OpenLayers 二维地图逻辑
    │   └── useMap3D.js            # Cesium 三维地图逻辑
    │
    ├── stores/
    │   └── mapStore.js            # Pinia 状态管理
    │
    └── config/
        └── layers.json            # 图层配置文件
```

## 文件职责速览

| 文件 | 职责 |
|------|------|
| `src/App.vue` | 根组件：Header（定位/模式/坐标拾取）、地图容器、图层面板、绘制工具栏 |
| `src/main.js` | Vue 应用入口，挂载 Pinia + Element Plus |
| `src/components/LayerTree.vue` | 图层面板：树形结构、复选框、眼睛图标、拖拽排序 |
| `src/components/DrawingToolbar.vue` | 绘制工具栏：选择/画线/多边形/矩形/圆/箭头 + 样式面板 |
| `src/components/MapToggle.vue` | 2D/3D 模式切换按钮 |
| `src/composables/useMap2D.js` | 二维地图初始化、底图切换、图层显隐、z-index 排序、定位飞行动画 |
| `src/composables/useMap3D.js` | 三维地图初始化、相机管理、飞行动画 |
| `src/stores/mapStore.js` | Pinia 全局状态：地图模式、底图、中心/缩放、图层树、绘制状态、定位 |
| `src/config/layers.json` | 图层配置数据：底图分组 + 叠加图层分组 |
| `src/assets/styles.css` | 全局 CSS 变量（科技蓝主题色系）+ 基础样式 |
