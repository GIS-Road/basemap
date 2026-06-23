import { ref } from 'vue'
import {
  Viewer,
  Cartesian3,
  Math as CesiumMath,
  createWorldTerrainAsync
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export function useMap3D() {
  const viewerInstance = ref(null)

  async function initViewer(container, options = {}) {
    const {
      center = [104.0, 35.0],
      zoom = 4
    } = options

    // 初始化 Cesium Viewer
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
      shouldAnimate: false
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
    viewerInstance.value = null
  }

  return {
    viewerInstance,
    initViewer,
    getCenter,
    getApproximateZoom,
    flyTo,
    destroyViewer
  }
}
