//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef USE_FLOAT64\n\
in vec3 positionHigh;\n\
in vec3 positionLow;\n\
#else\n\
in vec3 position;\n\
#endif\n\
in vec4 pickColor;\n\
in vec4 showPixelSizeColorAlpha;\n\
in vec3 outlineWidthColorAlpha;\n\
\n\
out vec4 v_pickColor;\n\
out vec4 v_color;\n\
out vec4 v_outlineColor;\n\
out float v_innerRadiusFrac;\n\
\n\
void main()\n\
{\n\
    // Unpack attributes.\n\
    float show = showPixelSizeColorAlpha.x;\n\
    float pixelSize = showPixelSizeColorAlpha.y;\n\
    vec4 color = czm_decodeRGB8(showPixelSizeColorAlpha.z);\n\
    float alpha = showPixelSizeColorAlpha.w;\n\
    float outlineWidth = outlineWidthColorAlpha.x;\n\
    vec4 outlineColor = czm_decodeRGB8(outlineWidthColorAlpha.y);\n\
    float outlineAlpha = outlineWidthColorAlpha.z;\n\
\n\
    ///////////////////////////////////////////////////////////////////////////\n\
\n\
    float innerRadius = 0.5 * pixelSize * czm_pixelRatio;\n\
    float outerRadius = (0.5 * pixelSize + outlineWidth) * czm_pixelRatio;\n\
\n\
    ///////////////////////////////////////////////////////////////////////////\n\
\n\
#ifdef USE_FLOAT64\n\
    vec4 p = czm_translateRelativeToEye(positionHigh, positionLow);\n\
    vec4 positionEC = czm_modelViewRelativeToEye * p;\n\
#else\n\
    vec4 positionEC = czm_modelView * vec4(position, 1.0);\n\
#endif\n\
\n\
    ///////////////////////////////////////////////////////////////////////////\n\
\n\
    gl_Position = czm_projection * positionEC;\n\
    czm_vertexLogDepth();\n\
\n\
    v_pickColor = pickColor / 255.0;\n\
\n\
    v_color = color;\n\
    v_color.a *= alpha * show;\n\
\n\
    v_outlineColor = outlineColor;\n\
    v_outlineColor.a *= outlineAlpha * show;\n\
\n\
    v_innerRadiusFrac = innerRadius / outerRadius;\n\
\n\
    gl_PointSize = 2.0 * outerRadius * show;\n\
    gl_Position *= show;\n\
}\n\
";
