/**
 * @description 系统配置参数
 * @file       config.js
 * @author     gis_road
 * @date       2026-07-28
 */

export default {
    // 天地图 token
    VITE_APP_TDT_TOKEN: "fa7ec9766b2c00747e3dd60ab3d05892",
    // 星图 token
    VITE_APP_GEOVISEARTH_TOKEN: "15d2ddab335383b5d485b78a3e04ac9f92683ee2e3b04cdf862cb292168674e7",
    // Cesium Ion token（可选）：配置后 3D 地形优先使用 Cesium World Terrain（全球高精度地形）
    // 未配置时默认使用 Esri World Elevation 3D（免费、无需 key、国内可访问）
    VITE_APP_CESIUM_ION_TOKEN: ""
}



