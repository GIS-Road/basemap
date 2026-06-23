//This file is automatically rebuilt by the Cesium build process.
export default "// See IntersectionUtils.glsl for the definitions of Ray, RayShapeIntersection,\n\
// NO_HIT, Intersections\n\
\n\
/* Box defines (set in Scene/VoxelBoxShape.js)\n\
#define BOX_INTERSECTION_INDEX ### // always 0\n\
*/\n\
\n\
uniform sampler2D u_renderBoundPlanesTexture;\n\
\n\
RayShapeIntersection intersectBoundPlanes(in Ray ray) {\n\
    vec4 lastEntry = vec4(ray.dir, -INF_HIT);\n\
    vec4 firstExit = vec4(-ray.dir, +INF_HIT);\n\
    for (int i = 0; i < 6; i++) {\n\
        vec4 boundPlane = getBoundPlane(u_renderBoundPlanesTexture, i);\n\
        vec4 intersection = intersectPlane(ray, boundPlane);\n\
        if (dot(ray.dir, boundPlane.xyz) < 0.0) {\n\
            lastEntry = intersection.w > lastEntry.w ? intersection : lastEntry;\n\
        } else {\n\
            firstExit = intersection.w < firstExit.w ? intersection: firstExit;\n\
        }\n\
    }\n\
\n\
    if (lastEntry.w < firstExit.w) {\n\
        return RayShapeIntersection(lastEntry, firstExit);\n\
    } else {\n\
        return RayShapeIntersection(vec4(-ray.dir, NO_HIT), vec4(ray.dir, NO_HIT));\n\
    }\n\
}\n\
\n\
void intersectShape(in Ray rayUV, in  Ray rayEC, inout Intersections ix)\n\
{\n\
    RayShapeIntersection intersection = intersectBoundPlanes(rayEC);\n\
    setShapeIntersection(ix, BOX_INTERSECTION_INDEX, intersection);\n\
}\n\
";
