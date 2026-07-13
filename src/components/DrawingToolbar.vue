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
        </div>

        <!-- 边线颜色 -->
        <div class="style-row">
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
        <div class="style-row">
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
        <div class="style-row">
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMapStore } from '../stores/mapStore'
import Draw from 'ol/interaction/Draw'
import Select from 'ol/interaction/Select'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import CircleStyle from 'ol/style/Circle'
import Polygon from 'ol/geom/Polygon'
import LineString from 'ol/geom/LineString'

const props = defineProps({
  map: { type: Object, default: null }
})

const mapStore = useMapStore()

// ==================== 工具定义 ====================
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
    icon: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 16 L 12 10 L 12 12 L 16 8 L 12 4 L 12 6 Z" fill="currentColor"/></svg>'
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

// 样式参数
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
// 军标箭头渐变参数
const gradientStartColor = ref('#FF4444')
const gradientEndColor = ref('#FFAA00')
const gradientStartOpacity = ref(0.7)
const gradientEndOpacity = ref(0.15)

// 预设颜色（含红色和黄色）
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
  if (selectedFeature.value) return selectedFeature.value.get('drawType')
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

// 是否是选择工具选中的要素（而非绘制后自动选中）
const isSelectPicked = ref(false)

// 面板标题
const panelTitle = computed(() => {
  if (selectedFeature.value) {
    const type = selectedFeature.value.get('drawType')
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

// ==================== 矢量图层 ====================
let vectorSource = null
let vectorLayer = null
let drawInteraction = null
let selectInteraction = null
let modifyInteraction = null

function initVectorLayer() {
  vectorSource = new VectorSource()
  vectorLayer = new VectorLayer({
    source: vectorSource,
    zIndex: 9999,
    properties: { name: 'drawing-layer' }
  })
  if (props.map) {
    props.map.addLayer(vectorLayer)
  }
}

// ==================== 样式工具函数 ====================
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 构建 Stroke 配置
function buildStroke(params) {
  const sc = params.strokeColor || '#4096FF'
  const sw = params.strokeWidth || 2
  const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
  const dashType = params.strokeDashType || 'solid'

  const strokeOpts = {
    color: hexToRgba(sc, so),
    width: sw,
    lineCap: 'round',
    lineJoin: 'round'
  }

  if (dashType === 'dashed') {
    strokeOpts.lineDash = [params.dashLength || 8, params.dashGap || 4]
  }

  return new Stroke(strokeOpts)
}

// 根据类型和参数创建样式
function createStyleFromParams(type, params) {
  if (type === 'Point') {
    const sc = params.strokeColor || '#4096FF'
    const sw = params.strokeWidth || 2
    const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
    return new Style({
      image: new CircleStyle({
        radius: params.radius || sw * 3,
        fill: new Fill({ color: hexToRgba(sc, so * 0.3) }),
        stroke: new Stroke({ color: hexToRgba(sc, so), width: sw })
      })
    })
  }

  if (type === 'Arrow' || type === 'WindArrow' || type === 'BattleArrow') return null // 箭头单独处理

  if (type === 'CircleOutline') {
    const sc = params.strokeColor || '#4096FF'
    const sw = params.strokeWidth || 2
    const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
    return new Style({
      stroke: new Stroke({ color: hexToRgba(sc, so), width: sw })
    })
  }

  if (type === 'LineString') {
    return new Style({ stroke: buildStroke(params) })
  }

  if (['Polygon', 'Rectangle', 'Ellipse'].includes(type)) {
    const fc = params.fillColor || '#4096FF'
    const fo = params.fillOpacity !== undefined ? params.fillOpacity : 0.15
    return new Style({
      stroke: buildStroke(params),
      fill: new Fill({ color: hexToRgba(fc, fo) })
    })
  }

  return new Style({ stroke: buildStroke(params) })
}

// 获取当前样式参数对象
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

// 将样式应用到指定要素
function applyFeatureStyle(feature) {
  const params = feature.get('styleParams')
  const type = feature.get('drawType')
  if (!params || !type) return

  if (type === 'Arrow') {
    applySmallArrowStyle(feature, params)
  } else if (type === 'WindArrow') {
    applyWindArrowStyle(feature, params)
  } else if (type === 'BattleArrow') {
    applyBattleArrowStyle(feature, params)
  } else {
    const style = createStyleFromParams(type, params)
    if (style) feature.setStyle(style)
  }
}

// ==================== 小箭头样式 — 细杆 + 三角箭头尖 ====================
function applySmallArrowStyle(feature, params) {
  const p = { ...(params || {}) }
  const sc = p.strokeColor || '#4096FF'
  const sw = p.strokeWidth || 2
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  const rgba = hexToRgba(sc, so)
  const scale = p.arrowScale || 1
  const headW = p.arrowHeadWidth || 5

  const geom = feature.getGeometry()
  if (!geom) return
  let coords
  try { coords = geom.getCoordinates() } catch (e) { return }
  if (!coords || coords.length < 2) return

  const last = coords[coords.length - 1]
  const prev = coords[coords.length - 2]
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])

  const headLen = 10 * scale
  const halfW = headW * scale * 0.8

  // 箭头尖端：从尾端点沿方向延伸
  const tip = [
    last[0] + Math.cos(angle) * headLen,
    last[1] + Math.sin(angle) * headLen
  ]
  // 三角底边位于线尾端点
  const baseLeft = [
    last[0] + Math.cos(angle + Math.PI / 2) * halfW,
    last[1] + Math.sin(angle + Math.PI / 2) * halfW
  ]
  const baseRight = [
    last[0] + Math.cos(angle - Math.PI / 2) * halfW,
    last[1] + Math.sin(angle - Math.PI / 2) * halfW
  ]

  const arrowHead = new Polygon([[tip, baseLeft, baseRight, tip]])

  feature.setStyle([
    // 杆身
    new Style({ stroke: buildStroke(p) }),
    // 箭头三角
    new Style({
      geometry: arrowHead,
      fill: new Fill({ color: rgba }),
      stroke: new Stroke({ color: rgba, width: 1 })
    })
  ])
}

// ==================== 风向箭头样式 — 曲线粗箭头（尾窄→体宽→尖头） ====================
function applyWindArrowStyle(feature, params) {
  const p = { ...(params || {}) }
  const sc = p.strokeColor || '#4096FF'
  const sw = p.strokeWidth || 2
  const so = p.strokeOpacity !== undefined ? p.strokeOpacity : 1
  const fc = p.fillColor || sc
  const fo = p.fillOpacity !== undefined ? p.fillOpacity : 0.25

  const geom = feature.getGeometry()
  if (!geom) return
  let coords
  try { coords = geom.getCoordinates() } catch (e) { return }
  if (!coords || coords.length < 2) return

  const polygon = buildTaperedArrowPolygon(coords, p, true)
  if (!polygon) return

  feature.setStyle(new Style({
    geometry: polygon,
    stroke: new Stroke({
      color: hexToRgba(sc, so),
      width: sw,
      lineJoin: 'round',
      lineCap: 'round'
    }),
    fill: new Fill({ color: hexToRgba(fc, fo) })
  }))
}

// ==================== 军标箭头几何函数 — 攻击箭头（尾窄→体宽→V形尖） ====================
function buildTaperedArrowPolygon(coords, params, smooth = false) {
  if (!coords || coords.length < 2) return null
  let path = coords
  if (smooth && coords.length >= 3) {
    path = catmullRomSmooth(coords, 24)
  }

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

    // 宽度曲线：尾窄→体宽→头更宽
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

  // 闭合多边形：左侧 → 尖端 → 右侧（逆序）
  const ring = [...leftSide, tip, ...rightSide.reverse()]
  ring.push(ring[0])

  return new Polygon([ring])
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

// ==================== 删除旧箭头相关函数 ====================
// (replaced above)

// ==================== 椭圆几何函数 ====================
function getEllipseGeometryFunction() {
  return (coordinates, optGeometry) => {
    if (!optGeometry) optGeometry = new Polygon([])
    const start = coordinates[0]
    const end = coordinates[coordinates.length - 1]
    const cx = (start[0] + end[0]) / 2
    const cy = (start[1] + end[1]) / 2
    const rx = Math.abs(end[0] - start[0]) / 2
    const ry = Math.abs(end[1] - start[1]) / 2
    const steps = 64
    const ringCoords = []
    for (let i = 0; i <= steps; i++) {
      const angle = (2 * Math.PI * i) / steps
      ringCoords.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)])
    }
    optGeometry.setCoordinates([ringCoords])
    return optGeometry
  }
}

// ==================== 矩形几何函数 ====================
function getRectangleGeometryFunction() {
  return (coordinates, optGeometry) => {
    if (!optGeometry) optGeometry = new Polygon([])
    const start = coordinates[0]
    const end = coordinates[coordinates.length - 1]
    optGeometry.setCoordinates([[
      [start[0], start[1]],
      [start[0], end[1]],
      [end[0], end[1]],
      [end[0], start[1]],
      [start[0], start[1]]
    ]])
    return optGeometry
  }
}

// ==================== 工具激活 ====================
function activateTool(type) {
  if (activeTool.value === type) {
    deactivateTool()
    return
  }

  deactivateTool()

  if (!props.map) return

  mapStore.setDrawingActive(true)

  if (type === 'Select') {
    activateSelectMode()
  } else {
    activateDrawMode(type)
  }

  activeTool.value = type
}

// ==================== 选择模式 ====================
function activateSelectMode() {
  selectInteraction = new Select({
    layers: [vectorLayer]
  })

  modifyInteraction = new Modify({
    features: selectInteraction.getFeatures()
  })

  selectInteraction.on('select', (e) => {
    e.deselected.forEach(f => applyFeatureStyle(f))

    if (e.selected.length > 0) {
      selectedFeature.value = e.selected[0]
      isSelectPicked.value = true
      updatePanelFromFeature(e.selected[0])
      applySelectionHighlight(e.selected[0])
    } else {
      selectedFeature.value = null
      isSelectPicked.value = false
    }
  })

  modifyInteraction.on('modifyend', (e) => {
    e.features.forEach(f => {
      applyFeatureStyle(f)
      if (f === selectedFeature.value) applySelectionHighlight(f)
    })
  })

  props.map.addInteraction(modifyInteraction)
  props.map.addInteraction(selectInteraction)

  const viewport = props.map.getViewport()
  viewport.style.cursor = 'pointer'
}

// ==================== 选中高亮 ====================
function applySelectionHighlight(feature) {
  const type = feature.get('drawType')
  const params = feature.get('styleParams')
  if (!params) return

  const sw = params.strokeWidth || 2

  let baseStyles
  if (type === 'Arrow') {
    applySmallArrowStyle(feature, params)
    baseStyles = feature.getStyle()
  } else if (type === 'WindArrow') {
    applyWindArrowStyle(feature, params)
    baseStyles = feature.getStyle()
  } else if (type === 'BattleArrow') {
    applyBattleArrowStyle(feature, params)
    baseStyles = [feature.getStyle()]
  } else {
    const baseStyle = createStyleFromParams(type, params)
    baseStyles = baseStyle ? [baseStyle] : []
  }

  if (!Array.isArray(baseStyles)) baseStyles = [baseStyles]

  const outerGlow = new Style({
    stroke: new Stroke({
      color: 'rgba(5, 245, 255, 0.7)',
      width: sw + 6,
      lineCap: 'round',
      lineJoin: 'round'
    }),
    fill: new Fill({ color: 'rgba(5, 245, 255, 0.06)' }),
    image: new CircleStyle({
      radius: (params.radius || sw * 3) + 8,
      fill: new Fill({ color: 'rgba(5, 245, 255, 0.1)' }),
      stroke: new Stroke({ color: 'rgba(5, 245, 255, 0.5)', width: 3 })
    })
  })

  const innerPulse = new Style({
    stroke: new Stroke({
      color: '#05f5ff',
      width: sw + 2,
      lineCap: 'round',
      lineJoin: 'round',
      lineDash: [8, 4]
    }),
    image: new CircleStyle({
      radius: (params.radius || sw * 3) + 4,
      fill: new Fill({ color: 'rgba(5, 245, 255, 0.05)' }),
      stroke: new Stroke({ color: '#05f5ff', width: 2.5, lineDash: [6, 3] })
    })
  })

  feature.setStyle([...baseStyles, outerGlow, innerPulse])
}

// ==================== 绘制模式 ====================
function activateDrawMode(type) {
  let drawOptions = {
    source: vectorSource,
    type: 'Point'
  }

  switch (type) {
    case 'Point':
      drawOptions.type = 'Point'
      break
    case 'LineString':
      drawOptions.type = 'LineString'
      break
    case 'Polygon':
      drawOptions.type = 'Polygon'
      break
    case 'Rectangle':
      drawOptions.type = 'Circle'
      drawOptions.geometryFunction = getRectangleGeometryFunction()
      break
    case 'Ellipse':
      drawOptions.type = 'Circle'
      drawOptions.geometryFunction = getEllipseGeometryFunction()
      break
    case 'Arrow':
      drawOptions.type = 'LineString'
      break
    case 'WindArrow':
      drawOptions.type = 'LineString'
      break
    case 'BattleArrow':
      drawOptions.type = 'LineString'
      break
    case 'CircleOutline':
      drawOptions.type = 'Circle'
      break
    default:
      return
  }

  // 绘制预览样式
  drawOptions.style = function(feature) {
    const params = getCurrentParams()
    if (type === 'Arrow') return createArrowPreviewStyle(params, feature)
    if (type === 'WindArrow') return createWindArrowPreviewStyle(params, feature)
    if (type === 'BattleArrow') return createBattleArrowPreviewStyle(params, feature)
    return createStyleFromParams(type, params)
  }

  drawInteraction = new Draw(drawOptions)

  drawInteraction.on('drawend', (event) => {
    const feature = event.feature
    feature.set('drawType', type)
    const params = getCurrentParams()

    // 圆形要素：从几何中读取实际半径
    if (type === 'CircleOutline') {
      const geom = feature.getGeometry()
      if (geom && geom.getRadius) {
        params.radius = geom.getRadius()
      }
    }

    feature.set('styleParams', params)
    applyFeatureStyle(feature)

    // 绘制完成后自动选中要素，使样式面板可编辑
    selectedFeature.value = feature
    isSelectPicked.value = false  // 非选择工具选中，不叠加高亮
    updatePanelFromFeature(feature)
  })

  props.map.addInteraction(drawInteraction)

  const viewport = props.map.getViewport()
  viewport.style.cursor = 'crosshair'
}

// ==================== 箭头绘制预览样式 ====================
function createArrowPreviewStyle(params, feature) {
  if (!feature) return new Style({ stroke: buildStroke(params) })
  const coords = feature.getGeometry().getCoordinates()
  if (!coords || coords.length < 2) return new Style({ stroke: buildStroke(params) })

  const last = coords[coords.length - 1]
  const prev = coords[coords.length - 2]
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
  const scale = params.arrowScale || 1
  const headW = params.arrowHeadWidth || 5
  const headLen = 10 * scale
  const halfW = headW * scale * 0.8

  const tip = [last[0] + Math.cos(angle) * headLen, last[1] + Math.sin(angle) * headLen]
  const baseLeft = [last[0] + Math.cos(angle + Math.PI / 2) * halfW, last[1] + Math.sin(angle + Math.PI / 2) * halfW]
  const baseRight = [last[0] + Math.cos(angle - Math.PI / 2) * halfW, last[1] + Math.sin(angle - Math.PI / 2) * halfW]
  const arrowHead = new Polygon([[tip, baseLeft, baseRight, tip]])
  const rgba = hexToRgba(params.strokeColor || '#4096FF', params.strokeOpacity || 1)

  return [
    new Style({ stroke: buildStroke(params) }),
    new Style({
      geometry: arrowHead,
      fill: new Fill({ color: rgba }),
      stroke: new Stroke({ color: rgba, width: 1 })
    })
  ]
}

function createWindArrowPreviewStyle(params, feature) {
  if (!feature) return new Style({ stroke: buildStroke(params) })
  const coords = feature.getGeometry().getCoordinates()
  if (!coords || coords.length < 2) return new Style({ stroke: buildStroke(params) })

  const polygon = buildTaperedArrowPolygon(coords, params, true)
  if (!polygon) return new Style({ stroke: buildStroke(params) })

  const sc = params.strokeColor || '#4096FF'
  const sw = params.strokeWidth || 2
  const so = params.strokeOpacity || 1
  const fc = params.fillColor || sc
  const fo = params.fillOpacity || 0.25

  return new Style({
    geometry: polygon,
    stroke: new Stroke({ color: hexToRgba(sc, so), width: sw, lineJoin: 'round', lineCap: 'round' }),
    fill: new Fill({ color: hexToRgba(fc, fo) })
  })
}

function createBattleArrowPreviewStyle(params, feature) {
  return new Style({
    renderer: (pixelCoordinates, state) => {
      const geom = state.geometry || (feature && feature.getGeometry())
      const coords = geom.getCoordinates()
      if (!coords || coords.length < 2) return

      const polygon = buildTaperedArrowPolygon(coords, params, false)
      if (!polygon) return

      const ring = polygon.getCoordinates()[0]
      const transform = state.coordinateToPixelTransform
      let pixelRing
      if (transform) {
        pixelRing = ring.map(c => [
          transform[0] * c[0] + transform[2] * c[1] + transform[4],
          transform[1] * c[0] + transform[3] * c[1] + transform[5]
        ])
      } else if (pixelCoordinates && pixelCoordinates.length >= 4) {
        // 回退：在像素空间直接构建箭头多边形
        const pixelPath = []
        if (Array.isArray(pixelCoordinates[0])) {
          for (let i = 0; i < pixelCoordinates.length; i++) {
            pixelPath.push(pixelCoordinates[i])
          }
        } else {
          for (let i = 0; i < pixelCoordinates.length; i += 2) {
            pixelPath.push([pixelCoordinates[i], pixelCoordinates[i + 1]])
          }
        }
        const pixelPolygon = buildTaperedArrowPolygon(pixelPath, params, false)
        if (pixelPolygon) pixelRing = pixelPolygon.getCoordinates()[0]
      }
      if (!pixelRing) return

      const context = state.context
      if (!context) return

      const sc = params.strokeColor || '#FF4444'
      const sw = params.strokeWidth || 2
      const so = params.strokeOpacity !== undefined ? params.strokeOpacity : 1
      const gs = params.gradientStartColor || '#FF4444'
      const ge = params.gradientEndColor || '#FF8800'
      const gso = params.gradientStartOpacity !== undefined ? params.gradientStartOpacity : 0.7
      const geo = params.gradientEndOpacity !== undefined ? params.gradientEndOpacity : 0.15

      const tail = pixelRing[0]
      const headIdx = Math.floor(pixelRing.length / 2) + 1
      const head = pixelRing[headIdx] || pixelRing[Math.floor(pixelRing.length / 2)] || pixelRing[pixelRing.length - 1]
      const gradient = context.createLinearGradient(tail[0], tail[1], head[0], head[1])
      gradient.addColorStop(0, hexToRgba(gs, gso))
      gradient.addColorStop(1, hexToRgba(ge, geo))

      context.beginPath()
      context.moveTo(pixelRing[0][0], pixelRing[0][1])
      for (let i = 1; i < pixelRing.length; i++) {
        context.lineTo(pixelRing[i][0], pixelRing[i][1])
      }
      context.closePath()

      context.fillStyle = gradient
      context.fill()

      context.strokeStyle = hexToRgba(sc, so)
      context.lineWidth = sw
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.stroke()
    }
  })
}

// 应用军标箭头样式（复用预览 renderer）
function applyBattleArrowStyle(feature, params) {
  feature.setStyle(createBattleArrowPreviewStyle(params, feature))
}

// ==================== 停用工具 ====================
function deactivateTool() {
  if (drawInteraction && props.map) {
    props.map.removeInteraction(drawInteraction)
    drawInteraction = null
  }
  if (selectInteraction && props.map) {
    selectInteraction.getFeatures().clear()
    props.map.removeInteraction(selectInteraction)
    selectInteraction = null
  }
  if (modifyInteraction && props.map) {
    props.map.removeInteraction(modifyInteraction)
    modifyInteraction = null
  }

  selectedFeature.value = null
  isSelectPicked.value = false
  activeTool.value = null

  mapStore.setDrawingActive(false)

  if (props.map) {
    const viewport = props.map.getViewport()
    viewport.style.cursor = ''
  }
}

// ==================== 样式变更处理 ====================
function onStyleChange() {
  if (isUpdatingPanel) return

  if (selectedFeature.value) {
    const params = { ...(selectedFeature.value.get('styleParams') || {}) }
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
      // 军标箭头渐变参数
      if (currentFeatureType.value === 'BattleArrow') {
        params.gradientStartColor = gradientStartColor.value
        params.gradientEndColor = gradientEndColor.value
        params.gradientStartOpacity = gradientStartOpacity.value
        params.gradientEndOpacity = gradientEndOpacity.value
      }
    }

    selectedFeature.value.set('styleParams', params)

    const type = selectedFeature.value.get('drawType')
    if (type === 'CircleOutline' && hasRadius.value) {
      const geom = selectedFeature.value.getGeometry()
      if (geom && geom.setRadius) {
        geom.setRadius(featureRadius.value)
      }
    }

    applyFeatureStyle(selectedFeature.value)
    // 仅当通过"选择"工具手动选中时，才叠加高亮效果
    if (isSelectPicked.value) {
      applySelectionHighlight(selectedFeature.value)
    }
  }

  // 绘制模式下，强制地图重绘以实时预览样式变化
  if (activeTool.value && activeTool.value !== 'Select' && props.map) {
    props.map.render()
  }
}

// 从选中要素更新面板参数
function updatePanelFromFeature(feature) {
  const params = feature.get('styleParams')
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

// ==================== 删除选中要素 ====================
function deleteSelectedFeature() {
  if (selectedFeature.value && vectorSource) {
    vectorSource.removeFeature(selectedFeature.value)
    selectedFeature.value = null
  }
}

// ==================== 操作 ====================
function clearDrawings() {
  if (vectorSource) {
    vectorSource.clear()
  }
  selectedFeature.value = null
}

function undoLast() {
  if (!vectorSource) return
  const features = vectorSource.getFeatures()
  if (features.length > 0) {
    const last = features[features.length - 1]
    if (selectedFeature.value === last) {
      selectedFeature.value = null
    }
    vectorSource.removeFeature(last)
  }
}

// ==================== 键盘事件 ====================
function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (selectedFeature.value && selectInteraction) {
      selectInteraction.getFeatures().clear()
      selectedFeature.value = null
    } else {
      deactivateTool()
    }
  }
}

// ==================== 生命周期 ====================
watch(() => props.map, (newMap) => {
  if (newMap && !vectorLayer) {
    initVectorLayer()
  }
}, { immediate: true })

onMounted(() => {
  if (props.map && !vectorLayer) {
    initVectorLayer()
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  deactivateTool()
  if (vectorLayer && props.map) {
    props.map.removeLayer(vectorLayer)
  }
  document.removeEventListener('keydown', handleKeydown)
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
