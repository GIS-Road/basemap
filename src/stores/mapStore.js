import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMapStore = defineStore('map', () => {
  // 当前地图模式：'2d' | '3d'
  const mapMode = ref('2d')

  // 图层列表（树形结构）
  const layerTree = ref([
    {
      id: 'base',
      label: '底图图层',
      type: 'group',
      expanded: true,
      children: [
        {
          id: 'osm',
          label: 'OpenStreetMap',
          type: 'base',
          visible: true
        },
        {
          id: 'tianditu_vec',
          label: '天地图矢量',
          type: 'base',
          visible: false
        },
        {
          id: 'tianditu_img',
          label: '天地图影像',
          type: 'base',
          visible: false
        },
        {
          id: 'arcgis',
          label: 'ArcGIS 卫星图',
          type: 'base',
          visible: false
        }
      ]
    },
    {
      id: 'overlay',
      label: '覆盖图层',
      type: 'group',
      expanded: true,
      children: [
        {
          id: 'boundary',
          label: '行政区划',
          type: 'overlay',
          visible: false
        },
        {
          id: 'poi',
          label: '兴趣点',
          type: 'overlay',
          visible: false
        }
      ]
    },
    {
      id: 'terrain',
      label: '地形图层',
      type: 'group',
      expanded: false,
      children: [
        {
          id: 'terrain_cesium',
          label: 'Cesium 地形',
          type: 'terrain',
          visible: false
        },
        {
          id: 'hillshade',
          label: '山体阴影',
          type: 'terrain',
          visible: false
        }
      ]
    }
  ])

  // 底图列表
  const baseMaps = [
    { id: 'osm', label: 'OpenStreetMap' },
    { id: 'tianditu_vec', label: '天地图矢量' },
    { id: 'tianditu_img', label: '天地图影像' },
    { id: 'arcgis', label: 'ArcGIS 卫星图' }
  ]

  // 当前活跃底图
  const activeBaseMap = ref('osm')

  // 地图中心 [lng, lat] - 默认中国中心
  const mapCenter = ref([104.0, 35.0])

  // 地图缩放级别
  const mapZoom = ref(4)

  // Cesium 相机状态
  const cesiumCamera = ref(null)

  // 切换地图模式
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

  return {
    mapMode,
    layerTree,
    baseMaps,
    activeBaseMap,
    mapCenter,
    mapZoom,
    cesiumCamera,
    toggleMapMode,
    setMapMode,
    setActiveBaseMap,
    setMapCenter,
    setMapZoom,
    setCesiumCamera,
    toggleLayerVisibility
  }
})
