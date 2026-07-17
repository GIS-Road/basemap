<template>
  <aside class="layer-panel" :class="{ collapsed: isCollapsed }">
    <!-- 面板头部 -->
    <div class="panel-header">
      <div class="panel-title" v-show="!isCollapsed">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#4096FF" stroke-width="1.2" />
          <line x1="1" y1="5.5" x2="15" y2="5.5" stroke="#4096FF" stroke-width="0.8" opacity="0.5" />
          <rect x="3" y="2.5" width="3" height="2" rx="0.5" fill="#4096FF" opacity="0.6" />
          <rect x="10" y="8" width="4" height="1.5" rx="0.5" fill="#69b1ff" opacity="0.4" />
          <rect x="3" y="8" width="5" height="1.5" rx="0.5" fill="#69b1ff" opacity="0.4" />
          <rect x="3" y="10.5" width="3" height="1.5" rx="0.5" fill="#69b1ff" opacity="0.3" />
        </svg>
        <span>图层面板</span>
      </div>
      <div class="panel-toggle" @click="isCollapsed = !isCollapsed">
        <svg viewBox="0 0 16 16" width="14" height="14" :style="{ transform: !isCollapsed ? 'rotate(180deg)' : '' }">
          <path d="M6 4 L11 8 L6 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- 树形图层 -->
    <div class="layer-tree-container" v-show="!isCollapsed">
      <!-- 搜索过滤框 -->
      <div class="layer-search-wrapper">
        <svg class="layer-search-icon" viewBox="0 0 16 16" width="14" height="14">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.3" />
          <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
        <input
          v-model="filterText"
          class="layer-search-input"
          type="text"
          placeholder="搜索图层..."
        />
        <span v-if="filterText" class="layer-search-clear" @click="filterText = ''">
          <svg viewBox="0 0 12 12" width="10" height="10">
            <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="true"
        :highlight-current="true"
        :indent="20"
        :filter-node-method="filterNode"
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
      >
        <template #default="{ data }">
          <div
            class="tree-node"
            :class="{ 'is-layer': data.type !== 'group', 'is-selected': selectedNodeId === data.id }"
          >
            <div class="tree-node-main">
              <!-- 图标 -->
              <span class="node-icon">
                <!-- 影像/卫星 -->
                <img v-if="data.children" class="layer-icon" :src="getIconUrl(data.icon)" alt="图标" width="20" height="20">
              </span>

              <!-- 标签（带截断 + 上方 tooltip） -->
              <span
                class="node-label-wrapper"
                :data-truncated="truncatedMap[data.id] ? 'true' : 'false'"
                @mouseenter="checkTruncation($event, data.id)"
              >
                <span class="node-label">{{ data.label }}</span>
                <span class="node-label-tooltip">{{ data.label }}</span>
              </span>

              <!-- 透明度设置图标（仅叶子节点，名称后） -->
              <span
                v-if="data.type !== 'group'"
                class="opacity-icon"
                :class="{ 'opacity-active': activeOpacityId === data.id }"
                @click.stop="openOpacityPopup(data, $event)"
                :title="'透明度设置'"
              >
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <path d="M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="none" stroke="currentColor" stroke-width="1.2" />
                  <path d="M8 1.5l-.6 1.8a4.8 4.8 0 00-1.3.5L4.4 2.8 2.8 4.4l1 1.7a4.8 4.8 0 00-.5 1.3L1.5 8l1.8.6c.1.5.3.9.5 1.3l-1 1.7 1.6 1.6 1.7-1c.4.2.8.4 1.3.5L8 14.5l.6-1.8c.5-.1.9-.3 1.3-.5l1.7 1 1.6-1.6-1-1.7c.2-.4.4-.8.5-1.3l1.8-.6-1.8-.6a4.8 4.8 0 00-.5-1.3l1-1.7-1.6-1.6-1.7 1a4.8 4.8 0 00-1.3-.5L8 1.5z"
                    fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" />
                </svg>
              </span>

              <!-- 眼睛图标（名称后，仅叶子节点） -->
              <span
                v-if="data.type !== 'group'"
                class="eye-icon"
                :class="{ 'eye-visible': data.visible, 'eye-hidden': !data.visible }"
                @click.stop="toggleEye(data)"
                :title="data.visible ? '隐藏图层' : '显示图层'"
              >
                <!-- 睁眼 -->
                <svg v-if="data.visible" viewBox="0 0 16 16" width="14" height="14">
                  <path d="M8 4C4.5 4 1.5 7 0.5 8c1 1 4 4 7.5 4S14.5 9 15.5 8c-1-1-4-4-7.5-4z"
                    fill="none" stroke="currentColor" stroke-width="1.2" />
                  <circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2" />
                  <circle cx="8" cy="8" r="0.8" fill="currentColor" />
                </svg>
                <!-- 闭眼 -->
                <svg v-else viewBox="0 0 16 16" width="14" height="14">
                  <path d="M8 4C4.5 4 1.5 7 0.5 8c1 1 4 4 7.5 4S14.5 9 15.5 8c-1-1-4-4-7.5-4z"
                    fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
                  <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="1.2" />
                </svg>
              </span>

              <!-- 拖拽手柄（仅叶子节点） -->
              <span v-if="data.type !== 'group'" class="drag-handle" title="拖动调整顺序">
                <svg viewBox="0 0 12 16" width="10" height="12">
                  <circle cx="4" cy="3" r="1" fill="currentColor" />
                  <circle cx="8" cy="3" r="1" fill="currentColor" />
                  <circle cx="4" cy="8" r="1" fill="currentColor" />
                  <circle cx="8" cy="8" r="1" fill="currentColor" />
                  <circle cx="4" cy="13" r="1" fill="currentColor" />
                  <circle cx="8" cy="13" r="1" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 折叠状态下的图标 -->
    <div class="collapsed-icons" v-show="isCollapsed">
      <div class="collapsed-icon" title="图层面板">
        <svg viewBox="0 0 16 16" width="20" height="20">
          <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#4096FF" stroke-width="1.2" />
          <line x1="1" y1="5.5" x2="15" y2="5.5" stroke="#4096FF" stroke-width="0.8" opacity="0.5" />
          <rect x="3" y="2.5" width="3" height="2" rx="0.5" fill="#4096FF" opacity="0.6" />
        </svg>
      </div>
    </div>

    <!-- 透明度浮动弹出面板（在 el-tree 外部，不受拖拽影响） -->
    <Teleport to="body">
      <div
        v-if="activeOpacityId"
        class="opacity-popup"
        :style="{ top: popupPos.y + 'px', left: popupPos.x + 'px' }"
        @click.stop
        @mousedown.stop
        @pointerdown.stop
      >
        <div class="opacity-popup-header">
          <span class="opacity-popup-title">{{ activeOpacityLabel }} - 透明度</span>
          <span class="opacity-popup-close" @click="closeOpacityPopup">
            <svg viewBox="0 0 12 12" width="10" height="10">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
        </div>
        <div class="opacity-popup-body">
          <input
            type="range"
            class="opacity-slider"
            min="0"
            max="1"
            step="0.05"
            :value="activeOpacityValue"
            @input="onPopupOpacityChange($event)"
          />
          <span class="opacity-value">{{ Math.round(activeOpacityValue * 100) }}%</span>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { da } from 'element-plus/es/locales.mjs'
const mapStore = useMapStore()
const isCollapsed = ref(false)
const treeRef = ref(null)
const filterText = ref('')

// ==================== 透明度弹出面板状态 ====================
const activeOpacityId = ref(null)
const activeOpacityLabel = ref('')
const activeOpacityValue = ref(1)
const popupPos = ref({ x: 0, y: 0 })

// 配置svg图标
const iconModules = import.meta.glob('@/assets/image/layers/*.svg', { eager: true, as: 'url' })

// 获取图标路径的方法
const getIconUrl = (iconName) => {
  try {
    return iconModules[`/src/assets/image/layers/${iconName}`]
  } catch {
    return ''
  }
}

const treeProps = {
  children: 'children',
  label: 'label'
}

// 当前选中的图层节点 ID
const selectedNodeId = ref(null)

// 记录哪些图层名称被截断（仅截断时显示 tooltip）
const truncatedMap = ref({})

/**
 * 鼠标进入标签时检测文字是否被截断
 */
function checkTruncation(event, id) {
  const label = event.currentTarget.querySelector('.node-label')
  if (label) {
    truncatedMap.value[id] = label.scrollWidth > label.clientWidth
  }
}

const treeData = computed(() => mapStore.layerTree)
// 默认展开的分组（仅 expanded: true 的分组）
const defaultExpandedKeys = computed(() => {
  return mapStore.layerTree
    .filter(node => node.type === 'group' && node.expanded)
    .map(node => node.id)
})

// ==================== 搜索过滤 ====================

function filterNode(value, data) {
  if (!value) return true
  // 分组节点始终显示（以便展开查看子图层）
  if (data.type === 'group') return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

watch(filterText, (val) => {
  treeRef.value?.filter(val)
  // 搜索时自动展开所有分组，以便查看匹配的子图层
  if (val) {
    nextTick(() => {
      const groupKeys = mapStore.layerTree
        .filter(n => n.type === 'group')
        .map(n => n.id)
      groupKeys.forEach(key => {
        const node = treeRef.value?.getNode(key)
        if (node && !node.expanded) node.expand()
      })
    })
  }
})

// ==================== 初始化 ====================

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

// ==================== 拖拽控制 ====================

function allowDrag(node) {
  return node.data.type !== 'group'
}

function allowDrop(draggingNode, dropNode, type) {
  if (!dropNode || type === 'inner') return false
  if (dropNode.data.type === 'group') return false
  const dragParent = draggingNode.parent
  const dropParent = dropNode.parent
  if (!dragParent || !dropParent) return false
  return dragParent.data.id === dropParent.data.id
}

function handleNodeDrop(draggingNode, dropNode, dropType) {
  // el-tree 已自动更新 children 顺序，App.vue watcher 会同步地图层级
}

// ==================== 节点选中 ====================

function handleNodeClick(data) {
  // 仅叶子图层节点可选中（分组节点仅展开/折叠）
  if (data.type !== 'group') {
    selectedNodeId.value = data.id
  }
}

// ==================== 眼睛图标：可见性切换 ====================

function toggleEye(layerNode) {
  mapStore.toggleLayerVisibility(layerNode.id)
}

// ==================== 透明度弹出面板 ====================

/**
 * 打开透明度弹出面板
 * 点击设置图标时调用，面板浮在 el-tree 外部，不受拖拽影响
 */
function openOpacityPopup(data, event) {
  // 如果点击的是当前已激活的图层，则关闭面板
  if (activeOpacityId.value === data.id) {
    closeOpacityPopup()
    return
  }

  activeOpacityId.value = data.id
  activeOpacityLabel.value = data.label
  activeOpacityValue.value = data.opacity ?? 1

  // 计算弹出位置：图标右侧偏下
  const rect = event.currentTarget.getBoundingClientRect()
  const panelWidth = 240
  const viewportWidth = window.innerWidth

  let x = rect.right + 6
  // 如果右侧空间不够，则放在图标左侧
  if (x + panelWidth > viewportWidth) {
    x = rect.left - panelWidth - 6
  }
  let y = rect.top

  popupPos.value = { x, y }
}

/**
 * 关闭透明度弹出面板
 */
function closeOpacityPopup() {
  activeOpacityId.value = null
}

/**
 * 弹出面板内滑块变化
 */
function onPopupOpacityChange(event) {
  const val = parseFloat(event.target.value)
  activeOpacityValue.value = val
  if (activeOpacityId.value) {
    mapStore.setLayerOpacity(activeOpacityId.value, val)
  }
}

/**
 * 点击面板外部时关闭
 */
function onDocumentClick() {
  if (activeOpacityId.value) {
    closeOpacityPopup()
  }
}
</script>

<style scoped>
.layer-panel {
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--bg-panel) 0%, #0a1830 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s ease;
  overflow: hidden;
}

.layer-panel.collapsed {
  width: 44px;
}

.panel-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid rgba(64, 150, 255, 0.1);
  flex-shrink: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.panel-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.panel-toggle:hover {
  background: rgba(64, 150, 255, 0.1);
  color: var(--tech-blue-400);
}

.layer-tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 4px;
}

/* ===== 搜索过滤框 ===== */
.layer-search-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 4px 8px;
  padding: 0 8px;
  height: 30px;
  background: rgba(64, 150, 255, 0.06);
  border: 1px solid rgba(64, 150, 255, 0.15);
  border-radius: 6px;
  transition: border-color 0.2s;
}

.layer-search-wrapper:focus-within {
  border-color: rgba(64, 150, 255, 0.4);
}

.layer-search-icon {
  flex-shrink: 0;
  color: rgba(139, 166, 204, 0.5);
}

.layer-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--text-primary);
  min-width: 0;
}

.layer-search-input::placeholder {
  color: rgba(139, 166, 204, 0.4);
}

.layer-search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  cursor: pointer;
  color: rgba(139, 166, 204, 0.5);
  transition: all 0.15s;
}

.layer-search-clear:hover {
  color: #fff;
  background: rgba(64, 150, 255, 0.15);
}

/* ===== 自定义树节点 ===== */
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  position: relative;
}

.tree-node-main {
  display: contents;
}

/* ===== 透明度图标 ===== */
.opacity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(139, 166, 204, 0.4);
}

.opacity-icon:hover {
  background: rgba(64, 150, 255, 0.12);
  color: rgba(139, 166, 204, 0.8);
}

.opacity-icon.opacity-active {
  color: var(--tech-blue-400);
  background: rgba(64, 150, 255, 0.12);
}

/* ===== 透明度浮动弹出面板 ===== */
.opacity-popup {
  position: fixed;
  z-index: 9999;
  width: 240px;
  background: linear-gradient(180deg, #0d2137 0%, #0a1830 100%);
  border: 1px solid rgba(64, 150, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(64, 150, 255, 0.2);
  overflow: hidden;
  animation: opacityPopupIn 0.15s ease-out;
}

@keyframes opacityPopupIn {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.opacity-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(64, 150, 255, 0.12);
  background: rgba(64, 150, 255, 0.04);
}

.opacity-popup-title {
  font-size: 12px;
  color: var(--tech-blue-400, #4096FF);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.opacity-popup-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(139, 166, 204, 0.5);
  transition: all 0.15s;
  flex-shrink: 0;
}

.opacity-popup-close:hover {
  background: rgba(64, 150, 255, 0.15);
  color: #fff;
}

.opacity-popup-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.opacity-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(64, 150, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.opacity-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.opacity-value {
  font-size: 12px;
  color: var(--tech-blue-400, #4096FF);
  font-weight: 600;
  min-width: 36px;
  text-align: right;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  flex-shrink: 0;
}

/* ===== 眼睛图标（名称后）===== */
.eye-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.eye-icon:hover {
  background: rgba(64, 150, 255, 0.12);
}

.eye-visible {
  color: rgba(186, 224, 255, 0.85);
}

.eye-hidden {
  color: rgba(186, 224, 255, 0.3);
}

.eye-hidden:hover {
  color: rgba(186, 224, 255, 0.6);
}

/* ===== 图层图标 ===== */
.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== 标签容器 + 截断 + 上方 tooltip ===== */
.node-label-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
}

.node-label {
  display: block;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
  transition: color 0.2s;
}

/* 选中态：激活色高亮 */
.tree-node.is-selected .node-label {
  color: #4096FF;
  font-weight: 500;
}

/* 上方完整名称 tooltip */
.node-label-tooltip {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  background: rgba(13, 31, 60, 0.96);
  color: #91caff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(64, 150, 255, 0.3);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.node-label-wrapper[data-truncated="true"]:hover .node-label-tooltip {
  opacity: 1;
}

/* ===== 拖拽手柄（滑入动画）===== */
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 22px;
  border-radius: 3px;
  cursor: grab;
  color: rgba(139, 166, 204, 0.3);
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.25s ease;
  margin-right: 2px;
}

.tree-node:hover .drag-handle {
  opacity: 1;
  transform: translateX(0);
}

.drag-handle:hover {
  color: var(--tech-blue-400);
  background: rgba(64, 150, 255, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
}

/* ===== 折叠图标 ===== */
.collapsed-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  gap: 16px;
}

.collapsed-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.collapsed-icon:hover {
  color: var(--tech-blue-400);
  background: rgba(64, 150, 255, 0.1);
}
</style>

<!-- 全局样式（非 scoped）用于覆盖 el-tree 样式 -->
<style>
/* ===== 树节点内容布局 ===== */
.layer-tree-container .el-tree-node__content {
  gap: 0 !important;
  padding-top: 3px;
  padding-right: 8px;
  padding-bottom: 3px;
  /* padding-left 由 el-tree indent 内联样式控制，不在此覆盖 */
  border-radius: 6px;
  margin: 1px 0;
  transition: background 0.15s;
}

.layer-tree-container .el-tree-node__content:hover {
  background: rgba(64, 150, 255, 0.08);
}

/* ===== 选中节点高亮（激活色，非白色背景）===== */
.layer-tree-container .el-tree-node.is-current > .el-tree-node__content {
  background: rgba(64, 150, 255, 0.15) !important;
}

.layer-tree-container .el-tree-node.is-current > .el-tree-node__content:hover {
  background: rgba(64, 150, 255, 0.2) !important;
}

/* ===== 分组节点样式 ===== */
.layer-tree-container .el-tree-node[aria-level="1"] > .el-tree-node__content {
  padding-left: 4px;
  font-weight: 500;
}

/* ===== 拖拽时的视觉反馈 ===== */
.layer-tree-container .el-tree-node.is-dragging > .el-tree-node__content {
  opacity: 0.4;
}

.layer-tree-container .el-tree-node.is-drop-inner > .el-tree-node__content {
  background: rgba(64, 150, 255, 0.15) !important;
}

/* 拖拽放置指示线 */
.layer-tree-container .el-tree__drop-indicator {
  height: 2px !important;
  background-color: #4096FF !important;
  border-radius: 1px;
  left: 16px !important;
  right: 8px !important;
}

/* 禁止放入分组内部 */
.layer-tree-container .el-tree-node[aria-level="1"].is-drop-inner > .el-tree-node__content {
  background: transparent !important;
}

/* ===== 分组展开/折叠箭头颜色 ===== */
.layer-tree-container .el-tree-node__expand-icon {
  color: rgba(139, 166, 204, 0.5) !important;
}

.layer-tree-container .el-tree-node__expand-icon:hover {
  color: var(--tech-blue-400) !important;
}

.layer-tree-container .el-tree-node__expand-icon.is-leaf {
  color: transparent !important;
}

.layer-icon{
  width: 20px;
  height: 20px;
}
</style>
