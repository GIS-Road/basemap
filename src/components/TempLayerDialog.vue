<template>
  <Transition name="temp-dialog">
    <div
      v-if="tempStore.dialogVisible"
      ref="dialogRef"
      class="temp-layer-dialog"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
    >
      <!-- 头部：可拖拽 -->
      <div class="dialog-header" @pointerdown="startDrag">
        <div class="header-title">
          <svg viewBox="0 0 16 16" width="15" height="15" class="header-icon">
            <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.2" />
            <path d="M1.5 6h13M6 6v8.5" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.7" />
            <rect x="3" y="3.2" width="3" height="1.4" rx="0.4" fill="currentColor" opacity="0.85" />
          </svg>
          <span>临时图层</span>
          <span class="header-count">{{ tempStore.totalCount }}</span>
        </div>
        <button class="dialog-close" title="关闭" @pointerdown.stop @click="tempStore.closeDialog()">
          <svg viewBox="0 0 12 12" width="10" height="10">
            <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- 图层分组 -->
      <div class="dialog-body">
        <div v-for="group in displayGroups" :key="group.key" class="layer-group">
          <div class="group-header">
            <span class="group-dot" :class="group.key"></span>
            <span class="group-label">{{ group.label }}</span>
            <span class="group-count">{{ groupTotal(group) }}</span>
          </div>

          <div v-if="!group.layers.length" class="group-empty">
            {{ group.key === 'measure' ? '暂无量测数据（后续接入测距/测面）' : '暂无临时图层' }}
          </div>

          <div v-for="layer in group.layers" :key="layer.id" class="layer-row">
            <svg class="layer-type-icon" :class="layerTypeClass(layer.id)" viewBox="0 0 14 14" width="12" height="12">
              <!-- Point -->
              <template v-if="layerTypeClass(layer.id) === 'point'">
                <circle cx="7" cy="7" r="2.2" fill="currentColor" />
                <circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5" />
              </template>
              <!-- Line -->
              <template v-else-if="layerTypeClass(layer.id) === 'line'">
                <polyline points="2,11 5,5 9,8 12,3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </template>
              <!-- Polygon -->
              <template v-else-if="layerTypeClass(layer.id) === 'polygon'">
                <polygon points="7,2.2 12,5.5 10,12.5 4,12.5 2,5.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
                <polygon points="7,2.2 12,5.5 10,12.5 4,12.5 2,5.5" fill="currentColor" opacity="0.18" />
              </template>
              <!-- Label -->
              <template v-else-if="layerTypeClass(layer.id) === 'label'">
                <path d="M3.5 4.2h7M7 4.2v7.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M5.5 11.8h3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
              </template>
            </svg>
            <span class="layer-name" :title="layer.name">{{ layer.name }}</span>
            <span class="layer-count">({{ layer.count }})</span>

            <div class="layer-actions">
              <button
                class="row-btn"
                :disabled="!layer.count"
                title="定位到该图层"
                @click="tempStore.zoomTo(layer.id)"
              >
                <svg viewBox="0 0 14 14" width="12" height="12">
                  <circle cx="7" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.2" />
                  <path d="M7 0.8v2.4M7 10.8v2.4M0.8 7h2.4M10.8 7h2.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </button>

              <button
                class="row-btn eye"
                :class="{ off: !layer.visible }"
                :disabled="!layer.count"
                :title="layer.visible ? '隐藏图层' : '显示图层'"
                @click="tempStore.setVisible(layer.id, !layer.visible)"
              >
                <svg v-if="layer.visible" viewBox="0 0 16 16" width="13" height="13">
                  <path d="M8 4C4.5 4 1.5 7 0.5 8c1 1 4 4 7.5 4S14.5 9 15.5 8c-1-1-4-4-7.5-4z" fill="none" stroke="currentColor" stroke-width="1.2" />
                  <circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" stroke-width="1.2" />
                  <circle cx="8" cy="8" r="0.8" fill="currentColor" />
                </svg>
                <svg v-else viewBox="0 0 16 16" width="13" height="13">
                  <path d="M8 4C4.5 4 1.5 7 0.5 8c1 1 4 4 7.5 4S14.5 9 15.5 8c-1-1-4-4-7.5-4z" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
                  <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="1.2" />
                </svg>
              </button>

              <button
                class="row-btn clear"
                :class="{ confirming: confirmingId === layer.id }"
                :disabled="!layer.count"
                :title="confirmingId === layer.id ? '再次点击确认清空' : '清空该图层'"
                @click="handleClear(layer.id)"
              >
                <span v-if="confirmingId === layer.id" class="confirm-text">确认</span>
                <svg v-else viewBox="0 0 14 14" width="12" height="12">
                  <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4"
                    fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="dialog-footer">
        <span class="footer-tip">绘制、量测与标注的临时图层</span>
        <button
          class="clear-all-btn"
          :class="{ confirming: confirmAll }"
          :disabled="!tempStore.totalCount"
          @click="handleClearAll"
        >
          {{ confirmAll ? '确认清空' : '清空全部' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { useTempLayerStore } from '../stores/tempLayerStore'

const mapStore = useMapStore()
const tempStore = useTempLayerStore()

// ==================== 位置与拖拽 ====================
const dialogRef = ref(null)
const pos = ref({ x: 12, y: 12 })
let dragState = null

function startDrag(e) {
  if (e.button !== 0) return
  dragState = {
    startX: e.clientX,
    startY: e.clientY,
    originX: pos.value.x,
    originY: pos.value.y
  }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', stopDrag)
}

function onDragMove(e) {
  if (!dragState) return
  const dx = e.clientX - dragState.startX
  const dy = e.clientY - dragState.startY

  // 限制在父容器（地图区域）内
  const parent = dialogRef.value?.parentElement
  const maxX = parent ? parent.clientWidth - (dialogRef.value?.offsetWidth || 300) : window.innerWidth - 300
  const maxY = parent ? parent.clientHeight - 120 : window.innerHeight - 120

  pos.value = {
    x: Math.min(Math.max(0, dragState.originX + dx), Math.max(0, maxX)),
    y: Math.min(Math.max(0, dragState.originY + dy), Math.max(0, maxY))
  }
}

function stopDrag() {
  dragState = null
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', stopDrag)
}

onBeforeUnmount(stopDrag)

// ==================== 数据展示 ====================
// 仅展示当前地图模式下的临时图层
const displayGroups = computed(() =>
  tempStore.groups.map(g => ({
    ...g,
    layers: g.layers.filter(l => l.mode === mapStore.mapMode)
  }))
)

const LAYER_TYPE_MAP = {
  '2d-temp-point': 'point', '3d-temp-point': 'point',
  '2d-temp-line': 'line', '3d-temp-line': 'line',
  '2d-temp-polygon': 'polygon', '3d-temp-polygon': 'polygon',
  '2d-temp-label': 'label', '3d-temp-label': 'label'
}

function layerTypeClass(id) {
  return LAYER_TYPE_MAP[id] || ''
}

function groupTotal(group) {
  return group.layers.reduce((s, l) => s + (l.count || 0), 0)
}

// ==================== 清空（二次确认） ====================
const confirmingId = ref(null)
const confirmAll = ref(false)
let confirmTimer = null

function resetConfirm() {
  confirmingId.value = null
  confirmAll.value = false
  if (confirmTimer) {
    clearTimeout(confirmTimer)
    confirmTimer = null
  }
}

function scheduleReset() {
  if (confirmTimer) clearTimeout(confirmTimer)
  confirmTimer = setTimeout(resetConfirm, 3000)
}

function handleClear(id) {
  if (confirmingId.value !== id) {
    resetConfirm()
    confirmingId.value = id
    scheduleReset()
    return
  }
  tempStore.clearLayer(id)
  resetConfirm()
}

function handleClearAll() {
  if (!confirmAll.value) {
    resetConfirm()
    confirmAll.value = true
    scheduleReset()
    return
  }
  tempStore.clearAll()
  resetConfirm()
}
</script>

<style scoped>
.temp-layer-dialog {
  position: absolute;
  z-index: 30;
  width: 300px;
  max-height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  background: rgba(13, 31, 60, 0.94);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 150, 255, 0.28);
  border-radius: 10px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(64, 150, 255, 0.06);
  overflow: hidden;
  user-select: none;
}

/* ===== 头部 ===== */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 10px 9px 12px;
  border-bottom: 1px solid rgba(64, 150, 255, 0.14);
  background: linear-gradient(135deg, rgba(64, 150, 255, 0.14) 0%, rgba(64, 150, 255, 0.04) 100%);
  cursor: move;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #d6e8ff;
  letter-spacing: 0.5px;
}

.header-icon {
  color: #4096ff;
}

.header-count {
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  border-radius: 8px;
  background: rgba(64, 150, 255, 0.18);
  border: 1px solid rgba(64, 150, 255, 0.35);
  color: #91caff;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
  text-align: center;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgba(139, 166, 204, 0.6);
  cursor: pointer;
  transition: all 0.15s;
}

.dialog-close:hover {
  background: rgba(64, 150, 255, 0.16);
  color: #fff;
}

/* ===== 内容 ===== */
.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px 4px;
}

.dialog-body::-webkit-scrollbar {
  width: 5px;
}

.dialog-body::-webkit-scrollbar-thumb {
  background: rgba(64, 150, 255, 0.25);
  border-radius: 3px;
}

.layer-group {
  margin-bottom: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px 6px;
}

.group-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.group-dot.draw { background: #4096ff; box-shadow: 0 0 6px rgba(64, 150, 255, 0.7); }
.group-dot.measure { background: #faad14; box-shadow: 0 0 6px rgba(250, 173, 20, 0.7); }
.group-dot.annotation { background: #13c2c2; box-shadow: 0 0 6px rgba(19, 194, 194, 0.7); }

.group-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(193, 213, 240, 0.9);
}

.group-count {
  margin-left: auto;
  font-size: 11px;
  color: rgba(139, 166, 204, 0.55);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.group-empty {
  margin: 0 4px;
  padding: 8px 10px;
  border: 1px dashed rgba(64, 150, 255, 0.18);
  border-radius: 6px;
  font-size: 11px;
  color: rgba(139, 166, 204, 0.45);
  text-align: center;
}

.layer-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 4px 0 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.layer-row:hover {
  background: rgba(64, 150, 255, 0.08);
}

.layer-type-icon {
  flex-shrink: 0;
  color: rgba(139, 166, 204, 0.6);
}

.layer-type-icon.point { color: #4096ff; }
.layer-type-icon.line { color: #13c2c2; }
.layer-type-icon.polygon { color: #faad14; }
.layer-type-icon.label { color: #722ed1; }

.layer-name {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-count {
  flex-shrink: 0;
  font-size: 11px;
  color: rgba(139, 166, 204, 0.5);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.layer-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.row-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgba(139, 166, 204, 0.6);
  cursor: pointer;
  transition: all 0.15s;
}

.row-btn:hover:not(:disabled) {
  background: rgba(64, 150, 255, 0.15);
  color: #91caff;
}

.row-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.row-btn.eye.off {
  color: rgba(139, 166, 204, 0.35);
}

.row-btn.clear:hover:not(:disabled) {
  background: rgba(255, 122, 105, 0.12);
  color: #ff7a69;
}

.row-btn.clear.confirming {
  width: auto;
  padding: 0 7px;
  background: rgba(255, 122, 105, 0.16);
  color: #ff8b7b;
}

.confirm-text {
  font-size: 11px;
  white-space: nowrap;
}

/* ===== 底部 ===== */
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid rgba(64, 150, 255, 0.12);
  background: rgba(10, 24, 48, 0.6);
  flex-shrink: 0;
}

.footer-tip {
  font-size: 11px;
  color: rgba(139, 166, 204, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-all-btn {
  flex-shrink: 0;
  height: 24px;
  padding: 0 10px;
  border: 1px solid rgba(255, 122, 105, 0.3);
  border-radius: 5px;
  background: rgba(255, 122, 105, 0.08);
  color: rgba(255, 140, 120, 0.85);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-all-btn:hover:not(:disabled) {
  background: rgba(255, 122, 105, 0.18);
  border-color: rgba(255, 122, 105, 0.5);
  color: #ff8b7b;
}

.clear-all-btn.confirming {
  background: rgba(255, 122, 105, 0.24);
  border-color: rgba(255, 122, 105, 0.6);
  color: #ffb3a8;
}

.clear-all-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ===== 过渡动画 ===== */
.temp-dialog-enter-active,
.temp-dialog-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.temp-dialog-enter-from,
.temp-dialog-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
