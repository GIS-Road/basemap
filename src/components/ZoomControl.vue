<template>
  <!-- 地图左上角缩放按钮组（提取自 vgis 项目 Statusbar 的 zoom-group） -->
  <div class="zoom-group" @click.stop>
    <button class="zoom-btn" title="放大" @click="zoomIn">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
    <button class="zoom-btn" title="复位" @click="resetPosition">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M3 11.5L12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.5 10.5V20h5v-5.5h3V20h5v-9.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button class="zoom-btn" title="缩小" @click="zoomOut">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
    <button
      class="zoom-btn compass-btn"
      :class="{ rotated: currentRotation !== 0 }"
      :title="currentRotation !== 0 ? '点击恢复正北' : '已朝北'"
      @click="resetNorth"
    >
      <svg class="compass-arrow" :style="compassArrowStyle" viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.2" />
        <!-- 北指针（上红） -->
        <polygon points="12,2 17,13 7,13" fill="#ff4d4f" />
        <!-- 南指针（下白） -->
        <polygon points="12,22 17,13 7,13" fill="currentColor" />
        <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { fromLonLat } from 'ol/proj'

/**
 * 二维地图缩放按钮组：放大 / 复位 / 缩小 / 指北罗盘
 * 替代 OpenLayers 默认 Zoom 控件（原位于左上角）
 */
const props = defineProps({
  map: { type: Object, default: null },
  // 复位目标视角（与 mapStore 初始值保持一致）
  defaultCenter: { type: Array, default: () => [104.0, 35.0] },
  defaultZoom: { type: Number, default: 14 }
})

const currentRotation = ref(0)

/**
 * 罗盘箭头样式：地图旋转时箭头反向旋转，始终指向屏幕上的正北方向
 */
const compassArrowStyle = computed(() => {
  const deg = (-currentRotation.value * 180) / Math.PI
  return { transform: `rotate(${deg.toFixed(2)}deg)`, transition: 'transform 0.2s' }
})

function updateRotation() {
  if (!props.map) return
  currentRotation.value = props.map.getView().getRotation() ?? 0
}

let changeRotationHandler = null

function bindMapEvents() {
  if (!props.map) return
  updateRotation()
  changeRotationHandler = updateRotation
  props.map.getView().on('change:rotation', changeRotationHandler)
}

function unbindMapEvents() {
  if (props.map && changeRotationHandler) {
    props.map.getView().un('change:rotation', changeRotationHandler)
    changeRotationHandler = null
  }
}

watch(
  () => props.map,
  (newMap, oldMap) => {
    if (oldMap) unbindMapEvents()
    if (newMap) bindMapEvents()
  },
  { immediate: true }
)

onUnmounted(unbindMapEvents)

// ==================== 缩放操作 ====================
const zoomIn = () => {
  if (props.map) {
    const view = props.map.getView()
    view.animate({ zoom: (view.getZoom() ?? 0) + 1, duration: 200 })
  }
}

const zoomOut = () => {
  if (props.map) {
    const view = props.map.getView()
    view.animate({ zoom: (view.getZoom() ?? 0) - 1, duration: 200 })
  }
}

const resetPosition = () => {
  if (props.map) {
    // 复位到系统默认视角，同时恢复正北朝向
    // 视图为 EPSG:3857，传入的经纬度中心需转换
    props.map.getView().animate({
      center: fromLonLat(props.defaultCenter),
      zoom: props.defaultZoom,
      rotation: 0,
      duration: 300
    })
  }
}

const resetNorth = () => {
  if (props.map) {
    props.map.getView().animate({ rotation: 0, duration: 300 })
  }
}
</script>

<style scoped>
.zoom-group {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 2px;
  /* 系统主题色（与顶部标题栏一致的深海军蓝） */
  background-color: #0a2540;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.zoom-btn {
  width: 28px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.zoom-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 罗盘指北按钮 */
.compass-btn {
  position: relative;
  margin-top: 4px;
}

/* 旋转状态：按钮背景高亮，提示可点击恢复 */
.compass-btn.rotated {
  background-color: rgba(255, 255, 255, 0.15);
}

.compass-btn.rotated:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.compass-arrow {
  display: inline-block;
  vertical-align: middle;
}
</style>
