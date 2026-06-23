//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef HAS_EDGE_VISIBILITY\n\
void edgeVisibilityStageVS() {\n\
    if (!u_isEdgePass) {\n\
        return;\n\
    }\n\
\n\
    v_edgeType = a_edgeType;\n\
    v_faceNormalAView = czm_normal * a_faceNormalA;\n\
    v_faceNormalBView = czm_normal * a_faceNormalB;\n\
    v_edgeOffset = a_edgeOffset;\n\
\n\
    // Silhouette detection: check both endpoints of the edge\n\
    v_shouldDiscard = 0.0;\n\
    float edgeTypeInt = a_edgeType * 255.0;\n\
    if (edgeTypeInt > 0.5 && edgeTypeInt < 1.5) {\n\
        vec3 normalA = normalize(v_faceNormalAView);\n\
        vec3 normalB = normalize(v_faceNormalBView);\n\
        const float perpTol = 2.5e-4;\n\
\n\
        // Check at current vertex (first endpoint)\n\
        vec4 currentPosEC = czm_modelView * vec4(v_positionMC, 1.0);\n\
        vec3 toEye1 = normalize(-currentPosEC.xyz);\n\
        float dotA1 = dot(normalA, toEye1);\n\
        float dotB1 = dot(normalB, toEye1);\n\
\n\
        // Check at other vertex (second endpoint)\n\
        vec4 otherPosEC = czm_modelView * vec4(a_edgeOtherPos, 1.0);\n\
        vec3 toEye2 = normalize(-otherPosEC.xyz);\n\
        float dotA2 = dot(normalA, toEye2);\n\
        float dotB2 = dot(normalB, toEye2);\n\
\n\
        // Discard if EITHER endpoint is non-silhouette\n\
        if (dotA1 * dotB1 > perpTol || dotA2 * dotB2 > perpTol) {\n\
            v_shouldDiscard = 1.0;\n\
        }\n\
    }\n\
\n\
#ifdef HAS_EDGE_FEATURE_ID\n\
    v_featureId_0 = a_edgeFeatureId;\n\
#endif\n\
\n\
#ifdef HAS_EDGE_COLOR_ATTRIBUTE\n\
    v_edgeColor = a_edgeColor;\n\
#endif\n\
\n\
#ifdef HAS_LINE_PATTERN\n\
    #ifdef HAS_EDGE_CUMULATIVE_DISTANCE\n\
    v_lineCoord = a_edgeCumulativeDistance * u_pixelsPerWorld;\n\
    #else\n\
    vec4 currentClip = czm_modelViewProjection * vec4(v_positionMC, 1.0);\n\
    vec2 currentScreen = ((currentClip.xy / currentClip.w) * 0.5 + 0.5) * czm_viewport.zw;\n\
\n\
    vec4 otherClip = czm_modelViewProjection * vec4(a_edgeOtherPos, 1.0);\n\
    vec2 otherScreen = ((otherClip.xy / otherClip.w) * 0.5 + 0.5) * czm_viewport.zw;\n\
    vec2 windowDir = otherScreen - currentScreen;\n\
\n\
    const float textureCoordinateBase = 8192.0;\n\
    if (abs(windowDir.x) > abs(windowDir.y)) {\n\
        v_lineCoord = textureCoordinateBase + currentScreen.x;\n\
    } else {\n\
        v_lineCoord = textureCoordinateBase + currentScreen.y;\n\
    }\n\
    #endif\n\
#endif\n\
\n\
    // Expand vertex to form quad\n\
    vec4 posClip = gl_Position;\n\
\n\
    if (length(a_edgeOtherPos) > 0.0 && abs(a_edgeOffset) > 0.0) {\n\
        vec4 currentClip = posClip;\n\
        vec4 otherClip = czm_modelViewProjection * vec4(a_edgeOtherPos, 1.0);\n\
\n\
        vec2 currentNDC = currentClip.xy / currentClip.w;\n\
        vec2 otherNDC = otherClip.xy / otherClip.w;\n\
\n\
        vec2 edgeDirNDC = otherNDC - currentNDC;\n\
\n\
        // Ensure consistent edge direction\n\
        if (edgeDirNDC.x < 0.0 || (abs(edgeDirNDC.x) < 0.001 && edgeDirNDC.y < 0.0)) {\n\
            edgeDirNDC = -edgeDirNDC;\n\
        }\n\
\n\
        edgeDirNDC = normalize(edgeDirNDC);\n\
        vec2 perpNDC = vec2(-edgeDirNDC.y, edgeDirNDC.x);\n\
\n\
        // Convert line width from pixels to clip space\n\
        float lineWidthPixels = u_lineWidth;\n\
        vec2 viewportSize = czm_viewport.zw;\n\
        vec2 clipPerPixel = (2.0 / viewportSize) * currentClip.w;\n\
        vec2 offsetClip = perpNDC * lineWidthPixels * clipPerPixel * 0.5 * a_edgeOffset;\n\
\n\
        posClip.xy += offsetClip;\n\
    }\n\
\n\
    gl_Position = posClip;\n\
}\n\
#endif\n\
";
