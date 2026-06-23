//This file is automatically rebuilt by the Cesium build process.
export default "/**\n\
 * DOC_TBA\n\
 *\n\
 * @name czm_columbusViewMorph\n\
 * @glslFunction\n\
 */\n\
vec4 czm_columbusViewMorph(vec4 position2D, vec4 position3D, float time)\n\
{\n\
    // Just linear for now.\n\
    // We're manually doing the equivalent of a `mix` here because, some GPUs\n\
    // (NVidia GeForce 3070 Ti and Intel Arc A750, to name two), `mix` seems to\n\
    // use an alternate formulation that introduces jitter even when `time` is\n\
    // 0.0 or 1.0. That is, the value of `p` won't be exactly `position2D.xyz`\n\
    // when `time` is 0.0 and it won't be exactly `position3D.xyz` when `time` is\n\
    // 1.0. The \"textbook\" formulation here, while probably a bit slower,\n\
    // does not have this problem.\n\
    vec3 p = position2D.xyz * (1.0 - time) + position3D.xyz * time;\n\
    return vec4(p, 1.0);\n\
}\n\
";
