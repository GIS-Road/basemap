//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef HAS_CONSTANT_LOD\n\
// Extract model scale to compensate for minimumPixelSize scaling\n\
float modelScaleX = length(czm_model[0].xyz);\n\
float modelScaleY = length(czm_model[1].xyz);\n\
float modelScaleZ = length(czm_model[2].xyz);\n\
float modelScale = (modelScaleX + modelScaleY + modelScaleZ) / 3.0;\n\
\n\
// Transform model position through ENU but as direction only (w=0) to avoid position-dependent rotation\n\
vec3 enuDir = (u_constantLodWorldToEnu * czm_model * vec4(v_positionMC, 0.0)).xyz;\n\
v_constantLodUvCustom.xy = (enuDir.yx + u_constantLodOffset) / modelScale;\n\
v_constantLodUvCustom.z = u_constantLodDistance / modelScale;\n\
#endif";
