//This file is automatically rebuilt by the Cesium build process.
export default "/**\n\
 * Useful for reinterpreting texture data as higher-precision values.\n\
 * Only works correctly in WebGL 2, which supports the uint type and bitwise operations.\n\
 *\n\
 * @param {float|vec2|vec3|vec4} 1-4 values from a texture lookup (RGBA channels), normalized to [0.0, 1.0].\n\
 * @return {uint} Raw bits as an unsigned integer.\n\
*/\n\
uint czm_unpackTexture(float packedValue) {\n\
    float rounded = czm_round(packedValue * 255.0);\n\
    return uint(rounded);\n\
}\n\
\n\
uint czm_unpackTexture(vec2 packedValue) {\n\
    vec2 rounded = czm_round(packedValue * 255.0);\n\
    uint byte0 = uint(rounded.x);\n\
    uint byte1 = uint(rounded.y);\n\
    return byte0 | (byte1 << 8);\n\
}\n\
\n\
uint czm_unpackTexture(vec3 packedValue) {\n\
    vec3 rounded = czm_round(packedValue * 255.0);\n\
    uint byte0 = uint(rounded.x);\n\
    uint byte1 = uint(rounded.y);\n\
    uint byte2 = uint(rounded.z);\n\
    return byte0 | (byte1 << 8) | (byte2 << 16);\n\
}\n\
\n\
uint czm_unpackTexture(vec4 packedValue) {\n\
    vec4 rounded = czm_round(packedValue * 255.0);\n\
    uint byte0 = uint(rounded.x);\n\
    uint byte1 = uint(rounded.y);\n\
    uint byte2 = uint(rounded.z);\n\
    uint byte3 = uint(rounded.w);\n\
    return byte0 | (byte1 << 8) | (byte2 << 16) | (byte3 << 24);\n\
}\n\
";
