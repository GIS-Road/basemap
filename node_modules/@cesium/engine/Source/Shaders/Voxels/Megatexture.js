//This file is automatically rebuilt by the Cesium build process.
export default "// See Octree.glsl for the definitions of SampleData\n\
\n\
/* Megatexture defines (set in Scene/VoxelRenderResources.js)\n\
#define SAMPLE_COUNT ###\n\
#define PADDING\n\
*/\n\
\n\
uniform ivec3 u_megatextureTileCounts; // number of tiles in the megatexture, along each axis\n\
\n\
vec3 index1DTo3DTexCoord(int index)\n\
{\n\
    int tilesPerZ = u_megatextureTileCounts.x * u_megatextureTileCounts.y;\n\
    int iz = index / tilesPerZ;\n\
    int remainder = index - iz * tilesPerZ;\n\
    int iy = remainder / u_megatextureTileCounts.x;\n\
    int ix = remainder - iy * u_megatextureTileCounts.x;\n\
    return vec3(ix, iy, iz) / vec3(u_megatextureTileCounts);\n\
}\n\
\n\
Properties getPropertiesFromMegatexture(in SampleData sampleData) {\n\
    int tileIndex = sampleData.megatextureIndex;\n\
\n\
    vec3 voxelCoord = sampleData.inputCoordinate;\n\
\n\
    // UV coordinate of the lower corner of the tile in the megatexture\n\
    vec3 tileUvOffset = index1DTo3DTexCoord(tileIndex);\n\
\n\
    // Voxel location\n\
    vec3 tileDimensions = vec3(u_inputDimensions);\n\
    vec3 clampedVoxelCoord = clamp(voxelCoord, vec3(0.5), tileDimensions - vec3(0.5));\n\
    vec3 voxelUv = clampedVoxelCoord / tileDimensions / vec3(u_megatextureTileCounts);\n\
\n\
    return getPropertiesFromMegatextureAtUv(tileUvOffset + voxelUv);\n\
}\n\
\n\
// Convert an array of sample datas to a final weighted properties.\n\
Properties accumulatePropertiesFromMegatexture(in SampleData sampleDatas[SAMPLE_COUNT]) {\n\
    #if (SAMPLE_COUNT == 1)\n\
        return getPropertiesFromMegatexture(sampleDatas[0]);\n\
    #else\n\
        // When more than one sample is taken the accumulator needs to start at 0\n\
        Properties properties = clearProperties();\n\
        for (int i = 0; i < SAMPLE_COUNT; ++i) {\n\
            float weight = sampleDatas[i].weight;\n\
\n\
            // Avoid reading the megatexture when the weight is 0 as it can be costly.\n\
            if (weight > 0.0) {\n\
                Properties tempProperties = getPropertiesFromMegatexture(sampleDatas[i]);\n\
                tempProperties = scaleProperties(tempProperties, weight);\n\
                properties = sumProperties(properties, tempProperties);\n\
            }\n\
        }\n\
        return properties;\n\
    #endif\n\
}\n\
";
