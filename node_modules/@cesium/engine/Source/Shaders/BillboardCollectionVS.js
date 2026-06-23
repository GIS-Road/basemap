//This file is automatically rebuilt by the Cesium build process.
export default "uniform float u_threePointDepthTestDistance;\n\
in vec2 direction;\n\
in vec4 positionHighAndScale;\n\
in vec4 positionLowAndRotation;\n\
in vec4 compressedAttribute0;                       // pixel offset, translate, horizontal origin, vertical origin, show, direction, texture coordinates (texture offset)\n\
in vec4 compressedAttribute1;                       // aligned axis, translucency by distance, image width\n\
in vec4 compressedAttribute2;                       // label horizontal origin, image height, color, pick color, size in meters, valid aligned axis, 13 bits free\n\
in vec4 eyeOffset;                                  // eye offset in meters, 4 bytes free (texture range)\n\
in vec4 scaleByDistance;                            // near, nearScale, far, farScale\n\
in vec4 pixelOffsetScaleByDistance;                 // near, nearScale, far, farScale\n\
in vec4 compressedAttribute3;                       // distance display condition near, far, disableDepthTestDistanceSq, dimensions\n\
in vec2 sdf;                                        // sdf outline color (rgb) and width (w)\n\
in float splitDirection;                            // splitDirection\n\
#ifdef VS_THREE_POINT_DEPTH_CHECK\n\
in vec4 textureCoordinateBoundsOrLabelTranslate;    // the min and max x and y values for the texture coordinates\n\
#endif\n\
#ifdef VECTOR_TILE\n\
in float a_batchId;\n\
#endif\n\
\n\
out vec2 v_textureCoordinates;\n\
out vec4 v_compressed;             // x: eyeDepth, y: applyTranslate & enableDepthCheck, z: dimensions, w: imageSize\n\
\n\
out vec4 v_pickColor;\n\
out vec4 v_color;\n\
flat out vec2 v_splitDirectionAndEllipsoidDepthEC;  // x: splitDirection, y: ellipsoid depth in eye coordinates\n\
#ifdef SDF\n\
out vec4 v_outlineColor;\n\
out float v_outlineWidth;\n\
#endif\n\
\n\
const float UPPER_BOUND = 32768.0;\n\
\n\
const float SHIFT_LEFT16 = 65536.0;\n\
const float SHIFT_LEFT12 = 4096.0;\n\
const float SHIFT_LEFT8 = 256.0;\n\
const float SHIFT_LEFT7 = 128.0;\n\
const float SHIFT_LEFT5 = 32.0;\n\
const float SHIFT_LEFT3 = 8.0;\n\
const float SHIFT_LEFT2 = 4.0;\n\
const float SHIFT_LEFT1 = 2.0;\n\
\n\
const float SHIFT_RIGHT12 = 1.0 / 4096.0;\n\
const float SHIFT_RIGHT8 = 1.0 / 256.0;\n\
const float SHIFT_RIGHT7 = 1.0 / 128.0;\n\
const float SHIFT_RIGHT5 = 1.0 / 32.0;\n\
const float SHIFT_RIGHT3 = 1.0 / 8.0;\n\
const float SHIFT_RIGHT2 = 1.0 / 4.0;\n\
const float SHIFT_RIGHT1 = 1.0 / 2.0;\n\
\n\
vec4 addScreenSpaceOffset(vec4 positionEC, vec2 imageSize, float scale, vec2 direction, vec2 origin, vec2 translate, vec2 pixelOffset, vec3 alignedAxis, bool validAlignedAxis, float rotation, bool sizeInMeters, out mat2 rotationMatrix, out float mpp)\n\
{\n\
    // Note the halfSize cannot be computed in JavaScript because it is sent via\n\
    // compressed vertex attributes that coerce it to an integer.\n\
    vec2 halfSize = imageSize * scale * 0.5;\n\
    halfSize *= ((direction * 2.0) - 1.0);\n\
\n\
    vec2 originTranslate = origin * abs(halfSize);\n\
\n\
#if defined(ROTATION) || defined(ALIGNED_AXIS)\n\
    if (validAlignedAxis || rotation != 0.0)\n\
    {\n\
        float angle = rotation;\n\
        if (validAlignedAxis)\n\
        {\n\
            vec4 projectedAlignedAxis = czm_modelView3D * vec4(alignedAxis, 0.0);\n\
            angle += sign(-projectedAlignedAxis.x) * acos(sign(projectedAlignedAxis.y) * (projectedAlignedAxis.y * projectedAlignedAxis.y) /\n\
                    (projectedAlignedAxis.x * projectedAlignedAxis.x + projectedAlignedAxis.y * projectedAlignedAxis.y));\n\
        }\n\
\n\
        float cosTheta = cos(angle);\n\
        float sinTheta = sin(angle);\n\
        rotationMatrix = mat2(cosTheta, sinTheta, -sinTheta, cosTheta);\n\
        halfSize = rotationMatrix * halfSize;\n\
    }\n\
    else\n\
    {\n\
        rotationMatrix = mat2(1.0, 0.0, 0.0, 1.0);\n\
    }\n\
#endif\n\
\n\
    mpp = czm_metersPerPixel(positionEC);\n\
    positionEC.xy += (originTranslate + halfSize) * czm_branchFreeTernary(sizeInMeters, 1.0, mpp);\n\
    positionEC.xy += (translate + pixelOffset) * mpp;\n\
\n\
    return positionEC;\n\
}\n\
\n\
#ifdef VS_THREE_POINT_DEPTH_CHECK\n\
float getGlobeDepth(vec4 positionEC)\n\
{\n\
    vec4 posWC = czm_eyeToWindowCoordinates(positionEC);\n\
\n\
    float globeDepth = czm_unpackDepth(texture(czm_globeDepthTexture, posWC.xy / czm_viewport.zw));\n\
\n\
    if (globeDepth == 0.0)\n\
    {\n\
        return 0.0; // not on the globe\n\
    }\n\
\n\
    vec4 eyeCoordinate = czm_windowToEyeCoordinates(posWC.xy, globeDepth);\n\
    return eyeCoordinate.z / eyeCoordinate.w;\n\
}\n\
#endif\n\
void main()\n\
{\n\
    // Modifying this shader may also require modifications to Billboard._computeScreenSpacePosition\n\
\n\
    // unpack attributes\n\
    vec3 positionHigh = positionHighAndScale.xyz;\n\
    vec3 positionLow = positionLowAndRotation.xyz;\n\
    float scale = positionHighAndScale.w;\n\
\n\
#if defined(ROTATION) || defined(ALIGNED_AXIS)\n\
    float rotation = positionLowAndRotation.w;\n\
#else\n\
    float rotation = 0.0;\n\
#endif\n\
\n\
    float compressed = compressedAttribute0.x;\n\
\n\
    vec2 pixelOffset;\n\
    pixelOffset.x = floor(compressed * SHIFT_RIGHT7);\n\
    compressed -= pixelOffset.x * SHIFT_LEFT7;\n\
    pixelOffset.x -= UPPER_BOUND;\n\
\n\
    vec2 origin;\n\
    origin.x = floor(compressed * SHIFT_RIGHT5);\n\
    compressed -= origin.x * SHIFT_LEFT5;\n\
\n\
    origin.y = floor(compressed * SHIFT_RIGHT3);\n\
    compressed -= origin.y * SHIFT_LEFT3;\n\
\n\
    origin -= vec2(1.0);\n\
\n\
    float show = floor(compressed * SHIFT_RIGHT2);\n\
    compressed -= show * SHIFT_LEFT2;\n\
\n\
    vec2 textureCoordinatesBottomLeft = czm_decompressTextureCoordinates(compressedAttribute0.w);\n\
    vec2 textureCoordinatesRange = czm_decompressTextureCoordinates(eyeOffset.w);\n\
    vec2 textureCoordinates = textureCoordinatesBottomLeft + direction * textureCoordinatesRange;\n\
\n\
    float temp = compressedAttribute0.y  * SHIFT_RIGHT8;\n\
    pixelOffset.y = -(floor(temp) - UPPER_BOUND);\n\
\n\
    vec2 translate;\n\
    translate.y = (temp - floor(temp)) * SHIFT_LEFT16;\n\
\n\
    temp = compressedAttribute0.z * SHIFT_RIGHT8;\n\
    translate.x = floor(temp) - UPPER_BOUND;\n\
    translate.x *= SHIFT_RIGHT2; // undo translateX scaling (helps preserve subpixel precision, see BillboardCollection.js attribute writer for more info)\n\
\n\
    translate.y += (temp - floor(temp)) * SHIFT_LEFT8;\n\
    translate.y -= UPPER_BOUND;\n\
    translate.y *= SHIFT_RIGHT2;\n\
\n\
    temp = compressedAttribute1.x * SHIFT_RIGHT8;\n\
    float temp2 = floor(compressedAttribute2.w * SHIFT_RIGHT2);\n\
\n\
    vec2 imageSize = vec2(floor(temp), temp2);\n\
\n\
#ifdef EYE_DISTANCE_TRANSLUCENCY\n\
    vec4 translucencyByDistance;\n\
    translucencyByDistance.x = compressedAttribute1.z;\n\
    translucencyByDistance.z = compressedAttribute1.w;\n\
\n\
    translucencyByDistance.y = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;\n\
\n\
    temp = compressedAttribute1.y * SHIFT_RIGHT8;\n\
    translucencyByDistance.w = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;\n\
#endif\n\
\n\
#ifdef VS_THREE_POINT_DEPTH_CHECK\n\
    temp = compressedAttribute3.w;\n\
    temp = temp * SHIFT_RIGHT12;\n\
\n\
    vec2 dimensions;\n\
    dimensions.y = (temp - floor(temp)) * SHIFT_LEFT12;\n\
    dimensions.x = floor(temp);\n\
#endif\n\
\n\
#ifdef ALIGNED_AXIS\n\
    vec3 alignedAxis = czm_octDecode(floor(compressedAttribute1.y * SHIFT_RIGHT8));\n\
    temp = compressedAttribute2.z * SHIFT_RIGHT5;\n\
    bool validAlignedAxis = (temp - floor(temp)) * SHIFT_LEFT1 > 0.0;\n\
#else\n\
    vec3 alignedAxis = vec3(0.0);\n\
    bool validAlignedAxis = false;\n\
#endif\n\
\n\
    vec4 color = czm_decodeRGB8(compressedAttribute2.x);\n\
    vec4 pickColor = czm_decodeRGB8(compressedAttribute2.y);\n\
\n\
    temp = compressedAttribute2.z * SHIFT_RIGHT8;\n\
    bool sizeInMeters = floor((temp - floor(temp)) * SHIFT_LEFT7) > 0.0;\n\
    temp = floor(temp) * SHIFT_RIGHT8;\n\
\n\
    pickColor.a = (temp - floor(temp)) * SHIFT_LEFT8;\n\
    pickColor.a /= 255.0;\n\
\n\
    color.a = floor(temp);\n\
    color.a /= 255.0;\n\
\n\
    ///////////////////////////////////////////////////////////////////////////\n\
\n\
    vec4 p = czm_translateRelativeToEye(positionHigh, positionLow);\n\
    vec4 positionEC = czm_modelViewRelativeToEye * p;\n\
\n\
    positionEC = czm_eyeOffset(positionEC, eyeOffset.xyz);\n\
    positionEC.xyz *= show;\n\
\n\
    ///////////////////////////////////////////////////////////////////////////\n\
\n\
#if defined(EYE_DISTANCE_SCALING) || defined(EYE_DISTANCE_TRANSLUCENCY) || defined(EYE_DISTANCE_PIXEL_OFFSET) || defined(DISTANCE_DISPLAY_CONDITION) || defined(DISABLE_DEPTH_DISTANCE)\n\
    float lengthSq;\n\
    if (czm_sceneMode == czm_sceneMode2D)\n\
    {\n\
        // 2D camera distance is a special case\n\
        // treat all billboards as flattened to the z=0.0 plane\n\
        lengthSq = czm_eyeHeight2D.y;\n\
    }\n\
    else\n\
    {\n\
        lengthSq = dot(positionEC.xyz, positionEC.xyz);\n\
    }\n\
#endif\n\
\n\
#ifdef EYE_DISTANCE_SCALING\n\
    float distanceScale = czm_nearFarScalar(scaleByDistance, lengthSq);\n\
    scale *= distanceScale;\n\
    translate *= distanceScale;\n\
    // push vertex behind near plane for clipping\n\
    if (scale == 0.0)\n\
    {\n\
        positionEC.xyz = vec3(0.0);\n\
    }\n\
#endif\n\
\n\
    float translucency = 1.0;\n\
#ifdef EYE_DISTANCE_TRANSLUCENCY\n\
    translucency = czm_nearFarScalar(translucencyByDistance, lengthSq);\n\
    // push vertex behind near plane for clipping\n\
    if (translucency == 0.0)\n\
    {\n\
        positionEC.xyz = vec3(0.0);\n\
    }\n\
#endif\n\
\n\
#ifdef EYE_DISTANCE_PIXEL_OFFSET\n\
    float pixelOffsetScale = czm_nearFarScalar(pixelOffsetScaleByDistance, lengthSq);\n\
    pixelOffset *= pixelOffsetScale;\n\
#endif\n\
\n\
#ifdef DISTANCE_DISPLAY_CONDITION\n\
    float nearSq = compressedAttribute3.x;\n\
    float farSq = compressedAttribute3.y;\n\
    if (lengthSq < nearSq || lengthSq > farSq)\n\
    {\n\
        positionEC.xyz = vec3(0.0);\n\
    }\n\
#endif\n\
\n\
    mat2 rotationMatrix;\n\
    float mpp;\n\
\n\
    float enableDepthCheck = 1.0;\n\
#ifdef DISABLE_DEPTH_DISTANCE\n\
    float disableDepthTestDistanceSq = compressedAttribute3.z;\n\
    if (disableDepthTestDistanceSq == 0.0 && czm_minimumDisableDepthTestDistance != 0.0)\n\
    {\n\
        disableDepthTestDistanceSq = czm_minimumDisableDepthTestDistance;\n\
    }\n\
\n\
    if (lengthSq < disableDepthTestDistanceSq || disableDepthTestDistanceSq < 0.0)\n\
    {\n\
        enableDepthCheck = 0.0;\n\
    }\n\
#endif\n\
\n\
    v_splitDirectionAndEllipsoidDepthEC.y = czm_infinity;\n\
    vec3 ellipsoidCenter = czm_view[3].xyz;\n\
    vec3 rayDirection = normalize(positionEC.xyz);\n\
    czm_ray ray = czm_ray(vec3(0.0), rayDirection);\n\
    vec3 ellipsoid_inverseRadii = czm_ellipsoidInverseRadii;\n\
    czm_raySegment intersection = czm_rayEllipsoidIntersectionInterval(ray, ellipsoidCenter, ellipsoid_inverseRadii);\n\
\n\
    if (!czm_isEmpty(intersection))\n\
    {\n\
        v_splitDirectionAndEllipsoidDepthEC.y = intersection.start;\n\
    }\n\
\n\
    v_compressed.y = enableDepthCheck;\n\
\n\
#ifdef VS_THREE_POINT_DEPTH_CHECK\n\
if (lengthSq < (u_threePointDepthTestDistance * u_threePointDepthTestDistance) && (enableDepthCheck == 1.0)) {\n\
    float depthsilon = 10.0;\n\
    vec2 depthOrigin;\n\
    // Horizontal origin for labels comes from a special attribute. If that value is 0, this is a billboard - use the regular origin.\n\
    // Otherwise, transform the label origin to -1, 0, 1 (right, center, left).\n\
    depthOrigin.x = floor(compressedAttribute2.w - (temp2 * SHIFT_LEFT2));\n\
    depthOrigin.x = czm_branchFreeTernary(depthOrigin.x == 0.0, origin.x, depthOrigin.x - 2.0);\n\
    depthOrigin.y = origin.y;\n\
\n\
    vec4 pEC1 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(0.0), depthOrigin, vec2(0.0), pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);\n\
    float globeDepth1 = getGlobeDepth(pEC1);\n\
\n\
    if (globeDepth1 != 0.0 && pEC1.z + depthsilon < globeDepth1)\n\
    {\n\
        vec4 pEC2 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(0.0, 1.0), depthOrigin, vec2(0.0), pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);\n\
        float globeDepth2 = getGlobeDepth(pEC2);\n\
\n\
        if (globeDepth2 != 0.0 && pEC2.z + depthsilon < globeDepth2)\n\
        {\n\
            vec4 pEC3 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(1.0), depthOrigin, vec2(0.0), pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);\n\
            float globeDepth3 = getGlobeDepth(pEC3);\n\
            if (globeDepth3 != 0.0 && pEC3.z + depthsilon < globeDepth3)\n\
            {\n\
                // \"Discard\" this vertex, as three key points fail depth test.\n\
                positionEC.xyz = vec3(0.0);\n\
            }\n\
        }\n\
    }\n\
}\n\
#endif\n\
    // Write out the eyespace depth before applying the screen space offset, but after potentially \"discarding\" the vertex\n\
    // by setting its eyespace position to zero, via the three-point depth test above.\n\
    v_compressed.x = positionEC.z;\n\
\n\
    positionEC = addScreenSpaceOffset(positionEC, imageSize, scale, direction, origin, translate, pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);\n\
    gl_Position = czm_projection * positionEC;\n\
    v_textureCoordinates = textureCoordinates;\n\
\n\
#ifdef LOG_DEPTH\n\
    czm_vertexLogDepth();\n\
#endif\n\
\n\
#ifdef DISABLE_DEPTH_DISTANCE\n\
\n\
    if (disableDepthTestDistanceSq != 0.0)\n\
    {\n\
        // Don't try to \"multiply both sides\" by w.  Greater/less-than comparisons won't work for negative values of w.\n\
        float zclip = gl_Position.z / gl_Position.w;\n\
        bool clipped = (zclip < -1.0 || zclip > 1.0);\n\
        // disableDepthTestDistanceSq can be less than zero if it's explicitly set to -1 in JS (as a sentinel value equivalent to infinity)\n\
        if (!clipped && (disableDepthTestDistanceSq < 0.0 || (lengthSq > 0.0 && lengthSq < disableDepthTestDistanceSq)))\n\
        {\n\
            // Position z on the near plane.\n\
            gl_Position.z = -gl_Position.w;\n\
#ifdef LOG_DEPTH\n\
            v_depthFromNearPlusOne = 1.0;\n\
#endif\n\
        }\n\
    }\n\
#endif\n\
\n\
#ifdef SDF\n\
    vec4 outlineColor = czm_decodeRGB8(sdf.x);\n\
    float outlineWidth;\n\
\n\
    temp = sdf.y;\n\
    temp = temp * SHIFT_RIGHT8;\n\
    float temp3 = (temp - floor(temp)) * SHIFT_LEFT8;\n\
    temp = floor(temp) * SHIFT_RIGHT8;\n\
    outlineWidth = (temp - floor(temp)) * SHIFT_LEFT8;\n\
    outlineColor.a = floor(temp);\n\
    outlineColor.a /= 255.0;\n\
\n\
    v_outlineWidth = outlineWidth / 255.0;\n\
    v_outlineColor = outlineColor;\n\
    v_outlineColor.a *= translucency;\n\
#endif\n\
\n\
    v_pickColor = pickColor;\n\
\n\
    v_color = color;\n\
    v_color.a *= translucency;\n\
    v_splitDirectionAndEllipsoidDepthEC.x = splitDirection;\n\
}\n\
";
