//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_boxLocalToShapeUvScale;\n\
\n\
uniform ivec4 u_cameraTileCoordinates;\n\
uniform vec3 u_cameraTileUv;\n\
uniform mat3 u_boxEcToXyz;\n\
\n\
mat3 convertLocalToShapeSpaceDerivative(in vec3 positionLocal) {\n\
    // For BOX, local space = shape space, so the Jacobian is the identity matrix.\n\
    return mat3(1.0);\n\
}\n\
\n\
vec3 scaleShapeUvToShapeSpace(in vec3 shapeUv) {\n\
    return shapeUv / u_boxLocalToShapeUvScale;\n\
}\n\
\n\
vec3 convertEcToDeltaTile(in vec3 positionEC) {\n\
    vec3 dPosition = u_boxEcToXyz * positionEC;\n\
    return u_boxLocalToShapeUvScale * dPosition * float(1 << u_cameraTileCoordinates.w);\n\
}\n\
\n\
TileAndUvCoordinate getTileAndUvCoordinate(in vec3 positionEC) {\n\
    vec3 deltaTileCoordinate = convertEcToDeltaTile(positionEC);\n\
    vec3 tileUvSum = u_cameraTileUv + deltaTileCoordinate;\n\
    ivec3 tileCoordinate = u_cameraTileCoordinates.xyz + ivec3(floor(tileUvSum));\n\
    tileCoordinate = min(max(ivec3(0), tileCoordinate), ivec3((1 << u_cameraTileCoordinates.w) - 1));\n\
    ivec3 tileCoordinateChange = tileCoordinate - u_cameraTileCoordinates.xyz;\n\
    vec3 tileUv = clamp(tileUvSum - vec3(tileCoordinateChange), 0.0, 1.0);\n\
    return TileAndUvCoordinate(ivec4(tileCoordinate, u_cameraTileCoordinates.w), tileUv);\n\
}\n\
";
