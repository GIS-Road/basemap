//This file is automatically rebuilt by the Cesium build process.
export default "// CESIUM_REDIRECTED_COLOR_OUTPUT flag is used to avoid color attachment conflicts\n\
// when shaders are processed by different rendering pipelines (e.g., OIT).\n\
// Only declare MRT outputs when not in a derived shader context.\n\
#if defined(HAS_EDGE_VISIBILITY_MRT) && !defined(CESIUM_REDIRECTED_COLOR_OUTPUT)\n\
layout(location = 1) out vec4 out_id;        // edge id / metadata\n\
layout(location = 2) out vec4 out_edgeDepth; // packed depth\n\
#endif\n\
\n\
void edgeVisibilityStage(inout vec4 color, inout FeatureIds featureIds)\n\
{\n\
#ifdef HAS_EDGE_VISIBILITY\n\
\n\
    if (!u_isEdgePass) {\n\
        return;\n\
    }\n\
 \n\
    float edgeTypeInt = v_edgeType * 255.0;\n\
\n\
    if (edgeTypeInt < 0.5) {\n\
        discard;\n\
    }\n\
\n\
    if (edgeTypeInt > 0.5 && edgeTypeInt < 1.5) { // silhouette candidate\n\
        // Silhouette check done in vertex shader\n\
        // v_shouldDiscard will be > 0.5 if this edge should be discarded\n\
        if (v_shouldDiscard > 0.5) {\n\
            discard;\n\
        }\n\
    }\n\
\n\
    vec4 finalColor = color;\n\
#ifdef HAS_EDGE_COLOR_ATTRIBUTE\n\
    if (v_edgeColor.a >= 0.0) {\n\
        finalColor = v_edgeColor;\n\
    }\n\
#endif\n\
\n\
#ifdef HAS_LINE_PATTERN\n\
    // Pattern is 16-bit, each bit represents visibility at that position\n\
    const float maskLength = 16.0;\n\
    \n\
    // Get the relative position within the dash from 0 to 1\n\
    float dashPosition = fract(v_lineCoord / maskLength);\n\
    // Figure out the mask index\n\
    float maskIndex = floor(dashPosition * maskLength);\n\
    // Test the bit mask\n\
    float maskTest = floor(u_linePattern / pow(2.0, maskIndex));\n\
    \n\
    // If bit is 0 (gap), discard the fragment (use < 1.0 for better numerical stability)\n\
    if (mod(maskTest, 2.0) < 1.0) {\n\
        discard;\n\
    }\n\
#endif\n\
    color = finalColor;\n\
    \n\
    #if defined(HAS_EDGE_VISIBILITY_MRT) && !defined(CESIUM_REDIRECTED_COLOR_OUTPUT)\n\
        // Write edge metadata\n\
        out_id = vec4(0.0);\n\
        out_id.r = edgeTypeInt;                    // Edge type (0-3)\n\
#ifdef HAS_EDGE_FEATURE_ID\n\
        out_id.g = float(featureIds.featureId_0); // Feature ID if available\n\
#else\n\
        out_id.g = 0.0;\n\
#endif\n\
        // Pack depth into separate MRT attachment\n\
        out_edgeDepth = czm_packDepth(gl_FragCoord.z);\n\
    #endif\n\
#endif\n\
}";
