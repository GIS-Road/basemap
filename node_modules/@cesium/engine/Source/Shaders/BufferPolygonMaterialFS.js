//This file is automatically rebuilt by the Cesium build process.
export default "in vec4 v_pickColor;\n\
in vec4 v_color;\n\
\n\
void main()\n\
{\n\
    if (v_color.a < 0.005)   // matches 0/255 and 1/255\n\
    {\n\
        discard;\n\
    }\n\
\n\
    out_FragColor = czm_gammaCorrect(v_color);\n\
    czm_writeLogDepth();\n\
}\n\
";
