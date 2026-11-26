/**
 * @description 系统配置参数
 * @file       config.js
 * @author     gis_road
 * @date       2026-07-28
 */

// 注意：以下token需要替换为你自己申请的key

export default {
    // 天地图 token
    VITE_APP_TDT_TOKEN: "fa7ec9766b2c00747e3dd60ab3d05892",
    // 星图 token
    VITE_APP_GEOVISEARTH_TOKEN: "15d2ddab335383b5d485b78a3e04ac9f92683ee2e3b04cdf862cb292168674e7",
    // Cesium Ion token（可选）：配置后 3D 地形优先使用 Cesium World Terrain（全球高精度地形）
    // 未配置时默认使用 Esri World Elevation 3D（免费、无需 key、国内可访问）
    VITE_APP_CESIUM_ION_TOKEN: "aaa",
    // 吉林一号：套件 TK（来自官网“我的套件”或 getUserTk 接口）
    VITE_APP_JL_TOKEN: "da22f22fa31437cd7ffaffa6d70249ce",
    // 吉林一号：签名密钥 SK（来自 getUserTk 接口返回的 sk，必填，否则瓦片 sign 无效）
    VITE_APP_JL_SK: "88251fee7cc34ebfb02b3cc6b8e25d42",
}



