//This file is automatically rebuilt by the Cesium build process.
export default "//\n\
// Vertex shader for Gaussian splats.\n\
\n\
// The splats are rendered as quads in view space. Splat attributes are loaded from a texture with precomputed 3D covariance.\n\
\n\
// Passes local quad coordinates and color to the fragment shader for Gaussian evaluation. \n\
//\n\
// Discards splats outside the view frustum or with negligible screen size.\n\
//\n\
#if defined(HAS_SPHERICAL_HARMONICS)\n\
const uint coefficientCount[3] = uint[3](3u,8u,15u);\n\
const float SH_C1 = 0.48860251;\n\
const float SH_C2[5] = float[5](\n\
         1.092548430,\n\
        -1.09254843,\n\
        0.315391565,\n\
        -1.09254843,\n\
        0.546274215\n\
);\n\
\n\
const float SH_C3[7] = float[7](\n\
         -0.59004358,\n\
        2.890611442,\n\
        -0.45704579,\n\
        0.373176332,\n\
        -0.45704579,\n\
        1.445305721,\n\
        -0.59004358\n\
);\n\
\n\
//Retrieve SH coefficient. Currently RG32UI format\n\
uvec2 loadSHCoeff(uint splatID, int index) {\n\
    ivec2 shTexSize = textureSize(u_sphericalHarmonicsTexture, 0);\n\
    uint dims = coefficientCount[uint(u_sphericalHarmonicsDegree)-1u];\n\
    uint splatsPerRow = uint(shTexSize.x) / dims;\n\
    uint shIndex = (splatID%splatsPerRow) * dims + uint(index);\n\
    ivec2 shPosCoord = ivec2(shIndex, splatID / splatsPerRow);\n\
    return texelFetch(u_sphericalHarmonicsTexture, shPosCoord, 0).rg;\n\
}\n\
\n\
//Unpack RG32UI half float coefficients to vec3\n\
vec3 halfToVec3(uvec2 packed) {\n\
    return vec3(unpackHalf2x16(packed.x), unpackHalf2x16(packed.y).x);\n\
}\n\
\n\
vec3 loadAndExpandSHCoeff(uint splatID, int index) {\n\
    uvec2 coeff = loadSHCoeff(splatID, index);\n\
    return halfToVec3(coeff);\n\
}\n\
\n\
vec3 evaluateSH(uint splatID, vec3 viewDir) {\n\
    vec3 result = vec3(0.0);\n\
    int coeffIndex = 0;\n\
    float x = viewDir.x, y = viewDir.y, z = viewDir.z;\n\
\n\
    if (u_sphericalHarmonicsDegree >= 1.) {\n\
        vec3 sh1 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
        vec3 sh2 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
        vec3 sh3 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
        result += -SH_C1 * y * sh1 + SH_C1 * z * sh2 - SH_C1 * x * sh3;\n\
\n\
        if (u_sphericalHarmonicsDegree >= 2.) {\n\
            float xx = x * x;\n\
            float yy = y * y;\n\
            float zz = z * z;\n\
            float xy = x * y;\n\
            float yz = y * z;\n\
            float xz = x * z;\n\
\n\
            vec3 sh4 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
            vec3 sh5 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
            vec3 sh6 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
            vec3 sh7 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
            vec3 sh8 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
            result += SH_C2[0] * xy * sh4 +\n\
                    SH_C2[1] * yz * sh5 +\n\
                    SH_C2[2] * (2.0f * zz - xx - yy) * sh6 +\n\
                    SH_C2[3] * xz * sh7 +\n\
                    SH_C2[4] * (xx - yy) * sh8;\n\
\n\
            if (u_sphericalHarmonicsDegree >= 3.) {\n\
                vec3 sh9 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh10 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh11 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh12 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh13 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh14 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                vec3 sh15 = loadAndExpandSHCoeff(splatID, coeffIndex++);\n\
                result += SH_C3[0] * y * (3.0f * xx - yy) * sh9 +\n\
                        SH_C3[1] * xy * z * sh10 +\n\
                        SH_C3[2] * y * (4.0f * zz - xx - yy) * sh11 +\n\
                        SH_C3[3] * z * (2.0f * zz - 3.0f * xx - 3.0f * yy) * sh12 +\n\
                        SH_C3[4] * x * (4.0f * zz - xx - yy) * sh13 +\n\
                        SH_C3[5] * z * (xx - yy) * sh14 +\n\
                        SH_C3[6] * x * (xx - 3.0f * yy) * sh15;\n\
            }\n\
        }\n\
    }\n\
    return result;\n\
}\n\
#endif\n\
\n\
// Transforms and projects splat covariance into screen space and extracts the major and minor axes of the Gaussian ellipsoid\n\
// which is used to calculate the vertex position in clip space.\n\
vec4 calcCovVectors(vec3 viewPos, mat3 Vrk) {\n\
    vec4 t = vec4(viewPos, 1.0);\n\
    vec2 focal = vec2(czm_projection[0][0] * czm_viewport.z, czm_projection[1][1] * czm_viewport.w);\n\
\n\
    vec2 J1 = focal / t.z;\n\
    vec2 J2 = -focal * vec2(t.x, t.y) / (t.z * t.z);\n\
    mat3 J = mat3(\n\
        J1.x, 0.0, J2.x,\n\
        0.0, J1.y, J2.y,\n\
        0.0, 0.0, 0.0\n\
    );\n\
\n\
    mat3 R = mat3(czm_modelView);\n\
\n\
    //transform our covariance into view space\n\
    //ensures orientation is correct\n\
    mat3 Vrk_view = R * Vrk * transpose(R);\n\
    mat3 cov = transpose(J) * Vrk_view * J;\n\
\n\
    float diagonal1 = cov[0][0] + .3;\n\
    float offDiagonal = cov[0][1];\n\
    float diagonal2 = cov[1][1] + .3;\n\
\n\
    float mid = 0.5 * (diagonal1 + diagonal2);\n\
    float radius = length(vec2((diagonal1 - diagonal2) * 0.5, offDiagonal));\n\
    float lambda1 = mid + radius;\n\
    float lambda2 = max(mid - radius, 0.1);\n\
\n\
    vec2 diagonalVector = normalize(vec2(offDiagonal, lambda1 - diagonal1));\n\
\n\
    return vec4(\n\
        min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector,\n\
        min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x)\n\
    );\n\
}\n\
\n\
highp vec4 discardVec = vec4(0.0, 0.0, 2.0, 1.0);\n\
\n\
void main() {\n\
    uint texIdx = uint(a_splatIndex);\n\
    // u_splatRowMask and u_splatRowShift encode the row width of the splat\n\
    // attribute texture. The texture width is always maximumTextureSize, which\n\
    // varies by GPU, so these are passed as uniforms rather than constants.\n\
    //   rowMask  = maximumTextureSize/2 - 1\n\
    //   rowShift = log2(maximumTextureSize/2)\n\
    uint rowMask = uint(u_splatRowMask);\n\
    uint rowShift = uint(u_splatRowShift);\n\
    ivec2 posCoord = ivec2(int((texIdx & rowMask) << 1), int(texIdx >> rowShift));\n\
    vec4 splatPosition = vec4( uintBitsToFloat(uvec4(texelFetch(u_splatAttributeTexture, posCoord, 0))) );\n\
\n\
    vec4 splatViewPos = czm_modelView * vec4(splatPosition.xyz, 1.0);\n\
    vec4 clipPosition = czm_projection * splatViewPos;\n\
\n\
    float clip = 1.2 * clipPosition.w;\n\
    if (clipPosition.z < -clip || clipPosition.x < -clip || clipPosition.x > clip ||\n\
        clipPosition.y < -clip || clipPosition.y > clip) {\n\
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);\n\
        return;\n\
    }\n\
\n\
    ivec2 covCoord = ivec2(int(((texIdx & rowMask) << 1) | 1u), int(texIdx >> rowShift));\n\
    uvec4 covariance = uvec4(texelFetch(u_splatAttributeTexture, covCoord, 0));\n\
\n\
    gl_Position = clipPosition;\n\
\n\
    vec2 u1 = unpackHalf2x16(covariance.x) ;\n\
    vec2 u2 = unpackHalf2x16(covariance.y);\n\
    vec2 u3 = unpackHalf2x16(covariance.z);\n\
    mat3 Vrk = mat3(u1.x, u1.y, u2.x, u1.y, u2.y, u3.x, u2.x, u3.x, u3.y);\n\
\n\
    vec4 covVectors = calcCovVectors(splatViewPos.xyz, Vrk);\n\
\n\
    if (dot(covVectors.xy, covVectors.xy) < 4.0 && dot(covVectors.zw, covVectors.zw) < 4.0) {\n\
        gl_Position = discardVec;\n\
        return;\n\
    }\n\
\n\
    vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2) - 1.;\n\
\n\
    gl_Position += vec4((corner.x * covVectors.xy + corner.y * covVectors.zw) / czm_viewport.zw * gl_Position.w, 0, 0);\n\
    gl_Position.z = clamp(gl_Position.z, -abs(gl_Position.w), abs(gl_Position.w));\n\
\n\
    v_vertPos = corner ;\n\
    v_splatColor = vec4(covariance.w & 0xffu, (covariance.w >> 8) & 0xffu, (covariance.w >> 16) & 0xffu, (covariance.w >> 24) & 0xffu) / 255.0;\n\
#if defined(HAS_SPHERICAL_HARMONICS)\n\
    vec4 splatWC = czm_inverseView * splatViewPos;\n\
    vec3 viewDirModel = normalize(u_inverseModelRotation * (splatWC.xyz - u_cameraPositionWC.xyz));\n\
\n\
    v_splatColor.rgb += evaluateSH(texIdx, viewDirModel).rgb;\n\
#endif\n\
    v_splitDirection = u_splitDirection;\n\
}";
