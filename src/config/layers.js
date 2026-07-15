// 天地图token
const TDT_TOKEN = "fa7ec9766b2c00747e3dd60ab3d05892"
// 星图token
const GEOVISEARTH = "15d2ddab335383b5d485b78a3e04ac9f92683ee2e3b04cdf862cb292168674e7"

// ESRI Wayback 历史影像 WMTS 服务地址
const WAYBACK_WMTS_URL = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"

// ESRI Wayback 历史影像图层列表 (从 WMTS Capabilities 自动提取)
// 共 195 个图层，时间跨度: 2014-02-20 ~ 2026-06-30
const WAYBACK_LAYERS = [
  { id: "WB_2026_R06", date: "2026-06-30" },
  { id: "WB_2026_R05", date: "2026-05-28" },
  { id: "WB_2026_R04", date: "2026-04-30" },
  { id: "WB_2026_R03", date: "2026-03-25" },
  { id: "WB_2026_R02", date: "2026-02-26" },
  { id: "WB_2026_R01", date: "2026-01-29" },
  { id: "WB_2025_R12", date: "2025-12-18" },
  { id: "WB_2025_R11", date: "2025-11-20" },
  { id: "WB_2025_R10", date: "2025-10-23" },
  { id: "WB_2025_R09", date: "2025-09-25" },
  { id: "WB_2025_R08", date: "2025-09-04" },
  { id: "WB_2025_R07", date: "2025-07-31" },
  { id: "WB_2025_R06", date: "2025-06-26" },
  { id: "WB_2025_R05", date: "2025-05-29" },
  { id: "WB_2025_R04", date: "2025-04-24" },
  { id: "WB_2025_R03", date: "2025-03-27" },
  { id: "WB_2025_R02", date: "2025-02-27" },
  { id: "WB_2025_R01", date: "2025-01-30" },
  { id: "WB_2024_R13", date: "2024-12-12" },
  { id: "WB_2024_R12", date: "2024-11-18" },
  { id: "WB_2024_R11", date: "2024-10-10" },
  { id: "WB_2024_R10", date: "2024-09-19" },
  { id: "WB_2024_R08", date: "2024-08-15" },
  { id: "WB_2024_R07", date: "2024-06-27" },
  { id: "WB_2024_R06", date: "2024-06-06" },
  { id: "WB_2024_R05", date: "2024-05-09" },
  { id: "WB_2024_R03", date: "2024-03-28" },
  { id: "WB_2024_R02", date: "2024-03-07" },
  { id: "WB_2024_R01", date: "2024-02-08" },
  { id: "WB_2024_R00", date: "2024-01-18" },
  { id: "WB_2023_R11", date: "2023-12-07" },
  { id: "WB_2023_R10", date: "2023-11-01" },
  { id: "WB_2023_R09", date: "2023-10-11" },
  { id: "WB_2023_R08", date: "2023-08-31" },
  { id: "WB_2023_R07", date: "2023-08-10" },
  { id: "WB_2023_R06", date: "2023-06-29" },
  { id: "WB_2023_R05", date: "2023-06-13" },
  { id: "WB_2023_R04", date: "2023-05-03" },
  { id: "WB_2023_R03", date: "2023-04-05" },
  { id: "WB_2023_R02", date: "2023-03-15" },
  { id: "WB_2023_R01", date: "2023-02-23" },
  { id: "WB_2023_R00", date: "2023-01-11" },
  { id: "WB_2022_R15", date: "2022-12-14" },
  { id: "WB_2022_R14", date: "2022-11-02" },
  { id: "WB_2022_R13", date: "2022-10-12" },
  { id: "WB_2022_R12", date: "2022-09-21" },
  { id: "WB_2022_R11", date: "2022-08-31" },
  { id: "WB_2022_R10", date: "2022-08-10" },
  { id: "WB_2022_R09", date: "2022-07-20" },
  { id: "WB_2022_R08", date: "2022-06-29" },
  { id: "WB_2022_R07", date: "2022-06-08" },
  { id: "WB_2022_R06", date: "2022-05-18" },
  { id: "WB_2022_R05", date: "2022-04-27" },
  { id: "WB_2022_R04", date: "2022-04-06" },
  { id: "WB_2022_R03", date: "2022-03-16" },
  { id: "WB_2022_R02", date: "2022-02-24" },
  { id: "WB_2022_R01", date: "2022-02-02" },
  { id: "WB_2022_R00", date: "2022-01-12" },
  { id: "WB_2021_R17", date: "2021-12-21" },
  { id: "WB_2021_R16", date: "2021-11-30" },
  { id: "WB_2021_R15", date: "2021-11-03" },
  { id: "WB_2021_R14", date: "2021-10-13" },
  { id: "WB_2021_R13", date: "2021-09-22" },
  { id: "WB_2021_R12", date: "2021-09-01" },
  { id: "WB_2021_R11", date: "2021-08-11" },
  { id: "WB_2021_R10", date: "2021-07-21" },
  { id: "WB_2021_R09", date: "2021-06-30" },
  { id: "WB_2021_R08", date: "2021-06-09" },
  { id: "WB_2021_R07", date: "2021-05-19" },
  { id: "WB_2021_R06", date: "2021-04-28" },
  { id: "WB_2021_R05", date: "2021-04-08" },
  { id: "WB_2021_R04", date: "2021-03-17" },
  { id: "WB_2021_R03", date: "2021-02-24" },
  { id: "WB_2021_R01", date: "2021-01-13" },
  { id: "WB_2020_R16", date: "2020-12-16" },
  { id: "WB_2020_R15", date: "2020-11-18" },
  { id: "WB_2020_R14", date: "2020-10-14" },
  { id: "WB_2020_R13", date: "2020-09-23" },
  { id: "WB_2020_R12", date: "2020-09-02" },
  { id: "WB_2020_R11", date: "2020-08-12" },
  { id: "WB_2020_R10", date: "2020-07-22" },
  { id: "WB_2020_R09", date: "2020-07-01" },
  { id: "WB_2020_R08", date: "2020-06-10" },
  { id: "WB_2020_R07", date: "2020-05-20" },
  { id: "WB_2020_R06", date: "2020-04-29" },
  { id: "WB_2020_R05", date: "2020-04-08" },
  { id: "WB_2020_R04", date: "2020-03-23" },
  { id: "WB_2020_R03", date: "2020-02-20" },
  { id: "WB_2020_R02", date: "2020-01-30" },
  { id: "WB_2020_R01", date: "2020-01-08" },
  { id: "WB_2019_R16", date: "2019-12-12" },
  { id: "WB_2019_R14", date: "2019-10-30" },
  { id: "WB_2019_R13", date: "2019-10-09" },
  { id: "WB_2019_R12", date: "2019-09-18" },
  { id: "WB_2019_R11", date: "2019-08-28" },
  { id: "WB_2019_R10", date: "2019-08-07" },
  { id: "WB_2019_R09", date: "2019-07-17" },
  { id: "WB_2019_R08", date: "2019-06-26" },
  { id: "WB_2019_R07", date: "2019-06-05" },
  { id: "WB_2019_R06", date: "2019-05-15" },
  { id: "WB_2019_R05", date: "2019-04-24" },
  { id: "WB_2019_R04", date: "2019-04-03" },
  { id: "WB_2019_R03", date: "2019-03-13" },
  { id: "WB_2019_R02", date: "2019-02-21" },
  { id: "WB_2019_R01", date: "2019-01-31" },
  { id: "WB_2019_R00", date: "2019-01-09" },
  { id: "WB_2018_R17", date: "2018-12-14" },
  { id: "WB_2018_R16", date: "2018-11-29" },
  { id: "WB_2018_R15", date: "2018-11-07" },
  { id: "WB_2018_R14", date: "2018-10-17" },
  { id: "WB_2018_R13", date: "2018-09-26" },
  { id: "WB_2018_R12", date: "2018-09-06" },
  { id: "WB_2018_R11", date: "2018-08-15" },
  { id: "WB_2018_R10", date: "2018-07-25" },
  { id: "WB_2018_R09", date: "2018-06-27" },
  { id: "WB_2018_R08", date: "2018-06-06" },
  { id: "WB_2018_R07", date: "2018-05-16" },
  { id: "WB_2018_R06", date: "2018-04-25" },
  { id: "WB_2018_R05", date: "2018-04-11" },
  { id: "WB_2018_R04", date: "2018-03-28" },
  { id: "WB_2018_R03", date: "2018-03-14" },
  { id: "WB_2018_R02", date: "2018-02-23" },
  { id: "WB_2018_R01", date: "2018-01-31" },
  { id: "WB_2018_R00", date: "2018-01-18" },
  { id: "WB_2017_R21", date: "2018-01-08" },
  { id: "WB_2017_R19", date: "2017-11-16" },
  { id: "WB_2017_R18", date: "2017-10-25" },
  { id: "WB_2017_R17", date: "2017-10-04" },
  { id: "WB_2017_R16", date: "2017-09-13" },
  { id: "WB_2017_R15", date: "2017-08-30" },
  { id: "WB_2017_R14", date: "2017-08-10" },
  { id: "WB_2017_R13", date: "2017-07-14" },
  { id: "WB_2017_R12", date: "2017-06-27" },
  { id: "WB_2017_R11", date: "2017-06-14" },
  { id: "WB_2017_R10", date: "2017-05-31" },
  { id: "WB_2017_R09", date: "2017-05-17" },
  { id: "WB_2017_R08", date: "2017-05-03" },
  { id: "WB_2017_R07", date: "2017-04-19" },
  { id: "WB_2017_R06", date: "2017-03-29" },
  { id: "WB_2017_R05", date: "2017-03-15" },
  { id: "WB_2017_R04", date: "2017-02-27" },
  { id: "WB_2017_R03", date: "2017-02-08" },
  { id: "WB_2017_R02", date: "2017-01-25" },
  { id: "WB_2017_R01", date: "2017-01-11" },
  { id: "WB_2016_R22", date: "2016-12-20" },
  { id: "WB_2016_R21", date: "2016-12-07" },
  { id: "WB_2016_R20", date: "2016-11-16" },
  { id: "WB_2016_R19", date: "2016-10-25" },
  { id: "WB_2016_R18", date: "2016-10-12" },
  { id: "WB_2016_R16", date: "2016-09-14" },
  { id: "WB_2016_R15", date: "2016-08-31" },
  { id: "WB_2016_R14", date: "2016-08-11" },
  { id: "WB_2016_R13", date: "2016-07-20" },
  { id: "WB_2016_R12", date: "2016-07-06" },
  { id: "WB_2016_R11", date: "2016-06-13" },
  { id: "WB_2016_R10", date: "2016-05-11" },
  { id: "WB_2016_R09", date: "2016-04-28" },
  { id: "WB_2016_R08", date: "2016-04-20" },
  { id: "WB_2016_R06", date: "2016-03-16" },
  { id: "WB_2016_R05", date: "2016-03-02" },
  { id: "WB_2016_R04", date: "2016-02-17" },
  { id: "WB_2016_R03", date: "2016-02-04" },
  { id: "WB_2016_R02", date: "2016-01-13" },
  { id: "WB_2015_R23", date: "2015-12-16" },
  { id: "WB_2015_R20", date: "2015-11-18" },
  { id: "WB_2015_R18", date: "2015-10-28" },
  { id: "WB_2015_R17", date: "2015-10-14" },
  { id: "WB_2015_R16", date: "2015-09-30" },
  { id: "WB_2015_R15", date: "2015-09-16" },
  { id: "WB_2015_R14", date: "2015-09-02" },
  { id: "WB_2015_R13", date: "2015-08-19" },
  { id: "WB_2015_R11", date: "2015-07-08" },
  { id: "WB_2015_R10", date: "2015-06-24" },
  { id: "WB_2015_R08", date: "2015-05-13" },
  { id: "WB_2015_R07", date: "2015-04-30" },
  { id: "WB_2015_R06", date: "2015-04-15" },
  { id: "WB_2015_R05", date: "2015-03-25" },
  { id: "WB_2015_R04", date: "2015-03-18" },
  { id: "WB_2015_R02", date: "2015-02-18" },
  { id: "WB_2015_R01", date: "2015-01-21" },
  { id: "WB_2014_R21", date: "2014-12-30" },
  { id: "WB_2014_R20", date: "2014-12-18" },
  { id: "WB_2014_R19", date: "2014-12-03" },
  { id: "WB_2014_R18", date: "2014-11-12" },
  { id: "WB_2014_R17", date: "2014-10-29" },
  { id: "WB_2014_R15", date: "2014-10-01" },
  { id: "WB_2014_R14", date: "2014-09-17" },
  { id: "WB_2014_R11", date: "2014-07-30" },
  { id: "WB_2014_R10", date: "2014-07-02" },
  { id: "WB_2014_R09", date: "2014-06-25" },
  { id: "WB_2014_R08", date: "2014-06-11" },
  { id: "WB_2014_R06", date: "2014-05-14" },
  { id: "WB_2014_R05", date: "2014-04-30" },
  { id: "WB_2014_R03", date: "2014-03-26" },
  { id: "WB_2014_R01", date: "2014-02-20" },
]

// 从 WAYBACK_LAYERS 生成图层配置对象
const waybackLayerConfigs = WAYBACK_LAYERS.map(wb => ({
  id: `wayback-${wb.id}`,
  label: `Wayback ${wb.date}`,
  name: wb.id,
  url: WAYBACK_WMTS_URL,
  group: "wayback",
  type: "image",
  serviceType: "wmts",
  visible: false
}))

const iconPath = "@/assets/image/layers/"
const layers = [
  //==========================影像图层开始============================//
  {
    "id": "image",
    "label": "影像图层",
    "expanded": true,
    "icon":`${iconPath}image.svg`,
    "children": [
      {
        "id": "geovisearth",
        "label": "星图地球-影像",
        "name": "星图地球",
        "url": "https://tiles.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=" + GEOVISEARTH,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "esri-World_Imagery",
        "label": "ArcGIS 卫星图-World_Imagery",
        "name": "World_Imagery",
        "url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "tianditu_img",
        "label": "天地图影像",
        "name": "tianditu_img",
        "url": `https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TDT_TOKEN}`,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": true
      },
      {
        "id": "bing-image",
        "label": "影像_Bing",
        "name": "影像_Bing",
        "url": `http://ecn.t3.tiles.virtualearth.net/tiles/a{q}.ipeg?g=0&dir=dir n'`,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "google-origin-image",
        "label": "影像_谷歌原版影像",
        "name": "影像_谷歌原版影像",
        "url": `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}`,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "gaode-image",
        "label": "高德卫星图(GJC02)",
        "name": "高德卫星图(GJC02)",
        "url": `https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}`,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "google-image-hybrid",
        "label": "谷歌卫星混合图层(GCJ02)",
        "name": "谷歌卫星混合图层(GCJ02)",
        "url": `http://mt.google.com/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}`,
        "group": "image",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================影像图层结束============================//
  //==========================矢量图层开始============================//
  {
    "id": "vector",
    "label": "矢量图层",
    "expanded": true,
    "icon":`${iconPath}vector.svg`,
    "children": [
      {
        "id": "esri-USA_Topo_Maps",
        "label": "USA Topo Maps",
        "name": "USA Topo Maps",
        "url": "https://server.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer/WMTS/1.0.0/WMTSCapabilities.xml",
        "group": "vector",
        "type": "vector",
        "serviceType": "wmts",
        "visible": false
      },
      {
        "id": "esri-World_Topo_Map",
        "label": "World_Topo_Map",
        "name": "World_Topo_Map",
        "url": "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "tdt_vector",
        "label": "天地图矢量",
        "name": "tianditu_vec",
        "url": `https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${TDT_TOKEN}`,
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "osm-vector",
        "label": "OpenStreetMap",
        "name": "osm",
        "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "Open_Topo_Map_vector",
        "label": "Open Topo Map",
        "name": "Open Topo Map",
        "url": "https://tile.opentopomap.org/{z}/{x}/{y}.png",
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "OpenStreetMap-vector",
        "label": "OpenStreetMap",
        "name": "OpenStreetMap",
        "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "Bing电子地图-vector",
        "label": "Bing电子地图",
        "name": "Bing电子地图",
        "url": "https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/a{q}.ipeg?g=0&mkt=zh-CN&it=GB,LC&shading=hill&n=t&og=2697&sv=9.38&cstl=s23&o=png&ur=hk",
        "group": "vector",
        "type": "vector",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================矢量图层结束============================//
  //==========================水系图层开始============================//
  {
    "id": "river",
    "label": "水系图层",
    "expanded": false,
    "icon":`${iconPath}river.svg`,
    "children": [
      {
        "id": "tencent-river",
        "label": "腾讯路网标注图（水系）",
        "name": "腾讯路网标注图（水系）",
        "url": `https://rt0.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3`,
        "group": "river",
        "type": "image",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================水系图层结束============================//
  //==========================灯光图层开始============================//
  {
    "id": "light",
    "label": "灯光图层",
    "expanded": false,
    "icon":`${iconPath}light.svg`,
    "children": [
      {
        "id": "Sentinel-2",
        "label": "Sentinel-2 夜间灯光",
        "name": "Sentinel-2",
        "url": "https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml",
        "group": "light",
        "type": "wmts",
        "serviceType": "wmts",
        "visible": false
      },
    ]
  },
  //==========================灯光图层结束============================//
  //==========================地形图层开始============================//
  {
    "id": "terrain",
    "label": "地形图层",
    "expanded": true,
    "icon":`${iconPath}terrain.svg`,
    "children": [
      {
        "id": "terrain-World_maps-for-free",
        "label": "地形 World_maps-for-free",
        "name": "World_maps-for-free",
        "url": `https://maps-for-free.com/layer/relief/z{level}/row{row}/{level}_{col}-{row}.jpg`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-World_Ocean_Base",
        "label": "地形_World_Ocean_Base",
        "name": "地形_World_Ocean_Base",
        "url": `https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-EMODnet",
        "label": "地形_欧洲海洋观测EMODnet",
        "name": "地形_欧洲海洋观测EMODnet",
        "url": `https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-Esri-Topography",
        "label": "Esri Topography Map地形底图",
        "name": "Esri Topography Map地形底图",
        "url": `http://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-Esri-Shaded-Relief",
        "label": "Eris Shaded Relief 地形",
        "name": "Eris Shaded Relief 地形",
        "url": `https://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-Esri-World_Physical_Map",
        "label": "Eris World_Physical_Map",
        "name": "Eris World_Physical_Map",
        "url": `https://server.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-World_Terrain_Base",
        "label": "Eris World_Terrain_Base",
        "name": "Eris World_Terrain_Base",
        "url": `https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-google-pure-landuse",
        "label": "谷歌地形图-纯图-土地利用",
        "name": "谷歌地形图-纯图-土地利用",
        "url": `http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga&apistyle=s.e:l|p.v:off,s.t:1|s.e:g|p.v:off,s.t:21|p.v:off,s.t:20|p.v:off,s.t:2|p.v:off,s.t:3|p.v:off,s.t:3|s.e:l.i|p.v:off,s.t:4|p.v:off`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "terrain-google-pure-gray",
        "label": "谷歌地形图-纯图-灰色",
        "name": "Eris World_Terrain_Base",
        "url": `http://www.google.com/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m1!1e5`,
        "group": "terrain",
        "type": "terrain",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================地形图层结束============================//
  //==========================路网图层开始============================//
  {
    "id": "road-net",
    "label": "路网图层",
    "expanded": false,
    "icon":`${iconPath}road-net.svg`,
    "children": [
      {
        "id": "gaode-road-net-GJC02",
        "label": "高德路网标注图(GJC02)",
        "name": "高德路网标注图(GJC02)",
        "url": `https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8<ype=11`,
        "group": "road-net",
        "type": "road",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "google-road-net-GJC02",
        "label": "谷歌路网标记图层(GCJ02)",
        "name": "谷歌路网标记图层(GCJ02)",
        "url": `http://mt.google.com/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}`,
        "group": "road-net",
        "type": "road",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "OpenRailwayMap-road-net",
        "label": "基于OSM铁路数据的在线PNG底图OpenRailwayMap",
        "name": "OpenRailwayMap",
        "url": `https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png`,
        "group": "road-net",
        "type": "road",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "OpenRailwayMap-Maxspeed-road-net",
        "label": "ORM最大速度图 OpenRailwayMap Maxspeed",
        "name": "OpenRailwayMap Maxspeed",
        "url": `https://a.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png`,
        "group": "road-net",
        "type": "road",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================路网图层结束============================//
  //==========================注记图层开始============================//
  {
    "id": "anotation",
    "label": "注记图层",
    "expanded": true,
    "icon":`${iconPath}anotation.svg`,
    "children": [
      {
        "id": "tdt_vector_label",
        "label": "天地图矢量注记",
        "name": "tdt_vector_label",
        "url": `https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${TDT_TOKEN}`,
        "group": "anotation",
        "type": "anotation",
        "serviceType": "xyz",
        "visible": false
      },
      {
        "id": "World_Ocean_Reference",
        "label": "World_Ocean_Reference",
        "name": "World_Ocean_Reference",
        "url": `https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}`,
        "group": "anotation",
        "type": "anotation",
        "serviceType": "xyz",
        "visible": false
      },
    ]
  },
  //==========================注记图层结束============================//
  //==========================土地利用图层开始============================//
  {
    "id": "landuse",
    "label": "土地利用图层",
    "expanded": false,
    "icon":`${iconPath}landuse.svg`,
    "children": [
      {
        "id": "osm-landuse",
        "label": "osm土地利用",
        "name": "osm土地利用",
        "url": `https://maps.heigit.org/osmlanduse/service?VERSION=1.3.0&TRANSPARENT=true&QUERY_LAYERS=osmlanduse:osm_lulc&LAYERS=osmlanduse:osm_lulc_combined_osm4eo&BUFFER=0&INFO_FORMAT=application/json&FEATURE_COUNT=1&I=91&J=129&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&STYLES=&BBOX=12836528.782099359,3600489.7803449426,12993071.8160274,3757032.8142729835`,
        "group": "landuse",
        "type": "landuse",
        "serviceType": "wmts",
        "visible": false
      },
    ]
  },
  //==========================土地利用图层结束============================//
  //====================Wayback 历史影像图层 (自动生成)================//
  {
    "id": "Wayback-history",
    "label": "Wayback 历史影像图层",
    "expanded": false,
    "icon":`${iconPath}image.svg`,
    "children": [
      ...waybackLayerConfigs,
    ]
  }
  //====================Wayback 历史影像图层结束======================//
]

export default layers
