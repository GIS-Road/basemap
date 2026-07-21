import { ref } from 'vue'
import OlMap from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import Projection from 'ol/proj/Projection'
import { addProjection, addCoordinateTransforms, getTransform, fromLonLat, toLonLat } from 'ol/proj'
import Zoom from 'ol/control/Zoom'
import Attribution from 'ol/control/Attribution'
import { tr } from 'element-plus/es/locales.mjs'

// ====================== 注册 EPSG:4490 坐标系 (CGCS2000) ======================
// 无需外部 proj4 库，通过坐标变换链实现 EPSG:4490 ↔ EPSG:4326 ↔ EPSG:3857
const cgcs2000 = new Projection({
  code: 'EPSG:4490',
  units: 'degrees',
  axisOrientation: 'enu'
})
addProjection(cgcs2000)

// EPSG:4326 ↔ EPSG:4490：CGCS2000 与 WGS84 在网页地图精度下可视为等价
addCoordinateTransforms(
  'EPSG:4326', 'EPSG:4490',
  (coord) => coord.slice(),
  (coord) => coord.slice()
)

// EPSG:3857 ↔ EPSG:4490：通过 EPSG:4326 中转
const to4326 = getTransform('EPSG:3857', 'EPSG:4326')
const from4326 = getTransform('EPSG:4326', 'EPSG:3857')
addCoordinateTransforms(
  'EPSG:3857', 'EPSG:4490',
  (coord) => to4326(coord),
  (coord) => from4326(coord)
)

// ====================== 天地图 Token ======================
const VITE_TDT_TOKEN = 'fa7ec9766b2c00747e3dd60ab3d05892'

// ====================== 底图源配置 ======================
// 预加载的底图图层，layerId 必须与 layers.js 中的 id 一致
const BASE_MAP_SOURCES = {
  osm: () => new TileLayer({
    source: new OSM(),
    visible: false,
    properties: { layerId: 'osm' }
  }),
  tdt_vector: () => new TileLayer({
    source: new XYZ({
      url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${VITE_TDT_TOKEN}`,
      crossOrigin: 'anonymous'
    }),
    visible: false,
    properties: { layerId: 'tdt_vector' }
  }),
  tianditu_img: () => new TileLayer({
    source: new XYZ({
      url: `https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${VITE_TDT_TOKEN}`,
      crossOrigin: 'anonymous'
    }),
    visible: true, // 默认天地图影像
    properties: { layerId: 'tianditu_img' }
  })
}

// ====================== Bing Maps quadkey 转换 ======================
// Bing 瓦片使用 quadkey（四叉键）寻址，每位编码 0/1/2/3 = 左上/右上/左下/右下
// OL 的 ol/source/XYZ 原生仅替换 {z}{x}{y}{-y}，不识别 {q}，故需手动转换
// Bing 与 Google/OSM 同为 Web Mercator + 左上角原点，y 无需翻转
function tileXYToQuadKey(x, y, z) {
  let quadKey = ''
  for (let i = z; i > 0; i--) {
    let digit = 0
    const mask = 1 << (i - 1)
    if ((x & mask) !== 0) digit++
    if ((y & mask) !== 0) digit += 2
    quadKey += digit
  }
  return quadKey
}

export function useMap2D() {
  const mapInstance = ref(null)

  function initMap(target, options = {}) {
    const {
      center = [104.0, 35.0],
      zoom = 14,
      baseMap = 'tianditu_img'
    } = options

    const layers = Object.values(BASE_MAP_SOURCES).map(fn => fn())

    // 视图使用 EPSG:3857 —— 天地图 img_w/vec_w 瓦片均为 Web Mercator 网格
    // 坐标显示通过 toLonLat() 转为经纬度，EPSG:4490≈EPSG:4326 在民用精度下等价
    const map = new OlMap({
      target,
      layers,
      view: new View({
        center: fromLonLat(center),  // EPSG:4326 → EPSG:3857
        zoom,
        projection: 'EPSG:3857',
        multiWorld: false
      }),
      controls: [
        new Zoom(),
        new Attribution()
      ]
    })

    // 设置初始底图
    switchBaseMap(map, baseMap)
    mapInstance.value = map

    return map
  }

  function switchBaseMap(map, mapId) {
    const layers = map.getLayers().getArray()
    layers.forEach(layer => {
      const id = layer.get('layerId')
      if (id) {
        layer.setVisible(id === mapId)
      }
    })
  }

  /**
   * 按图层ID控制可见性（用于图层面板联动）
   */
  function setLayerVisible(map, layerId, visible) {
    const layer = findLayerById(map.getLayers().getArray(), layerId)
    if (layer) {
      layer.setVisible(visible)
    }
  }

  /**
   * 按图层ID设置透明度（用于图层面板联动）
   */
  function setLayerOpacity(map, layerId, opacity) {
    const layer = findLayerById(map.getLayers().getArray(), layerId)
    if (layer) {
      layer.setOpacity(opacity)
    }
  }

  /**
   * 按 layerId 查找地图图层
   */
  function findLayerById(layers, id) {
    return layers.find(l => l.get('layerId') === id)
  }

  /**
   * 同步图层顺序到地图：根据图层树中从上到下的顺序设置 zIndex
   * 越靠上的图层 zIndex 越小（离用户越远），越靠下的图层 zIndex 越大（离用户越近）
   * @param {ol/Map} map
   * @param {Array} treeData - 图层树数据
   */
  function syncLayerOrder(map, treeData) {
    let zIndex = 0
    const allLayers = map.getLayers().getArray()
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.type !== 'group') {
          const layer = findLayerById(allLayers, node.id)
          if (layer) {
            layer.setZIndex(zIndex)
            zIndex++
          }
        }
        if (node.children) traverse(node.children)
      }
    }
    traverse(treeData)
  }

  // 动态图层注册表（用于 overlay / terrain 等非底图图层）
  const dynamicLayers = new Map()

  /**
   * 检查动态图层是否已加载
   * @param {string} layerId
   * @returns {boolean}
   */
  function hasDynamicLayer(layerId) {
    return dynamicLayers.has(layerId)
  }

  /**
   * 添加动态图层到地图最上层（覆盖层/地形层等非底图图层）
   * 如果同 ID 图层已存在，则跳过（不重复添加，不影响其他图层）
   * @param {ol/Map} map
   * @param {string} layerId
   * @param {ol/layer/Base} layer
   */
  function addLayerToTop(map, layerId, layer) {
    // 如果已存在同 ID 图层，跳过（避免重复添加影响其他图层）
    if (dynamicLayers.has(layerId)) return
    // 插入到集合末尾（渲染时在最上层）
    map.getLayers().push(layer)
    dynamicLayers.set(layerId, layer)
  }

  /**
   * 移除动态图层
   * @param {ol/Map} map
   * @param {string} layerId
   */
  function removeDynamicLayer(map, layerId) {
    const layer = dynamicLayers.get(layerId)
    if (layer) {
      map.removeLayer(layer)
      dynamicLayers.delete(layerId)
    }
  }

  /**
   * 为覆盖层/地形层等非底图图层创建 TileLayer 并添加到地图最上层
   * @param {ol/Map} map
   * @param {string} layerId
   * @param {string} url - XYZ 瓦片 URL 模板
   * @param {string} [serviceType='xyz'] - 图层服务类型，支持 xyz / osm
   * @param {Object} [options={}] - 额外选项
   * @param {number} [options.zoom] - 最小显示缩放级别（minZoom），低于此级别图层不显示
   */
  function createOverlayAndAddToTop(map, layerId, url, serviceType = 'xyz', options = {}) {
    if (!url) return
    let source
    if (serviceType === 'osm') {
      source = new OSM({
        url,
        opaque: true,
        crossOrigin: 'anonymous'
      })
    } else if (serviceType === 'xyz') {
      source = new XYZ({
        opaque: true,
        url,
        crossOrigin: 'anonymous'
      })
    } else if (url.includes('{q}')) {
      // Bing Maps quadkey 寻址：{q} 不被 OL 原生支持，用 tileUrlFunction 转换
      source = new XYZ({
        crossOrigin: 'anonymous',
        tileUrlFunction: (tileCoord) => {
          const [z, x, y] = tileCoord
          if (z == null || x == null || y == null) return undefined
          const quadKey = tileXYToQuadKey(x, y, z)
          let finalUrl = url.replace(/\{q\}/g, quadKey)
          // 子域名轮换：{0-3} / {0-7} 等，按 (x+y+z) hash 分担请求
          finalUrl = finalUrl.replace(/\{(\d+)-(\d+)\}/g, (m, min, max) => {
            const lo = Number(min), hi = Number(max)
            return String(lo + ((x + y + z) % (hi - lo + 1)))
          })
          return finalUrl
        }
      })
    } else if (serviceType === 'maps-for-free-terrain') {
      source = new OSM({
        url,
        crossOrigin: 'anonymous'
      })
    } else if (serviceType === 'maps-for-free-landuse') {
      source = new OSM({
        url,
        opaque: true,
        crossOrigin: 'anonymous'
      })
    } else {
      source = new XYZ({
        url,
        crossOrigin: 'anonymous'
      })
    }
    const layer = new TileLayer({
      source,
      visible: true,
      // minZoom: options.zoom || 0,
      properties: { layerId }
    })
    // map.addLayer(layer)
    addLayerToTop(map, layerId, layer)
  }

  /**
   * WMTS Capabilities 缓存：同一 URL 只 fetch + parse 一次
   * key = capabilitiesUrl, value = parsed caps object
   */
  const wmtsCapsCache = new Map()

  /**
   * 为 WMTS 图层解析 Capabilities XML 并添加到地图最上层
   * @param {ol/Map} map
   * @param {string} layerId
   * @param {string} capabilitiesUrl - WMTS GetCapabilities XML 地址
   * @param {Object} [options] - 覆盖选项
   * @param {string} [options.layerName] - 图层名（不传则用 capabilities 中第一个图层）
   * @param {string} [options.matrixSet] - 矩阵集名（不传则自动选择 EPSG:3857 兼容项）
   * @param {number} [options.zoom] - 最小显示缩放级别（minZoom），低于此级别图层不显示
   */
  async function createWmtsOverlayAndAddToTop(map, layerId, capabilitiesUrl, options = {}) {
    if (!capabilitiesUrl) return
    // 如果图层已加载，跳过（避免重复加载影响其他图层）
    if (dynamicLayers.has(layerId)) return

    try {
      // 优先使用缓存的 Capabilities 对象（同一 URL 的多个图层共享）
      let caps = wmtsCapsCache.get(capabilitiesUrl)
      if (!caps) {
        const response = await fetch(capabilitiesUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        let xmlText = await response.text()

        // 部分 WMTS 服务的 XML 使用 https:// 命名空间，
        // 而 OpenLayers 的 WMTSCapabilities 解析器仅识别 http:// 命名空间，
        // 导致 Contents/TileMatrixSet 等节点无法匹配。此处做命名空间归一化。
        xmlText = xmlText.replace(/https:\/\/www\.opengis\.net/g, 'http://www.opengis.net')

        const parser = new WMTSCapabilities()
        caps = parser.read(xmlText)
        wmtsCapsCache.set(capabilitiesUrl, caps)
      }

      // 优先使用用户指定的 layerName，否则取 Capabilities 中第一个图层
      const layerName = options.layerName || (caps.Contents?.Layer?.[0]?.Identifier)
      if (!layerName) {
        console.warn(`[WMTS] 未找到有效图层: ${capabilitiesUrl}`)
        return
      }

      // 自动选择 matrixSet：优先 EPSG:3857 / GoogleMapsCompatible / WGS84
      const matrixSets = caps.Contents?.TileMatrixSet || []
      const preferredMatrixSet = options.matrixSet
        || matrixSets.find(ms => ms.Identifier === 'EPSG:3857')?.Identifier
        || matrixSets.find(ms => ms.Identifier === 'GoogleMapsCompatible')?.Identifier
        || matrixSets.find(ms => ms.Identifier?.includes('3857'))?.Identifier
        || matrixSets[0]?.Identifier

      if (!preferredMatrixSet) {
        console.warn(`[WMTS] 未找到可用 matrixSet: ${capabilitiesUrl}`)
        return
      }

      // 使用 optionsFromCapabilities 提取完整配置（tileGrid / url / projection 等）
      const wmtsOptions = optionsFromCapabilities(caps, {
        layer: layerName,
        matrixSet: preferredMatrixSet
      })

      if (!wmtsOptions) {
        console.warn(`[WMTS] optionsFromCapabilities 返回空: ${capabilitiesUrl}`)
        return
      }

      // optionsFromCapabilities 已根据 Capabilities 自动判断 requestEncoding：
      //   - 服务提供 ResourceURL 时返回 REST 编码 + REST URL 模板
      //   - 否则返回 KVP 编码 + KVP 端点 URL
      // 强制覆盖 requestEncoding 会导致编码与 URL 不匹配（REST 模板 + KVP 参数），
      // 因此默认不覆盖，仅在调用方显式指定时才使用。
      const sourceOptions = {
        ...wmtsOptions,
        crossOrigin: 'anonymous'
      }
      if (options.requestEncoding) {
        sourceOptions.requestEncoding = options.requestEncoding
      }

      const source = new WMTS(sourceOptions)

      const layer = new TileLayer({
        source,
        visible: true,
        minZoom: options.zoom || 0,
        properties: { layerId }
      })

      addLayerToTop(map, layerId, layer)
      console.log(`[WMTS] 图层加载成功: ${layerId} (layer=${layerName}, matrixSet=${preferredMatrixSet}, encoding=${sourceOptions.requestEncoding || wmtsOptions.requestEncoding})`)
    } catch (err) {
      console.error(`[WMTS] 图层加载失败 ${layerId}:`, err)
    }
  }

  function getCenter(map) {
    return toLonLat(map.getView().getCenter())
  }

  function getZoom(map) {
    return map.getView().getZoom()
  }

  function setView(map, center, zoom) {
    map.getView().animate({
      center: fromLonLat(center),
      zoom,
      duration: 500
    })
  }

  /**
   * 飞行动画：平滑飞至目标位置并缩放
   * @param {ol/Map} map
   * @param {[number, number]} center [lng, lat]
   * @param {number} zoom
   * @param {number} duration 动画时长（ms），默认 2000
   */
  function flyToLocation(map, center, zoom, duration = 2000) {
    const view = map.getView()

    // 先缩小到较低级别，制造"起飞"效果
    view.animate({
      zoom: view.getZoom() - 3,
      duration: duration * 0.3
    }, () => {
      // 飞到目标位置并放大
      view.animate({
        center: fromLonLat(center),
        zoom,
        duration: duration * 0.7,
        easing: function (t) {
          // easeOutCubic：平滑减速
          return 1 - Math.pow(1 - t, 3)
        }
      })
    })
  }

  function getExtent(map) {
    const extent = map.getView().calculateExtent(map.getSize())
    const [minLon, minLat] = toLonLat([extent[0], extent[1]])
    const [maxLon, maxLat] = toLonLat([extent[2], extent[3]])
    return { west: minLon, south: minLat, east: maxLon, north: maxLat }
  }

  function destroyMap(map) {
    if (map) {
      map.setTarget(undefined)
      map.dispose()
    }
    mapInstance.value = null
  }

  return {
    mapInstance,
    initMap,
    switchBaseMap,
    setLayerVisible,
    setLayerOpacity,
    addLayerToTop,
    removeDynamicLayer,
    hasDynamicLayer,
    createOverlayAndAddToTop,
    createWmtsOverlayAndAddToTop,
    syncLayerOrder,
    getCenter,
    getZoom,
    setView,
    flyToLocation,
    getExtent,
    destroyMap
  }
}
