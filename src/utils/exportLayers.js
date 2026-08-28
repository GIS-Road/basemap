/**
 * @description 图层服务信息导出工具 - 导出为 Excel(.xls) 格式
 * @file       exportLayers.js
 * @author     gis_road
 * @date       2026-08-24
 */

import layersConfig from '../config/layers.js'

/**
 * 服务类型映射表 - 将 serviceType 值映射为中文可读名称
 */
const SERVICE_TYPE_MAP = {
  'xyz': 'XYZ 瓦片',
  'wmts': 'WMTS 服务',
  'maps-for-free-terrain': 'maps-for-free 地形',
  'maps-for-free-landuse': 'maps-for-free 土地利用',
  'maps-for-free': 'maps-for-free 通用',
}

/**
 * 图层类型映射表
 */
const LAYER_TYPE_MAP = {
  'terrain': '地形',
  'image': '影像',
  'vector': '矢量',
  'road': '路网',
  'anotation': '注记',
  'landuse': '土地利用',
  'wmts': 'WMTS',
}

/**
 * 从 layers.js 中提取所有 catalog 类型的父目录
 * @returns {Array<{id: string, label: string}>} 目录列表
 */
export function getCatalogOptions() {
  return layersConfig
    .filter(node => node.type === 'catalog')
    .map(node => ({ id: node.id, label: node.label }))
}

/**
 * 根据选中的目录ID获取图层列表
 * @param {string} catalogId - 目录ID，'all' 表示全部
 * @returns {Array} 扁平化的图层信息数组
 */
function getFlatLayers(catalogId) {
  const result = []

  layersConfig.forEach(catalog => {
    if (catalog.type !== 'catalog' || !catalog.children) return
    if (catalogId !== 'all' && catalog.id !== catalogId) return

    catalog.children.forEach(layer => {
      result.push({
        catalogLabel: catalog.label,
        id: layer.id,
        label: layer.label,
        name: layer.name,
        serviceType: SERVICE_TYPE_MAP[layer.serviceType] || layer.serviceType,
        type: LAYER_TYPE_MAP[layer.type] || layer.type,
        url: layer.url,
        group: layer.group,
        visible: layer.visible ? '是' : '否',
        zoom: layer.zoom || '-',
        rawServiceType: layer.serviceType,
      })
    })
  })

  return result
}

/**
 * 获取表格列定义（按服务类型确定字段）
 * 所有服务类型共用以下列，服务类型列标识具体类型
 * @param {Array} layers - 扁平化图层数组
 * @returns {Array<{key: string, label: string, width: number}>} 列定义
 */
function getColumns() {
  return [
    { key: 'index',       label: '序号',       width: 60 },
    { key: 'catalogLabel', label: '所属目录',   width: 140 },
    { key: 'id',           label: '图层ID',     width: 200 },
    { key: 'label',        label: '图层名称',   width: 200 },
    { key: 'name',         label: '服务名称',   width: 180 },
    { key: 'serviceType',  label: '服务类型',   width: 120 },
    { key: 'type',         label: '图层类型',   width: 90 },
    { key: 'url',          label: '服务地址',   width: 600 },
    { key: 'group',        label: '分组',       width: 90 },
    { key: 'visible',      label: '默认可见',   width: 70 },
    { key: 'zoom',         label: '缩放级别',   width: 70 },
  ]
}

/**
 * 生成 HTML 表格并导出为 Excel(.xls) 文件
 * 表头：加粗、居中、淡灰色背景
 * @param {string} catalogId - 目录ID，'all' 表示全部
 * @param {string} catalogLabel - 目录名称（用于文件名）
 */
export async function exportLayersToExcel(catalogId = 'all', catalogLabel = '全部') {
  const layers = getFlatLayers(catalogId)

  if (layers.length === 0) {
    console.warn('[exportLayers] 未找到可导出的图层')
    return
  }

  const columns = getColumns()

  // ==================== 构建 HTML 表格 ====================
  const styles = `
    <style>
      @page { margin: 0.5in; }
      table { border-collapse: collapse; width: 100%; font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 11px; }
      th, td { border: 1px solid #B0B0B0; padding: 4px 6px; }
      thead th {
        font-weight: bold;
        text-align: center;
        background-color: #D9D9D9;
        color: #1a1a1a;
        font-size: 12px;
        height: 28px;
      }
      tbody td { vertical-align: middle; }
      tbody tr:nth-child(even) { background-color: #F7F7F7; }
      .col-index { text-align: center; }
      .col-visible { text-align: center; }
      .col-zoom { text-align: center; }
      .col-type { text-align: center; }
      .col-group { text-align: center; }
      .col-serviceType { text-align: center; }
      .col-url { word-break: break-all; }
    </style>
  `

  // 表头行
  const headerHtml = columns.map(col =>
    `<th style="width: ${col.width}px">${col.label}</th>`
  ).join('')

  // 数据行
  const bodyHtml = layers.map((layer, i) => {
    const cells = columns.map(col => {
      let val = ''
      if (col.key === 'index') {
        val = i + 1
      } else if (col.key === 'url') {
        val = layer[col.key] || '-'
      } else {
        val = layer[col.key] ?? '-'
      }
      const cls = `col-${col.key}`
      return `<td class="${cls}">${escapeHtml(val)}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<!--[if gte mso 9]><xml>
<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
  <ExcelWorksheets>
    <ExcelWorksheet>
      <Name>图层服务清单</Name>
      <WorksheetOptions>
        <Selected/>
        <FreezePanes/>
        <TopRowVisible>0</TopRowVisible>
        <LeftColumnVisible>0</LeftColumnVisible>
        <ActivePane>2</ActivePane>
        <SplitHorizontal>1</SplitHorizontal>
        <SplitVertical>0</SplitVertical>
        <Panes>
          <Pane><Number>3</Number></Pane>
          <Pane><Number>2</Number><ActiveRow>1</ActiveRow></Pane>
        </Panes>
      </WorksheetOptions>
    </ExcelWorksheet>
  </ExcelWorksheets>
</ExcelWorkbook>
</xml><![endif]-->
${styles}
</head>
<body>
<table>
  <thead>
    <tr>${headerHtml}</tr>
  </thead>
  <tbody>
    ${bodyHtml}
  </tbody>
</table>
</body>
</html>`

  // ==================== 下载文件 ====================
  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const dateStr = new Date().toISOString().slice(0, 10)
  link.download = `图层服务清单_${catalogLabel}_${dateStr}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * HTML 转义
 */
function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
