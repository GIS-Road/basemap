//This file is automatically rebuilt by the Cesium build process.
export default "in vec2 v_textureCoordinates;\n\
\n\
uniform int u_polygonsLength;\n\
uniform int u_extentsLength;\n\
uniform highp sampler2D u_polygonTexture;\n\
uniform highp sampler2D u_extentsTexture;\n\
\n\
int getPolygonIndex(float dimension, vec2 coord) {\n\
   vec2 uv = coord.xy * dimension;\n\
   return int(floor(uv.y) * dimension + floor(uv.x));\n\
}\n\
\n\
vec2 getLookupUv(ivec2 dimensions, int i) {\n\
    int pixY = i / dimensions.x;\n\
    int pixX = i - (pixY * dimensions.x);\n\
    float pixelWidth = 1.0 / float(dimensions.x);\n\
    float pixelHeight = 1.0 / float(dimensions.y);\n\
    float u = (float(pixX) + 0.5) * pixelWidth; // sample from center of pixel\n\
    float v = (float(pixY) + 0.5) * pixelHeight;\n\
    return vec2(u, v);\n\
}\n\
\n\
vec4 getExtents(int i) {\n\
    return texture(u_extentsTexture, getLookupUv(textureSize(u_extentsTexture, 0), i));\n\
}\n\
\n\
ivec2 getPositionsLengthAndExtentsIndex(int i) {\n\
    vec2 uv = getLookupUv(textureSize(u_polygonTexture, 0), i);\n\
    vec4 value = texture(u_polygonTexture, uv);\n\
    return ivec2(int(value.x), int(value.y));\n\
}\n\
\n\
vec2 getPolygonPosition(int i) {\n\
    vec2 uv = getLookupUv(textureSize(u_polygonTexture, 0), i);\n\
    return texture(u_polygonTexture, uv).xy;\n\
}\n\
\n\
vec2 getCoordinates(vec2 textureCoordinates, vec4 extents) {\n\
    float latitude = mix(extents.x, extents.x + 1.0 / extents.z, textureCoordinates.y);\n\
    float longitude = mix(extents.y, extents.y + 1.0 / extents.w, textureCoordinates.x);\n\
    return vec2(latitude, longitude);\n\
}\n\
\n\
void main() {\n\
    int lastPolygonIndex = 0;\n\
    out_FragColor = vec4(1.0);\n\
\n\
    // Get the relevant region of the texture\n\
    float dimension = float(u_extentsLength);\n\
    if (u_extentsLength > 2) {\n\
        dimension = ceil(log2(float(u_extentsLength)));\n\
    }\n\
    int regionIndex = getPolygonIndex(dimension, v_textureCoordinates);\n\
\n\
    if (regionIndex >= u_extentsLength) {\n\
        return; // done (no polygons in this region)\n\
    }\n\
\n\
    for (int polygonIndex = 0; polygonIndex < u_polygonsLength; polygonIndex++) {\n\
        ivec2 positionsLengthAndExtents = getPositionsLengthAndExtentsIndex(lastPolygonIndex);\n\
        int positionsLength = positionsLengthAndExtents.x;\n\
        int polygonExtentsIndex = positionsLengthAndExtents.y;\n\
        lastPolygonIndex += 1;\n\
\n\
        // Read the individual polygon extent (2 pixels: south/west, latRange/lonRange)\n\
        vec2 extentsSouthWest = getPolygonPosition(lastPolygonIndex);\n\
        vec2 extentsRange = getPolygonPosition(lastPolygonIndex + 1);\n\
        vec4 polygonExtent = vec4(extentsSouthWest, extentsRange);\n\
        lastPolygonIndex += 2;\n\
\n\
        if (polygonExtentsIndex < regionIndex) {\n\
            lastPolygonIndex += positionsLength;\n\
            continue; // skip to next (TODO: could optimize further if we knew how many polygons to skip)\n\
        } else if (polygonExtentsIndex > regionIndex) {\n\
            break; // done (we know polygons are sorted by regionIndex)\n\
        }\n\
\n\
         // Only compute signed distance for the relevant part of the atlas\n\
        float clipAmount = czm_infinity;\n\
        vec4 extents = getExtents(polygonExtentsIndex);\n\
        vec2 textureOffset = vec2(mod(float(polygonExtentsIndex), dimension), floor(float(polygonExtentsIndex) / dimension)) / dimension;\n\
        vec2 p = getCoordinates((v_textureCoordinates - textureOffset) * dimension, extents);   // current pixel position\n\
\n\
        // Only consider polygons whos boundingbox includes current pixel (with a slight padding)\n\
        float padding = 0.05;   // 5% of polygon extents\n\
        float polygonNorth = polygonExtent.x + polygonExtent.z;\n\
        float polygonEast = polygonExtent.y + polygonExtent.w;\n\
        float latPadding = padding * polygonExtent.z; // padding as fraction of latitude range\n\
        float lonPadding = padding * polygonExtent.w; // padding as fraction of longitude range\n\
        if (p.x < polygonExtent.x - latPadding || p.x > polygonNorth + latPadding ||\n\
            p.y < polygonExtent.y - lonPadding || p.y > polygonEast + lonPadding) {\n\
            lastPolygonIndex += positionsLength;\n\
            continue;   // skip to next\n\
        }\n\
\n\
        float s = 1.0;\n\
\n\
        // Check each edge for absolute distance.\n\
        // Cache the previous vertex to halve the texture reads per iteration.\n\
        vec2 prev = getPolygonPosition(lastPolygonIndex + positionsLength - 1);\n\
        for (int i = 0; i < positionsLength; i++) {\n\
            vec2 a = getPolygonPosition(lastPolygonIndex + i);\n\
            vec2 b = prev;\n\
            prev = a;\n\
\n\
            vec2 ab = b - a;\n\
            vec2 pa = p - a;\n\
            float t = dot(pa, ab) / dot(ab, ab);\n\
            t = clamp(t, 0.0, 1.0);\n\
\n\
            vec2 pq = pa - t * ab;\n\
            float d = length(pq);\n\
\n\
            // Inside / outside computation to determine sign\n\
            bvec3 cond = bvec3(p.y >= a.y, \n\
                        p.y < b.y, \n\
                        ab.x * pa.y > ab.y * pa.x);\n\
            if (all(cond) || all(not(cond))) s = -s;\n\
            if (abs(d) < abs(clipAmount)) {\n\
                clipAmount = d;\n\
            }\n\
        }\n\
\n\
        // Normalize the range to [0,1]\n\
        vec4 result = (s * vec4(clipAmount * length(extents.zw))) / 2.0 + 0.5;\n\
        // In the case where we've iterated through multiple polygons, take the minimum\n\
        out_FragColor = min(out_FragColor, result);\n\
\n\
        lastPolygonIndex += positionsLength;\n\
    }\n\
}";
