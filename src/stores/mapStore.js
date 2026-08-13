import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import layerConfig from '../config/layers.js'

export const useMapStore = defineStore('map', () => {
  // 图层树（从配置文件构建）
  const layerTree = ref(layerConfig)

  // 当前地图模式：'2d' | '3d'
  const mapMode = ref('2d')

  // 底图列表（与 useMap2D.js 中 BASE_MAP_SOURCES 的 key 对应）
  const baseMaps = [
    { id: 'tianditu_img', label: '天地图影像' },
    { id: 'tdt_vector', label: '天地图矢量' },
    { id: 'osm', label: 'OpenStreetMap' }
  ]

  // 当前活跃底图 — 默认天地图影像
  const activeBaseMap = ref('tianditu_img')

  // 地图中心 [lng, lat] — 默认中国中心
  const mapCenter = ref([104.0, 35.0])

  // 地图缩放级别 — 默认 14（城市级）
  const mapZoom = ref(14)

  // 是否已完成定位（避免重复 fly-to）
  const hasLocated = ref(false)

  // 定位状态
  const locateStatus = ref('idle') // 'idle' | 'locating' | 'success' | 'error'

  // 绘制工具栏是否处于激活状态（阻止地图点击拾取坐标）
  const isDrawingActive = ref(false)

  // Cesium 相机状态
  const cesiumCamera = ref(null)

  // ==================== Actions ====================

  function toggleMapMode() {
    mapMode.value = mapMode.value === '2d' ? '3d' : '2d'
  }

  function setMapMode(mode) {
    mapMode.value = mode
  }

  function setActiveBaseMap(id) {
    activeBaseMap.value = id
  }

  function setMapCenter(center) {
    mapCenter.value = center
  }

  function setMapZoom(zoom) {
    mapZoom.value = zoom
  }

  function setCesiumCamera(camera) {
    cesiumCamera.value = camera
  }

  function setDrawingActive(active) {
    isDrawingActive.value = active
  }

  /**
   * 执行一次浏览器定位（单个配置）
   * @param {boolean} highAccuracy - 是否使用高精度
   * @param {number} timeout - 超时毫秒数
   * @returns {Promise<{lng: number, lat: number}>}
   */
  function getPositionOnce(highAccuracy, timeout) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            accuracy: pos.coords.accuracy || 0
          })
        },
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout, maximumAge: 60000 }
      )
    })
  }

  /**
   * IP 定位兜底：浏览器定位不可用时，通过多个免费接口获取城市级位置
   * 接口按顺序尝试，全部失败则 reject
   * @returns {Promise<{lng: number, lat: number, accuracy: number}>}
   */
  async function locateByIP() {
    const IP_PROVIDERS = [
      // geojs.io：免费、CORS 开放、国内可访问
      async () => {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(5000) })
        const data = await res.json()
        if (data.latitude != null && data.longitude != null) {
          return { lng: Number(data.longitude), lat: Number(data.latitude), accuracy: 50000, city: data.city }
        }
        throw new Error('geojs.io 定位失败')
      },
      // ipwho.is：免费、CORS 开放、国内可访问
      async () => {
        const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(5000) })
        const data = await res.json()
        if (data.success && data.latitude != null && data.longitude != null) {
          return { lng: data.longitude, lat: data.latitude, accuracy: 50000, city: data.city }
        }
        throw new Error('ipwho.is 定位失败')
      }
    ]
    let lastErr = null
    for (const provider of IP_PROVIDERS) {
      try {
        return await provider()
      } catch (err) {
        lastErr = err
        console.warn('[定位] IP 定位接口失败:', err.message)
      }
    }
    throw new Error(lastErr?.message || 'IP 定位不可用')
  }

  /**
   * 获取当前位置（三级降级）：
   * 1) 浏览器 GPS 高精度定位
   * 2) 失败 → 低精度重试（权限被拒则跳过直接走 IP 兜底）
   * 3) 仍失败 → IP 定位兜底（城市级）
   * @returns {Promise<{lng: number, lat: number, accuracy: number}>}
   */
  async function getCurrentLocation() {
    locateStatus.value = 'locating'
    try {
      // 非安全上下文（非 HTTPS / 非 localhost）下浏览器定位不可用，直接 IP 兜底
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return finalizeLocation(await locateByIP())
      }

      // 1) 高精度定位（8s 超时）
      try {
        return finalizeLocation(await getPositionOnce(true, 8000))
      } catch (err) {
        console.warn('[定位] 高精度定位失败:', err.message || err.code)
        // 权限被拒（code=1）：重试无意义，直接 IP 兜底
        if (err && err.code === 1) {
          return finalizeLocation(await locateByIP())
        }
      }

      // 2) 低精度重试（8s 超时）
      try {
        return finalizeLocation(await getPositionOnce(false, 8000))
      } catch (err) {
        console.warn('[定位] 低精度定位失败:', err.message || err.code)
      }

      // 3) IP 定位兜底
      return finalizeLocation(await locateByIP())
    } catch (err) {
      console.warn('[定位] 所有定位方式均失败:', err.message)
      locateStatus.value = 'error'
      throw err
    }
  }

  /**
   * 定位结果统一收口：更新 store 状态
   */
  function finalizeLocation(result) {
    mapCenter.value = [result.lng, result.lat]
    mapZoom.value = 14
    hasLocated.value = true
    locateStatus.value = 'success'
    return result
  }

  // 切换图层可见性
  function toggleLayerVisibility(layerId) {
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === layerId) {
          node.visible = !node.visible
          return true
        }
        if (node.children && traverse(node.children)) {
          return true
        }
      }
      return false
    }
    traverse(layerTree.value)
  }

  /**
   * 设置图层可见性（直接设置，不切换）
   */
  function setLayerVisibility(layerId, visible) {
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === layerId) {
          node.visible = visible
          return true
        }
        if (node.children && traverse(node.children)) {
          return true
        }
      }
      return false
    }
    traverse(layerTree.value)
  }

  /**
   * 获取图层可见性
   */
  function getLayerVisibility(layerId) {
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === layerId) return node.visible
        if (node.children) {
          const result = traverse(node.children)
          if (result !== undefined) return result
        }
      }
      return undefined
    }
    return traverse(layerTree.value)
  }

  /**
   * 设置图层透明度
   */
  function setLayerOpacity(layerId, opacity) {
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === layerId) {
          node.opacity = opacity
          return true
        }
        if (node.children && traverse(node.children)) {
          return true
        }
      }
      return false
    }
    traverse(layerTree.value)
  }

  /**
   * 获取图层透明度
   */
  function getLayerOpacity(layerId) {
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === layerId) return node.opacity
        if (node.children) {
          const result = traverse(node.children)
          if (result !== undefined) return result
        }
      }
      return undefined
    }
    return traverse(layerTree.value)
  }

  /**
   * 获取所有叶子图层按树顺序的扁平列表（用于 z-index 分配）
   * 越靠前（索引越小）的图层 zIndex 越小，离用户越远
   */
  function getFlatOrderedLayers() {
    const result = []
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.type !== 'group') {
          result.push(node)
        }
        if (node.children) traverse(node.children)
      }
    }
    traverse(layerTree.value)
    return result
  }

  return {
    mapMode,
    layerTree,
    baseMaps,
    activeBaseMap,
    mapCenter,
    mapZoom,
    hasLocated,
    locateStatus,
    cesiumCamera,
    isDrawingActive,
    toggleMapMode,
    setMapMode,
    setActiveBaseMap,
    setMapCenter,
    setMapZoom,
    setCesiumCamera,
    setDrawingActive,
    toggleLayerVisibility,
    setLayerVisibility,
    getLayerVisibility,
    setLayerOpacity,
    getLayerOpacity,
    getFlatOrderedLayers,
    getCurrentLocation
  }
})
