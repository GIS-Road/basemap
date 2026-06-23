<template>
  <div class="map-toggle">
    <div class="toggle-bg"></div>
    <div class="toggle-indicator" :class="{ is3d: mapStore.mapMode === '3d' }"></div>
    <button
      class="toggle-btn"
      :class="{ active: mapStore.mapMode === '2d' }"
      @click="switchTo('2d')"
      title="二维地图"
    >
      <div class="btn-content">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
          <line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.4" />
          <line x1="8" y1="3" x2="8" y2="21" stroke="currentColor" stroke-width="0.8" opacity="0.4" />
        </svg>
        <span class="btn-label">2D</span>
      </div>
    </button>
    <button
      class="toggle-btn"
      :class="{ active: mapStore.mapMode === '3d' }"
      @click="switchTo('3d')"
      title="三维地图"
    >
      <div class="btn-content">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5" />
          <ellipse cx="12" cy="9" rx="6" ry="3" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="0.6" opacity="0.3" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="0.6" opacity="0.3" />
        </svg>
        <span class="btn-label">3D</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()

const emit = defineEmits(['toggle', 'modeChange'])

function switchTo(mode) {
  if (mode !== mapStore.mapMode) {
    emit('toggle')
    emit('modeChange', mode)
  }
}
</script>

<style scoped>
.map-toggle {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toggle-bg {
  position: absolute;
  inset: 0;
  background: rgba(13, 31, 60, 0.94);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(64, 150, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(64, 150, 255, 0.08) inset;
}

.toggle-indicator {
  width: 42px;
  height: 36px;
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--tech-blue-700);
  border-radius: 10px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.4);
}

.toggle-indicator.is3d {
  transform: translateY(44px);
}

.toggle-btn {
  position: relative;
  z-index: 1;
  width: 54px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.25s;
  color: var(--text-secondary);
}

.toggle-btn.active {
  color: #fff;
}

.toggle-btn:hover:not(.active) {
  color: var(--tech-blue-300);
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.btn-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
