//This file is automatically rebuilt by the Cesium build process.
export default "void edgeDetectionStage(inout vec4 color, inout FeatureIds featureIds) {\n\
    if (u_isEdgePass) {\n\
        return;\n\
    }\n\
\n\
    vec2 screenCoord = gl_FragCoord.xy / czm_viewport.zw;\n\
\n\
    vec4 edgeColor = texture(czm_edgeColorTexture, screenCoord);\n\
    vec4 edgeId = texture(czm_edgeIdTexture, screenCoord);\n\
\n\
    // Packed window-space depth from edge pass (0..1)\n\
    float edgeDepthWin = czm_unpackDepth(texture(czm_edgeDepthTexture, screenCoord));\n\
\n\
    // Near / far for current frustum\n\
    float n = czm_currentFrustum.x;\n\
    float f = czm_currentFrustum.y;\n\
\n\
    // geometry depth in eye coordinate\n\
    vec4 geomEC = czm_windowToEyeCoordinates(gl_FragCoord);\n\
    float geomDepthLinear = -geomEC.z;\n\
\n\
    // Convert edge depth to linear depth\n\
    float z_ndc_edge = edgeDepthWin * 2.0 - 1.0;\n\
    float edgeDepthLinear = (2.0 * n * f) / (f + n - z_ndc_edge * (f - n));\n\
\n\
    float d = abs(edgeDepthLinear - geomDepthLinear);\n\
\n\
    // Adaptive epsilon using linear depth fwidth for robustness\n\
    float pixelStepLinear = fwidth(geomDepthLinear);\n\
    float rel = geomDepthLinear * 0.0005;\n\
    float eps = max(n * 1e-4, max(pixelStepLinear * 1.5, rel));\n\
\n\
    // If Edge isn't behind any geometry and the pixel has edge data\n\
    if (d < eps && edgeId.r > 0.0) {\n\
#ifdef HAS_EDGE_FEATURE_ID\n\
        float edgeFeatureId    = edgeId.g;\n\
        float currentFeatureId = float(featureIds.featureId_0);\n\
#endif\n\
        float globeDepth = czm_unpackDepth(texture(czm_globeDepthTexture, screenCoord));\n\
        // Background / sky / globe: always show edge\n\
        bool isBackground = geomDepthLinear > globeDepth;\n\
        bool drawEdge = isBackground;\n\
\n\
#ifdef HAS_EDGE_FEATURE_ID\n\
        bool hasEdgeFeature = edgeFeatureId > 0.0;\n\
        bool hasCurrentFeature = currentFeatureId > 0.0;\n\
        bool featuresMatch = edgeFeatureId == currentFeatureId;\n\
\n\
        drawEdge = drawEdge || !hasEdgeFeature || !hasCurrentFeature || featuresMatch;\n\
#else\n\
        drawEdge = true;\n\
#endif\n\
\n\
        if (drawEdge) {\n\
            color = edgeColor;\n\
        }\n\
    }\n\
}\n\
";
