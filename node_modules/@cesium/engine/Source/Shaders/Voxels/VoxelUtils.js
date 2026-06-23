//This file is automatically rebuilt by the Cesium build process.
export default "struct Ray {\n\
    vec3 pos;\n\
    vec3 dir;\n\
};\n\
\n\
float minComponent(in vec3 v) {\n\
    return min(min(v.x, v.y), v.z);\n\
}\n\
\n\
float maxComponent(in vec3 v) {\n\
    return max(max(v.x, v.y), v.z);\n\
}\n\
";
