//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef USE_FLOAT64\n\
in vec3 positionHigh;\n\
in vec3 positionLow;\n\
#else\n\
in vec3 position;\n\
#endif\n\
in vec4 pickColor;\n\
in vec3 showColorAlpha;\n\
\n\
out vec4 v_pickColor;\n\
out vec4 v_color;\n\
\n\
void main()\n\
{\n\
    float show = showColorAlpha.x;\n\
    vec4 color = czm_decodeRGB8(showColorAlpha.y);\n\
    float alpha = showColorAlpha.z;\n\
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
    gl_Position *= show;\n\
}\n\
";
