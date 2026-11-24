/**
 * @description 吉林一号瓦片逐瓦片签名工具
 * @file       jl1Tile.js
 *
 * 官网实验室的签名规则：
 * sign = md5(从 /getTile 开始的 URL 子串 + sk)
 * sk 来自登录后的 /tileflowapi/imagery/getUserTk 接口。
 */

import md5 from 'js-md5'
import CONFIG from '@/config/config.js'

const JL_SK = CONFIG.VITE_APP_JL_SK || ''
let warned = false

function warnOnce() {
  if (!JL_SK && !warned) {
    console.warn('[JL1] VITE_APP_JL_SK 未配置，吉林一号瓦片签名将无效，请在 src/config/config.js 中填写 sk')
    warned = true
  }
}

/**
 * 生成不带 sign 的瓦片地址（占位符已替换）
 * @param {string} template -  layers.js 中的 URL 模板，形如 .../getTile/{z}/{x}/{-y}?...&vf=0
 * @param {number} z - 层级
 * @param {number} x - 列号
 * @param {number} y - OpenLayers/Cesium 传入的行号（左上角为 0）
 * @returns {string}
 */
function buildBaseUrl(template, z, x, y) {
  const reverseY = Math.pow(2, z) - y - 1
  return template
    .replace(/&sign=[^&]*/g, '')
    .replace(/\{z\}/g, String(z))
    .replace(/\{x\}/g, String(x))
    .replace(/\{-y\}/g, String(reverseY))
    .replace(/\{reverseY\}/g, String(reverseY))
}

/** 计算某个瓦片的 sign */
export function getJl1Sign(template, z, x, y) {
  warnOnce()
  const signSource = buildBaseUrl(template, z, x, y).replace(/^.*(?=\/getTile)/, '') + JL_SK
  return md5(signSource)
}

/** 生成带 sign 的完整瓦片地址 */
export function buildJl1TileUrl(template, z, x, y) {
  return `${buildBaseUrl(template, z, x, y)}&sign=${getJl1Sign(template, z, x, y)}`
}
