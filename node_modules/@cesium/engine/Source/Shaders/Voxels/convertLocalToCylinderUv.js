//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_cylinderLocalToShapeUvScale; // x = radius scale, y = angle scale, z = height scale\n\
uniform float u_cylinderShapeUvAngleRangeOrigin;\n\
uniform mat3 u_cylinderEcToRadialTangentUp;\n\
uniform ivec4 u_cameraTileCoordinates;\n\
uniform vec3 u_cameraTileUv;\n\
uniform vec3 u_cameraShapePosition; // (radial distance, angle, height) of camera in shape space\n\
\n\
mat3 convertLocalToShapeSpaceDerivative(in vec3 position) {\n\
    vec3 radial = normalize(vec3(position.xy, 0.0));\n\
    vec3 z = vec3(0.0, 0.0, 1.0);\n\
    vec3 east = normalize(vec3(-position.y, position.x, 0.0));\n\
    return mat3(radial, east / length(position.xy), z);\n\
}\n\
\n\
vec3 scaleShapeUvToShapeSpace(in vec3 shapeUv) {\n\
    float radius = shapeUv.x / u_cylinderLocalToShapeUvScale.x;\n\
    float angle = shapeUv.y * czm_twoPi / u_cylinderLocalToShapeUvScale.y;\n\
    float height = shapeUv.z / u_cylinderLocalToShapeUvScale.z;\n\
\n\
    return vec3(radius, angle, height);\n\
}\n\
\n\
/**\n\
 * Computes the change in polar coordinates given a change in position.\n\
 * @param {vec2} dPosition The change in position in Cartesian coordinates.\n\
 * @param {float} cameraRadialDistance The radial distance of the camera from the origin.\n\
 * @return {vec2} The change in polar coordinates (radial distance, angle).\n\
 */\n\
vec2 computePolarChange(in vec2 dPosition, in float cameraRadialDistance) {\n\
    float dAngle = atan(dPosition.y, cameraRadialDistance + dPosition.x);\n\
    // Find the direction of the radial axis at the output angle, in Cartesian coordinates\n\
    vec2 outputRadialAxis = vec2(cos(dAngle), sin(dAngle));\n\
    float sinHalfAngle = sin(dAngle / 2.0);\n\
    float versine = 2.0 * sinHalfAngle * sinHalfAngle;\n\
    float dRadial = dot(dPosition, outputRadialAxis) - cameraRadialDistance * versine;\n\
    return vec2(dRadial, dAngle);\n\
}\n\
\n\
vec3 convertEcToDeltaShape(in vec3 positionEC) {\n\
    // 1. Rotate to radial, tangent, and up coordinates\n\
    vec3 rtu = u_cylinderEcToRadialTangentUp * positionEC;\n\
    // 2. Compute change in angular and radial coordinates.\n\
    vec2 dPolar = computePolarChange(rtu.xy, u_cameraShapePosition.x);\n\
    return vec3(dPolar.xy, rtu.z);\n\
}\n\
\n\
vec3 convertEcToDeltaTile(in vec3 positionEC) {\n\
    vec3 deltaShape = convertEcToDeltaShape(positionEC);\n\
    // Convert to tileset coordinates in [0, 1]\n\
    float dx = u_cylinderLocalToShapeUvScale.x * deltaShape.x;\n\
    float dy = deltaShape.y / czm_twoPi;\n\
#if defined(CYLINDER_HAS_SHAPE_BOUNDS_ANGLE)\n\
    // Wrap to ensure dy is not crossing through the unoccupied angle range, where\n\
    // angle to tile coordinate conversions would be more complicated\n\
    float cameraUvAngle = (u_cameraShapePosition.y + czm_pi) / czm_twoPi;\n\
    float cameraUvAngleShift = fract(cameraUvAngle - u_cylinderShapeUvAngleRangeOrigin);\n\
    float rawOutputUvAngle = cameraUvAngleShift + dy;\n\
    float rotation = floor(rawOutputUvAngle);\n\
    dy -= rotation;\n\
#endif\n\
    dy *= u_cylinderLocalToShapeUvScale.y;\n\
    float dz = u_cylinderLocalToShapeUvScale.z * deltaShape.z;\n\
    // Convert to tile coordinate changes\n\
    return vec3(dx, dy, dz) * float(1 << u_cameraTileCoordinates.w);\n\
}\n\
\n\
TileAndUvCoordinate getTileAndUvCoordinate(in vec3 positionEC) {\n\
    vec3 deltaTileCoordinate = convertEcToDeltaTile(positionEC);\n\
    vec3 tileUvSum = u_cameraTileUv + deltaTileCoordinate;\n\
    ivec3 tileCoordinate = u_cameraTileCoordinates.xyz + ivec3(floor(tileUvSum));\n\
    int maxTileCoordinate = (1 << u_cameraTileCoordinates.w) - 1;\n\
    tileCoordinate.x = min(max(0, tileCoordinate.x), maxTileCoordinate);\n\
    tileCoordinate.z = min(max(0, tileCoordinate.z), maxTileCoordinate);\n\
#if (!defined(CYLINDER_HAS_SHAPE_BOUNDS_ANGLE))\n\
    ivec3 tileCoordinateChange = tileCoordinate - u_cameraTileCoordinates.xyz;\n\
    if (tileCoordinate.y < 0) {\n\
        tileCoordinate.y += (maxTileCoordinate + 1);\n\
    } else if (tileCoordinate.y > maxTileCoordinate) {\n\
        tileCoordinate.y -= (maxTileCoordinate + 1);\n\
    }\n\
#else\n\
    tileCoordinate.y = min(max(0, tileCoordinate.y), maxTileCoordinate);\n\
    ivec3 tileCoordinateChange = tileCoordinate - u_cameraTileCoordinates.xyz;\n\
#endif\n\
    vec3 tileUv = tileUvSum - vec3(tileCoordinateChange);\n\
    tileUv.x = clamp(tileUv.x, 0.0, 1.0);\n\
#if (!defined(CYLINDER_HAS_SHAPE_BOUNDS_ANGLE))\n\
    // If there is only one tile spanning 2*PI angle, the coordinate wraps around\n\
    tileUv.y = (u_cameraTileCoordinates.w == 0) ? fract(tileUv.y) : clamp(tileUv.y, 0.0, 1.0);\n\
#else\n\
    tileUv.y = clamp(tileUv.y, 0.0, 1.0);\n\
#endif\n\
    tileUv.z = clamp(tileUv.z, 0.0, 1.0);\n\
    return TileAndUvCoordinate(ivec4(tileCoordinate, u_cameraTileCoordinates.w), tileUv);\n\
}\n\
";
