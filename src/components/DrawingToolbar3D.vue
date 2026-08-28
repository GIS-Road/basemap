<template>
  <div class="drawing-toolbar" @click.stop>
    <!-- 样式编辑面板（浮动在工具栏左侧） -->
    <transition name="slide-fade">
      <div class="style-panel-container" v-if="showStylePanel">
        <!-- 面板标题 -->
        <div class="style-panel-header">
          <span class="style-panel-icon">
            <svg viewBox="0 0 14 14" width="13" height="13">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="style-panel-title">{{ panelTitle }}</span>
          <!-- 关闭按钮 -->
          <button class="style-panel-close-btn" @click="closeStylePanel" title="关闭样式面板">
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 边线颜色 -->
        <div class="style-row" v-if="hasStroke">
          <label class="style-label">边线颜色</label>
          <div class="style-control">
            <input
              type="color"
              class="color-input"
              v-model="strokeColor"
              @input="onStyleChange"
            />
            <span class="color-value">{{ strokeColor }}</span>
          </div>
          <div class="preset-colors">
            <button
              v-for="c in presetColors"
              :key="'s-' + c"
              class="preset-color-swatch"
              :class="{ active: strokeColor.toUpperCase() === c.toUpperCase() }"
              :style="{ background: c }"
              @click="selectPresetColor(c, 'stroke')"
              :title="c"
            ></button>
          </div>
        </div>

        <!-- 边线宽度 -->
        <div class="style-row" v-if="hasStroke">
          <label class="style-label">边线宽度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="strokeWidth"
              min="1" max="10" step="0.5"
              @input="onStyleChange"
            />
            <span class="range-value">{{ strokeWidth }}px</span>
          </div>
        </div>

        <!-- 边线透明度 -->
        <div class="style-row" v-if="hasStroke">
          <label class="style-label">边线透明度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="strokeOpacity"
              min="0" max="1" step="0.05"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(strokeOpacity * 100) }}%</span>
          </div>
        </div>

        <!-- 边线类型（实线/虚线） -->
        <div class="style-row" v-if="hasStroke">
          <label class="style-label">边线类型</label>
          <div class="style-control">
            <div class="dash-toggle-group">
              <button
                class="dash-toggle-btn"
                :class="{ active: strokeDashType === 'solid' }"
                @click="strokeDashType = 'solid'; onStyleChange()"
              >
                <svg viewBox="0 0 40 12" width="28" height="10">
                  <line x1="2" y1="6" x2="38" y2="6" stroke="currentColor" stroke-width="2.5"/>
                </svg>
                实线
              </button>
              <button
                class="dash-toggle-btn"
                :class="{ active: strokeDashType === 'dashed' }"
                @click="strokeDashType = 'dashed'; onStyleChange()"
              >
                <svg viewBox="0 0 40 12" width="28" height="10">
                  <line x1="2" y1="6" x2="8" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="12" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="22" y1="6" x2="28" y2="6" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="32" y1="6" x2="38" y2="6" stroke="currentColor" stroke-width="2.5"/>
                </svg>
                虚线
              </button>
            </div>
          </div>
        </div>

        <!-- 虚线间隔（仅虚线时显示） -->
        <template v-if="strokeDashType === 'dashed' && hasStroke">
          <div class="style-row">
            <label class="style-label">虚线长度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="dashLength"
                min="2" max="20" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ dashLength }}px</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">虚线间隔</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="dashGap"
                min="1" max="20" step="1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ dashGap }}px</span>
            </div>
          </div>
        </template>

        <!-- 填充颜色 -->
        <div class="style-row" v-if="hasFill">
          <label class="style-label">填充颜色</label>
          <div class="style-control">
            <input
              type="color"
              class="color-input"
              v-model="fillColor"
              @input="onStyleChange"
            />
            <span class="color-value">{{ fillColor }}</span>
          </div>
          <div class="preset-colors">
            <button
              v-for="c in presetColors"
              :key="'f-' + c"
              class="preset-color-swatch"
              :class="{ active: fillColor.toUpperCase() === c.toUpperCase() }"
              :style="{ background: c }"
              @click="selectPresetColor(c, 'fill')"
              :title="c"
            ></button>
          </div>
        </div>

        <!-- 填充透明度 -->
        <div class="style-row" v-if="hasFill">
          <label class="style-label">填充透明度</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="fillOpacity"
              min="0" max="1" step="0.05"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(fillOpacity * 100) }}%</span>
          </div>
        </div>

        <!-- 半径 -->
        <div class="style-row" v-if="hasRadius">
          <label class="style-label">{{ radiusLabel }}</label>
          <div class="style-control">
            <input
              type="range"
              class="range-input"
              v-model.number="featureRadius"
              min="1" max="500" step="1"
              @input="onStyleChange"
            />
            <span class="range-value">{{ Math.round(featureRadius) }}</span>
          </div>
        </div>

        <!-- 箭头专用控制 -->
        <template v-if="isArrow">
          <div class="style-row">
            <label class="style-label">箭头大小</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="arrowScale"
                min="0.5" max="5" step="0.1"
                @input="onStyleChange"
              />
              <span class="range-value">{{ arrowScale }}x</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">箭头宽度</label>
            <div class="style-control">
              <input
                type="range"
                class="range-input"
                v-model.number="arrowHeadWidth"
                min="1" max="10" step="0.5"
                @input="onStyleChange"
              />
              <span class="range-value">{{ arrowHeadWidth }}px</span>
            </div>
          </div>
        </template>

        <!-- 军标箭头渐变控制 -->
        <template v-if="isBattleArrow">
          <div class="style-separator">渐变填充</div>
          <div class="style-row">
            <label class="style-label">起始颜色（尾）</label>
            <div class="style-control">
              <input type="color" class="color-input" v-model="gradientStartColor" @input="onStyleChange" />
              <span class="color-value">{{ gradientStartColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'gs-' + c"
                class="preset-color-swatch"
                :class="{ active: gradientStartColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'gradientStart')"
                :title="c"
              ></button>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">起始透明度</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="gradientStartOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
              <span class="range-value">{{ Math.round(gradientStartOpacity * 100) }}%</span>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">结束颜色（头）</label>
            <div class="style-control">
              <input type="color" class="color-input" v-model="gradientEndColor" @input="onStyleChange" />
              <span class="color-value">{{ gradientEndColor }}</span>
            </div>
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="'ge-' + c"
                class="preset-color-swatch"
                :class="{ active: gradientEndColor.toUpperCase() === c.toUpperCase() }"
                :style="{ background: c }"
                @click="selectPresetColor(c, 'gradientEnd')"
                :title="c"
              ></button>
            </div>
          </div>
          <div class="style-row">
            <label class="style-label">结束透明度</label>
            <div class="style-control">
              <input type="range" class="range-input" v-model.number="gradientEndOpacity" min="0" max="1" step="0.05" @input="onStyleChange" />
              <span class="range-value">{{ Math.round(gradientEndOpacity * 100) }}%</span>
            </div>
          </div>
        </template>

        <!-- 删除选中要素按钮 -->
        <button
          v-if="selectedFeature"
          class="delete-feature-btn"
          @click="deleteSelectedFeature"
        >
          <svg viewBox="0 0 14 14" width="13" height="13">
            <path d="M3 4h8M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M10 4v7a1 1 0 01-1 1H5a1 1 0 01-1-1V4"
              fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          删除选中要素
        </button>
      </div>
    </transition>

    <!-- 绘制工具按钮组 -->
    <div class="tool-group">
      <button
        v-for="tool in tools"
        :key="tool.type"
        class="tool-btn"
        :class="{ active: activeTool === tool.type }"
        :title="tool.label"
        @click="activateTool(tool.type)"
      >
        <i v-html="tool.icon"></i>
        <span class="tool-label">{{ tool.label }}</span>
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="tool-divider"></div>

    <!-- 操作按钮 -->
    <div class="tool-actions">
      <button class="action-btn clear-btn" @click="clearDrawings" title="清除所有绘制">
        <svg viewBox="0 0 14 14" width="14" height="14">
          <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>清除</span>
      </button>
      <button class="action-btn undo-btn" @click="undoLast" title="撤销上一步">
        <svg viewBox="0 0 14 14" width="14" height="14">
          <path d="M3 5h5a3 3 0 013 3v0a3 3 0 01-3 3H6"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 3L3 5l2 2"
            fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>撤销</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import { useMapStore } from '../stores/mapStore'
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian3,
  Cartesian2,
  Cartographic,
  Color,
  PolylineDashMaterialProperty,
  ImageMaterialProperty,
  Math as CesiumMath
} from 'cesium'

const props = defineProps({
  viewer: { type: Object, required: true }
})

const mapStore = useMapStore()
const viewer = props.viewer

// ==================== 工具定义（与 2D 绘制工具条完全一致） ====================
const tools = [
  {
    type: 'Select',
    label: '选择',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M4 3l5 12 2-5 5-2z" fill="currentColor" opacity="0.3"/><path d="M4 3l5 12 2-5 5-2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
  },
  {
    type: 'Point',
    label: '点',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="1.2" fill="currentColor"/></svg>'
  },
  {
    type: 'LineString',
    label: '线',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><polyline points="3,17 8,8 13,11 17,3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  {
    type: 'Polygon',
    label: '面',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><polygon points="10,3 17,8 14,16 6,16 3,8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><polygon points="10,3 17,8 14,16 6,16 3,8" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Rectangle',
    label: '矩形',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="4" y="5" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="4" y="5" width="12" height="10" rx="1" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Ellipse',
    label: '椭圆',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><ellipse cx="10" cy="10" rx="7" ry="5" fill="none" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="10" rx="7" ry="5" fill="currentColor" opacity="0.15"/></svg>'
  },
  {
    type: 'Arrow',
    label: '小箭头',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><line x1="3" y1="16" x2="14" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="14,5 10,6 11,10" fill="currentColor"/></svg>'
  },
  {
    type: 'WindArrow',
    label: '风向',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 16 Q 8 16, 10 10 T 16 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="16,4 12,5 13,8" fill="currentColor"/></svg>'
  },
  {
    type: 'BattleArrow',
    label: '军标',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 1.5 L18 9 L13 9 L13 18.5 L7 18.5 L7 9 L2 9 Z" fill="currentColor"/></svg>'
  },
  {
    type: 'CircleOutline',
    label: '画圆',
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>'
  }
]

// ==================== 状态 ====================
const activeTool = ref(null)
const selectedFeature = ref(null)
const isSelectPicked = ref(false)

// 样式参数（与 2D 一致）
const strokeColor = ref('#4096FF')
const strokeWidth = ref(2)
const strokeOpacity = ref(1)
const strokeDashType = ref('solid')   // 'solid' | 'dashed'
const dashLength = ref(8)
const dashGap = ref(4)
const fillColor = ref('#4096FF')
const fillOpacity = ref(0.15)
const featureRadius = ref(6)
// 箭头参数
const arrowScale = ref(1)
const arrowHeadWidth = ref(3)
// 军标箭头渐变参数（尾→头由淡变深）
const gradientStartColor = ref('#FFB3B3')
const gradientEndColor = ref('#D32F2F')
const gradientStartOpacity = ref(0.3)
const gradientEndOpacity = ref(1)

// 预设颜色（与 2D 一致）
const presetColors = [
  '#4096FF',  // 科技蓝
  '#F5222D',  // 红色
  '#FAAD14',  // 黄色
  '#52C41A',  // 绿色
  '#722ED1',  // 紫色
  '#13C2C2',  // 青色
  '#FF7A69',  // 珊瑚红
  '#000000',  // 黑色
  '#FFFFFF',  // 白色
]

// 选择预设颜色
function selectPresetColor(color, target) {
  if (target === 'stroke') strokeColor.value = color
  else if (target === 'fill') fillColor.value = color
  else if (target === 'gradientStart') gradientStartColor.value = color
  else if (target === 'gradientEnd') gradientEndColor.value = color
  onStyleChange()
}

// 面板更新标志
let isUpdatingPanel = false

// 箭头类型列表
const ARROW_TYPES = ['Arrow', 'WindArrow', 'BattleArrow']

// 当前操作要素类型
const currentFeatureType = computed(() => {
  if (selectedFeature.value) return selectedFeature.value.drawType
  return activeTool.value
})

// 是否显示样式面板
const showStylePanel = computed(() => {
  // 选择工具：只有在地图上选中要素后才显示面板
  if (activeTool.value === 'Select') {
    return !!selectedFeature.value
  }
  // 绘制工具：激活即显示面板，便于实时调参
  return !!activeTool.value || !!selectedFeature.value
})

// 面板标题
const panelTitle = computed(() => {
  if (selectedFeature.value) {
    const type = selectedFeature.value.drawType
    const typeMap = {
      Point: '点要素', LineString: '线要素', Polygon: '面要素',
      Rectangle: '矩形要素', Ellipse: '椭圆要素',
      Arrow: '小箭头', WindArrow: '风向箭头', BattleArrow: '军标箭头',
      CircleOutline: '圆形要素'
    }
    return `编辑${typeMap[type] || '要素'}样式`
  }
  return '绘制样式设置'
})

// 是否有边线（所有要素除纯点外都有边线）
const hasStroke = computed(() => {
  const t = currentFeatureType.value
  return t !== 'Point' && t !== 'CircleOutline'
})

// 是否是箭头类型
const isArrow = computed(() => {
  return ARROW_TYPES.includes(currentFeatureType.value)
})

// 是否为军标箭头（需要渐变控制）
const isBattleArrow = computed(() => {
  return currentFeatureType.value === 'BattleArrow'
})

// 是否有填充
const hasFill = computed(() => {
  return ['Polygon', 'Rectangle', 'Ellipse', 'WindArrow'].includes(currentFeatureType.value)
})

// 是否有半径控制
const hasRadius = computed(() => {
  const t = currentFeatureType.value
  return t === 'Point' || t === 'CircleOutline'
})

// 半径标签
const radiusLabel = computed(() => {
  const t = currentFeatureType.value
  if (t === 'Point') return '点大小'
  if (t === 'CircleOutline') return '半径大小'
  return '半径'
})

// ==================== 绘制要素管理 ====================
// 逻辑要素：{ id, drawType, styleParams, coords:[[lng,lat,h]], entity, fillEntity, strokeEntity, ringFn, ... }
const features = ref([])
let featureSeq = 0

// 绘制交互状态
let handler = null
let drawState = null
let clickTimer = null
let savedDepthTest = false

// 预览实体
let previewLine = null
let previewFill = null

// 点击序列类工具（单击加点，双击/右键结束）
const CLICK_SEQUENCE_TYPES = ['LineString', 'Polygon', 'Arrow', 'WindArrow', 'BattleArrow']
// 拖拽类工具
const DRAG_TYPES = ['Rectangle', 'Ellipse', 'CircleOutline']

// ==================== 坐标与几何工具 ====================
const M_PER_DEG_LAT = 110540

function mPerDegLng(lat) {
  return 111320 * Math.cos((lat * Math.PI) / 180)
}

/**
 * 屏幕坐标 → 经纬度 + 高度（优先拾取地形真实高度，失败回退椭球面）
 */
function pickLngLat(position) {
  if (!position) return null
  const scene = viewer.scene
  let cartesian = null
  try {
    cartesian = scene.pickPosition(position)
  } catch (e) { /* 忽略 */ }
  if (!cartesian) {
    try {
      cartesian = viewer.camera.pickEllipsoid(position, scene.globe.ellipsoid)
    } catch (e) { /* 忽略 */ }
  }
  if (!cartesian) return null
  const carto = Cartographic.fromCartesian(cartesian)
  return {
    lng: CesiumMath.toDegrees(carto.longitude),
    lat: CesiumMath.toDegrees(carto.latitude),
    height: carto.height
  }
}

function toCartesians(coords, fallbackHeight) {
  return coords.map(c => Cartesian3.fromDegrees(c[0], c[1], c[2] ?? fallbackHeight ?? 0))
}

function avgH(pts) {
  if (!pts.length) return 0
  let s = 0
  for (const p of pts) s += (p[2] ?? p.height ?? 0)
  return s / pts.length
}

// 经纬度 → 局部米制坐标（围绕中心点，避免经度纬度比例失真）
function toLocalMeters(coords) {
  const refLng = coords.reduce((s, c) => s + c[0], 0) / coords.length
  const refLat = coords.reduce((s, c) => s + c[1], 0) / coords.length
  const kx = mPerDegLng(refLat)
  return {
    refLng,
    refLat,
    kx,
    pts: coords.map(c => [(c[0] - refLng) * kx, (c[1] - refLat) * M_PER_DEG_LAT])
  }
}

// 局部米制坐标 → 经纬度（恢复高度）
function fromLocalMeters(local, pts, h) {
  const { refLng, refLat, kx } = local
  return pts.map(p => [refLng + p[0] / kx, refLat + p[1] / M_PER_DEG_LAT, h])
}

// ==================== 颜色 / 材质 ====================
function cssColor(hex, alpha) {
  return Color.fromCssColorString(hex).withAlpha(alpha ?? 1)
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 创建边线材质（实线 = Color，虚线 = PolylineDashMaterialProperty）
function createStrokeMaterial(p) {
  const color = cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1)
  if (p.strokeDashType === 'dashed') {
    const dash = p.dashLength || 8
    const gap = p.dashGap || 4
    const total = Math.max(1, dash + gap)
    const ratio = Math.min(1, dash / total)
    const n = Math.round(16 * ratio)
    const pattern = n <= 0 ? 0 : n >= 16 ? 0xFFFF : ((0xFFFF << (16 - n)) & 0xFFFF)
    return new PolylineDashMaterialProperty({ color, dashLength: total, dashPattern: pattern })
  }
  return color
}

// 军标渐变 canvas 材质
function createGradientCanvas(p) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 16
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 256, 0)
  g.addColorStop(0, hexToRgba(p.gradientStartColor || '#FFB3B3', p.gradientStartOpacity ?? 0.3))
  g.addColorStop(1, hexToRgba(p.gradientEndColor || '#D32F2F', p.gradientEndOpacity ?? 1))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 16)
  return canvas
}

// ==================== 箭头几何（米制局部坐标） ====================
// 小箭头：三角箭头尖
function computeArrowHead(coords, params) {
  const last = coords[coords.length - 1]
  const prev = coords[coords.length - 2]
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
  const scale = params.arrowScale || 1
  const headW = (params.arrowHeadWidth || 5) * scale * 0.8
  const headLen = 10 * scale
  const tip = [last[0] + Math.cos(angle) * headLen, last[1] + Math.sin(angle) * headLen]
  const baseLeft = [last[0] + Math.cos(angle + Math.PI / 2) * headW, last[1] + Math.sin(angle + Math.PI / 2) * headW]
  const baseRight = [last[0] + Math.cos(angle - Math.PI / 2) * headW, last[1] + Math.sin(angle - Math.PI / 2) * headW]
  return [tip, baseLeft, baseRight]
}

// Catmull-Rom 曲线平滑
function catmullRomSmooth(points, numSegments) {
  if (points.length < 3) return [...points]
  const result = [points[0]]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    for (let j = 1; j <= numSegments; j++) {
      const t = j / (numSegments + 1)
      const t2 = t * t; const t3 = t2 * t
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      result.push([x, y])
    }
  }
  result.push(points[points.length - 1])
  return result
}

// 风向箭头：锥形箭头（尾窄→体宽→尖头）
function buildTaperedArrowPolygon(coords, params, smooth = true) {
  if (!coords || coords.length < 2) return null
  let path = coords
  if (smooth && coords.length >= 3) path = catmullRomSmooth(coords, 24)

  const segLens = []
  let totalLen = 0
  for (let i = 1; i < path.length; i++) {
    const dx = path[i][0] - path[i - 1][0]
    const dy = path[i][1] - path[i - 1][1]
    const d = Math.sqrt(dx * dx + dy * dy)
    segLens.push(d)
    totalLen += d
  }
  if (totalLen < 1) totalLen = 1

  const scale = params.arrowScale || 1
  const sw = params.strokeWidth || 2
  const headW = (params.arrowHeadWidth || 8) * scale        // 头部半宽
  const bodyW = headW * 0.6                                // 体部半宽
  const tailW = Math.max(sw * 0.4, 1) * scale              // 尾部半宽

  const leftSide = []
  const rightSide = []
  let acc = 0

  for (let i = 0; i < path.length; i++) {
    if (i > 0) acc += segLens[i - 1]
    const t = acc / totalLen
    let hw
    if (t < 0.2) {
      hw = tailW + (bodyW - tailW) * (t / 0.2)
    } else if (t < 0.8) {
      hw = bodyW
    } else {
      const p = (t - 0.8) / 0.2
      hw = bodyW + (headW - bodyW) * p
    }
    let dx, dy
    if (i === 0) {
      dx = path[1][0] - path[0][0]; dy = path[1][1] - path[0][1]
    } else if (i === path.length - 1) {
      dx = path[i][0] - path[i - 1][0]; dy = path[i][1] - path[i - 1][1]
    } else {
      dx = path[i + 1][0] - path[i - 1][0]; dy = path[i + 1][1] - path[i - 1][1]
    }
    const nl = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / nl
    const ny = dx / nl
    leftSide.push([path[i][0] + nx * hw, path[i][1] + ny * hw])
    rightSide.push([path[i][0] - nx * hw, path[i][1] - ny * hw])
  }

  // 尖端从最后一个点向外延伸
  const last = path[path.length - 1]
  const prev = path[path.length - 2]
  const lastAngle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
  const tipExtend = headW * 1.6
  const tip = [last[0] + Math.cos(lastAngle) * tipExtend, last[1] + Math.sin(lastAngle) * tipExtend]

  // 闭合多边形：左侧 → 尖端 → 右侧（逆序），不重复首点
  return [...leftSide, tip, ...rightSide.reverse()]
}

// 军标箭头：窄尾柄 + 宽三角头
function buildBattleArrowPolygon(coords, params) {
  if (!coords || coords.length < 2) return null

  const scale = params.arrowScale || 1
  const arrowHeadWidth = params.arrowHeadWidth || 6
  const baseW = arrowHeadWidth * scale * 1.8   // 三角头底部半宽
  const stemW = baseW * 0.42                    // 箭杆半宽

  const segLens = []
  let totalLen = 0
  for (let i = 1; i < coords.length; i++) {
    const dx = coords[i][0] - coords[i - 1][0]
    const dy = coords[i][1] - coords[i - 1][1]
    const d = Math.sqrt(dx * dx + dy * dy)
    segLens.push(d)
    totalLen += d
  }
  if (totalLen < 1) totalLen = 1

  const headRatio = Math.min(0.45, Math.max(0.25, (baseW * 2.5) / totalLen))
  const minSamples = 24
  const numSamples = Math.max(minSamples, Math.ceil(totalLen / 6))

  function pointAtT(t) {
    if (t <= 0) return [coords[0][0], coords[0][1]]
    if (t >= 1) return [coords[coords.length - 1][0], coords[coords.length - 1][1]]
    const target = t * totalLen
    let acc = 0
    for (let i = 0; i < coords.length - 1; i++) {
      if (acc + segLens[i] >= target) {
        const local = (target - acc) / segLens[i]
        return [
          coords[i][0] + (coords[i + 1][0] - coords[i][0]) * local,
          coords[i][1] + (coords[i + 1][1] - coords[i][1]) * local
        ]
      }
      acc += segLens[i]
    }
    return [coords[coords.length - 1][0], coords[coords.length - 1][1]]
  }

  function dirAtT(t) {
    const eps = 1 / numSamples
    const p1 = pointAtT(Math.max(0, t - eps))
    const p2 = pointAtT(Math.min(1, t + eps))
    const dx = p2[0] - p1[0]
    const dy = p2[1] - p1[1]
    const nl = Math.sqrt(dx * dx + dy * dy) || 1
    return [-dy / nl, dx / nl]
  }

  const leftSide = []
  const rightSide = []

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples
    const p = pointAtT(t)
    const [nx, ny] = dirAtT(t)

    let hw
    if (t <= 1 - headRatio + 1e-6) {
      hw = stemW
    } else {
      const localT = (t - (1 - headRatio)) / headRatio
      hw = baseW * Math.max(0, 1 - localT)
    }

    leftSide.push([p[0] + nx * hw, p[1] + ny * hw])
    rightSide.push([p[0] - nx * hw, p[1] - ny * hw])
  }

  return [...leftSide, ...rightSide.reverse()]
}

// ==================== 面类几何 ====================
function rectRingFromTwoPoints(s, e, h) {
  return [
    [s.lng, s.lat, h],
    [s.lng, e.lat, h],
    [e.lng, e.lat, h],
    [e.lng, s.lat, h]
  ]
}

function ellipseFromTwoPoints(s, e) {
  const kx = mPerDegLng((s.lat + e.lat) / 2)
  const rx = Math.max(1, Math.abs(e.lng - s.lng) * kx / 2)
  const ry = Math.max(1, Math.abs(e.lat - s.lat) * M_PER_DEG_LAT / 2)
  return { rx, ry, center: { lng: (s.lng + e.lng) / 2, lat: (s.lat + e.lat) / 2 } }
}

function distMeters(a, b) {
  const kx = mPerDegLng((a.lat + b.lat) / 2)
  const dx = (b.lng - a.lng) * kx
  const dy = (b.lat - a.lat) * M_PER_DEG_LAT
  return Math.sqrt(dx * dx + dy * dy)
}

function ellipseRingMeters(center, rx, ry, h) {
  const kx = mPerDegLng(center.lat)
  const ring = []
  const steps = 64
  for (let i = 0; i < steps; i++) {
    const a = (2 * Math.PI * i) / steps
    ring.push([center.lng + (rx * Math.cos(a)) / kx, center.lat + (ry * Math.sin(a)) / M_PER_DEG_LAT, h])
  }
  return ring
}

// ==================== 样式应用 ====================
function getCurrentParams() {
  return {
    strokeColor: strokeColor.value,
    strokeWidth: strokeWidth.value,
    strokeOpacity: strokeOpacity.value,
    strokeDashType: strokeDashType.value,
    dashLength: dashLength.value,
    dashGap: dashGap.value,
    fillColor: fillColor.value,
    fillOpacity: fillOpacity.value,
    radius: featureRadius.value,
    arrowScale: arrowScale.value,
    arrowHeadWidth: arrowHeadWidth.value,
    gradientStartColor: gradientStartColor.value,
    gradientEndColor: gradientEndColor.value,
    gradientStartOpacity: gradientStartOpacity.value,
    gradientEndOpacity: gradientEndOpacity.value
  }
}

// 将样式应用到逻辑要素（重建 geometry/材质）
function applyFeatureStyle(f) {
  const p = f.styleParams
  const t = f.drawType
  const h = f.height

  if (t === 'Point') {
    const c = f.coords[0]
    f.entity.position = Cartesian3.fromDegrees(c[0], c[1], c[2] ?? h)
    f.entity.point = {
      pixelSize: (p.radius || 6) * 2,
      color: cssColor(p.strokeColor || '#4096FF', (p.strokeOpacity ?? 1) * 0.3),
      outlineColor: cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1),
      outlineWidth: p.strokeWidth || 2
    }
    return
  }

  if (t === 'LineString') {
    f.strokeEntity.polyline = {
      positions: toCartesians(f.coords, h),
      width: p.strokeWidth,
      material: createStrokeMaterial(p)
    }
    return
  }

  if (t === 'Arrow') {
    // 杆身
    f.strokeEntity.polyline = {
      positions: toCartesians(f.coords, h),
      width: p.strokeWidth,
      material: createStrokeMaterial(p)
    }
    // 三角箭头尖
    const local = toLocalMeters(f.coords)
    const head = computeArrowHead(local.pts, p)
    const headGeo = fromLocalMeters(local, head, f.coords[f.coords.length - 1][2] ?? h)
    f.fillEntity.polygon = {
      hierarchy: toCartesians(headGeo, h),
      material: cssColor(p.strokeColor || '#4096FF', p.strokeOpacity ?? 1)
    }
    return
  }

  // 面类：Polygon / Rectangle / Ellipse / WindArrow / BattleArrow / CircleOutline
  const ring = f.ringFn ? f.ringFn(p) : f.coords
  const cartesians = toCartesians(ring, h)

  if (f.fillEntity) {
    let material
    if (t === 'BattleArrow') {
      material = new ImageMaterialProperty({
        image: createGradientCanvas(p),
        repeat: new Cartesian2(1, 1)
      })
    } else {
      material = cssColor(p.fillColor || p.strokeColor || '#4096FF', p.fillOpacity ?? 0.15)
    }
    f.fillEntity.polygon = {
      hierarchy: cartesians,
      material
    }
  }

  f.strokeEntity.polyline = {
    positions: [...cartesians, cartesians[0]],
    width: p.strokeWidth,
    material: createStrokeMaterial(p)
  }
}

// ==================== 实体创建 ====================
function createEntities(f) {
  const t = f.drawType
  if (t === 'Point') {
    f.entity = viewer.entities.add({ position: Cartesian3.fromDegrees(0, 0, 0) })
    f.entity.__drawFeature = f
  } else if (t === 'LineString') {
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
  } else if (t === 'Arrow') {
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
    f.fillEntity = viewer.entities.add({ polygon: {} })
    f.fillEntity.__drawFeature = f
  } else {
    if (t !== 'CircleOutline') {
      f.fillEntity = viewer.entities.add({ polygon: {} })
      f.fillEntity.__drawFeature = f
    }
    f.strokeEntity = viewer.entities.add({ polyline: {} })
    f.strokeEntity.__drawFeature = f
  }
}

// 创建逻辑要素并添加实体
function buildFeature(drawType, params, coords, extra = {}) {
  const f = {
    id: `draw-${++featureSeq}`,
    drawType,
    styleParams: { ...params },
    coords,
    height: extra.height ?? avgH(coords),
    entity: null,
    fillEntity: null,
    strokeEntity: null,
    ringFn: extra.ringFn || null,
    rx: extra.rx,
    ry: extra.ry,
    radius: extra.radius,
    centerLng: coords.reduce((s, c) => s + c[0], 0) / coords.length,
    centerLat: coords.reduce((s, c) => s + c[1], 0) / coords.length
  }
  createEntities(f)
  applyFeatureStyle(f)
  // markRaw 阻止 Vue 深度代理 feature 及其 Cesium Entity 对象，
  // 否则 viewer.entities.contains(代理对象) 引用比较失败导致 remove 无效（清除/撤销失效）
  features.value.push(markRaw(f))
  return f
}

function removeFeature(f) {
  const ents = [f.entity, f.fillEntity, f.strokeEntity]
  for (const e of ents) {
    if (e) {
      try {
        // 直接 remove（removeById 按 entity.id 查找），不使用 contains 引用比较，
        // 避免代理对象导致 contains 返回 false 而跳过移除
        viewer.entities.remove(e)
      } catch (err) {
        console.warn('[DrawingToolbar3D] 移除实体失败:', err)
      }
    }
  }
  const idx = features.value.indexOf(f)
  if (idx > -1) features.value.splice(idx, 1)
}

// ==================== 选择模式 ====================
function startSelectMode() {
  handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((movement) => {
    const picked = viewer.scene.pick(movement.position)
    const entity = picked && picked.id
    const f = entity && entity.__drawFeature
    if (f) {
      selectFeature(f)
    } else {
      unselect()
    }
  }, ScreenSpaceEventType.LEFT_CLICK)
}

function selectFeature(f) {
  if (selectedFeature.value && selectedFeature.value !== f) unselect()
  selectedFeature.value = f
  isSelectPicked.value = true
  applySelectionHighlight(f)
  updatePanelFromFeature(f)
}

function unselect() {
  if (selectedFeature.value) {
    applyFeatureStyle(selectedFeature.value)
    selectedFeature.value = null
    isSelectPicked.value = false
  }
}

// 选中高亮：青色描边 / 加粗 / 放大
function applySelectionHighlight(f) {
  const p = f.styleParams
  const cyan = Color.fromCssColorString('#05f5ff')
  if (f.entity) {
    f.entity.point.pixelSize = ((p.radius || 6) * 2) + 6
    f.entity.point.outlineColor = cyan
    f.entity.point.outlineWidth = 3
  }
  if (f.strokeEntity) {
    const cur = f.strokeEntity.polyline.width
    const w = (cur && typeof cur.getValue === 'function' ? cur.getValue() : cur) || p.strokeWidth || 2
    f.strokeEntity.polyline.width = w + 4
  }
  if (f.fillEntity) {
    f.fillEntity.polygon.outline = true
    f.fillEntity.polygon.outlineColor = cyan
    f.fillEntity.polygon.outlineWidth = 2
  }
}

// ==================== 预览实体 ====================
function setPreviewLine(coords, params, h) {
  if (!previewLine) previewLine = viewer.entities.add({ polyline: {} })
  previewLine.show = true
  previewLine.polyline = {
    positions: toCartesians(coords, h),
    width: params.strokeWidth,
    material: createStrokeMaterial(params)
  }
}

function setPreviewFill(coords, material, h) {
  if (!previewFill) previewFill = viewer.entities.add({ polygon: {} })
  previewFill.show = true
  previewFill.polygon = {
    hierarchy: toCartesians(coords, h),
    material
  }
}

function hidePreviewFill() {
  if (previewFill) previewFill.show = false
}

function cleanupPreview() {
  if (previewLine) {
    viewer.entities.remove(previewLine)
    previewLine = null
  }
  if (previewFill) {
    viewer.entities.remove(previewFill)
    previewFill = null
  }
}

// ==================== 点击序列绘制（线/面/箭头） ====================
function setupClickSequence(type) {
  handler.setInputAction((movement) => {
    const pos = pickLngLat(movement.position)
    if (!pos) return
    // 双击会触发两次单击，用定时器延迟加点，双击时取消
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
      return
    }
    clickTimer = setTimeout(() => {
      clickTimer = null
      drawState.points.push(pos)
      updatePreview()
    }, 250)
  }, ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(() => {
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
    }
    finishClickSequence()
  }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  handler.setInputAction(() => {
    finishClickSequence(true)
  }, ScreenSpaceEventType.RIGHT_CLICK)

  handler.setInputAction((movement) => {
    if (!drawState || drawState.points.length === 0) return
    const pos = pickLngLat(movement.endPosition)
    if (!pos) return
    drawState.mousePos = pos
    updatePreview()
  }, ScreenSpaceEventType.MOUSE_MOVE)
}

function updatePreview() {
  const t = drawState.type
  // drawState.points 存储的是 {lng, lat, height} 对象，需转为 [lng, lat, height] 数组
  const pts = drawState.points.map(p => [p.lng, p.lat, p.height])
  const mouse = drawState.mousePos
  const mouseArr = mouse ? [mouse.lng, mouse.lat, mouse.height] : null
  const all = mouseArr ? [...pts, mouseArr] : pts
  const params = getCurrentParams()
  const h = avgH(all)

  if (t === 'LineString') {
    setPreviewLine(all, params, h)
    hidePreviewFill()
  } else if (t === 'Polygon') {
    setPreviewLine([...all, all[0]], params, h)
    setPreviewFill(all, cssColor(params.fillColor, params.fillOpacity), h)
  } else if (t === 'Arrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const head = computeArrowHead(local.pts, params)
      setPreviewFill(fromLocalMeters(local, head, avgH(all)), cssColor(params.strokeColor, params.strokeOpacity), h)
    } else {
      hidePreviewFill()
    }
  } else if (t === 'WindArrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const body = buildTaperedArrowPolygon(local.pts, params)
      if (body) {
        setPreviewFill(fromLocalMeters(local, body, avgH(all)), cssColor(params.fillColor, params.fillOpacity), h)
        return
      }
    }
    hidePreviewFill()
  } else if (t === 'BattleArrow') {
    setPreviewLine(all, params, h)
    if (all.length >= 2) {
      const local = toLocalMeters(all)
      const body = buildBattleArrowPolygon(local.pts, params)
      if (body) {
        setPreviewFill(
          fromLocalMeters(local, body, avgH(all)),
          new ImageMaterialProperty({ image: createGradientCanvas(params), repeat: new Cartesian2(1, 1) }),
          h
        )
        return
      }
    }
    hidePreviewFill()
  }
}

function finishClickSequence() {
  if (!drawState) return
  const t = drawState.type
  const pts = drawState.points
  const min = t === 'Polygon' ? 3 : 2
  if (pts.length >= min) {
    const params = getCurrentParams()
    const coords = pts.map(p => [p.lng, p.lat, p.height])
    let f = null
    if (t === 'LineString') {
      f = buildFeature('LineString', params, coords)
    } else if (t === 'Polygon') {
      f = buildFeature('Polygon', params, coords, { ringFn: () => [...coords] })
    } else if (t === 'Arrow') {
      f = buildFeature('Arrow', params, coords)
    } else if (t === 'WindArrow') {
      f = buildFeature('WindArrow', params, coords, {
        ringFn: (p2) => {
          const local = toLocalMeters(coords)
          const body = buildTaperedArrowPolygon(local.pts, p2)
          return body ? fromLocalMeters(local, body, avgH(coords)) : coords
        }
      })
    } else if (t === 'BattleArrow') {
      f = buildFeature('BattleArrow', params, coords, {
        ringFn: (p2) => {
          const local = toLocalMeters(coords)
          const body = buildBattleArrowPolygon(local.pts, p2)
          return body ? fromLocalMeters(local, body, avgH(coords)) : coords
        }
      })
    }
    cleanupPreview()
    drawState.points = []
    drawState.mousePos = null
    if (f) {
      selectedFeature.value = f
      isSelectPicked.value = false
      updatePanelFromFeature(f)
    }
  } else if (pts.length > 0) {
    // 点数不足：取消本次绘制
    cleanupPreview()
    drawState.points = []
    drawState.mousePos = null
  }
}

// ==================== 拖拽绘制（矩形/椭圆/画圆） ====================
function setupDrag(type) {
  handler.setInputAction((movement) => {
    const pos = pickLngLat(movement.position)
    if (!pos) return
    drawState.startPos = pos
    drawState.endPos = pos
    drawState.dragging = true
    updateDragPreview()
  }, ScreenSpaceEventType.LEFT_DOWN)

  handler.setInputAction((movement) => {
    if (!drawState || !drawState.dragging) return
    const pos = pickLngLat(movement.endPosition)
    if (!pos) return
    drawState.endPos = pos
    updateDragPreview()
  }, ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction(() => {
    if (!drawState || !drawState.dragging) return
    drawState.dragging = false
    finishDrag()
  }, ScreenSpaceEventType.LEFT_UP)
}

function updateDragPreview() {
  const t = drawState.type
  const s = drawState.startPos
  const e = drawState.endPos
  const params = getCurrentParams()
  const h = (s.height + e.height) / 2

  if (t === 'Rectangle') {
    const ring = rectRingFromTwoPoints(s, e, h)
    setPreviewFill(ring, cssColor(params.fillColor, params.fillOpacity), h)
    setPreviewLine([...ring, ring[0]], params, h)
  } else if (t === 'Ellipse') {
    const { rx, ry, center } = ellipseFromTwoPoints(s, e)
    const ring = ellipseRingMeters(center, rx, ry, h)
    setPreviewFill(ring, cssColor(params.fillColor, params.fillOpacity), h)
    setPreviewLine([...ring, ring[0]], params, h)
  } else if (t === 'CircleOutline') {
    const r = Math.max(1, distMeters(s, e))
    const ring = ellipseRingMeters({ lng: s.lng, lat: s.lat }, r, r, h)
    setPreviewLine([...ring, ring[0]], params, h)
    hidePreviewFill()
  }
}

function finishDrag() {
  const t = drawState.type
  const s = drawState.startPos
  const e = drawState.endPos
  const h = (s.height + e.height) / 2
  const params = getCurrentParams()
  let f = null

  if (t === 'Rectangle') {
    const ring = rectRingFromTwoPoints(s, e, h)
    f = buildFeature('Rectangle', params, [[s.lng, s.lat, h], [e.lng, e.lat, h]], {
      ringFn: () => [...ring]
    })
  } else if (t === 'Ellipse') {
    const { rx, ry, center } = ellipseFromTwoPoints(s, e)
    f = buildFeature('Ellipse', params, [[center.lng, center.lat, h]], {
      rx, ry,
      ringFn: () => ellipseRingMeters(center, rx, ry, h)
    })
  } else if (t === 'CircleOutline') {
    const r = Math.max(1, distMeters(s, e))
    params.radius = Math.round(r)
    const center = { lng: s.lng, lat: s.lat }
    f = buildFeature('CircleOutline', params, [[s.lng, s.lat, h]], {
      radius: r,
      ringFn: (p2) => ellipseRingMeters(center, p2.radius ?? r, p2.radius ?? r, h)
    })
  }

  cleanupPreview()
  drawState.startPos = null
  drawState.endPos = null
  if (f) {
    selectedFeature.value = f
    isSelectPicked.value = false
    updatePanelFromFeature(f)
  }
}

// ==================== 绘制模式 ====================
function startDrawMode(type) {
  // 绘制时禁用相机控制，避免与鼠标交互冲突
  viewer.scene.screenSpaceCameraController.enableInputs = false
  // 设置十字丝光标
  viewer.scene.canvas.style.cursor = 'crosshair'
  drawState = { type, points: [], mousePos: null, startPos: null, endPos: null, dragging: false }
  handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

  if (type === 'Point') {
    handler.setInputAction((movement) => {
      const pos = pickLngLat(movement.position)
      if (!pos) return
      const params = getCurrentParams()
      const f = buildFeature('Point', params, [[pos.lng, pos.lat, pos.height]])
      selectedFeature.value = f
      isSelectPicked.value = false
      updatePanelFromFeature(f)
    }, ScreenSpaceEventType.LEFT_CLICK)
  } else if (CLICK_SEQUENCE_TYPES.includes(type)) {
    setupClickSequence(type)
  } else if (DRAG_TYPES.includes(type)) {
    setupDrag(type)
  }
}

// ==================== 工具激活 / 停用 ====================
function activateTool(type) {
  if (activeTool.value === type) {
    deactivateTool()
    return
  }
  deactivateTool()

  if (!viewer || viewer.isDestroyed()) return

  mapStore.setDrawingActive(true)
  activeTool.value = type

  if (type === 'Select') {
    startSelectMode()
  } else {
    startDrawMode(type)
  }
}

function deactivateTool() {
  if (clickTimer) {
    clearTimeout(clickTimer)
    clickTimer = null
  }
  cleanupPreview()
  drawState = null
  if (handler) {
    handler.destroy()
    handler = null
  }
  if (viewer && !viewer.isDestroyed() && viewer.scene) {
    viewer.scene.screenSpaceCameraController.enableInputs = true
    // 恢复默认光标
    viewer.scene.canvas.style.cursor = 'default'
  }
  unselect()
  activeTool.value = null
  mapStore.setDrawingActive(false)
}

// ==================== 样式变更处理 ====================
function onStyleChange() {
  if (isUpdatingPanel) return

  if (selectedFeature.value) {
    const f = selectedFeature.value
    const params = { ...(f.styleParams || {}) }
    params.strokeColor = strokeColor.value
    params.strokeWidth = strokeWidth.value
    params.strokeOpacity = strokeOpacity.value
    params.strokeDashType = strokeDashType.value
    params.dashLength = dashLength.value
    params.dashGap = dashGap.value
    params.fillColor = fillColor.value
    params.fillOpacity = fillOpacity.value
    if (hasRadius.value) params.radius = featureRadius.value
    if (isArrow.value) {
      params.arrowScale = arrowScale.value
      params.arrowHeadWidth = arrowHeadWidth.value
      if (currentFeatureType.value === 'BattleArrow') {
        params.gradientStartColor = gradientStartColor.value
        params.gradientEndColor = gradientEndColor.value
        params.gradientStartOpacity = gradientStartOpacity.value
        params.gradientEndOpacity = gradientEndOpacity.value
      }
    }

    f.styleParams = params
    applyFeatureStyle(f)
    // 仅当通过"选择"工具手动选中时，才叠加高亮效果
    if (isSelectPicked.value) {
      applySelectionHighlight(f)
    }
  }
}

// 从选中要素更新面板参数
function updatePanelFromFeature(f) {
  const params = f.styleParams
  if (!params) return

  isUpdatingPanel = true
  strokeColor.value = params.strokeColor || '#4096FF'
  strokeWidth.value = params.strokeWidth || 2
  strokeOpacity.value = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
  strokeDashType.value = params.strokeDashType || 'solid'
  dashLength.value = params.dashLength || 8
  dashGap.value = params.dashGap || 4
  fillColor.value = params.fillColor || '#4096FF'
  fillOpacity.value = params.fillOpacity !== undefined ? params.fillOpacity : 0.15
  if (params.radius !== undefined) featureRadius.value = params.radius
  if (params.arrowScale !== undefined) arrowScale.value = params.arrowScale
  if (params.arrowHeadWidth !== undefined) arrowHeadWidth.value = params.arrowHeadWidth
  if (params.gradientStartColor !== undefined) gradientStartColor.value = params.gradientStartColor
  if (params.gradientEndColor !== undefined) gradientEndColor.value = params.gradientEndColor
  if (params.gradientStartOpacity !== undefined) gradientStartOpacity.value = params.gradientStartOpacity
  if (params.gradientEndOpacity !== undefined) gradientEndOpacity.value = params.gradientEndOpacity

  nextTick(() => { isUpdatingPanel = false })
}

// ==================== 删除 / 清除 / 撤销 ====================
function deleteSelectedFeature() {
  if (selectedFeature.value) {
    removeFeature(selectedFeature.value)
    selectedFeature.value = null
    isSelectPicked.value = false
  }
}

function clearDrawings() {
  cleanupPreview()
  for (const f of [...features.value]) removeFeature(f)
  features.value = []
  selectedFeature.value = null
  isSelectPicked.value = false
}

function undoLast() {
  const f = features.value[features.value.length - 1]
  if (f) {
    if (selectedFeature.value === f) {
      selectedFeature.value = null
      isSelectPicked.value = false
    }
    removeFeature(f)
  }
}

// ==================== 关闭样式面板 ====================
function closeStylePanel() {
  // 选择模式下：取消选中要素即可关闭面板
  if (activeTool.value === 'Select' && selectedFeature.value) {
    unselect()
    return
  }
  // 绘制模式下：停用工具
  deactivateTool()
}

// ==================== 键盘事件 ====================
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (activeTool.value === 'Select' && selectedFeature.value) {
      unselect()
    } else {
      deactivateTool()
    }
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 开启深度测试，使 scene.pickPosition 能拾取地形高度（绘制要素贴合地形）
  if (viewer && viewer.scene && viewer.scene.globe) {
    savedDepthTest = viewer.scene.globe.depthTestAgainstTerrain
    viewer.scene.globe.depthTestAgainstTerrain = true
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  deactivateTool()
  document.removeEventListener('keydown', handleKeydown)
  if (viewer && !viewer.isDestroyed() && viewer.scene && viewer.scene.globe) {
    viewer.scene.globe.depthTestAgainstTerrain = savedDepthTest
  }
})
</script>

<style scoped>
.drawing-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba(13, 31, 60, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(64, 150, 255, 0.15);
  border-radius: 10px;
  padding: 5px;
  width: 52px;
  min-width: 52px;
  user-select: none;
  z-index: 20;
}

/* ===== 工具按钮组 ===== */
.tool-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: auto;
  padding: 5px 2px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(186, 224, 255, 0.85);
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.15);
}

.tool-btn.active {
  color: #69b1ff;
  background: rgba(64, 150, 255, 0.2);
  box-shadow: inset 0 0 0 1px rgba(64, 150, 255, 0.4);
}

.tool-btn i {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.tool-label {
  font-size: 11px;
  line-height: 1.2;
  margin-top: 1px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ===== 分隔线 ===== */
.tool-divider {
  height: 1px;
  background: rgba(64, 150, 255, 0.12);
  margin: 4px 2px;
}

/* ===== 样式编辑面板 ===== */
.style-panel-container {
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 240px;
  background: rgba(13, 31, 60, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 150, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 21;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
}

.style-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(64, 150, 255, 0.12);
}

.style-panel-icon {
  display: flex;
  align-items: center;
  color: #69b1ff;
}

.style-panel-title {
  font-size: 12px;
  color: #e6f0ff;
  font-weight: 600;
  letter-spacing: 0.5px;
  flex: 1;
}

.style-panel-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgba(186, 224, 255, 0.5);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.style-panel-close-btn:hover {
  background: rgba(255, 122, 105, 0.15);
  color: rgba(255, 140, 120, 0.9);
}

.style-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.style-label {
  font-size: 11px;
  color: rgba(186, 224, 255, 0.7);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.style-separator {
  font-size: 10px;
  color: rgba(255, 170, 0, 0.7);
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 0 0 0;
  border-top: 1px solid rgba(255, 170, 0, 0.15);
  margin-top: 2px;
}

.style-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 36px;
  height: 26px;
  border: 1px solid rgba(64, 150, 255, 0.25);
  border-radius: 5px;
  cursor: pointer;
  background: transparent;
  padding: 0;
  flex-shrink: 0;
}

.color-input::-webkit-color-swatch-wrapper { padding: 2px; }
.color-input::-webkit-color-swatch { border: none; border-radius: 3px; }

.color-value {
  font-size: 11px;
  color: rgba(186, 224, 255, 0.6);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  letter-spacing: 0.3px;
}

/* 预设颜色色板 */
.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.preset-color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(64, 150, 255, 0.2);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}

.preset-color-swatch:hover {
  transform: scale(1.15);
  border-color: rgba(64, 150, 255, 0.5);
}

.preset-color-swatch.active {
  border-color: #fff;
  box-shadow: 0 0 0 1px #4096FF;
}

/* 实线/虚线切换 */
.dash-toggle-group {
  display: flex;
  gap: 4px;
  width: 100%;
}

.dash-toggle-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 5px 4px;
  background: rgba(64, 150, 255, 0.06);
  border: 1px solid rgba(64, 150, 255, 0.1);
  border-radius: 6px;
  color: rgba(186, 224, 255, 0.6);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.dash-toggle-btn:hover {
  color: #bae0ff;
  background: rgba(64, 150, 255, 0.12);
}

.dash-toggle-btn.active {
  color: #69b1ff;
  background: rgba(64, 150, 255, 0.18);
  border-color: rgba(64, 150, 255, 0.4);
  box-shadow: inset 0 0 0 1px rgba(64, 150, 255, 0.3);
}

.range-input {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(64, 150, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4096FF;
  cursor: pointer;
  border: 2px solid rgba(230, 240, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.range-value {
  font-size: 11px;
  color: #69b1ff;
  font-weight: 600;
  min-width: 36px;
  text-align: right;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.delete-feature-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 7px;
  background: rgba(255, 122, 105, 0.1);
  border: 1px solid rgba(255, 122, 105, 0.25);
  border-radius: 6px;
  color: rgba(255, 140, 120, 0.9);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.delete-feature-btn:hover {
  background: rgba(255, 122, 105, 0.2);
  color: #ff7a69;
  border-color: rgba(255, 122, 105, 0.4);
}

/* ===== 操作按钮 ===== */
.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  padding: 5px 2px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  font-weight: 500;
}

.clear-btn { color: rgba(255, 140, 120, 0.7); }
.clear-btn:hover { color: #ff7a69; background: rgba(255, 122, 105, 0.1); }
.undo-btn { color: rgba(186, 224, 255, 0.7); }
.undo-btn:hover { color: #bae0ff; background: rgba(64, 150, 255, 0.15); }

/* ===== 面板动画 ===== */
.slide-fade-enter-active { transition: all 0.25s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(8px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(8px); }
</style>
