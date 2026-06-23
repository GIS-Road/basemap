//This file is automatically rebuilt by the Cesium build process.
export default "// See IntersectionUtils.glsl for the definitions of Ray, Intersections,\n\
// setIntersectionPair, INF_HIT, NO_HIT\n\
\n\
/* intersectDepth defines (set in Scene/VoxelRenderResources.js)\n\
#define DEPTH_INTERSECTION_INDEX ###\n\
*/\n\
\n\
void intersectDepth(in vec2 screenCoord, in Ray ray, inout Intersections ix) {\n\
    float logDepthOrDepth = czm_unpackDepth(texture(czm_globeDepthTexture, screenCoord));\n\
    float entry;\n\
    float exit;\n\
    if (logDepthOrDepth != 0.0) {\n\
        // Calculate how far the ray must travel before it hits the depth buffer.\n\
        vec4 eyeCoordinateDepth = czm_screenToEyeCoordinates(screenCoord, logDepthOrDepth);\n\
        eyeCoordinateDepth /= eyeCoordinateDepth.w;\n\
        entry = dot(eyeCoordinateDepth.xyz - ray.pos, ray.dir);\n\
        exit = +INF_HIT;\n\
    } else {\n\
        // There's no depth at this location.\n\
        entry = NO_HIT;\n\
        exit = NO_HIT;\n\
    }\n\
    ix.distanceToDepthBuffer = entry;\n\
#if defined(DEPTH_TEST)\n\
    setIntersectionPair(ix, DEPTH_INTERSECTION_INDEX, vec2(entry, exit));\n\
#endif\n\
}\n\
";
