//This file is automatically rebuilt by the Cesium build process.
export default "// These octree flags must be in sync with GpuOctreeFlag in VoxelTraversal.js\n\
#define OCTREE_FLAG_INTERNAL 0\n\
#define OCTREE_FLAG_LEAF 1\n\
#define OCTREE_FLAG_PACKED_LEAF_FROM_PARENT 2\n\
\n\
#define OCTREE_MAX_LEVELS 32 // Harcoded value because GLSL doesn't like variable length loops\n\
\n\
uniform sampler2D u_octreeInternalNodeTexture;\n\
uniform vec2 u_octreeInternalNodeTexelSizeUv;\n\
uniform int u_octreeInternalNodeTilesPerRow;\n\
#if (SAMPLE_COUNT > 1)\n\
uniform sampler2D u_octreeLeafNodeTexture;\n\
uniform vec2 u_octreeLeafNodeTexelSizeUv;\n\
uniform int u_octreeLeafNodeTilesPerRow;\n\
#endif\n\
uniform ivec3 u_dimensions; // does not include padding, and is in the z-up orientation\n\
uniform ivec3 u_inputDimensions; // includes padding, and is in the orientation of the input data\n\
#if defined(PADDING)\n\
    uniform ivec3 u_paddingBefore;\n\
#endif\n\
\n\
struct OctreeNodeData {\n\
    int data;\n\
    int flag;\n\
};\n\
\n\
struct TraversalData {\n\
    ivec4 octreeCoords;\n\
    int parentOctreeIndex;\n\
};\n\
\n\
struct TileAndUvCoordinate {\n\
    ivec4 tileCoords;\n\
    vec3 tileUv;\n\
};\n\
\n\
struct SampleData {\n\
    int megatextureIndex;\n\
    ivec4 tileCoords;\n\
    vec3 tileUv;\n\
    vec3 inputCoordinate;\n\
    #if (SAMPLE_COUNT > 1)\n\
        float weight;\n\
    #endif\n\
};\n\
\n\
int normU8_toInt(in float value) {\n\
    return int(value * 255.0);\n\
}\n\
int normU8x2_toInt(in vec2 value) {\n\
    return int(value.x * 255.0) + 256 * int(value.y * 255.0);\n\
}\n\
float normU8x2_toFloat(in vec2 value) {\n\
    return float(normU8x2_toInt(value)) / 65535.0;\n\
}\n\
\n\
OctreeNodeData getOctreeNodeData(in vec2 octreeUv) {\n\
    vec4 texData = texture(u_octreeInternalNodeTexture, octreeUv);\n\
\n\
    OctreeNodeData data;\n\
    data.data = normU8x2_toInt(texData.xy);\n\
    data.flag = normU8x2_toInt(texData.zw);\n\
    return data;\n\
}\n\
\n\
OctreeNodeData getOctreeChildData(in int parentOctreeIndex, in ivec3 childCoord) {\n\
    int childIndex = childCoord.z * 4 + childCoord.y * 2 + childCoord.x;\n\
    int octreeCoordX = (parentOctreeIndex % u_octreeInternalNodeTilesPerRow) * 9 + 1 + childIndex;\n\
    int octreeCoordY = parentOctreeIndex / u_octreeInternalNodeTilesPerRow;\n\
    vec2 octreeUv = u_octreeInternalNodeTexelSizeUv * vec2(float(octreeCoordX) + 0.5, float(octreeCoordY) + 0.5);\n\
    return getOctreeNodeData(octreeUv);\n\
}\n\
\n\
int getOctreeParentIndex(in int octreeIndex) {\n\
    int octreeCoordX = (octreeIndex % u_octreeInternalNodeTilesPerRow) * 9;\n\
    int octreeCoordY = octreeIndex / u_octreeInternalNodeTilesPerRow;\n\
    vec2 octreeUv = u_octreeInternalNodeTexelSizeUv * vec2(float(octreeCoordX) + 0.5, float(octreeCoordY) + 0.5);\n\
    vec4 parentData = texture(u_octreeInternalNodeTexture, octreeUv);\n\
    int parentOctreeIndex = normU8x2_toInt(parentData.xy);\n\
    return parentOctreeIndex;\n\
}\n\
\n\
vec3 getTileUv(in TileAndUvCoordinate tileAndUv, in ivec4 octreeCoords) {\n\
    int levelDifference = tileAndUv.tileCoords.w - octreeCoords.w;\n\
    float scalar = exp2(-1.0 * float(levelDifference));\n\
    vec3 originShift = vec3(tileAndUv.tileCoords.xyz - (octreeCoords.xyz << levelDifference)) * scalar;\n\
    return tileAndUv.tileUv * scalar + originShift;\n\
}\n\
\n\
vec3 getClampedTileUv(in TileAndUvCoordinate tileAndUv, in ivec4 octreeCoords) {\n\
    vec3 tileUv = getTileUv(tileAndUv, octreeCoords);\n\
    return clamp(tileUv, vec3(0.0), vec3(1.0));\n\
}\n\
\n\
void addSampleCoordinates(in TileAndUvCoordinate tileAndUv, inout SampleData sampleData) {\n\
    vec3 tileUv = getClampedTileUv(tileAndUv, sampleData.tileCoords);\n\
\n\
    vec3 inputCoordinate = tileUv * vec3(u_dimensions);\n\
#if defined(PADDING)\n\
    inputCoordinate += vec3(u_paddingBefore);\n\
#endif\n\
#if defined(Y_UP_METADATA_ORDER)\n\
#if defined(SHAPE_BOX)\n\
    float inputY = inputCoordinate.y;\n\
    inputCoordinate.y = inputCoordinate.z;\n\
    // u_inputDimensions.z is the y-up dimension along the 3D Tiles y-axis.\n\
    inputCoordinate.z = float(u_inputDimensions.z) - inputY;\n\
#elif defined(SHAPE_CYLINDER)\n\
    float angle = inputCoordinate.y;\n\
    float height = inputCoordinate.z;\n\
    #if (!defined(CYLINDER_HAS_SHAPE_BOUNDS_ANGLE))\n\
    // Account for the different 0-angle convention in glTF vs 3DTiles\n\
    if (sampleData.tileCoords.w == 0) {\n\
        float angleCount = float(u_inputDimensions.z);\n\
        angle = mod(angle + angleCount / 2.0, angleCount);\n\
    }\n\
    #endif\n\
    inputCoordinate.y = height;\n\
    inputCoordinate.z = angle;\n\
#endif\n\
#endif\n\
\n\
    sampleData.tileUv = tileUv;\n\
    sampleData.inputCoordinate = inputCoordinate;\n\
}\n\
\n\
void getOctreeLeafSampleData(in OctreeNodeData data, in ivec4 octreeCoords, out SampleData sampleData) {\n\
    sampleData.megatextureIndex = data.data;\n\
    sampleData.tileCoords = (data.flag == OCTREE_FLAG_PACKED_LEAF_FROM_PARENT)\n\
        ? ivec4(octreeCoords.xyz / 2, octreeCoords.w - 1)\n\
        : octreeCoords;\n\
}\n\
\n\
#if (SAMPLE_COUNT > 1)\n\
void getOctreeLeafSampleDatas(in OctreeNodeData data, in ivec4 octreeCoords, out SampleData sampleDatas[SAMPLE_COUNT]) {\n\
    int leafIndex = data.data;\n\
    int leafNodeTexelCount = 2;\n\
    // Adding 0.5 moves to the center of the texel\n\
    float leafCoordXStart = float((leafIndex % u_octreeLeafNodeTilesPerRow) * leafNodeTexelCount) + 0.5;\n\
    float leafCoordY = float(leafIndex / u_octreeLeafNodeTilesPerRow) + 0.5;\n\
\n\
    // Get an interpolation weight and a flag to determine whether to read the parent texture\n\
    vec2 leafUv0 = u_octreeLeafNodeTexelSizeUv * vec2(leafCoordXStart + 0.0, leafCoordY);\n\
    vec4 leafData0 = texture(u_octreeLeafNodeTexture, leafUv0);\n\
    float lerp = normU8x2_toFloat(leafData0.xy);\n\
    sampleDatas[0].weight = 1.0 - lerp;\n\
    sampleDatas[1].weight = lerp;\n\
    // TODO: this looks wrong? Should be comparing to OCTREE_FLAG_PACKED_LEAF_FROM_PARENT\n\
    sampleDatas[0].tileCoords = (normU8_toInt(leafData0.z) == 1)\n\
        ? ivec4(octreeCoords.xyz / 2, octreeCoords.w - 1)\n\
        : octreeCoords;\n\
    sampleDatas[1].tileCoords = (normU8_toInt(leafData0.w) == 1)\n\
        ? ivec4(octreeCoords.xyz / 2, octreeCoords.w - 1)\n\
        : octreeCoords;\n\
\n\
    // Get megatexture indices for both samples\n\
    vec2 leafUv1 = u_octreeLeafNodeTexelSizeUv * vec2(leafCoordXStart + 1.0, leafCoordY);\n\
    vec4 leafData1 = texture(u_octreeLeafNodeTexture, leafUv1);\n\
    sampleDatas[0].megatextureIndex = normU8x2_toInt(leafData1.xy);\n\
    sampleDatas[1].megatextureIndex = normU8x2_toInt(leafData1.zw);\n\
}\n\
#endif\n\
\n\
OctreeNodeData traverseOctreeDownwards(in ivec4 tileCoordinate, inout TraversalData traversalData) {\n\
    OctreeNodeData childData;\n\
\n\
    for (int i = 0; i < OCTREE_MAX_LEVELS; ++i) {\n\
        // tileCoordinate.xyz is defined at the level of detail tileCoordinate.w.\n\
        // Find the corresponding coordinate at the level traversalData.octreeCoords.w\n\
        int level = traversalData.octreeCoords.w + 1;\n\
        int levelDifference = tileCoordinate.w - level;\n\
        ivec3 coordinateAtLevel = tileCoordinate.xyz >> levelDifference;\n\
        traversalData.octreeCoords = ivec4(coordinateAtLevel, level);\n\
\n\
        ivec3 childCoordinate = coordinateAtLevel & 1;\n\
        childData = getOctreeChildData(traversalData.parentOctreeIndex, childCoordinate);\n\
\n\
        if (childData.flag != OCTREE_FLAG_INTERNAL) {\n\
            // leaf tile - stop traversing\n\
            break;\n\
        }\n\
\n\
        traversalData.parentOctreeIndex = childData.data;\n\
    }\n\
\n\
    return childData;\n\
}\n\
\n\
/**\n\
* Transform a given position to an octree tile coordinate and a position within that tile,\n\
* and find the corresponding megatexture index and texture coordinates\n\
*/\n\
void traverseOctreeFromBeginning(in TileAndUvCoordinate tileAndUv, out TraversalData traversalData, out SampleData sampleDatas[SAMPLE_COUNT]) {\n\
    traversalData.octreeCoords = ivec4(0);\n\
    traversalData.parentOctreeIndex = 0;\n\
\n\
    OctreeNodeData nodeData = getOctreeNodeData(vec2(0.0));\n\
    if (nodeData.flag != OCTREE_FLAG_LEAF) {\n\
        nodeData = traverseOctreeDownwards(tileAndUv.tileCoords, traversalData);\n\
    }\n\
\n\
    #if (SAMPLE_COUNT == 1)\n\
        getOctreeLeafSampleData(nodeData, traversalData.octreeCoords, sampleDatas[0]);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[0]);\n\
    #else\n\
        getOctreeLeafSampleDatas(nodeData, traversalData.octreeCoords, sampleDatas);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[0]);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[1]);\n\
    #endif\n\
}\n\
\n\
bool insideTile(in ivec4 tileCoordinate, in ivec4 octreeCoords) {\n\
    int levelDifference = tileCoordinate.w - octreeCoords.w;\n\
    if (levelDifference < 0) {\n\
        return false;\n\
    }\n\
    ivec3 coordinateAtLevel = tileCoordinate.xyz >> levelDifference;\n\
    return coordinateAtLevel == octreeCoords.xyz;\n\
}\n\
\n\
void traverseOctreeFromExisting(in TileAndUvCoordinate tileAndUv, inout TraversalData traversalData, inout SampleData sampleDatas[SAMPLE_COUNT]) {\n\
    ivec4 tileCoords = tileAndUv.tileCoords;\n\
    if (insideTile(tileCoords, traversalData.octreeCoords)) {\n\
        for (int i = 0; i < SAMPLE_COUNT; i++) {\n\
            addSampleCoordinates(tileAndUv, sampleDatas[i]);\n\
        }\n\
        return;\n\
    }\n\
\n\
    // Go up tree until we find a parent tile containing tileCoords.\n\
    // Assumes all parents are available all they way up to the root.\n\
    for (int i = 0; i < OCTREE_MAX_LEVELS; ++i) {\n\
        traversalData.octreeCoords.xyz /= 2;\n\
        traversalData.octreeCoords.w -= 1;\n\
\n\
        if (insideTile(tileCoords, traversalData.octreeCoords)) {\n\
            break;\n\
        }\n\
\n\
        traversalData.parentOctreeIndex = getOctreeParentIndex(traversalData.parentOctreeIndex);\n\
    }\n\
\n\
    // Go down tree\n\
    OctreeNodeData nodeData = traverseOctreeDownwards(tileCoords, traversalData);\n\
\n\
    #if (SAMPLE_COUNT == 1)\n\
        getOctreeLeafSampleData(nodeData, traversalData.octreeCoords, sampleDatas[0]);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[0]);\n\
    #else\n\
        getOctreeLeafSampleDatas(nodeData, traversalData.octreeCoords, sampleDatas);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[0]);\n\
        addSampleCoordinates(tileAndUv, sampleDatas[1]);\n\
    #endif\n\
}\n\
";
