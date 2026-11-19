/**
 * Bing Maps quadkey（四叉键）换算
 *
 * Bing（含 ditu.live.com 必应中国）瓦片按 Web Mercator 四叉树寻址，
 * URL 中的 {q} 不是 z/x/y，而是把 z 层级的 (x, y) 逐位编码为 0/1/2/3：
 *   0 = 左上  1 = 右上  2 = 左下  3 = 右下
 * 字符串长度即缩放级别 z（z=0 时为空字符串）。
 *
 * Bing 与 Google/OSM 同为左上角原点（y 从北往南），与 OL/Cesium 的
 * 标准 XYZ y 值方向一致，无需翻转。
 */

/**
 * 瓦片坐标 → quadkey
 * @param {number} x - 瓦片列号（从西往东）
 * @param {number} y - 瓦片行号（从北往南，标准 XYZ 方向）
 * @param {number} z - 缩放级别
 * @returns {string} quadkey 字符串（长度 === z）
 */
export function tileXYToQuadKey(x, y, z) {
  let quadKey = ''
  for (let i = z; i > 0; i--) {
    let digit = 0
    const mask = 1 << (i - 1)
    if ((x & mask) !== 0) digit++
    if ((y & mask) !== 0) digit += 2
    quadKey += digit
  }
  return quadKey
}
