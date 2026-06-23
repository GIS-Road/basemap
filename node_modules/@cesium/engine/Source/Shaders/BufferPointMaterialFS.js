//This file is automatically rebuilt by the Cesium build process.
export default "in vec4 v_pickColor;\n\
in vec4 v_color;\n\
in vec4 v_outlineColor;\n\
in float v_innerRadiusFrac;\n\
\n\
void main()\n\
{\n\
    // Distance between fragment and point center, 0 to 0.5.\n\
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));\n\
    float delta = fwidth(distanceToCenter);\n\
\n\
    float outerLimit = 0.5;\n\
    float innerLimit = 0.5 * v_innerRadiusFrac;\n\
\n\
    float outerAlpha = 1.0 - smoothstep(max(0.0, outerLimit - delta), outerLimit, distanceToCenter);\n\
    float innerAlpha = 1.0 - smoothstep(innerLimit - delta, innerLimit, distanceToCenter);\n\
\n\
    vec4 color = vec4(mix(v_outlineColor.rgb, v_color.rgb, innerAlpha), outerAlpha);\n\
    color.a *= mix(v_outlineColor.a, v_color.a, innerAlpha);\n\
\n\
    if (color.a < 0.005)   // matches 0/255 and 1/255\n\
    {\n\
        discard;\n\
    }\n\
\n\
    out_FragColor = czm_gammaCorrect(color);\n\
    czm_writeLogDepth();\n\
}\n\
";
