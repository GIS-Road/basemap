//This file is automatically rebuilt by the Cesium build process.
export default "uniform mat3 u_cubeMapPanoramaTransform;\n\
\n\
in vec3 position;\n\
out vec3 v_texCoord;\n\
\n\
void main()\n\
{\n\
    vec3 p = czm_viewRotation * (u_cubeMapPanoramaTransform * (czm_entireFrustum.y * position));\n\
    gl_Position = czm_projection * vec4(p, 1.0);\n\
    v_texCoord = position.xyz;\n\
}\n\
";
