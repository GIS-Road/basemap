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
      >
        <template #default="{ data }">
          <div class="tree-node">
            <!-- 图标 -->
            <span class="node-icon">
              <!-- 分组 -->
              <svg v-if="data.type === 'group'" viewBox="0 0 14 14" width="14" height="14">
                <path d="M2 2.5h4l1.5 1.5H12a1 1 0 011 1V11a1 1 0 01-1 1H2a1 1 0 01-1-1V3.5a1 1 0 011-1z"
                  fill="none" stroke="#4096FF" stroke-width="1" />
              </svg>
              <!-- 底图 -->
              <svg v-else-if="data.type === 'base'" viewBox="0 0 14 14" width="14" height="14">
                <rect x="1" y="1" width="12" height="12" rx="1" fill="none" stroke="#69b1ff" stroke-width="1" />
                <rect x="3" y="3" width="8" height="8" rx="0.5" fill="#69b1ff" opacity="0.2" />
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

            <!-- 可见性开关 -->
            <span
              v-if="data.type !== 'group'"
              class="visibility-toggle"
              @click.stop="handleToggleVisibility(data)"
              :title="data.visible ? '隐藏图层' : '显示图层'"
            >
              <svg v-if="data.visible" viewBox="0 0 16 16" width="14" height="14">
                <circle cx="8" cy="8" r="3" fill="none" stroke="#4096FF" stroke-width="1" />
                <circle cx="8" cy="8" r="1" fill="#4096FF" />
                <path d="M1 8s3-6 7-6 7 6 7 6-3 6-7 6-7-6-7-6z" fill="none" stroke="#4096FF" stroke-width="0.6" opacity="0.4" />
              </svg>
              <svg v-else viewBox="0 0 16 16" width="14" height="14">
                <path d="M1 8s3-6 7-6 7 6 7 6-3 6-7 6-7-6-7-6z" fill="none" stroke="#5a6a80" stroke-width="0.6" />
                <line x1="3" y1="3" x2="13" y2="13" stroke="#5a6a80" stroke-width="1" />
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
import { ref, computed } from 'vue'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()
const isCollapsed = ref(false)
const treeRef = ref(null)

const treeProps = {
  children: 'children',
  label: 'label'
}

const treeData = computed(() => mapStore.layerTree)

function handleToggleVisibility(data) {
  mapStore.toggleLayerVisibility(data.id)
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

/* 自定义树节点 */
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
}

.visibility-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.tree-node:hover .visibility-toggle {
  opacity: 1;
}

.visibility-toggle:hover {
  background: rgba(64, 150, 255, 0.12);
}

/* 折叠图标 */
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
