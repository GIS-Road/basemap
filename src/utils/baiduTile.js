/**
 * 百度瓦片适配工具
 *
 * 百度瓦片与标准 XYZ (OSM/Google/Esri) 的关键差异：
 *  1. 坐标系：百度用 BD-09 + 自定义墨卡托，不是 Web Mercator (EPSG:3857)
 *  2. 瓦片原点：百度瓦片原点在世界中心 (0,0)，x/y 索引可向负方向延伸
 *  3. 子域：maponline0 ~ maponline9（数字），不是 OL 默认的 a/b/c
 *
 * 本模块提供 EPSG:3857 / EPSG:4326 ↔ BD09MC 的坐标变换，
 * 供 useMap2D.js 注册 BAIDU 投影，让 OpenLayers 把百度瓦片重投影到 3857 视图。
 * 算法基于百度地图公开的 BD-09 / 百度墨卡托转换表（分段多项式拟合）。
 */

const PI = Math.PI
const X_PI = (PI * 3000) / 180

// ==================== WGS84 → GCJ02（火星坐标系，中国境内偏移） ====================
const GCJ_A = 6378245.0
const GCJ_EE = 0.00669342162296594323

function outOfChina(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0
  return ret
}

function transformLon(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat]
  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLon(lng - 105.0, lat - 35.0)
  const radLat = (lat / 180.0) * PI
  let magic = Math.sin(radLat)
  magic = 1 - GCJ_EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((GCJ_A * (1 - GCJ_EE)) / (magic * sqrtMagic)) * PI)
  dLng = (dLng * 180.0) / ((GCJ_A / sqrtMagic) * Math.cos(radLat) * PI)
  return [lng + dLng, lat + dLat]
}

// ==================== GCJ02 → BD-09 ====================
function gcj02ToBd09(lng, lat) {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI)
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI)
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006]
}

// ==================== BD-09 经纬度 → 百度墨卡托（分段多项式） ====================
const LLBAND = [75, 60, 45, 30, 15, 0]
const LL2MC = [
  [-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
  [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5],
  [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5],
  [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
  [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
  [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]
]

function getRange(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

// ==================== 百度墨卡托 → BD-09 经纬度（MC2LL 分段多项式） ====================
const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0]
const MC2LL = [
  [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
  [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86],
  [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
  [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
  [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
  [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]
]

function convertMC2LL(x, y) {
  const xAbs = Math.abs(x)
  const yAbs = Math.abs(y)
  let c = null
  for (let i = 0; i < MCBAND.length; i++) {
    if (yAbs >= MCBAND[i]) {
      c = MC2LL[i]
      break
    }
  }
  if (!c) {
    for (let i = MCBAND.length - 1; i >= 0; i--) {
      if (yAbs <= -MCBAND[i]) {
        c = MC2LL[i]
        break
      }
    }
  }
  if (!c) return [0, 0]

  const lng = c[0] + c[1] * xAbs
  const cc = yAbs / c[9]
  let lat = c[2]
  for (let i = 1; i < 7; i++) {
    lat += c[2 + i] * Math.pow(cc, i)
  }
  return [x < 0 ? -lng : lng, y < 0 ? -lat : lat]
}

// ==================== BD-09 → GCJ02 ====================
function bd09ToGcj02(bdLng, bdLat) {
  const x = bdLng - 0.0065
  const y = bdLat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
  return [z * Math.cos(theta), z * Math.sin(theta)]
}

// ==================== GCJ02 → WGS84（迭代反解，精度 ~1e-7 度） ====================
function gcj02ToWgs84(lng, lat) {
  if (outOfChina(lng, lat)) return [lng, lat]
  const [tmpLng, tmpLat] = wgs84ToGcj02(lng, lat)
  return [lng * 2 - tmpLng, lat * 2 - tmpLat]
}

function convertLL2MC(lng, lat) {
  // 必须用钳制而非回绕：BD09 偏移会把 180° 推到 180.0065°，
  // 若回绕到 -179.99° 会导致东边界 mcX 符号翻转（变为负值），
  // 上层所有以它为边界的矩形交集计算全部失效
  lng = getRange(lng, -180, 180)
  lat = getRange(lat, -74, 74)

  // 波段选择必须用 |lat|：原实现负纬度会落入错误的分段，南半球坐标被严重歪曲
  const latAbs = Math.abs(lat)
  let c = null
  for (let i = 0; i < LLBAND.length; i++) {
    if (latAbs >= LLBAND[i]) {
      c = LL2MC[i]
      break
    }
  }
  if (!c) return [0, 0]

  const lngAbs = Math.abs(lng)
  let x = c[0] + c[1] * lngAbs
  const cc = latAbs / c[9]
  // c[2]..c[8] 是 7 项多项式系数
  let y = c[2]
  for (let i = 1; i < 7; i++) {
    y += c[2 + i] * Math.pow(cc, i)
  }
  return [lng < 0 ? -x : x, lat < 0 ? -y : y]
}

// ==================== Web Mercator 米 → WGS84 经纬度 ====================
const ORIGIN_SHIFT = 20037508.342789244

function webMercatorToLngLat(x, y) {
  const lng = (x / ORIGIN_SHIFT) * 180
  let lat = (y / ORIGIN_SHIFT) * 180
  lat = (180 / PI) * (2 * Math.atan(Math.exp((lat * PI) / 180)) - PI / 2)
  return [lng, lat]
}

// ==================== 对外导出：BD09MC 投影转换（供 OL 注册投影用） ====================
/**
 * 百度卫星瓦片索引约定（实测验证）：
 *  - x = floor(mcX / (256 * 2^(18-z)))，向东为正，原点在本初子午线/赤道交点
 *  - y = floor(mcY / (256 * 2^(18-z)))，向北为正（注意与 OL tileGrid 的 y 向下相反）
 *  - 服务端（starpic satepc）仅提供 x>=0 且 y>=0 的瓦片，负方向返回"无卫星图"占位图
 */

/** EPSG:4326 经纬度（度）→ BD09MC（百度墨卡托 米） */
export function lngLatToBaiduMercator(coord) {
  const [gcjLng, gcjLat] = wgs84ToGcj02(coord[0], coord[1])
  const [bdLng, bdLat] = gcj02ToBd09(gcjLng, gcjLat)
  return convertLL2MC(bdLng, bdLat)
}

/** BD09MC（百度墨卡托 米）→ EPSG:4326 经纬度（度） */
export function baiduMercatorToLngLat(coord) {
  const [bdLng, bdLat] = convertMC2LL(coord[0], coord[1])
  const [gcjLng, gcjLat] = bd09ToGcj02(bdLng, bdLat)
  return gcj02ToWgs84(gcjLng, gcjLat)
}

/** BD09MC 投影范围：东经 0~180°、北纬 0~74°（百度影像实际可服务区域） */
export const BAIDU_EXTENT = [0, 0, 20037726.37, 12474104.17]

// ==================== 投影转换（供 OL addCoordinateTransforms 注册用） ====================

/** EPSG:3857 (Web Mercator 米) → BAIDU (百度墨卡托 米) */
export function webMercatorToBaiduMercator(coord) {
  const [lng, lat] = webMercatorToLngLat(coord[0], coord[1])
  const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat)
  const [bdLng, bdLat] = gcj02ToBd09(gcjLng, gcjLat)
  const [x, y] = convertLL2MC(bdLng, bdLat)
  return [x, y]
}

/** BAIDU (百度墨卡托 米) → EPSG:3857 (Web Mercator 米) */
export function baiduMercatorToWebMercator(coord) {
  const [bdLng, bdLat] = convertMC2LL(coord[0], coord[1])
  const [gcjLng, gcjLat] = bd09ToGcj02(bdLng, bdLat)
  const [wgsLng, wgsLat] = gcj02ToWgs84(gcjLng, gcjLat)
  // WGS84 → Web Mercator
  const x = (wgsLng * ORIGIN_SHIFT) / 180
  let y = (wgsLat * ORIGIN_SHIFT) / 180
  y = (Math.log(Math.tan(((90 + wgsLat) * PI) / 360)) / (PI / 180)) * (ORIGIN_SHIFT / 180)
  return [x, y]
}
