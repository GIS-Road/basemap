/**
 * @description OpenLayers 工具库
 * @file        config.js
 * @author      gis_road
 * @date        2026/8/6
 */


import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Feature} from "ol";
import {Point} from "ol/geom";
import CircleStyle from "ol/style/Circle";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";


/**
 * @description：清除指定图层
 * @param map：地图对象，默认为全局地图对象
 * @param layerName：图层名
 */
export function removeLayerByName(layerName,map = window._map){
    const layers = map.getLayers().getArray()
    layers.forEach(targetLayer => {
        const props = targetLayer.getProperties()
        if (layerName === props["layerName"]) {map.removeLayer(targetLayer)}
    })
}

/**
 * @description：创建 OpenLayers 闪烁点
 * @param map {Map}：地图对象
 * @param coordinate {Coordinate [x,y]}：地图坐标点对象
 **/
export function createPulseEffect(map, coordinate){
    removeLayerByName('poiTempLayer')
    const pulseFeatures = [];
    const source = new VectorSource();
    const layer = new VectorLayer({ source });
    layer.setProperties({ layerName: 'poiTempLayer' })
    layer.setZIndex(99999999999999)
    map.addLayer(layer);

    for (let i = 0; i < 3; i++) {
        const feature = new Feature(new Point(coordinate));
        pulseFeatures.push(feature);
        source.addFeature(feature);
    }
    // 定位到闪烁点
    map.getView().fit(pulseFeatures[0].getGeometry())

    // 初始半径
    let radius = 5;
    // 动画函数
    const animate = () => {
        radius = radius >= 20 ? 5 : radius + 0.1;

        pulseFeatures.forEach((feature, i) => {
            const r = radius + (i * 3);
            const opacity = 0.7 - (i * 0.2);

            feature.setStyle(new Style({
                image: new CircleStyle({
                    radius: r,
                    fill: new Fill({
                        // color: `rgba(255, 0, 0, ${opacity})`
                        color: `rgba(34, 255, 136, ${opacity})`
                    }),
                    stroke: new Stroke({ color: `rgba(255, 255, 255, ${opacity})`,
                        width: 1
                    })
                }),
                fill: new Fill({})
            }));
        });

        requestAnimationFrame(animate);
    };
    animate();
    // 返回清除函数
    return () => map.removeLayer(layer);
}
