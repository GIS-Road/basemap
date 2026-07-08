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
        <svg viewBox="0 0 16 16" width="14" height="14" :style="{ transform: isCollapsed ? 'rotate(180deg)' : '' }">
          <path d="M6 4 L11 8 L6 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- 树形图层 -->
    <div class="layer-tree-container" v-show="!isCollapsed">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="true"
        :highlight-current="false"
        show-checkbox
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        @check="handleCheck"
        @node-drop="handleNodeDrop"
      >
        <template #default="{ data }">
          <div class="tree-node" :class="{ 'is-layer': data.type !== 'group' }">
            <!-- 图标 -->
            <span class="node-icon">
              <!-- 分组 -->
              <svg v-if="data.type === 'group'" viewBox="0 0 14 14" width="14" height="14">
                <path d="M2 2.5h4l1.5 1.5H12a1 1 0 011 1V11a1 1 0 01-1 1H2a1 1 0 01-1-1V3.5a1 1 0 011-1z"
                  fill="none" stroke="#4096FF" stroke-width="1" />
              </svg>
              <!-- 底图 - 矢量 -->
              <svg v-else-if="data.type === 'base' && (data.id === 'osm' || data.id === 'tianditu_vec')" viewBox="0 0 14 14" width="14" height="14">
                <path d="M2 11 L5 4 L8 8 L12 2" fill="none" stroke="#69b1ff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="5" cy="4" r="1.2" fill="#69b1ff" />
                <circle cx="8" cy="8" r="1.2" fill="#69b1ff" />
                <circle cx="12" cy="2" r="1.2" fill="#69b1ff" />
              </svg>
              <!-- 底图 - 影像/卫星 -->
              <svg v-else-if="data.type === 'base'" viewBox="0 0 14 14" width="14" height="14">
                <circle cx="7" cy="7" r="3.5" fill="none" stroke="#ffa940" stroke-width="1" />
                <ellipse cx="7" cy="7" rx="6" ry="2.5" fill="none" stroke="#ffa940" stroke-width="0.7" opacity="0.6" transform="rotate(-30 7 7)" />
                <ellipse cx="7" cy="7" rx="6" ry="2.5" fill="none" stroke="#ffa940" stroke-width="0.7" opacity="0.6" transform="rotate(30 7 7)" />
                <circle cx="7" cy="7" r="1.5" fill="#ffa940" opacity="0.25" />
              </svg>
              <!-- 覆盖层 -->
              <svg v-else-if="data.type === 'overlay'" viewBox="0 0 14 14" width="14" height="14">
                <circle cx="7" cy="7" r="4" fill="none" stroke="#52c41a" stroke-width="1" />
                <circle cx="7" cy="7" r="1.2" fill="#52c41a" opacity="0.6" />
              </svg>
              <!-- 地形 -->
              <svg v-else-if="data.type === 'terrain'" viewBox="0 0 14 14" width="14" height="14">
                <polyline points="1,11 4,7 7,9 10,3 13,6" fill="none" stroke="#ffa940" stroke-width="1"
                  stroke-linejoin="round" />
              </svg>
              <!-- 默认 -->
              <svg v-else viewBox="0 0 14 14" width="14" height="14">
                <rect x="2" y="4" width="10" height="7" rx="1" fill="none" stroke="#8ba6cc" stroke-width="0.8" />
              </svg>
            </span>

            <!-- 标签 -->
            <span class="node-label">{{ data.label }}</span>

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
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()
const isCollapsed = ref(false)
const treeRef = ref(null)

const treeProps = {
  children: 'children',
  label: 'label',
  disabled: (data) => data.type === 'group'
}

const treeData = computed(() => mapStore.layerTree)

// ==================== 初始化 & 同步复选框 ====================

// 收集所有可见叶子图层 ID
function collectVisibleLeafIds(nodes) {
  const ids = []
  const traverse = (list) => {
    for (const node of list) {
      if (node.type !== 'group' && node.visible) {
        ids.push(node.id)
      }
      if (node.children) traverse(node.children)
    }
  }
  traverse(nodes)
  return ids
}

/**
 * 将 mapStore 中的可见性状态同步到 el-tree 复选框
 */
function syncCheckboxes() {
  if (!treeRef.value) return
  treeRef.value.setCheckedKeys(collectVisibleLeafIds(mapStore.layerTree))
}

onMounted(() => {
  nextTick(() => syncCheckboxes())
})

// 监听图层树变化，同步复选框状态
watch(() => mapStore.layerTree, () => {
  nextTick(() => syncCheckboxes())
}, { deep: true })

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

// ==================== 复选框变更 ====================

function handleCheck(data, checkedState) {
  // 仅处理叶子节点；分组节点由 CSS 隐藏复选框
  if (data.type !== 'group') {
    const isChecked = checkedState.checkedKeys.includes(data.id)
    mapStore.setLayerVisibility(data.id, isChecked)
  }
}

// ==================== 眼睛图标：可见性切换 ====================

function toggleEye(layerNode) {
  mapStore.toggleLayerVisibility(layerNode.id)
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

/* ===== 自定义树节点 ===== */
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  position: relative;
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
  color: var(--tech-blue-400);
}

.eye-hidden {
  color: rgba(139, 166, 204, 0.35);
}

.eye-hidden:hover {
  color: rgba(139, 166, 204, 0.7);
}

/* ===== 图层图标 ===== */
.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== 标签 ===== */
.node-label {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
  transition: color 0.2s;
}

/* ===== 拖拽手柄 ===== */
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
  transition: all 0.2s;
  opacity: 0;
  margin-right: 2px;
}

.tree-node:hover .drag-handle {
  opacity: 1;
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
  padding: 3px 8px;
  border-radius: 6px;
  margin: 1px 0;
  transition: background 0.15s;
}

.layer-tree-container .el-tree-node__content:hover {
  background: rgba(64, 150, 255, 0.06);
}

/* ===== 隐藏分组节点的复选框 ===== */
.layer-tree-container .el-tree-node[aria-level="1"] > .el-tree-node__content > .el-checkbox {
  display: none;
}

/* ===== 暗色复选框 ===== */
.layer-tree-container .el-checkbox__inner {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(139, 166, 204, 0.35) !important;
}

.layer-tree-container .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: var(--tech-blue-500, #4096FF) !important;
  border-color: var(--tech-blue-500, #4096FF) !important;
}

.layer-tree-container .el-checkbox__inner::after {
  border-color: #fff !important;
}

.layer-tree-container .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: var(--tech-blue-500, #4096FF) !important;
  border-color: var(--tech-blue-500, #4096FF) !important;
}

.layer-tree-container .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  background-color: #fff !important;
}

.layer-tree-container .el-checkbox:hover .el-checkbox__inner {
  border-color: var(--tech-blue-400) !important;
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
</style>
