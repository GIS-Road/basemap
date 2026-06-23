//This file is automatically rebuilt by the Cesium build process.
export default "uniform sampler2D u_atlas;\n\
uniform float u_coarseDepthTestDistance;\n\
uniform float u_threePointDepthTestDistance;\n\
\n\
#ifdef VECTOR_TILE\n\
uniform vec4 u_highlightColor;\n\
#endif\n\
\n\
in vec2 v_textureCoordinates;\n\
in vec4 v_pickColor;\n\
in vec4 v_color;\n\
flat in vec2 v_splitDirectionAndEllipsoidDepthEC;\n\
\n\
#ifdef SDF\n\
in vec4 v_outlineColor;\n\
in float v_outlineWidth;\n\
#endif\n\
\n\
in vec4 v_compressed;                               // x: eyeDepth, y: applyTranslate & enableDepthCheck, z: dimensions, w: imageSize\n\
const float SHIFT_LEFT1 = 2.0;\n\
const float SHIFT_RIGHT1 = 1.0 / 2.0;\n\
\n\
float getGlobeDepthAtCoords(vec2 st)\n\
{\n\
    float logDepthOrDepth = czm_unpackDepth(texture(czm_globeDepthTexture, st));\n\
    if (logDepthOrDepth == 0.0)\n\
    {\n\
        return 0.0; // not on the globe\n\
    }\n\
\n\
    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, logDepthOrDepth);\n\
    return eyeCoordinate.z / eyeCoordinate.w;\n\
}\n\
\n\
#ifdef SDF\n\
\n\
// Get the distance from the edge of a glyph at a given position sampling an SDF texture.\n\
float getDistance(vec2 position)\n\
{\n\
    return texture(u_atlas, position).r;\n\
}\n\
\n\
// Samples the sdf texture at the given position and produces a color based on the fill color and the outline.\n\
vec4 getSDFColor(vec2 position, float outlineWidth, vec4 outlineColor, float smoothing)\n\
{\n\
    float distance = getDistance(position);\n\
\n\
    if (outlineWidth > 0.0)\n\
    {\n\
        // Don't get the outline edge exceed the SDF_EDGE\n\
        float outlineEdge = clamp(SDF_EDGE - outlineWidth, 0.0, SDF_EDGE);\n\
        float outlineFactor = smoothstep(SDF_EDGE - smoothing, SDF_EDGE + smoothing, distance);\n\
        vec4 sdfColor = mix(outlineColor, v_color, outlineFactor);\n\
        float alpha = smoothstep(outlineEdge - smoothing, outlineEdge + smoothing, distance);\n\
        return vec4(sdfColor.rgb, sdfColor.a * alpha);\n\
    }\n\
    else\n\
    {\n\
        float alpha = smoothstep(SDF_EDGE - smoothing, SDF_EDGE + smoothing, distance);\n\
        return vec4(v_color.rgb, v_color.a * alpha);\n\
    }\n\
}\n\
#endif\n\
\n\
bool getDepthTestEnabled() {\n\
    float temp = v_compressed.y;\n\
    temp = temp * SHIFT_RIGHT1;\n\
    float temp2 = (temp - floor(temp)) * SHIFT_LEFT1;\n\
    return temp2 != 0.0;\n\
}\n\
\n\
float getRelativeEyeDepth(float eyeDepth, float distanceToEllipsoid, float epsilon) {\n\
    float depthDifferential = eyeDepth - distanceToEllipsoid;\n\
    float depthRatio = abs(depthDifferential / distanceToEllipsoid);\n\
    if (depthRatio < epsilon) {\n\
        // The approximations are imprecise, so use an epsilon check for small value differences and assume a value of 0.0\n\
        return 0.0;\n\
    }\n\
\n\
    return depthDifferential;\n\
}\n\
\n\
// Extra manual depth testing is done to allow more control over how a billboard is occluded\n\
// by the globe when near and far from the camera.\n\
void doDepthTest(float eyeDepth, float globeDepth) {\n\
\n\
#ifdef VS_THREE_POINT_DEPTH_CHECK\n\
    // Since discarding vertices is not possible, the vertex shader sets eyeDepth to 0 to indicate the depth test failed. Apply the discard here.\n\
    if (eyeDepth > -u_threePointDepthTestDistance) {\n\
        if (eyeDepth == 0.0) {\n\
            discard;\n\
        }\n\
        return;\n\
    }\n\
#endif\n\
    bool useGlobeDepth = eyeDepth > -u_coarseDepthTestDistance;\n\
    if (useGlobeDepth && globeDepth == 0.0) {\n\
        // Pixel is not on the globe, so there is no distance to compare against. Pass.\n\
        return;\n\
    }\n\
\n\
    // If the camera is close, compare against the globe depth texture that includes depth from the 3D tile pass.\n\
    if (useGlobeDepth && getRelativeEyeDepth(eyeDepth, globeDepth, czm_epsilon1) < 0.0) {\n\
        discard;\n\
    }\n\
}\n\
\n\
#ifdef LOG_DEPTH\n\
void writeDepth(float eyeDepth, float globeDepth, float distanceToEllipsoid) {\n\
    // If we've made it here, the manual depth test above determined that this fragment should be visible.\n\
    // But the automatic depth test must still run in order to write the result to the depth buffer, and its results may\n\
    // disagree with our manual depth test's results. To prefer our manual results when in front of the globe, apply an offset towards the camera.\n\
\n\
    float depthArg = v_depthFromNearPlusOne;\n\
\n\
    if (globeDepth != 0.0 && getRelativeEyeDepth(eyeDepth, distanceToEllipsoid, czm_epsilon3) > 0.0) {\n\
        float globeDepthFromNearPlusOne = (-globeDepth - czm_currentFrustum.x) + 1.0;\n\
        float nudge = max(globeDepthFromNearPlusOne * 5e-6, czm_epsilon7);\n\
        float globeOnTop = max(1.0, globeDepthFromNearPlusOne - nudge);\n\
        depthArg = min(depthArg, globeOnTop);\n\
    }\n\
\n\
    czm_writeLogDepth(depthArg);\n\
}\n\
#endif\n\
\n\
void main()\n\
{\n\
    if (v_splitDirectionAndEllipsoidDepthEC.x < 0.0 && gl_FragCoord.x > czm_splitPosition) {\n\
        discard;\n\
    }\n\
    if (v_splitDirectionAndEllipsoidDepthEC.x > 0.0 && gl_FragCoord.x < czm_splitPosition) {\n\
        discard;\n\
    }\n\
\n\
    if (getDepthTestEnabled()) {\n\
        vec2 fragSt = gl_FragCoord.xy / czm_viewport.zw;\n\
        float eyeDepth = v_compressed.x;\n\
        float globeDepth = getGlobeDepthAtCoords(fragSt);\n\
        float distanceToEllipsoid = -v_splitDirectionAndEllipsoidDepthEC.y;\n\
        doDepthTest(eyeDepth, globeDepth);\n\
\n\
        #ifdef LOG_DEPTH\n\
        writeDepth(eyeDepth, globeDepth, distanceToEllipsoid);\n\
        #endif\n\
    }\n\
\n\
    vec4 color = texture(u_atlas, v_textureCoordinates);\n\
\n\
#ifdef SDF\n\
    float outlineWidth = v_outlineWidth;\n\
    vec4 outlineColor = v_outlineColor;\n\
\n\
    // Get the current distance\n\
    float distance = getDistance(v_textureCoordinates);\n\
\n\
#if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\n\
    float smoothing = fwidth(distance);\n\
    // Get an offset that is approximately half the distance to the neighbor pixels\n\
    // 0.354 is approximately half of 1/sqrt(2)\n\
    vec2 sampleOffset = 0.354 * vec2(dFdx(v_textureCoordinates) + dFdy(v_textureCoordinates));\n\
\n\
    // Sample the center point\n\
    vec4 center = getSDFColor(v_textureCoordinates, outlineWidth, outlineColor, smoothing);\n\
\n\
    // Sample the 4 neighbors\n\
    vec4 color1 = getSDFColor(v_textureCoordinates + vec2(sampleOffset.x, sampleOffset.y), outlineWidth, outlineColor, smoothing);\n\
    vec4 color2 = getSDFColor(v_textureCoordinates + vec2(-sampleOffset.x, sampleOffset.y), outlineWidth, outlineColor, smoothing);\n\
    vec4 color3 = getSDFColor(v_textureCoordinates + vec2(-sampleOffset.x, -sampleOffset.y), outlineWidth, outlineColor, smoothing);\n\
    vec4 color4 = getSDFColor(v_textureCoordinates + vec2(sampleOffset.x, -sampleOffset.y), outlineWidth, outlineColor, smoothing);\n\
\n\
    // Equally weight the center sample and the 4 neighboring samples\n\
    color = (center + color1 + color2 + color3 + color4)/5.0;\n\
#else\n\
    // If no derivatives available (IE 10?), just do a single sample\n\
    float smoothing = 1.0/32.0;\n\
    color = getSDFColor(v_textureCoordinates, outlineWidth, outlineColor, smoothing);\n\
#endif\n\
\n\
    color = czm_gammaCorrect(color);\n\
#else\n\
    color = czm_gammaCorrect(color);\n\
    color *= czm_gammaCorrect(v_color);\n\
#endif\n\
\n\
// Fully transparent parts of the billboard are not pickable.\n\
#if !defined(OPAQUE) && !defined(TRANSLUCENT)\n\
    if (color.a < 0.005)   // matches 0/255 and 1/255\n\
    {\n\
        discard;\n\
    }\n\
#else\n\
// The billboard is rendered twice. The opaque pass discards translucent fragments\n\
// and the translucent pass discards opaque fragments.\n\
#ifdef OPAQUE\n\
    if (color.a < 0.995)   // matches < 254/255\n\
    {\n\
        discard;\n\
    }\n\
#else\n\
    if (color.a >= 0.995)  // matches 254/255 and 255/255\n\
    {\n\
        discard;\n\
    }\n\
#endif\n\
#endif\n\
\n\
#ifdef VECTOR_TILE\n\
    color *= u_highlightColor;\n\
#endif\n\
    out_FragColor = color;\n\
}\n\
";
