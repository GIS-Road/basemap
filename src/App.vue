<template>
  <div class="app-container">
    <!-- 顶部标题栏 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4096FF" />
                <stop offset="100%" stop-color="#1677FF" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="none" stroke="url(#logoGrad)" stroke-width="2" />
            <ellipse cx="16" cy="14" rx="8" ry="5" fill="none" stroke="url(#logoGrad)" stroke-width="1.5" opacity="0.7" />
            <line x1="16" y1="4" x2="16" y2="2" stroke="#4096FF" stroke-width="1.5" />
            <line x1="16" y1="28" x2="16" y2="30" stroke="#4096FF" stroke-width="1.5" />
            <circle cx="12" cy="13" r="1.5" fill="#69b1ff" />
            <circle cx="20" cy="15" r="1.5" fill="#69b1ff" />
            <circle cx="16" cy="18" r="1" fill="#69b1ff" />
            <path d="M10 10 L8 8 M22 18 L24 20 M22 10 L24 8 M10 18 L8 20"
              stroke="#69b1ff" stroke-width="0.8" opacity="0.5" />
          </svg>
        </div>
        <h1 class="header-title">在线底图服务系统</h1>
      </div>
      <div class="header-right">
        <span class="mode-badge" :class="mapStore.mapMode">
          {{ mapStore.mapMode === '2d' ? '二维模式' : '三维模式' }}
        </span>
        <div class="coord-display">
          <svg viewBox="0 0 14 14" width="14" height="14" style="margin-right: 4px;">
            <circle cx="7" cy="7" r="1.5" fill="#4096FF" />
            <circle cx="7" cy="7" r="5" fill="none" stroke="#4096FF" stroke-width="0.8" opacity="0.5" />
            <line x1="7" y1="1" x2="7" y2="3.5" stroke="#4096FF" stroke-width="0.6" opacity="0.5" />
            <line x1="7" y1="10.5" x2="7" y2="13" stroke="#4096FF" stroke-width="0.6" opacity="0.5" />
            <line x1="1" y1="7" x2="3.5" y2="7" stroke="#4096FF" stroke-width="0.6" opacity="0.5" />
            <line x1="10.5" y1="7" x2="13" y2="7" stroke="#4096FF" stroke-width="0.6" opacity="0.5" />
          </svg>
          <span>{{ coordText }}</span>
        </div>
      </div>
    </header>

    <div class="app-body">
      <!-- 左侧图层树 -->
      <LayerTree />

      <!-- 地图区域 -->
      <main class="map-area">
        <!-- 加载状态 -->
        <Transition name="fade">
          <div v-if="isLoading" class="map-loading">
            <div class="loading-spinner"></div>
            <p>地图加载中...</p>
          </div>
        </Transition>

        <!-- 二维地图 -->
        <div
          v-show="mapStore.mapMode === '2d'"
          ref="map2dRef"
          class="map-container"
        ></div>

        <!-- 三维地图 -->
        <div
          v-show="mapStore.mapMode === '3d'"
          ref="map3dRef"
          class="map-container"
        ></div>

        <!-- 2D/3D 切换按钮 -->
        <MapToggle
          @toggle="handleMapToggle"
          @mode-change="handleModeChange"
        />

        <!-- 底图选择器（悬浮在地图上的浮动工具栏） -->
        <div class="base-map-selector" v-if="mapStore.mapMode === '2d'">
          <div
            v-for="bm in mapStore.baseMaps"
            :key="bm.id"
            class="base-map-item"
            :class="{ active: mapStore.activeBaseMap === bm.id }"
            @click="switchBaseMap(bm.id)"
          >
            {{ bm.label }}
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMapStore } from './stores/mapStore'
import { useMap2D } from './composables/useMap2D'
import { useMap3D } from './composables/useMap3D'
import LayerTree from './components/LayerTree.vue'
import MapToggle from './components/MapToggle.vue'

const mapStore = useMapStore()
const { initMap, switchBaseMap: switch2DBase, getCenter, getZoom, setView, destroyMap } = useMap2D()
const { initViewer, getCenter: get3DCenter, getApproximateZoom, flyTo, destroyViewer } = useMap3D()

const map2dRef = ref(null)
const map3dRef = ref(null)
const isLoading = ref(false)
const coordText = ref('104.00°E, 35.00°N')

let map2d = null
let viewer3d = null
let coordWatchHandle = null

// 初始化二维地图
async function init2DMap() {
  if (!map2dRef.value) return
  await nextTick()
  map2d = initMap(map2dRef.value, {
    center: mapStore.mapCenter,
    zoom: mapStore.mapZoom,
    baseMap: mapStore.activeBaseMap
  })

  // 监听视角变化
  map2d.on('moveend', () => {
    const center = getCenter(map2d)
    const zoom = getZoom(map2d)
    mapStore.setMapCenter([center[0], center[1]])
    mapStore.setMapZoom(zoom)
    updateCoordDisplay(center)
  })
}

// 初始化三维地图
async function init3DMap() {
  if (!map3dRef.value) return
  await nextTick()
  viewer3d = await initViewer(map3dRef.value, {
    center: mapStore.mapCenter,
    zoom: mapStore.mapZoom
  })

  // 监听相机变化
  viewer3d.camera.changed.addEventListener(() => {
    const center = get3DCenter(viewer3d)
    const zoom = getApproximateZoom(viewer3d)
    mapStore.setMapCenter([center[0], center[1]])
    mapStore.setMapZoom(zoom)
    updateCoordDisplay(center)
  })
}

function updateCoordDisplay(center) {
  const lng = center[0].toFixed(2)
  const lat = center[1].toFixed(2)
  const lngDir = lng >= 0 ? 'E' : 'W'
  const latDir = lat >= 0 ? 'N' : 'S'
  coordText.value = `${Math.abs(lng)}°${lngDir}, ${Math.abs(lat)}°${latDir}`
}

// 切换底图
function switchBaseMap(mapId) {
  mapStore.setActiveBaseMap(mapId)
  if (map2d) {
    switch2DBase(map2d, mapId)
  }
}

// 切换 2D/3D
async function handleMapToggle() {
  isLoading.value = true
  const prevMode = mapStore.mapMode

  try {
    if (prevMode === '2d') {
      // 切换到 3D
      mapStore.setMapMode('3d')
      await nextTick()

      if (!viewer3d) {
        await init3DMap()
      } else {
        // 同步视角
        if (map2d) {
          const center = getCenter(map2d)
          const zoom = getZoom(map2d)
          flyTo(viewer3d, [center[0], center[1]], zoom)
        }
      }

      // 销毁 2D 地图（节约资源）
      if (map2d) {
        destroyMap(map2d)
        map2d = null
      }
    } else {
      // 切换到 2D
      mapStore.setMapMode('2d')
      await nextTick()

      if (!map2d) {
        await init2DMap()
      } else {
        // 同步视角
        if (viewer3d) {
          const center = get3DCenter(viewer3d)
          const zoom = getApproximateZoom(viewer3d)
          setView(map2d, [center[0], center[1]], zoom)
        }
      }

      // 销毁 3D 地球（节约资源）
      if (viewer3d) {
        destroyViewer(viewer3d)
        viewer3d = null
      }
    }
  } catch (err) {
    console.error('地图切换失败:', err)
    mapStore.mapMode = prevMode
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }
}

// 直接模式切换（MapToggle 单选）
function handleModeChange(mode) {
  if (mode !== mapStore.mapMode) {
    handleMapToggle()
  }
}

// 监听图层可见性变化（底图切换）
watch(() => mapStore.layerTree, () => {
  // 可在此处扩展图层显隐逻辑
}, { deep: true })

onMounted(async () => {
  await nextTick()
  await init2DMap()
})

onUnmounted(() => {
  if (map2d) destroyMap(map2d)
  if (viewer3d) destroyViewer(viewer3d)
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-dark);
}

/* ===== 顶部标题栏 ===== */
.app-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(135deg, var(--tech-blue-900) 0%, #0a2540 50%, var(--tech-blue-900) 100%);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #fff, #91caff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mode-badge {
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.mode-badge.\32 d {
  background: rgba(64, 150, 255, 0.15);
  color: var(--tech-blue-400);
  border: 1px solid rgba(64, 150, 255, 0.25);
}

.mode-badge.\33 d {
  background: rgba(105, 177, 255, 0.12);
  color: var(--tech-blue-300);
  border: 1px solid rgba(105, 177, 255, 0.2);
}

.coord-display {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  letter-spacing: 0.5px;
}

/* ===== 主体区域 ===== */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #0c1a2d;
}

.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* ===== 加载状态 ===== */
.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 22, 40, 0.85);
  z-index: 999;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 150, 255, 0.2);
  border-top-color: var(--tech-blue-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-loading p {
  color: var(--text-secondary);
  font-size: 14px;
  letter-spacing: 1px;
}

/* ===== 过渡动画 ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== 底图选择器（浮动工具栏） ===== */
.base-map-selector {
  position: absolute;
  top: 12px;
  right: 80px;
  display: flex;
  gap: 4px;
  background: rgba(13, 31, 60, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px;
  z-index: 10;
}

.base-map-item {
  padding: 5px 12px;
  font-size: 12px;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;
}

.base-map-item:hover {
  color: var(--tech-blue-300);
  background: rgba(64, 150, 255, 0.1);
}

.base-map-item.active {
  color: #fff;
  background: var(--tech-blue-700);
}
</style>
