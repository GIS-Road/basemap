//This file is automatically rebuilt by the Cesium build process.
export default "//\n\
// Fragment shader for Gaussian splats.\n\
// Renders a Gaussian splat within a quad, discarding fragments outside the unit circle.\n\
// Applies an approximate Gaussian falloff based on distance from the center and outputs\n\
// a color modulated by the alpha and Gaussian weight.\n\
//\n\
void main() {\n\
    if (v_splitDirection < 0.0 && gl_FragCoord.x > czm_splitPosition) discard;\n\
    if (v_splitDirection > 0.0 && gl_FragCoord.x < czm_splitPosition) discard;\n\
\n\
    float A = -dot(v_vertPos, v_vertPos);\n\
    if (A < -4.) {\n\
        discard;\n\
    }\n\
\n\
    float B = exp(A * 4.) * v_splatColor.a ;\n\
    out_FragColor = vec4(v_splatColor.rgb * B , B);\n\
}\n\
";
