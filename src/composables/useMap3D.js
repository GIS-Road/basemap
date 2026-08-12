import { ref } from 'vue'
import {
  Viewer,
  Cartesian3,
  Math as CesiumMath,
  UrlTemplateImageryProvider,
  ImageryLayer,
  createWorldTerrainAsync
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

/**
 * @description Cesium 三维地图封装
 * @file       useMap3D.js
 * @author     gis_road
 * @date       2026-08-12
 *
 * 能力：
 * 1. 创建 Cesium Viewer（关闭默认底图，底图由图层树驱动）
 * 2. 将图层树（LayerTree）中的在线服务同步到 3D 场景：
 *    - XYZ 瓦片（天地图 / Esri / 谷歌 / 高德 / OSM 等）
 *    - WMTS（Capabilities 解析 / REST 模板）
 *    - 显隐控制、透明度、层级顺序（与 2D zIndex 语义一致：树中靠前的在下层）
 */

// ====================== 底图图层 ID ======================
// 与图层树 layers.js 中的 id 一致；右上角底图选择器中的 'osm'
// 对应图层树中的 'osm_vector' 节点
export const BASE_MAP_IDS = ['tianditu_img', 'tdt_vector', 'osm_vector']

// 天地图最大级别（超出返回 404）
const TDT_MAX_LEVEL = 18

// WMTS Capabilities 缓存：同一 URL 只 fetch + 解析一次
const wmtsCapsCache = new Map()

/**
 * 将 OL/XYZ 风格的瓦片 URL 模板转换为 Cesium UrlTemplateImageryProvider 支持的格式
 * 1) {0-7} / {0-3} 子域写法  → {s} + subdomains 数组
 * 2) {q}（Bing quadkey）     → 不支持，返回 null
 * 3) WMTS REST 占位符        → {TileMatrix}→{z}  {TileRow}→{reverseY}  {TileCol}→{x}
 * 4) TMS 反 Y 占位符         → {_y} / {-y} → {reverseY}
 * @param {string} url
 * @returns {{url: string, subdomains?: string[]}|null}
 */
function normalizeTileUrl(url) {
  let subdomains

  // 1) 子域 {0-7} / {0-3} → {s} + subdomains
  const subMatch = url.match(/\{(\d+)-(\d+)\}/)
  if (subMatch) {
    const lo = Number(subMatch[1])
    const hi = Number(subMatch[2])
    subdomains = Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i))
    url = url.replace(/\{\d+-\d+\}/, '{s}')
  }

  // 2) Bing quadkey 寻址不支持
  if (url.includes('{q}')) return null

  // 3) WMTS REST 占位符转换
  url = url
    .replace(/\/\{TileMatrixSet\}\/?/g, '/')
    .replace(/\/\{style\}\/?/g, '/')
    .replace(/\{TileMatrixSet\}/g, '')
    .replace(/\{TileMatrix\}/g, '{z}')
    .replace(/\{TileRow\}/g, '{reverseY}')
    .replace(/\{TileCol\}/g, '{x}')
    .replace(/\{style\}/g, '')

  // 4) TMS 反 Y 占位符
  url = url.replace(/\{_y\}/g, '{reverseY}')
  url = url.replace(/\{-y\}/g, '{reverseY}')

  return { url, subdomains }
}

/**
 * 从 XML 元素中按多个可能的标签名查找子元素（兼容 ows: 前缀命名空间）
 */
function getTag(el, ...names) {
  for (const name of names) {
    const found = el.getElementsByTagName(name)[0]
    if (found) return found
  }
  return null
}

function getTagAll(el, ...names) {
  for (const name of names) {
    const found = el.getElementsByTagName(name)
    if (found.length) return Array.from(found)
  }
  return []
}

/**
 * 解析 WMTS GetCapabilities XML，创建影像提供器
 * 优先使用 REST ResourceURL 模板，其次构造 KVP GetTile 模板
 * @param {string} capsUrl - capabilities XML 地址
 * @param {string} [preferredLayerName] - 期望的图层名（不匹配则取第一个图层）
 * @returns {Promise<UrlTemplateImageryProvider|null>}
 */
async function createWmtsProviderFromCapabilities(capsUrl, preferredLayerName) {
  let doc = wmtsCapsCache.get(capsUrl)
  if (!doc) {
    const response = await fetch(capsUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    let xmlText = await response.text()
    // 命名空间归一化（部分服务使用 https:// 命名空间，DOMParser 下不影响解析，此处兼容处理）
    xmlText = xmlText.replace(/https:\/\/www\.opengis\.net/g, 'http://www.opengis.net')
    doc = new DOMParser().parseFromString(xmlText, 'application/xml')
    wmtsCapsCache.set(capsUrl, doc)
  }

  // 收集所有图层
  const allLayers = getTagAll(doc, 'Layer').filter(l => getTag(l, 'Identifier', 'ows:Identifier'))
  if (!allLayers.length) throw new Error('Capabilities 中未找到任何图层')

  let layerEl = null
  if (preferredLayerName) {
    layerEl = allLayers.find(l => {
      const id = getTag(l, 'Identifier', 'ows:Identifier')?.textContent?.trim()
      return id === preferredLayerName
    })
    if (!layerEl) {
      layerEl = allLayers.find(l => {
        const id = getTag(l, 'Identifier', 'ows:Identifier')?.textContent?.trim() || ''
        return id.toLowerCase().includes(preferredLayerName.toLowerCase())
      })
    }
  }
  if (!layerEl) layerEl = allLayers[0]

  const layerName = getTag(layerEl, 'Identifier', 'ows:Identifier').textContent.trim()

  // TileMatrixSet：优先图层声明的，其次全局选择 3857 兼容项
  let tmsId = getTag(layerEl, 'TileMatrixSet')?.textContent?.trim()
  if (!tmsId) {
    const allTms = getTagAll(doc, 'TileMatrixSet')
    const tms3857 = allTms.find(t =>
      (getTag(t, 'Identifier', 'ows:Identifier')?.textContent || '').includes('3857')
    )
    const tmsEl = tms3857 || allTms[0]
    tmsId = getTag(tmsEl, 'Identifier', 'ows:Identifier')?.textContent?.trim()
  }

  const styleEl = getTag(layerEl, 'Style')
  const styleId = getTag(styleEl, 'Identifier', 'ows:Identifier')?.textContent?.trim() || 'default'

  // 优先 REST ResourceURL 模板
  const resourceUrl = getTagAll(layerEl, 'ResourceURL').find(r => r.getAttribute('resourceType') === 'tile')
  const template = resourceUrl?.getAttribute('template')
  if (template) {
    let tpl = template
      .replace(/\{TileMatrixSet\}/g, tmsId || '')
      .replace(/\{style\}/g, styleId)
    const norm = normalizeTileUrl(tpl)
    if (norm) {
      return new UrlTemplateImageryProvider({ url: norm.url, subdomains: norm.subdomains })
    }
  }

  // 兜底：KVP GetTile 模板
  const formatEl = getTag(layerEl, 'Format')
  const format = formatEl?.textContent?.trim() || 'image/jpeg'
  const baseUrl = capsUrl.replace(/[?#].*$/, '').replace(/WMTSCapabilities\.xml.*$/i, '').replace(/\/+$/, '')
  const kvpTpl = `${baseUrl}?service=WMTS&request=GetTile&version=1.0.0` +
    `&layer=${encodeURIComponent(layerName)}` +
    `&style=${encodeURIComponent(styleId)}` +
    `&tilematrixset=${encodeURIComponent(tmsId || '')}` +
    `&TileMatrix={z}&TileRow={reverseY}&TileCol={x}&format=${encodeURIComponent(format)}`
  return new UrlTemplateImageryProvider({ url: kvpTpl })
}

/**
 * 根据图层配置创建 Cesium 影像提供器
 * 支持 serviceType: xyz（大部分在线服务）/ wmts（Capabilities 或 REST 模板）
 * @param {Object} layerConfig - 图层树中的叶子节点配置
 * @returns {Promise<UrlTemplateImageryProvider|null>}
 */
async function createImageryProvider(layerConfig) {
  const { id, url, serviceType } = layerConfig
  if (!url) return null
  try {
    // WMTS：优先 Capabilities 解析，其次 REST 模板
    if (serviceType === 'wmts') {
      if (/WMTSCapabilities|capabilities/i.test(url)) {
        return await createWmtsProviderFromCapabilities(url, layerConfig.name)
      }
      if (url.includes('{TileMatrix') || url.includes('{TileMatrixSet')) {
        const norm = normalizeTileUrl(url)
        if (norm) return new UrlTemplateImageryProvider({ url: norm.url, subdomains: norm.subdomains })
      }
      console.warn(`[3D] WMTS 图层 ${id} 既非 Capabilities 地址也无模板占位符，跳过`)
      return null
    }

    // XYZ 及其他模板瓦片
    const norm = normalizeTileUrl(url)
    if (!norm) {
      console.warn(`[3D] 图层 ${id} 的 URL 模板无法转换（可能含 {q} 等不支持占位符），跳过`)
      return null
    }
    // 天地图服务最高 18 级，超出会 404
    const maximumLevel = /tianditu/i.test(id) ? TDT_MAX_LEVEL : undefined
    return new UrlTemplateImageryProvider({
      url: norm.url,
      subdomains: norm.subdomains,
      maximumLevel
    })
  } catch (err) {
    console.warn(`[3D] 创建影像提供器失败 ${id}:`, err.message)
    return null
  }
}

export function useMap3D() {
  const viewerInstance = ref(null)

  // 已加载到 3D 场景的影像图层注册表
  // key: layerId, value: { layer, config }
  const dynamicImageryLayers = new Map()

  function isBaseLayer(layerId) {
    return BASE_MAP_IDS.includes(layerId)
  }

  /**
   * 将图层树中的在线服务同步到 Cesium 场景
   * - 可见图层：自动创建影像图层并添加（底图用 show 控制，动态图层用增删控制）
   * - 不可见图层：动态图层移除，底图仅隐藏（保留 provider 以便快速切换）
   * - 透明度：同步到 ImageryLayer.alpha
   * - 层级顺序：树中靠前的图层在下层（与 2D zIndex 语义一致）
   * @param {Viewer} viewer - Cesium Viewer 实例
   * @param {Array} layerTree - 图层树数据
   */
  async function syncLayersToViewer(viewer, layerTree) {
    if (!viewer) return

    // 收集叶子图层（按树顺序）
    const leafNodes = []
    const collect = (nodes) => {
      for (const node of nodes) {
        if (node.type !== 'group' && !node.children) {
          leafNodes.push(node)
        }
        if (node.children) collect(node.children)
      }
    }
    collect(layerTree)

    // 1) 显隐 + 透明度同步
    for (const node of leafNodes) {
      const isBase = isBaseLayer(node.id)
      const existing = dynamicImageryLayers.get(node.id)

      if (node.visible) {
        if (!existing) {
          // 动态创建影像图层
          const provider = await createImageryProvider(node)
          if (provider) {
            const layer = new ImageryLayer(provider, {
              alpha: node.opacity ?? 1
            })
            viewer.imageryLayers.add(layer)
            dynamicImageryLayers.set(node.id, { layer, config: node })
          }
        } else {
          existing.layer.show = true
          if (node.opacity != null) existing.layer.alpha = node.opacity
        }
      } else {
        if (existing) {
          if (isBase) {
            // 底图隐藏（保留 provider，切换底图时无需重新请求）
            existing.layer.show = false
          } else {
            // 动态图层移除
            viewer.imageryLayers.remove(existing.layer, false)
            dynamicImageryLayers.delete(node.id)
          }
        }
      }
    }

    // 2) 层级顺序同步
    syncImageryOrder(viewer, leafNodes)
  }

  /**
   * 同步影像图层渲染顺序：树中靠前的图层在下层（离地球表面近），
   * 与 2D 中"越靠上 zIndex 越小（离用户越远）"语义一致
   */
  function syncImageryOrder(viewer, leafNodes) {
    const layers = viewer.imageryLayers
    const expected = leafNodes
      .filter(n => n.visible && dynamicImageryLayers.has(n.id))
      .map(n => dynamicImageryLayers.get(n.id).layer)

    const current = []
    for (let i = 0; i < layers.length; i++) current.push(layers.get(i))

    // 顺序一致则跳过，避免无谓的销毁重建
    if (current.length === expected.length && current.every((l, i) => l === expected[i])) return

    // 全部移除后按期望顺序重新添加（ImageryLayer 内部瓦片缓存保留，不会重新请求）
    for (const l of current) layers.remove(l, false)
    for (const l of expected) layers.add(l)
  }

  async function initViewer(container, options = {}) {
    const {
      center = [104.0, 35.0],
      zoom = 4
    } = options

    // 初始化 Cesium Viewer（关闭默认影像底图，底图由图层树驱动加载）
    const viewer = new Viewer(container, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      homeButton: true,
      sceneModePicker: false,
      navigationHelpButton: false,
      geocoder: false,
      infoBox: false,
      selectionIndicator: false,
      scene3DOnly: false,
      shouldAnimate: false,
      baseLayer: false // 不创建默认影像图层
    })

    // 设置初始视角
    const height = getHeightFromZoom(zoom)
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(center[0], center[1], height),
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-45),
        roll: 0
      },
      duration: 0
    })

    // 尝试加载地形
    try {
      const terrainProvider = await createWorldTerrainAsync()
      viewer.terrainProvider = terrainProvider
    } catch (e) {
      console.warn('默认地形加载失败，使用无地形模式:', e.message)
    }

    viewerInstance.value = viewer
    return viewer
  }

  function getHeightFromZoom(zoom) {
    // 将 OpenLayers zoom 级别转换为 Cesium 相机高度
    const heights = {
      1: 20000000,
      2: 10000000,
      3: 5000000,
      4: 2500000,
      5: 1200000,
      6: 600000,
      7: 300000,
      8: 150000,
      9: 70000,
      10: 35000,
      11: 18000,
      12: 9000,
      13: 4500,
      14: 2200,
      15: 1100,
      16: 550,
      17: 280,
      18: 140,
      19: 70
    }
    return heights[Math.round(zoom)] || 2500000
  }

  function getCenter(viewer) {
    const cameraPos = viewer.camera.positionCartographic
    if (!cameraPos) return [104.0, 35.0]
    return [
      CesiumMath.toDegrees(cameraPos.longitude),
      CesiumMath.toDegrees(cameraPos.latitude)
    ]
  }

  function getApproximateZoom(viewer) {
    const height = viewer.camera.positionCartographic?.height || 2500000
    const zoomMap = {
      20000000: 1, 10000000: 2, 5000000: 3, 2500000: 4,
      1200000: 5, 600000: 6, 300000: 7, 150000: 8,
      70000: 9, 35000: 10, 18000: 11, 9000: 12,
      4500: 13, 2200: 14, 1100: 15, 550: 16,
      280: 17, 140: 18, 70: 19
    }

    let closestZoom = 4
    let closestDist = Infinity
    for (const [h, z] of Object.entries(zoomMap)) {
      const dist = Math.abs(height - Number(h))
      if (dist < closestDist) {
        closestDist = dist
        closestZoom = z
      }
    }
    return closestZoom
  }

  function flyTo(viewer, center, zoom) {
    const height = getHeightFromZoom(zoom)
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(center[0], center[1], height),
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-45),
        roll: 0
      },
      duration: 1.0
    })
  }

  function destroyViewer(viewer) {
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy()
    }
    dynamicImageryLayers.clear()
    viewerInstance.value = null
  }

  return {
    viewerInstance,
    BASE_MAP_IDS,
    initViewer,
    syncLayersToViewer,
    getCenter,
    getApproximateZoom,
    flyTo,
    destroyViewer
  }
}
