import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 图层操作回调注册表（非响应式，避免 Vue 深度代理函数）
const handlerRegistry = new Map()

/**
 * 临时图层分组：绘制 / 量测 / 标注
 * layers 中的每一项为图层的元数据，实际操作由注册的回调执行
 */
export const useTempLayerStore = defineStore('tempLayers', () => {
  const dialogVisible = ref(false)

  const groups = ref([
    { key: 'draw', label: '绘制图层', icon: 'draw', layers: [] },
    { key: 'measure', label: '量测图层', icon: 'measure', layers: [] },
    { key: 'annotation', label: '标注图层', icon: 'annotation', layers: [] }
  ])

  const totalCount = computed(() =>
    groups.value.reduce((sum, g) => sum + g.layers.reduce((s, l) => s + (l.count || 0), 0), 0)
  )

  function findGroup(category) {
    return groups.value.find(g => g.key === category)
  }

  function findLayer(id) {
    for (const g of groups.value) {
      const layer = g.layers.find(l => l.id === id)
      if (layer) return layer
    }
    return null
  }

  /**
   * 注册/更新一个临时图层
   * @param {Object} options
   * @param {string} options.id 唯一 ID
   * @param {string} options.name 显示名称
   * @param {string} options.category draw | measure | annotation
   * @param {string} options.mode 2d | 3d
   * @param {string} options.owner 注册者标识（用于安全注销）
   * @param {number} options.count 要素数量
   * @param {boolean} options.visible 是否可见
   * @param {Object} options.handlers { toggle, zoom, clear }
   */
  function registerLayer({ id, name, category, mode = '2d', owner = '', count = 0, visible = true, handlers = {} }) {
    const group = findGroup(category)
    if (!group) return

    handlerRegistry.set(id, { owner, ...handlers })

    const meta = { id, name, category, mode, count, visible }
    const index = group.layers.findIndex(l => l.id === id)
    if (index > -1) {
      group.layers[index] = meta
    } else {
      group.layers.push(meta)
    }
  }

  /**
   * 注销临时图层（仅当注册者匹配时才移除，避免模式切换时误删）
   */
  function unregisterLayer(id, owner = '') {
    const registered = handlerRegistry.get(id)
    if (owner && registered && registered.owner !== owner) return

    for (const group of groups.value) {
      const index = group.layers.findIndex(l => l.id === id)
      if (index > -1) group.layers.splice(index, 1)
    }
    handlerRegistry.delete(id)
  }

  /**
   * 更新图层元数据（数量 / 可见性等）
   */
  function setLayerMeta(id, patch) {
    const layer = findLayer(id)
    if (layer) Object.assign(layer, patch)
  }

  /**
   * 设置图层可见性
   */
  function setVisible(id, visible) {
    const layer = findLayer(id)
    if (!layer) return
    layer.visible = visible
    handlerRegistry.get(id)?.toggle?.(visible)
  }

  function zoomTo(id) {
    handlerRegistry.get(id)?.zoom?.()
  }

  function clearLayer(id) {
    handlerRegistry.get(id)?.clear?.()
  }

  function clearAll() {
    for (const group of groups.value) {
      for (const layer of group.layers) {
        handlerRegistry.get(layer.id)?.clear?.()
      }
    }
  }

  function openDialog() {
    dialogVisible.value = true
  }

  function closeDialog() {
    dialogVisible.value = false
  }

  function toggleDialog() {
    dialogVisible.value = !dialogVisible.value
  }

  return {
    dialogVisible,
    groups,
    totalCount,
    registerLayer,
    unregisterLayer,
    setLayerMeta,
    setVisible,
    zoomTo,
    clearLayer,
    clearAll,
    openDialog,
    closeDialog,
    toggleDialog
  }
})
