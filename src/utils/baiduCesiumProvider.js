/**
 * Cesium 三维：百度 BD09MC 瓦片提供器
 *
 * 百度瓦片网格建立在 BD09MC（百度墨卡托）之上，与 Web Mercator 的米数不一致
 * （中纬度 y 相差约数十公里、比例差约 1.5%），且每级瓦片数不是 2 的幂
 * （z 级瓦片宽 = 256 * 2^(18-z) 米，覆盖东经 0~180° 仅约 153×96 块 z9 瓦片）。
 * Cesium 不像 OpenLayers 能自动做瓦片重投影，因此实现自定义 TilingScheme
 * （鸭子类型：Cesium 内部仅调用 rectangle/ellipsoid/projection/五个平铺方法，
 * 且 1.142 起 TilingScheme 抽象基类禁止直接实例化）。
 *
 * 约定（与 useMap2D 的 BD09MC 方案一致，实测验证）：
 *  - x = floor(mcX / S)，向东为正；y = floor(mcY / S)，向北为正；
 *    Cesium 瓦片 y 从北往南，恰好与百度 y 编号一致（第 0 行都在最北）
 *  - Cesium level L 直接对应百度 z = L（用 minimumLevel 跳过占位的 z=0；
 *    注意 customTags 无法覆盖内建 {z} 占位符，故不能做 z+1 偏移）
 *  - 服务端（starpic satepc）仅提供 x>=0 且 y>=0 的瓦片
 */
import {
  Rectangle,
  Cartesian2,
  Math as CesiumMath,
  WebMercatorProjection,
  Ellipsoid,
  UrlTemplateImageryProvider,
  ImageryProvider,
  Resource,
  defined
} from 'cesium'
import { lngLatToBaiduMercator, baiduMercatorToLngLat, BAIDU_EXTENT } from './baiduTile.js'

/** 百度卫星瓦片最低可用级别（z=0 服务端返回占位图） */
const BAIDU_MIN_Z = 1
/** 百度卫星瓦片最高可用级别（z=19 起服务端返回占位图） */
const BAIDU_MAX_Z = 18

/**
 * 百度 BD09MC 平铺方案
 *
 * projection 故意声明为 WebMercatorProjection（而非 Geographic）：
 * Cesium 的 ImageryLayer 仅在 imagery tilingScheme 的 projection 为
 * WebMercatorProjection 时启用 useWebMercatorT 路径——纹理坐标改在
 * 「原生坐标」（rectangleToNativeRectangle/tileXYToNativeRectangle 的输出，
 * 此处即 BD09MC 米）空间中线性插值。百度瓦片图像本身就是按 BD09MC
 * 线性绘制的，因此纹理可以精确贴合；若按 Geographic 声明，Cesium 会把
 * 纹理按纬度线性贴图，BD09MC 的墨卡托型非线性在低级别大瓦片（跨几十个
 * 纬度）上会产生严重的竖条状拉伸涂抹。
 * 地表顶点的 webMercatorT 属性由标准 Web Mercator 计算，与 BD09MC 仅差
 * GCJ 加偏造成的瓦片内近似常量偏移（米级，与百度影像固有的 GCJ 偏移同
 * 量级），不产生瓦片内非线性形变。
 */
class BaiduTilingScheme {
  constructor() {
    this._ellipsoid = Ellipsoid.WGS84
    this._projection = new WebMercatorProjection(this._ellipsoid)
    // 百度影像可服务范围：东经 0~180°、北纬 0~74°
    this._rectangle = Rectangle.fromDegrees(0, 0, 180, 74)
  }

  get ellipsoid() {
    return this._ellipsoid
  }

  get projection() {
    return this._projection
  }

  get rectangle() {
    return this._rectangle
  }

  /** level 级百度瓦片边长（BD09MC 米），level 直接对应百度 z */
  _tileSizeMeters(level) {
    return 256 * Math.pow(2, 18 - level)
  }

  getNumberOfXTilesAtLevel(level) {
    return Math.ceil(BAIDU_EXTENT[2] / this._tileSizeMeters(level))
  }

  getNumberOfYTilesAtLevel(level) {
    return Math.ceil(BAIDU_EXTENT[3] / this._tileSizeMeters(level))
  }

  /**
   * 瓦片 (x, y, level) → 经纬度矩形（弧度）
   * 返回网格单元的真实范围，不做服务范围裁剪：瓦片图像内容覆盖整个网格
   * 单元（包括服务范围之外的空白区），裁剪会导致边缘瓦片的整图纹理被
   * 压缩映射到缩小后的矩形上产生错位；显示范围由 provider.rectangle 裁剪，
   * Cesium 的纹理坐标交集计算会精确处理部分相交。
   * y 为 Cesium 约定（从北往南），第 0 行覆盖最北端
   */
  tileXYToRectangle(x, y, level, result) {
    const S = this._tileSizeMeters(level)
    // mcX ↔ 经度、mcY ↔ 纬度 换算相互独立（mcY 取 0/0 仅用于分带选择，
    // 各带 x/y 系数一致，误差可忽略；坐标换算用矩形中心纬度/经度保证
    // GCJ 加偏一致，见 rectangleToNativeRectangle 注释）
    const west = baiduMercatorToLngLat([x * S, 0])[0]
    const east = baiduMercatorToLngLat([(x + 1) * S, 0])[0]
    const north = baiduMercatorToLngLat([0, BAIDU_EXTENT[3] - y * S])[1]
    const south = baiduMercatorToLngLat([0, BAIDU_EXTENT[3] - (y + 1) * S])[1]
    return Rectangle.fromDegrees(west, south, east, north, result)
  }

  /** 瓦片 (x, y, level) → 原生 BD09MC 矩形（米），网格单元真实范围，不裁剪 */
  tileXYToNativeRectangle(x, y, level, result) {
    const S = this._tileSizeMeters(level)
    const west = x * S
    const east = (x + 1) * S
    const north = BAIDU_EXTENT[3] - y * S
    const south = BAIDU_EXTENT[3] - (y + 1) * S
    if (!defined(result)) {
      return new Rectangle(west, south, east, north)
    }
    result.west = west
    result.south = south
    result.east = east
    result.north = north
    return result
  }

  /**
   * 地理矩形 → 原生 BD09MC 矩形（米）
   * 百度 LL2MC/MC2LL 按纬度分带，且 GCJ 加偏同时依赖经纬度：
   * x/y 换算时用矩形中心的另一维坐标（而非 0），保证分带选择正确、
   * GCJ 偏移与矩形实际位置一致；x/y 各自单调，逐边换算即为边界值。
   */
  rectangleToNativeRectangle(rectangle, result) {
    const centerLng = CesiumMath.toDegrees((rectangle.west + rectangle.east) / 2)
    const centerLat = CesiumMath.toDegrees((rectangle.south + rectangle.north) / 2)
    const west = lngLatToBaiduMercator([CesiumMath.toDegrees(rectangle.west), centerLat])[0]
    const east = lngLatToBaiduMercator([CesiumMath.toDegrees(rectangle.east), centerLat])[0]
    const south = lngLatToBaiduMercator([centerLng, CesiumMath.toDegrees(rectangle.south)])[1]
    const north = lngLatToBaiduMercator([centerLng, CesiumMath.toDegrees(rectangle.north)])[1]
    if (!defined(result)) {
      return new Rectangle(west, south, east, north)
    }
    result.west = west
    result.south = south
    result.east = east
    result.north = north
    return result
  }

  /**
   * 经纬度位置 → 瓦片坐标
   * @param {Cartographic} position - 地理弧度
   */
  positionToTileXY(position, level, result) {
    const lng = CesiumMath.toDegrees(position.longitude)
    const lat = CesiumMath.toDegrees(position.latitude)
    const mc = lngLatToBaiduMercator([lng, lat])
    const S = this._tileSizeMeters(level)
    const x = Math.floor(mc[0] / S)
    const y = Math.floor((BAIDU_EXTENT[3] - mc[1]) / S)
    if (result) {
      result.x = x
      result.y = y
      return result
    }
    return new Cartesian2(x, y)
  }
}

/**
 * 创建百度卫星瓦片影像提供器（供 Cesium ImageryLayer 使用）
 *
 * 不能直接把带 `;` 分隔符的 URL 交给 UrlTemplateImageryProvider：
 * 其内部 Resource 会把 query 按 `&`/`=` 解析再重新序列化，
 * `u=x={x};y={y}` 这类「值中含 =」的参数会被破坏（{x} 直接丢失）。
 * 因此覆写 requestImage，在原始模板上自行完成占位符替换后再发起请求。
 * @param {string} url - 百度瓦片 URL 模板，支持 {s}（子域）与 {x}{y}{z}
 * @returns {UrlTemplateImageryProvider}
 */
export function createBaiduImageryProvider(url) {
  let tpl = url
  let subdomains = ['0', '1', '2', '3']
  // 兼容 {0-3} 子域写法（与 layers.js 中其他服务一致）
  const subMatch = tpl.match(/\{(\d+)-(\d+)\}/)
  if (subMatch) {
    const lo = Number(subMatch[1])
    const hi = Number(subMatch[2])
    subdomains = Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i))
    tpl = tpl.replace(/\{\d+-\d+\}/, '{s}')
  }

  class BaiduImageryProvider extends UrlTemplateImageryProvider {
    constructor() {
      // 基类 url 仅为占位（requestImage 已完全覆写，不会用到）
      super({
        url: 'https://maponline0.bdimg.com/starpic/',
        crossOrigin: 'anonymous',
        tilingScheme: new BaiduTilingScheme(),
        minimumLevel: BAIDU_MIN_Z,
        maximumLevel: BAIDU_MAX_Z
      })
      this._baiduTemplate = tpl
      this._baiduSubdomains = subdomains
    }

    requestImage(x, y, level, request) {
      const subs = this._baiduSubdomains
      const sub = subs[Math.abs(x + y) % subs.length]
      const finalUrl = this._baiduTemplate
        .replace(/\{s\}/g, sub)
        .replace(/\{x\}/g, String(x))
        .replace(/\{y\}/g, String(y))
        .replace(/\{z\}/g, String(level))
        // 关键：百度协议把 `u` 当作单个参数（内部用 ; 分隔 x/y/z），
        // 必须把值中的 = 和 ; 编码，否则 Resource 的 query 解析会破坏协议格式，
        // 服务端收不到完整的 x/y/z（实测返回占位图）
        .replace(/u=([^&]+)/, (m, v) => 'u=' + v.replace(/=/g, '%3D').replace(/;/g, '%3B'))
      return ImageryProvider.loadImage(this, new Resource({ url: finalUrl, request }))
    }
  }

  return new BaiduImageryProvider()
}
