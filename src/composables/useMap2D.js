import { ref } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import { defaults as defaultControls } from 'ol/control'

// 底图源配置
const BASE_MAP_SOURCES = {
  osm: () => new TileLayer({
    source: new OSM(),
    visible: true
  }),
  tianditu_vec: () => new TileLayer({
    source: new XYZ({
      url: 'https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=YOUR_TIANDITU_KEY',
      crossOrigin: 'anonymous'
    }),
    visible: false
  }),
  tianditu_img: () => new TileLayer({
    source: new XYZ({
      url: 'https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=YOUR_TIANDITU_KEY',
      crossOrigin: 'anonymous'
    }),
    visible: false
  }),
  arcgis: () => new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'anonymous'
    }),
    visible: false
  })
}

export function useMap2D() {
  const mapInstance = ref(null)

  function initMap(target, options = {}) {
    const {
      center = [104.0, 35.0],
      zoom = 4,
      baseMap = 'osm'
    } = options

    const layers = Object.values(BASE_MAP_SOURCES).map(fn => fn())

    const map = new Map({
      target,
      layers,
      view: new View({
        center: fromLonLat(center),
        zoom,
        projection: 'EPSG:3857'
      }),
      controls: defaultControls({
        zoom: true,
        rotate: false,
        attribution: true
      })
    })

    // 设置初始底图
    switchBaseMap(map, baseMap)
    mapInstance.value = map

    return map
  }

  function switchBaseMap(map, mapId) {
    const layers = map.getLayers().getArray()
    layers.forEach(layer => {
      const source = layer.getSource()
      if (source) {
        let layerId = 'unknown'
        if (source instanceof OSM) layerId = 'osm'
        else if (source instanceof XYZ) {
          const url = source.getUrls()?.[0] || ''
          if (url.includes('tianditu') && url.includes('vec_w')) layerId = 'tianditu_vec'
          else if (url.includes('tianditu') && url.includes('img_w')) layerId = 'tianditu_img'
          else if (url.includes('arcgisonline')) layerId = 'arcgis'
        }
        layer.setVisible(layerId === mapId)
      }
    })
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
    getCenter,
    getZoom,
    setView,
    getExtent,
    destroyMap
  }
}
