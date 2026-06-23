//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef HAS_CONSTANT_LOD\n\
\n\
vec4 constantLodTextureLookup(sampler2D textureSampler, vec3 constantLodParams) {\n\
    bool atMaxClamp = v_constantLodUvCustom.z >= constantLodParams.y;\n\
    bool atMinClamp = v_constantLodUvCustom.z <= constantLodParams.x;\n\
    bool atClampBoundary = atMaxClamp || atMinClamp;\n\
    \n\
    float effectiveDistance = atMaxClamp ? constantLodParams.y : \n\
                              (atMinClamp ? constantLodParams.x : v_constantLodUvCustom.z);\n\
    \n\
    float logDepth = log2(effectiveDistance);\n\
    logDepth = clamp(logDepth, -10.0, 20.0);\n\
    \n\
    float f = fract(logDepth);\n\
    float p = floor(logDepth);\n\
    \n\
    if (atClampBoundary) {\n\
        float clampedP = ceil(logDepth);\n\
        vec2 tc = v_constantLodUvCustom.xy / pow(2.0, clampedP) * constantLodParams.z;\n\
        return texture(textureSampler, tc);\n\
    }\n\
\n\
    vec2 tc1 = v_constantLodUvCustom.xy / pow(2.0, p) * constantLodParams.z;\n\
    vec2 tc2 = v_constantLodUvCustom.xy / pow(2.0, p + 1.0) * constantLodParams.z;\n\
    return mix(texture(textureSampler, tc1), texture(textureSampler, tc2), f);\n\
}\n\
\n\
vec4 constantLodTextureLookup(sampler2D textureSampler, vec3 constantLodParams, mat3 textureTransform) {\n\
    bool atMaxClamp = v_constantLodUvCustom.z >= constantLodParams.y;\n\
    bool atMinClamp = v_constantLodUvCustom.z <= constantLodParams.x;\n\
    bool atClampBoundary = atMaxClamp || atMinClamp;\n\
    \n\
    float effectiveDistance = atMaxClamp ? constantLodParams.y : \n\
                              (atMinClamp ? constantLodParams.x : v_constantLodUvCustom.z);\n\
    \n\
    float logDepth = log2(effectiveDistance);\n\
    logDepth = clamp(logDepth, -10.0, 20.0);\n\
    \n\
    float f = fract(logDepth);\n\
    float p = floor(logDepth);\n\
    \n\
    if (atClampBoundary) {\n\
        float clampedP = ceil(logDepth);\n\
        vec2 tc = v_constantLodUvCustom.xy / pow(2.0, clampedP) * constantLodParams.z;\n\
        // Apply texture transform to the final texture coordinates\n\
        tc = czm_computeTextureTransform(tc, textureTransform);\n\
        return texture(textureSampler, tc);\n\
    }\n\
\n\
    vec2 tc1 = v_constantLodUvCustom.xy / pow(2.0, p) * constantLodParams.z;\n\
    vec2 tc2 = v_constantLodUvCustom.xy / pow(2.0, p + 1.0) * constantLodParams.z;\n\
    \n\
    // Apply texture transform to both LOD texture coordinates before mixing\n\
    tc1 = czm_computeTextureTransform(tc1, textureTransform);\n\
    tc2 = czm_computeTextureTransform(tc2, textureTransform);\n\
    \n\
    return mix(texture(textureSampler, tc1), texture(textureSampler, tc2), f);\n\
}\n\
\n\
#endif\n\
";
