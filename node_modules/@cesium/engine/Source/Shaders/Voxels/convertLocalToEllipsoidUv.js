//This file is automatically rebuilt by the Cesium build process.
export default "/* Ellipsoid defines (set in Scene/VoxelEllipsoidShape.js)\n\
#define ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE\n\
#define ELLIPSOID_HAS_SHAPE_BOUNDS_LATITUDE\n\
*/\n\
\n\
uniform vec3 u_cameraPositionCartographic; // (longitude, latitude, height) in radians and meters\n\
uniform vec2 u_ellipsoidCurvatureAtLatitude;\n\
uniform mat3 u_ellipsoidEcToEastNorthUp;\n\
uniform vec3 u_ellipsoidRadii;\n\
uniform vec2 u_evoluteScale; // (radii.x ^ 2 - radii.z ^ 2) * vec2(1.0, -1.0) / radii;\n\
uniform vec3 u_ellipsoidInverseRadiiSquared;\n\
#if defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE)\n\
    uniform float u_ellipsoidShapeUvLongitudeRangeOrigin;\n\
#endif\n\
uniform vec3 u_ellipsoidLocalToShapeUvScale; // x = longitude scale, y = latitude scale, z = height scale\n\
\n\
uniform ivec4 u_cameraTileCoordinates;\n\
uniform vec3 u_cameraTileUv;\n\
\n\
// robust iterative solution without trig functions\n\
// https://github.com/0xfaded/ellipse_demo/issues/1\n\
// https://stackoverflow.com/questions/22959698/distance-from-given-point-to-given-ellipse\n\
// Extended to return radius of curvature along with the point\n\
vec3 nearestPointAndRadiusOnEllipse(vec2 pos, vec2 radii) {\n\
    vec2 p = abs(pos);\n\
    vec2 inverseRadii = 1.0 / radii;\n\
\n\
    // We describe the ellipse parametrically: v = radii * vec2(cos(t), sin(t))\n\
    // but store the cos and sin of t in a vec2 for efficiency.\n\
    // Initial guess: t = pi/4\n\
    vec2 tTrigs = vec2(0.7071067811865476);\n\
    // Initial guess of point on ellipsoid\n\
    vec2 v = radii * tTrigs;\n\
    // Center of curvature of the ellipse at v\n\
    vec2 evolute = u_evoluteScale * tTrigs * tTrigs * tTrigs;\n\
\n\
    const int iterations = 3;\n\
    for (int i = 0; i < iterations; ++i) {\n\
        // Find the (approximate) intersection of p - evolute with the ellipsoid.\n\
        vec2 q = normalize(p - evolute) * length(v - evolute);\n\
        // Update the estimate of t.\n\
        tTrigs = (q + evolute) * inverseRadii;\n\
        tTrigs = normalize(clamp(tTrigs, 0.0, 1.0));\n\
        v = radii * tTrigs;\n\
        evolute = u_evoluteScale * tTrigs * tTrigs * tTrigs;\n\
    }\n\
\n\
    return vec3(v * sign(pos), length(v - evolute));\n\
}\n\
\n\
mat3 convertLocalToShapeSpaceDerivative(in vec3 position) {\n\
    vec3 east = normalize(vec3(-position.y, position.x, 0.0));\n\
\n\
    // Convert the 3D position to a 2D position relative to the ellipse (radii.x, radii.z)\n\
    // (assume radii.y == radii.x) and find the nearest point on the ellipse and its normal\n\
    float distanceFromZAxis = length(position.xy);\n\
    vec2 posEllipse = vec2(distanceFromZAxis, position.z);\n\
    vec3 surfacePointAndRadius = nearestPointAndRadiusOnEllipse(posEllipse, u_ellipsoidRadii.xz);\n\
    vec2 surfacePoint = surfacePointAndRadius.xy;\n\
\n\
    vec2 normal2d = normalize(surfacePoint * u_ellipsoidInverseRadiiSquared.xz);\n\
    vec3 north = vec3(-normal2d.y * normalize(position.xy), abs(normal2d.x));\n\
\n\
    float heightSign = length(posEllipse) < length(surfacePoint) ? -1.0 : 1.0;\n\
    float height = heightSign * length(posEllipse - surfacePoint);\n\
    vec3 up = normalize(cross(east, north));\n\
\n\
    return mat3(east / distanceFromZAxis, north / (surfacePointAndRadius.z + height), up);\n\
}\n\
\n\
vec3 scaleShapeUvToShapeSpace(in vec3 shapeUv) {\n\
    // Convert from [0, 1] to radians [-pi, pi]\n\
    float longitude = shapeUv.x * czm_twoPi;\n\
    #if defined (ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE)\n\
        longitude /= u_ellipsoidLocalToShapeUvScale.x;\n\
    #endif\n\
\n\
    // Convert from [0, 1] to radians [-pi/2, pi/2]\n\
    float latitude = shapeUv.y * czm_pi;\n\
    #if defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LATITUDE)\n\
        latitude /= u_ellipsoidLocalToShapeUvScale.y;\n\
    #endif\n\
\n\
    float height = shapeUv.z / u_ellipsoidLocalToShapeUvScale.z;\n\
\n\
    return vec3(longitude, latitude, height);\n\
}\n\
\n\
vec3 convertEcToDeltaShape(in vec3 positionEC) {\n\
    vec3 enu = u_ellipsoidEcToEastNorthUp * positionEC;\n\
\n\
    // 1. Compute the change in longitude from the camera to the ENU point\n\
    // First project the camera and ENU positions to the equatorial XY plane,\n\
    // positioning the camera on the +x axis, so that enu.x projects along the +y axis\n\
    float cosLatitude = cos(u_cameraPositionCartographic.y);\n\
    float sinLatitude = sin(u_cameraPositionCartographic.y);\n\
    float primeVerticalRadius = 1.0 / u_ellipsoidCurvatureAtLatitude.x;\n\
    vec2 cameraXY = vec2((primeVerticalRadius + u_cameraPositionCartographic.z) * cosLatitude, 0.0);\n\
    // Note precision loss in positionXY.x if length(enu) << length(cameraXY)\n\
    vec2 positionXY = cameraXY + vec2(-enu.y * sinLatitude + enu.z * cosLatitude, enu.x);\n\
    float dLongitude = atan(positionXY.y, positionXY.x);\n\
\n\
    // 2. Find the longitude component of positionXY, by rotating about Z until the y component is zero.\n\
    // Use the versine  to compute the change in x directly from the change in angle:\n\
    //   versine(angle) = 2 * sin^2(angle/2)\n\
    float sinHalfLongitude = sin(dLongitude / 2.0);\n\
    float dx = length(positionXY) * 2.0 * sinHalfLongitude * sinHalfLongitude;\n\
    // Rotate longitude component back to ENU North and Up, and remove from enu\n\
    enu += vec3(-enu.x, -dx * sinLatitude, dx * cosLatitude);\n\
\n\
    // 3. Compute the change in latitude from the camera to the ENU point.\n\
    // First project the camera and ENU positions to the meridional ZX plane,\n\
    // positioning the camera on the +Z axis, so that enu.y maps to the +X axis.\n\
    float meridionalRadius = 1.0 / u_ellipsoidCurvatureAtLatitude.y;\n\
    vec2 cameraZX = vec2(meridionalRadius + u_cameraPositionCartographic.z, 0.0);\n\
    vec2 positionZX = cameraZX + vec2(enu.z, enu.y);\n\
    float dLatitude = atan(positionZX.y, positionZX.x);\n\
\n\
    // 4. Compute the change in height above the ellipsoid\n\
    // Find the change in enu.z associated with rotating the point to the latitude of the camera\n\
    float sinHalfLatitude = sin(dLatitude / 2.0);\n\
    float dz = length(positionZX) * 2.0 * sinHalfLatitude * sinHalfLatitude;\n\
    // The remaining change in enu.z is the change in height above the ellipsoid\n\
    float dHeight = enu.z + dz;\n\
\n\
    return vec3(dLongitude, dLatitude, dHeight);\n\
}\n\
\n\
vec3 convertEcToDeltaTile(in vec3 positionEC) {\n\
    vec3 deltaShape = convertEcToDeltaShape(positionEC);\n\
    // Convert to tileset coordinates in [0, 1]\n\
    float dx = deltaShape.x / czm_twoPi;\n\
\n\
#if (defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE))\n\
    // Wrap to ensure dx is not crossing through the unoccupied angle range, where\n\
    // angle to tile coordinate conversions would be more complicated\n\
    float cameraUvLongitude = (u_cameraPositionCartographic.x + czm_pi) / czm_twoPi;\n\
    float cameraUvLongitudeShift = fract(cameraUvLongitude - u_ellipsoidShapeUvLongitudeRangeOrigin);\n\
    float rawOutputUvLongitude = cameraUvLongitudeShift + dx;\n\
    float rotation = floor(rawOutputUvLongitude);\n\
    dx -= rotation;\n\
    dx *= u_ellipsoidLocalToShapeUvScale.x;\n\
#endif\n\
\n\
    float dy = deltaShape.y / czm_pi;\n\
#if (defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LATITUDE))\n\
    dy *= u_ellipsoidLocalToShapeUvScale.y;\n\
#endif\n\
\n\
    float dz = u_ellipsoidLocalToShapeUvScale.z * deltaShape.z;\n\
    // Convert to tile coordinate changes\n\
    return vec3(dx, dy, dz) * float(1 << u_cameraTileCoordinates.w);\n\
}\n\
\n\
TileAndUvCoordinate getTileAndUvCoordinate(in vec3 positionEC) {\n\
    vec3 deltaTileCoordinate = convertEcToDeltaTile(positionEC);\n\
    vec3 tileUvSum = u_cameraTileUv + deltaTileCoordinate;\n\
    ivec3 tileCoordinate = u_cameraTileCoordinates.xyz + ivec3(floor(tileUvSum));\n\
    int maxTileCoordinate = (1 << u_cameraTileCoordinates.w) - 1;\n\
    tileCoordinate.y = min(max(0, tileCoordinate.y), maxTileCoordinate);\n\
    tileCoordinate.z = min(max(0, tileCoordinate.z), maxTileCoordinate);\n\
#if (!defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE))\n\
    ivec3 tileCoordinateChange = tileCoordinate - u_cameraTileCoordinates.xyz;\n\
    if (tileCoordinate.x < 0) {\n\
        tileCoordinate.x += (maxTileCoordinate + 1);\n\
    } else if (tileCoordinate.x > maxTileCoordinate) {\n\
        tileCoordinate.x -= (maxTileCoordinate + 1);\n\
    }\n\
#else\n\
    tileCoordinate.x = min(max(0, tileCoordinate.x), maxTileCoordinate);\n\
    ivec3 tileCoordinateChange = tileCoordinate - u_cameraTileCoordinates.xyz;\n\
#endif\n\
    vec3 tileUv = tileUvSum - vec3(tileCoordinateChange);\n\
#if (!defined(ELLIPSOID_HAS_SHAPE_BOUNDS_LONGITUDE))\n\
    // If there is only one tile spanning 2*PI angle, the coordinate wraps around\n\
    tileUv.x = (u_cameraTileCoordinates.w == 0) ? fract(tileUv.x) : clamp(tileUv.x, 0.0, 1.0);\n\
#else\n\
    tileUv.x = clamp(tileUv.x, 0.0, 1.0);\n\
#endif\n\
    tileUv.y = clamp(tileUv.y, 0.0, 1.0);\n\
    tileUv.z = clamp(tileUv.z, 0.0, 1.0);\n\
    return TileAndUvCoordinate(ivec4(tileCoordinate, u_cameraTileCoordinates.w), tileUv);\n\
}\n\
";
