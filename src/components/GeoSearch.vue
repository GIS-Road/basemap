<template>
  <!-- 地名地址搜索（天地图 地名搜索V2.0 · 普通搜索服务） -->
  <div ref="rootRef" class="geo-search" @click.stop>
    <div class="search-input-wrap" :class="{ focused: isFocused, loading }">
      <svg class="search-icon" viewBox="0 0 24 24" width="15" height="15">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input
        ref="inputRef"
        v-model="keyword"
        class="search-input"
        type="text"
        placeholder="搜索地名、地址、POI…"
        maxlength="60"
        @focus="onFocus"
        @input="onInput"
        @keydown="onKeydown"
      />
      <span v-if="loading" class="search-spinner"></span>
      <button
        v-else-if="keyword"
        class="clear-btn"
        title="清空"
        @click="clearAll"
      >
        <svg viewBox="0 0 12 12" width="11" height="11">
          <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </button>
      <button class="search-btn" title="搜索" @click="doSearch">
        搜索
      </button>
    </div>

    <!-- 结果下拉面板 -->
    <Transition name="dropdown">
      <div v-if="showPanel" class="search-panel">
        <div v-if="loading" class="search-state">正在搜索…</div>
        <div v-else-if="errorMsg" class="search-state error">{{ errorMsg }}</div>
        <div v-else-if="!results.length" class="search-state">
          {{ keyword ? '未找到相关结果' : '输入关键字开始搜索' }}
        </div>
        <template v-else>
          <div class="panel-head">
            <span>共 {{ total }} 条结果</span>
            <span class="panel-tip">点击定位</span>
          </div>
          <ul class="result-list">
            <li
              v-for="(item, i) in results"
              :key="item.name + item.lnglat.join(',') + i"
              class="result-item"
              :class="{ active: activeIndex === i }"
              @mouseenter="activeIndex = i"
              @click="selectItem(item)"
            >
              <div class="result-icon">
                <svg v-if="item.kind === 'poi'" viewBox="0 0 16 16" width="13" height="13">
                  <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5z" fill="none" stroke="currentColor" stroke-width="1.3" />
                  <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                </svg>
                <svg v-else viewBox="0 0 16 16" width="13" height="13">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3" />
                  <path d="M2 6.5h12M6.5 6.5V14" fill="none" stroke="currentColor" stroke-width="1.1" />
                </svg>
              </div>
              <div class="result-text">
                <div class="result-name">{{ item.name }}</div>
                <div class="result-addr">{{ item.address || '—' }}</div>
              </div>
              <span class="result-badge">{{ item.kind === 'poi' ? 'POI' : (item.kind === 'area' ? '行政区' : '城市') }}</span>
            </li>
          </ul>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CONFIG from '../config/config.js'


/**
 * 地名地址搜索组件：天地图    
 *
 * 接口：天地图 WEB服务API「地名搜索V2.0」→ 1.6 普通搜索服务
 *   GET  https://api.tianditu.gov.cn/v2/search?postStr={json}&type=query&tk=密钥
 * postStr 字段（官方文档）：
 *   keyWord    搜索关键字（必填）
 *   mapBound   查询的地图范围 "minx,miny,maxx,maxy"（必填）
 *   level      当前查询级别 1-18（必填）
 *   queryType  1 = 普通搜索（含地名/地址/POI 及地铁公交）
 *   start/count 分页（0-300 / 1-300）
 *   show       2 = 返回详细 POI 信息
 * 响应按 resultType 分支：1 普通POI(pois) / 2 统计(statistics) / 3 行政区(area)
 * / 4 建议词 / 5 线路(lineData，无坐标)。POI 与行政区坐标字段均为 lonlat "x,y"。
 * 服务返回 Access-Control-Allow-Origin: *，前端可直接请求，无需代理。
 */
const props = defineProps({
  // 返回当前视野信息 { mapBound: 'minLng,minLat,maxLng,maxLat', level: 1-18 }
  // 由宿主提供（2D 取 OL 视图范围，3D 取相机中心构造），缺省使用全国范围
  getViewInfo: { type: Function, default: null }
})

const emit = defineEmits(['locate'])

const SEARCH_URL = 'https://api.tianditu.gov.cn/v2/search'
const TK = CONFIG.VITE_APP_TDT_TOKEN
const PAGE_SIZE = 10
const DEFAULT_VIEW = { mapBound: '-180,-90,180,90', level: 12 }

const rootRef = ref(null)
const inputRef = ref(null)
const keyword = ref('')
const results = ref([])
const total = ref(0)
const loading = ref(false)
const errorMsg = ref('')
const showPanel = ref(false)
const isFocused = ref(false)
const activeIndex = ref(-1)

let debounceTimer = null
let abortController = null
let requestSeq = 0

function getViewParams() {
  try {
    const info = props.getViewInfo?.()
    if (info?.mapBound) return info
  } catch { /* 视野获取失败时退回全国范围 */ }
  return DEFAULT_VIEW
}

/** 将服务响应的各类结果归一化为可定位条目 */
function normalizeResponse(json) {
  const items = []
  let count = Number(json.count) || 0

  // resultType=1 / 缺省：普通 POI 结果（实测部分响应不带 resultType 但有 pois）
  if (Array.isArray(json.pois)) {
    for (const p of json.pois) {
      const lnglat = parseLonLat(p.lonlat)
      if (!lnglat) continue
      items.push({
        name: p.name || '未命名',
        address: p.address || [p.province, p.city, p.county].filter(Boolean).join(' ') || p.typeName || '',
        lnglat,
        kind: 'poi'
      })
    }
  }

  // resultType=3：行政区（实测 area 为对象而非数组）
  const areas = Array.isArray(json.area) ? json.area : (json.area ? [json.area] : [])
  for (const a of areas) {
    const lnglat = parseLonLat(a.lonlat)
    if (!lnglat) continue
    items.push({
      name: a.name || '行政区',
      address: a.bound ? '点击适配行政区范围' : '',
      lnglat,
      level: Number(a.level) || undefined,
      bound: a.bound,
      kind: 'area'
    })
  }

  // resultType=2：统计结果（推荐城市/省），提供城市中心点便于跳转
  const stat = json.statistics
  if (stat && !items.length) {
    const cities = [
      ...(Array.isArray(stat.priorityCitys) ? stat.priorityCitys : []),
      ...(Array.isArray(stat.allAdmins) ? stat.allAdmins : [])
    ]
    for (const c of cities.slice(0, PAGE_SIZE)) {
      const lnglat = parseLonLat(c.lonlat)
      if (!lnglat) continue
      items.push({
        name: c.name || '行政区',
        address: c.count ? `包含约 ${c.count} 条结果` : '',
        lnglat,
        kind: 'city'
      })
    }
  }

  if (items.length && !count) count = items.length
  return { items, count }
}

function parseLonLat(lonlat) {
  if (!lonlat || typeof lonlat !== 'string') return null
  const parts = lonlat.split(',').map(Number)
  if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null
  if (parts[0] < -180 || parts[0] > 180 || parts[1] < -90 || parts[1] > 90) return null
  return parts // [lng, lat]
}

async function doSearch() {
  const kw = keyword.value.trim()
  clearTimeout(debounceTimer)
  if (!kw) {
    results.value = []
    total.value = 0
    errorMsg.value = ''
    loading.value = false
    return
  }
  if (!TK) {
    errorMsg.value = '未配置天地图密钥（VITE_APP_TDT_TOKEN）'
    showPanel.value = true
    return
  }

  // 取消上一条未完成的请求，避免结果竞态
  if (abortController) abortController.abort()
  abortController = new AbortController()
  const seq = ++requestSeq
  const view = getViewParams()

  const postStr = {
    keyWord: kw,
    mapBound: view.mapBound,
    level: Math.min(18, Math.max(1, Math.round(view.level || 12))),
    queryType: 1,
    start: 0,
    count: PAGE_SIZE,
    show: 2
  }
  const url = `${SEARCH_URL}?postStr=${encodeURIComponent(JSON.stringify(postStr))}&type=query&tk=${TK}`

  loading.value = true
  errorMsg.value = ''
  showPanel.value = true
  activeIndex.value = -1

  try {
    const resp = await fetch(url, { signal: abortController.signal })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    if (seq !== requestSeq) return

    const status = json.status || {}
    if (status.infocode !== undefined && status.infocode !== 1000) {
      // 3001 = No data found，按“无结果”处理，其余显示服务描述
      errorMsg.value = status.infocode === 3001
        ? ''
        : (status.cndesc || `服务返回信息码 ${status.infocode}`)
      if (status.infocode !== 3001) {
        results.value = []
        total.value = 0
        return
      }
    }

    const { items, count } = normalizeResponse(json)
    results.value = items
    total.value = count
  } catch (err) {
    if (err.name === 'AbortError') return
    if (seq !== requestSeq) return
    results.value = []
    total.value = 0
    errorMsg.value = `搜索失败：${err.message || '网络异常'}`
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

function onInput() {
  showPanel.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(doSearch, 350)
}

function onFocus() {
  isFocused.value = true
  if (keyword.value.trim() && (results.value.length || errorMsg.value)) showPanel.value = true
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    showPanel.value = false
    inputRef.value?.blur()
    return
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (!results.value.length) return
    e.preventDefault()
    showPanel.value = true
    const n = results.value.length
    activeIndex.value = e.key === 'ArrowDown'
      ? (activeIndex.value + 1) % n
      : (activeIndex.value <= 0 ? n - 1 : activeIndex.value - 1)
    return
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    clearTimeout(debounceTimer)
    if (showPanel.value && activeIndex.value >= 0 && results.value[activeIndex.value]) {
      selectItem(results.value[activeIndex.value])
    } else {
      doSearch()
    }
  }
}

function selectItem(item) {
  emit('locate', {
    lng: item.lnglat[0],
    lat: item.lnglat[1],
    name: item.name,
    address: item.address,
    level: item.level,
    bound: item.bound
  })
  keyword.value = item.name
  showPanel.value = false
  activeIndex.value = -1
  inputRef.value?.blur()
}

function clearAll() {
  keyword.value = ''
  results.value = []
  total.value = 0
  errorMsg.value = ''
  showPanel.value = false
  clearTimeout(debounceTimer)
  if (abortController) abortController.abort()
  inputRef.value?.focus()
}

function onDocumentMousedown(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    showPanel.value = false
    isFocused.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onDocumentMousedown))
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentMousedown)
  clearTimeout(debounceTimer)
  if (abortController) abortController.abort()
})
</script>

<style scoped>
.geo-search {
  position: relative;
  width: 300px;
  font-size: 13px;
  color: var(--text-primary, #e6f0ff);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 4px 0 9px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-color, rgba(64, 150, 255, 0.25));
  border-radius: 4px;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.search-input-wrap:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-input-wrap.focused {
  border-color: var(--tech-blue-500, #4096ff);
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.15);
}

.search-icon {
  flex-shrink: 0;
  color: var(--tech-blue-400, #69b1ff);
  margin-right: 6px;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary, #e6f0ff);
  font-size: 13px;
}

.search-input::placeholder {
  color: var(--text-secondary, #8ba6cc);
}

.clear-btn {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary, #8ba6cc);
  cursor: pointer;
  border-radius: 3px;
}

.clear-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.search-btn {
  flex-shrink: 0;
  height: 24px;
  padding: 0 10px;
  margin-left: 4px;
  border: none;
  border-radius: 3px;
  background: var(--tech-blue-600, #1677ff);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: var(--tech-blue-500, #4096ff);
}

.search-spinner {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  margin: 0 6px 0 4px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: var(--tech-blue-400, #69b1ff);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 结果下拉面板 ===== */
.search-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  max-height: 380px;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel, #0d1f3c);
  border: 1px solid var(--border-color, rgba(64, 150, 255, 0.25));
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  z-index: 2000;
  overflow: hidden;
}

.search-state {
  padding: 16px 12px;
  text-align: center;
  color: var(--text-secondary, #8ba6cc);
}

.search-state.error {
  color: #ff7875;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  padding: 7px 12px;
  font-size: 11px;
  color: var(--text-secondary, #8ba6cc);
  border-bottom: 1px solid rgba(64, 150, 255, 0.12);
}

.panel-tip {
  color: var(--tech-blue-400, #69b1ff);
}

.result-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  max-height: 330px;
}

.result-list::-webkit-scrollbar {
  width: 6px;
}

.result-list::-webkit-scrollbar-thumb {
  background: rgba(64, 150, 255, 0.3);
  border-radius: 3px;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.result-item:hover,
.result-item.active {
  background: rgba(64, 150, 255, 0.14);
}

.result-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--tech-blue-400, #69b1ff);
}

.result-text {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 13px;
  color: var(--text-primary, #e6f0ff);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-addr {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-secondary, #8ba6cc);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-badge {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 2px;
  color: var(--tech-blue-300, #91caff);
  background: rgba(64, 150, 255, 0.12);
}

/* 下拉过渡 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
