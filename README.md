# 🗺️ 在线底图服务系统

> 这是一个Web项目，旨在打造全网最全在线底图整合系统。收集整理地球上所有的在线底图、标注、影像、矢量图层以及地形数据，构建二三维一体化应用。



## 🛠️ 技术框架
纯前端项目，使用流行的前端库进行打造。

技术包： `Vue3 + OpenLayers + Cesium` 

构建工具：`Vite`

## 🔗 项目地址

在线访问：https://gis-road.github.io/basemap/

GitHub 仓库：https://github.com/gis-road/basemap

## 📂 项目结构
```
basemap/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖配置
├── package-lock.json
├── vite.config.js                # Vite 构建配置
├── README.md
├── .gitignore
│
├── public/
│   └── vite.svg
│
└── src/
    ├── main.js                   # Vue 应用入口
    ├── App.vue                   # 根组件（Header / 地图 / 图层面板 / 绘制工具栏）
    │
    ├── assets/
    │   └── styles.css            # 全局样式 + CSS 变量（科技蓝主题）
    │
    ├── components/
    │   ├── DrawingToolbar.vue    # 绘制工具栏（选择/画线/多边形/矩形/圆/箭头/样式面板）
    │   ├── LayerTree.vue         # 图层面板（树形结构/复选框/眼睛/拖拽排序）
    │   └── MapToggle.vue         # 2D/3D 切换按钮
    │
    ├── composables/
    │   ├── useMap2D.js           # OpenLayers 二维地图逻辑（初始化/底图/图层/绘制层）
    │   └── useMap3D.js           # Cesium 三维地图逻辑（初始化/相机/飞行动画）
    │
    ├── stores/
    │   └── mapStore.js           # Pinia 状态管理（地图模式/底图/中心/缩放/图层树/绘制状态）
    │
    └── config/
        └── layers.js             # 图层配置
```
## 🖼️ 项目效果

| 绘制线段 | 绘制箭头 | 矢量底图 |
|:---:|:---:|:---:|
| <img src="src/assets/效果图/simple-line.png" alt="线段" width="280"> | <img src="src/assets/效果图/arrow-line.png" alt="绘制箭头" width="280"> | <img src="src/assets/效果图/basemap-vector.png" alt="矢量底图" width="280"> |

| 影像底图 | 绘制面 | 绘制矩形 |
|:---:|:---:|:---:|
| <img src="src/assets/效果图/basemap-image.png" alt="影像底图" width="280"> | <img src="src/assets/效果图/circle.png" alt="绘制面" width="280"> | <img src="src/assets/效果图/rectangle.png" alt="绘制矩形" width="280"> |

| 军事箭头 | 3D影像 | 3D影像 |
|:---:|:---:|:---:|
| <img src="src/assets/效果图/arrow.png" alt="军事箭头" width="280"> | <img src="src/assets/效果图/3d-image.png" alt="3D影像" width="280"> | <img src="src/assets/效果图/3d-image1.png" alt="3D影像" width="280"> |

| 3D地形 | ESRI地形 | 天地图地形影像 |
|:---:|:---:|:---:|
| <img src="src/assets/效果图/3d-terrain.png" alt="3D地形" width="280"> | <img src="src/assets/效果图/3d-vector.png" alt="ESRI地形" width="280"> | <img src="src/assets/效果图/3d-image1.png" alt="天地图地形影像" width="280"> |


## ✨ 项目特点
- 二三维一体化应用
- 在线底图服务
- 个性化绘制和编辑

## 🚀 如何运行
`node` 版本要求22+

项目运行
```
npm install
npm run dev
```

项目打包
```
npm run build
```

## 🛰️ 图层列表

> 共 51 个图层，11 列属性。

| 序号 | 所属目录 | 图层名称 | 服务类型 | 图层类型 | 服务地址 |
|---|---|---|---|---|---|
| 1 | 地形图层 | 山体阴影_白色_esri | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}) |
| 2 | 地形图层 | 山体阴影_黑色_esri | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}) |
| 3 | 地形图层 | 山体阴影_天地图 | XYZ 瓦片 | 地形 | [t{0-7}.tianditu.gov.cn](https://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=fa7ec9766b2c00747e3dd60ab3d05892) |
| 4 | 地形图层 | 地形_maps-for-free | maps-for-free 地形 | 地形 | `/maps-for-free/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg` |
| 5 | 地形图层 | Esri_Shaded_Relief | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}) |
| 6 | 地形图层 | Esri_World_Physical_Map | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}) |
| 7 | 地形图层 | Esri_World_Terrain_Base | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}) |
| 8 | 地形图层 | 欧洲海洋观测EMODnet | XYZ 瓦片 | 地形 | [tiles.emodnet-bathymetry.eu](https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png) |
| 9 | 地形图层 | Esri_World_Ocean_Base | XYZ 瓦片 | 地形 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}) |
| 10 | 地形图层 | 谷歌地形图_纯图_土地利用 | XYZ 瓦片 | 地形 | [mt0.google.com](http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga&apistyle=s.e:l\|p.v:off,s.t:1\|s.e:g\|p.v:off,s.t:21\|p.v:off,s.t:20\|p.v:off,s.t:2\|p.v:off,s.t:3\|p.v:off,s.t:3\|s.e:l.i\|p.v:off,s.t:4\|p.v:off) |
| 11 | 地形图层 | 谷歌地形图_纯图_灰色 | XYZ 瓦片 | 地形 | [www.google.com](http://www.google.com/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m1!1e5) |
| 12 | 影像图层 | 天地图影像 | XYZ 瓦片 | 影像 | [t{0-7}.tianditu.gov.cn](https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=fa7ec9766b2c00747e3dd60ab3d05892) |
| 13 | 影像图层 | 星图地球_影像 | XYZ 瓦片 | 影像 | [tiles.geovisearth.com](https://tiles.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=15d2ddab335383b5d485b78a3e04ac9f92683ee2e3b04cdf862cb292168674e7) |
| 14 | 影像图层 | Esri_World_Imagery_卫星图 | XYZ 瓦片 | 影像 | [server.arcgisonline.com](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}) |
| 15 | 影像图层 | 高德卫星图(GJC02)（有偏移） | XYZ 瓦片 | 影像 | [webst01.is.autonavi.com](https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}) |
| 16 | 影像图层 | 百度卫星影像 | baidu | 影像 | [maponline{s}.bdimg.com](https://maponline{s}.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46) |
| 17 | 影像图层 | 影像_谷歌原版影像 | XYZ 瓦片 | 影像 | [mt1.google.com](https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}) |
| 18 | 影像图层 | 谷歌卫星混合图层(GCJ02)（有偏移） | XYZ 瓦片 | 影像 | [mt.google.com](http://mt.google.com/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}) |
| 19 | 矢量图层 | 天地图矢量图层 | XYZ 瓦片 | 矢量 | [t{0-7}.tianditu.gov.cn](https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=fa7ec9766b2c00747e3dd60ab3d05892) |
| 20 | 矢量图层 | USA_Topo_Maps | XYZ 瓦片 | 矢量 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}) |
| 21 | 矢量图层 | World_Topo_Map | XYZ 瓦片 | 矢量 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}) |
| 22 | 矢量图层 | OpenStreetMap | XYZ 瓦片 | 矢量 | [tile.openstreetmap.org](https://tile.openstreetmap.org/{z}/{x}/{y}.png) |
| 23 | 矢量图层 | Open_Topo_Map | XYZ 瓦片 | 矢量 | [tile.opentopomap.org](https://tile.opentopomap.org/{z}/{x}/{y}.png) |
| 24 | 矢量图层 | Bing电子地图 | XYZ 瓦片 | 矢量 | [t.ssl.ak.dynamic.tiles.virtualearth.net](https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/a{q}.ipeg?g=0&mkt=zh_CN&it=GB,LC&shading=hill&n=t&og=2697&sv=9.38&cstl=s23&o=png&ur=hk) |
| 25 | 水系图层 | 腾讯路网标注图（水系） | XYZ 瓦片 | 影像 | [rt0.map.gtimg.com](https://rt0.map.gtimg.com/tile?z={z}&x={x}&y={_y}&type=vector&styleid=3) |
| 26 | 水系图层 | maps-for-free_World_river | XYZ 瓦片 | 影像 | `/maps-for-free/layer/water/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 27 | 灯光图层 | 夜间灯光_BlackMarble | WMTS 服务 | WMTS | [tiles.maps.eox.at](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml) |
| 28 | 路网图层 | 高德路网标注图(GJC02) | XYZ 瓦片 | 路网 | [wprd01.is.autonavi.com](https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8<ype=11) |
| 29 | 路网图层 | 谷歌路网标记图层(GCJ02) | XYZ 瓦片 | 路网 | [mt.google.com](http://mt.google.com/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}) |
| 30 | 路网图层 | 基于OSM铁路数据的在线PNG底图_OpenRailwayMap | XYZ 瓦片 | 路网 | [a.tiles.openrailwaymap.org](https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png) |
| 31 | 路网图层 | ORM最大速度图_OpenRailwayMap_Maxspeed | XYZ 瓦片 | 路网 | [a.tiles.openrailwaymap.org](https://a.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png) |
| 32 | 路网图层 | 路网_maps-for-free | XYZ 瓦片 | 路网 | `/maps-for-free/layer/streets/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 33 | 路网图层 | 路网_白色_esri | XYZ 瓦片 | 路网 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}) |
| 34 | 路网图层 | 路网_黑色_esri | XYZ 瓦片 | 路网 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}) |
| 35 | 路网图层 | road_osm_street | XYZ 瓦片 | 路网 | [tile.openstreetmap.bzh](https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png) |
| 36 | 路网图层 | 必应暗色街道地图（有偏移） | bingService | 路网 | [t{0-3}.dynamic.tiles.ditu.live.com](https://t{0-3}.dynamic.tiles.ditu.live.com/comp/ch/{q}?mkt=zh-CN&ur=cn&it=G,RL&n=z&og=804&cstl=vbd) |
| 37 | 路网图层 | 必应彩色街道地图（有偏移） | bingService | 路网 | [t{0-3}.dynamic.tiles.ditu.live.com](https://t{0-3}.dynamic.tiles.ditu.live.com/comp/ch/{q}?mkt=zh-CN&ur=cn&it=G,RL&n=z&og=804&cstl=vb) |
| 38 | 行政区图层 | Esri_World_Ocean_Reference | XYZ 瓦片 | 注记 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}) |
| 39 | 行政区图层 | Admin_maps-for-free_world | XYZ 瓦片 | 影像 | `/maps-for-free/layer/admin/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 40 | 行政区图层 | Country_maps_for-free_world | XYZ 瓦片 | 影像 | `/maps-for-free/layer/country/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 41 | 注记图层 | 天地图矢量注记 | XYZ 瓦片 | 注记 | [t{0-7}.tianditu.gov.cn](https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=fa7ec9766b2c00747e3dd60ab3d05892) |
| 42 | 注记图层 | 天地图影像注记 | XYZ 瓦片 | 注记 | [t{0-7}.tianditu.gov.cn](https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=fa7ec9766b2c00747e3dd60ab3d05892) |
| 43 | 注记图层 | Esri_World_Boundaries_and_Places | XYZ 瓦片 | 注记 | [server.arcgisonline.com](https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}) |
| 44 | 土地利用图层 | osm土地利用 | WMTS 服务 | 土地利用 | [maps.heigit.org](https://maps.heigit.org/osmlanduse/service?VERSION=1.3.0&TRANSPARENT=true&QUERY_LAYERS=osmlanduse:osm_lulc&LAYERS=osmlanduse:osm_lulc_combined_osm4eo&BUFFER=0&INFO_FORMAT=application/json&FEATURE_COUNT=1&I=91&J=129&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&STYLES=&BBOX=12836528.782099359,3600489.7803449426,12993071.8160274,3757032.8142729835) |
| 45 | 土地利用图层 | 耕地 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/crop/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 46 | 土地利用图层 | 草地 | maps-for-free 通用 | 土地利用 | `/maps-for-free/layer/grass/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 47 | 土地利用图层 | 林地 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/forest/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 48 | 土地利用图层 | 苔原 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/tundra/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 49 | 土地利用图层 | 荒漠\|荒原 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/sand/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 50 | 土地利用图层 | 沼泽 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/swamp/z{z}/row{y}/{z}_{x}-{y}.gif` |
| 51 | 土地利用图层 | 冰原 | maps-for-free 土地利用 | 土地利用 | `/maps-for-free/layer/ice/z{z}/row{y}/{z}_{x}-{y}.gif` |


# 📮 联系作者
微信公众号：**GIS之路**

![alt text](src/assets/image/公众号.png)

个人微信：`shanhaigis`

![alt text](src/assets/image/个人微信.png)


# 📋 版权说明

本系统所使用的地图服务内容均来自于网络公开整理，版权归原作者所有。

