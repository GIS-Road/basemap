//This file is automatically rebuilt by the Cesium build process.
export default "/**\n\
 * Applies a 2D texture transformation matrix to texture coordinates.\n\
 * This function applies translation, rotation, and scaling transformations\n\
 * as specified by the KHR_texture_transform glTF extension.\n\
 *\n\
 * @name czm_computeTextureTransform\n\
 * @glslFunction\n\
 *\n\
 * @param {vec2} texCoord The texture coordinates to transform.\n\
 * @param {mat3} textureTransform The 3x3 transformation matrix.\n\
 *\n\
 * @returns {vec2} The transformed texture coordinates.\n\
 *\n\
 * @example\n\
 * // GLSL declaration\n\
 * vec2 czm_computeTextureTransform(vec2 texCoord, mat3 textureTransform);\n\
 *\n\
 * // Apply texture transform to UV coordinates\n\
 * vec2 transformedUV = czm_computeTextureTransform(uv, u_textureTransform);\n\
 */\n\
vec2 czm_computeTextureTransform(vec2 texCoord, mat3 textureTransform)\n\
{\n\
    return vec2(textureTransform * vec3(texCoord, 1.0));\n\
}";
