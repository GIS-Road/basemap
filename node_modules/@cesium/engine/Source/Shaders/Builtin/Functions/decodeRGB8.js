//This file is automatically rebuilt by the Cesium build process.
export default "/**\n\
 * Decodes RGB values packed into a single float at 8-bit precision. Encoded\n\
 * representation is equivalent to 0xFFFFFF in JavaScript.\n\
 *\n\
 * @name czm_decodeRGB8\n\
 * @glslFunction\n\
 *\n\
 * @param {float} encoded Float-encoded RGB values.\n\
 * @returns {vec4} Decoded RGB values.\n\
 */\n\
vec4 czm_decodeRGB8(float encoded) {\n\
    const float SHIFT_RIGHT16 = 1.0 / 65536.0;\n\
    const float SHIFT_RIGHT8 = 1.0 / 256.0;\n\
    const float SHIFT_LEFT16 = 65536.0;\n\
    const float SHIFT_LEFT8 = 256.0;\n\
\n\
    vec4 color = vec4(255.0);\n\
    color.r = floor(encoded * SHIFT_RIGHT16);\n\
    color.g = floor((encoded - color.r * SHIFT_LEFT16) * SHIFT_RIGHT8);\n\
    color.b = floor(encoded - color.r * SHIFT_LEFT16 - color.g * SHIFT_LEFT8);\n\
    return color / 255.0;\n\
}\n\
";
