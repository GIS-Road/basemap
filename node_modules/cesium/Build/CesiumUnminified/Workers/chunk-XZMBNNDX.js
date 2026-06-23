/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.142.0
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  Intersect_default
} from "./chunk-C6J67V5A.js";
import {
  Rectangle_default
} from "./chunk-MYP774IS.js";
import {
  Matrix4_default
} from "./chunk-Q3PY526V.js";
import {
  Cartographic_default,
  Ellipsoid_default
} from "./chunk-V7VQKN6N.js";
import {
  Cartesian3_default,
  Matrix3_default
} from "./chunk-MPZHGZU6.js";
import {
  Math_default
} from "./chunk-J6BWOHUF.js";
import {
  Check_default,
  DeveloperError_default
} from "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Core/GeographicProjection.js
var GeographicProjection = class {
  /**
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid.
   */
  constructor(ellipsoid) {
    this._ellipsoid = ellipsoid ?? Ellipsoid_default.default;
    this._semimajorAxis = this._ellipsoid.maximumRadius;
    this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
  }
  /**
   * Gets the {@link Ellipsoid}.
   *
   * @type {Ellipsoid}
   * @readonly
   */
  get ellipsoid() {
    return this._ellipsoid;
  }
  /**
   * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
   * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
   * ellipsoid.  Z is the unmodified height.
   *
   * @param {Cartographic} cartographic The coordinates to project.
   * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
   *        undefined, a new instance is created and returned.
   * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
   *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
   *          created and returned.
   */
  project(cartographic, result) {
    const semimajorAxis = this._semimajorAxis;
    const x = cartographic.longitude * semimajorAxis;
    const y = cartographic.latitude * semimajorAxis;
    const z = cartographic.height;
    if (!defined_default(result)) {
      return new Cartesian3_default(x, y, z);
    }
    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  }
  /**
   * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
   * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
   * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
   *
   * @param {Cartesian3} cartesian The Cartesian position to unproject with height (z) in meters.
   * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
   *        undefined, a new instance is created and returned.
   * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
   *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
   *          created and returned.
   */
  unproject(cartesian, result) {
    if (!defined_default(cartesian)) {
      throw new DeveloperError_default("cartesian is required");
    }
    const oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
    const longitude = cartesian.x * oneOverEarthSemimajorAxis;
    const latitude = cartesian.y * oneOverEarthSemimajorAxis;
    const height = cartesian.z;
    if (!defined_default(result)) {
      return new Cartographic_default(longitude, latitude, height);
    }
    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  }
};
var GeographicProjection_default = GeographicProjection;

// packages/engine/Source/Core/Interval.js
function Interval(start, stop) {
  this.start = start ?? 0;
  this.stop = stop ?? 0;
}
var Interval_default = Interval;

// packages/engine/Source/Core/BoundingSphere.js
var BoundingSphere = class _BoundingSphere {
  /**
   * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the bounding sphere.
   * @param {number} [radius=0.0] The radius of the bounding sphere.
   */
  constructor(center, radius) {
    this.center = Cartesian3_default.clone(center ?? Cartesian3_default.ZERO);
    this.radius = radius ?? 0;
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing a list of 3D Cartesian points.
   * The bounding sphere is computed by running two algorithms, a naive algorithm and
   * Ritter's algorithm. The smaller of the two spheres is used to ensure a tight fit.
   *
   * @param {Cartesian3[]} [positions] An array of points that the bounding sphere will enclose.  Each point must have <code>x</code>, <code>y</code>, and <code>z</code> properties.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @see {@link http://help.agi.com/AGIComponents/html/BlogBoundingSphere.htm|Bounding Sphere computation article}
   */
  static fromPoints(positions, result) {
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(positions) || positions.length === 0) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    const currentPos = Cartesian3_default.clone(positions[0], fromPointsCurrentPos);
    const xMin = Cartesian3_default.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3_default.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3_default.clone(currentPos, fromPointsZMin);
    const xMax = Cartesian3_default.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3_default.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3_default.clone(currentPos, fromPointsZMax);
    const numPositions = positions.length;
    let i;
    for (i = 1; i < numPositions; i++) {
      Cartesian3_default.clone(positions[i], currentPos);
      const x = currentPos.x;
      const y = currentPos.y;
      const z = currentPos.z;
      if (x < xMin.x) {
        Cartesian3_default.clone(currentPos, xMin);
      }
      if (x > xMax.x) {
        Cartesian3_default.clone(currentPos, xMax);
      }
      if (y < yMin.y) {
        Cartesian3_default.clone(currentPos, yMin);
      }
      if (y > yMax.y) {
        Cartesian3_default.clone(currentPos, yMax);
      }
      if (z < zMin.z) {
        Cartesian3_default.clone(currentPos, zMin);
      }
      if (z > zMax.z) {
        Cartesian3_default.clone(currentPos, zMax);
      }
    }
    const xSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(zMax, zMin, fromPointsScratch)
    );
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;
    let radiusSquared = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;
    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;
    const naiveCenter = Cartesian3_default.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );
    let naiveRadius = 0;
    for (i = 0; i < numPositions; i++) {
      Cartesian3_default.clone(positions[i], currentPos);
      const r = Cartesian3_default.magnitude(
        Cartesian3_default.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }
      const oldCenterToPointSquared = Cartesian3_default.magnitudeSquared(
        Cartesian3_default.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
        ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
        ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
      }
    }
    if (ritterRadius < naiveRadius) {
      Cartesian3_default.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3_default.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }
    return result;
  }
  /**
   * Computes a bounding sphere from a rectangle projected in 2D.
   *
   * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
   * @param {MapProjection} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromRectangle2D(rectangle, projection, result) {
    return _BoundingSphere.fromRectangleWithHeights2D(
      rectangle,
      projection,
      0,
      0,
      result
    );
  }
  /**
   * Computes a bounding sphere from a rectangle projected in 2D.  The bounding sphere accounts for the
   * object's minimum and maximum heights over the rectangle.
   *
   * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
   * @param {MapProjection} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
   * @param {number} [minimumHeight=0.0] The minimum height over the rectangle.
   * @param {number} [maximumHeight=0.0] The maximum height over the rectangle.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromRectangleWithHeights2D(rectangle, projection, minimumHeight, maximumHeight, result) {
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(rectangle)) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    defaultProjection._ellipsoid = Ellipsoid_default.default;
    projection = projection ?? defaultProjection;
    Rectangle_default.southwest(rectangle, fromRectangle2DSouthwest);
    fromRectangle2DSouthwest.height = minimumHeight;
    Rectangle_default.northeast(rectangle, fromRectangle2DNortheast);
    fromRectangle2DNortheast.height = maximumHeight;
    const lowerLeft = projection.project(
      fromRectangle2DSouthwest,
      fromRectangle2DLowerLeft
    );
    const upperRight = projection.project(
      fromRectangle2DNortheast,
      fromRectangle2DUpperRight
    );
    const width = upperRight.x - lowerLeft.x;
    const height = upperRight.y - lowerLeft.y;
    const elevation = upperRight.z - lowerLeft.z;
    result.radius = Math.sqrt(width * width + height * height + elevation * elevation) * 0.5;
    const center = result.center;
    center.x = lowerLeft.x + width * 0.5;
    center.y = lowerLeft.y + height * 0.5;
    center.z = lowerLeft.z + elevation * 0.5;
    return result;
  }
  /**
   * Computes a bounding sphere from a rectangle in 3D. The bounding sphere is created using a subsample of points
   * on the ellipsoid and contained in the rectangle. It may not be accurate for all rectangles on all types of ellipsoids.
   *
   * @param {Rectangle} [rectangle] The valid rectangle used to create a bounding sphere.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid used to determine positions of the rectangle.
   * @param {number} [surfaceHeight=0.0] The height above the surface of the ellipsoid.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromRectangle3D(rectangle, ellipsoid, surfaceHeight, result) {
    ellipsoid = ellipsoid ?? Ellipsoid_default.default;
    surfaceHeight = surfaceHeight ?? 0;
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(rectangle)) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    const positions = Rectangle_default.subsample(
      rectangle,
      ellipsoid,
      surfaceHeight,
      fromRectangle3DScratch
    );
    return _BoundingSphere.fromPoints(positions, result);
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing a list of 3D points, where the points are
   * stored in a flat array in X, Y, Z, order.  The bounding sphere is computed by running two
   * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
   * ensure a tight fit.
   *
   * @param {number[]|TypedArray} [positions] An array of points that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {Cartesian3} [center=Cartesian3.ZERO] The position to which the positions are relative, which need not be the
   *        origin of the coordinate system.  This is useful when the positions are to be used for
   *        relative-to-center (RTC) rendering.
   * @param {number} [stride=3] The number of array elements per vertex.  It must be at least 3, but it may
   *        be higher.  Regardless of the value of this parameter, the X coordinate of the first position
   *        is at array index 0, the Y coordinate is at array index 1, and the Z coordinate is at array index
   *        2.  When stride is 3, the X coordinate of the next position then begins at array index 3.  If
   *        the stride is 5, however, two array elements are skipped and the next position begins at array
   *        index 5.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @example
   * // Compute the bounding sphere from 3 positions, each specified relative to a center.
   * // In addition to the X, Y, and Z coordinates, the points array contains two additional
   * // elements per point which are ignored for the purpose of computing the bounding sphere.
   * const center = new Cesium.Cartesian3(1.0, 2.0, 3.0);
   * const points = [1.0, 2.0, 3.0, 0.1, 0.2,
   *               4.0, 5.0, 6.0, 0.1, 0.2,
   *               7.0, 8.0, 9.0, 0.1, 0.2];
   * const sphere = Cesium.BoundingSphere.fromVertices(points, center, 5);
   *
   * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
   */
  static fromVertices(positions, center, stride, result) {
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(positions) || positions.length === 0) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    center = center ?? Cartesian3_default.ZERO;
    stride = stride ?? 3;
    Check_default.typeOf.number.greaterThanOrEquals("stride", stride, 3);
    const currentPos = fromPointsCurrentPos;
    currentPos.x = positions[0] + center.x;
    currentPos.y = positions[1] + center.y;
    currentPos.z = positions[2] + center.z;
    const xMin = Cartesian3_default.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3_default.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3_default.clone(currentPos, fromPointsZMin);
    const xMax = Cartesian3_default.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3_default.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3_default.clone(currentPos, fromPointsZMax);
    const numElements = positions.length;
    let i;
    for (i = 0; i < numElements; i += stride) {
      const x = positions[i] + center.x;
      const y = positions[i + 1] + center.y;
      const z = positions[i + 2] + center.z;
      currentPos.x = x;
      currentPos.y = y;
      currentPos.z = z;
      if (x < xMin.x) {
        Cartesian3_default.clone(currentPos, xMin);
      }
      if (x > xMax.x) {
        Cartesian3_default.clone(currentPos, xMax);
      }
      if (y < yMin.y) {
        Cartesian3_default.clone(currentPos, yMin);
      }
      if (y > yMax.y) {
        Cartesian3_default.clone(currentPos, yMax);
      }
      if (z < zMin.z) {
        Cartesian3_default.clone(currentPos, zMin);
      }
      if (z > zMax.z) {
        Cartesian3_default.clone(currentPos, zMax);
      }
    }
    const xSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(zMax, zMin, fromPointsScratch)
    );
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;
    let radiusSquared = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;
    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;
    const naiveCenter = Cartesian3_default.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );
    let naiveRadius = 0;
    for (i = 0; i < numElements; i += stride) {
      currentPos.x = positions[i] + center.x;
      currentPos.y = positions[i + 1] + center.y;
      currentPos.z = positions[i + 2] + center.z;
      const r = Cartesian3_default.magnitude(
        Cartesian3_default.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }
      const oldCenterToPointSquared = Cartesian3_default.magnitudeSquared(
        Cartesian3_default.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
        ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
        ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
      }
    }
    if (ritterRadius < naiveRadius) {
      Cartesian3_default.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3_default.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }
    return result;
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing a list of EncodedCartesian3s, where the points are
   * stored in parallel flat arrays in X, Y, Z, order.  The bounding sphere is computed by running two
   * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
   * ensure a tight fit.
   *
   * @param {number[]} [positionsHigh] An array of high bits of the encoded cartesians that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {number[]} [positionsLow] An array of low bits of the encoded cartesians that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
   */
  static fromEncodedCartesianVertices(positionsHigh, positionsLow, result) {
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(positionsHigh) || !defined_default(positionsLow) || positionsHigh.length !== positionsLow.length || positionsHigh.length === 0) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    const currentPos = fromPointsCurrentPos;
    currentPos.x = positionsHigh[0] + positionsLow[0];
    currentPos.y = positionsHigh[1] + positionsLow[1];
    currentPos.z = positionsHigh[2] + positionsLow[2];
    const xMin = Cartesian3_default.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3_default.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3_default.clone(currentPos, fromPointsZMin);
    const xMax = Cartesian3_default.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3_default.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3_default.clone(currentPos, fromPointsZMax);
    const numElements = positionsHigh.length;
    let i;
    for (i = 0; i < numElements; i += 3) {
      const x = positionsHigh[i] + positionsLow[i];
      const y = positionsHigh[i + 1] + positionsLow[i + 1];
      const z = positionsHigh[i + 2] + positionsLow[i + 2];
      currentPos.x = x;
      currentPos.y = y;
      currentPos.z = z;
      if (x < xMin.x) {
        Cartesian3_default.clone(currentPos, xMin);
      }
      if (x > xMax.x) {
        Cartesian3_default.clone(currentPos, xMax);
      }
      if (y < yMin.y) {
        Cartesian3_default.clone(currentPos, yMin);
      }
      if (y > yMax.y) {
        Cartesian3_default.clone(currentPos, yMax);
      }
      if (z < zMin.z) {
        Cartesian3_default.clone(currentPos, zMin);
      }
      if (z > zMax.z) {
        Cartesian3_default.clone(currentPos, zMax);
      }
    }
    const xSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(zMax, zMin, fromPointsScratch)
    );
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;
    let radiusSquared = Cartesian3_default.magnitudeSquared(
      Cartesian3_default.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;
    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;
    const naiveCenter = Cartesian3_default.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );
    let naiveRadius = 0;
    for (i = 0; i < numElements; i += 3) {
      currentPos.x = positionsHigh[i] + positionsLow[i];
      currentPos.y = positionsHigh[i + 1] + positionsLow[i + 1];
      currentPos.z = positionsHigh[i + 2] + positionsLow[i + 2];
      const r = Cartesian3_default.magnitude(
        Cartesian3_default.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }
      const oldCenterToPointSquared = Cartesian3_default.magnitudeSquared(
        Cartesian3_default.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
        ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
        ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
      }
    }
    if (ritterRadius < naiveRadius) {
      Cartesian3_default.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3_default.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }
    return result;
  }
  /**
   * Computes a bounding sphere from the corner points of an axis-aligned bounding box.  The sphere
   * tightly and fully encompasses the box.
   *
   * @param {Cartesian3} [corner] The minimum height over the rectangle.
   * @param {Cartesian3} [oppositeCorner] The maximum height over the rectangle.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * // Create a bounding sphere around the unit cube
   * const sphere = Cesium.BoundingSphere.fromCornerPoints(new Cesium.Cartesian3(-0.5, -0.5, -0.5), new Cesium.Cartesian3(0.5, 0.5, 0.5));
   */
  static fromCornerPoints(corner, oppositeCorner, result) {
    Check_default.typeOf.object("corner", corner);
    Check_default.typeOf.object("oppositeCorner", oppositeCorner);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    const center = Cartesian3_default.midpoint(corner, oppositeCorner, result.center);
    result.radius = Cartesian3_default.distance(center, oppositeCorner);
    return result;
  }
  /**
   * Creates a bounding sphere encompassing an ellipsoid.
   *
   * @param {Ellipsoid} ellipsoid The ellipsoid around which to create a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * const boundingSphere = Cesium.BoundingSphere.fromEllipsoid(ellipsoid);
   */
  static fromEllipsoid(ellipsoid, result) {
    Check_default.typeOf.object("ellipsoid", ellipsoid);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
    result.radius = ellipsoid.maximumRadius;
    return result;
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing the provided array of bounding spheres.
   *
   * @param {BoundingSphere[]} [boundingSpheres] The array of bounding spheres.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromBoundingSpheres(boundingSpheres, result) {
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    if (!defined_default(boundingSpheres) || boundingSpheres.length === 0) {
      result.center = Cartesian3_default.clone(Cartesian3_default.ZERO, result.center);
      result.radius = 0;
      return result;
    }
    const length = boundingSpheres.length;
    if (length === 1) {
      return _BoundingSphere.clone(boundingSpheres[0], result);
    }
    if (length === 2) {
      return _BoundingSphere.union(
        boundingSpheres[0],
        boundingSpheres[1],
        result
      );
    }
    const positions = [];
    let i;
    for (i = 0; i < length; i++) {
      positions.push(boundingSpheres[i].center);
    }
    result = _BoundingSphere.fromPoints(positions, result);
    const center = result.center;
    let radius = result.radius;
    for (i = 0; i < length; i++) {
      const tmp = boundingSpheres[i];
      radius = Math.max(
        radius,
        Cartesian3_default.distance(center, tmp.center) + tmp.radius
      );
    }
    result.radius = radius;
    return result;
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing the provided oriented bounding box.
   *
   * @param {OrientedBoundingBox} orientedBoundingBox The oriented bounding box.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromOrientedBoundingBox(orientedBoundingBox, result) {
    Check_default.defined("orientedBoundingBox", orientedBoundingBox);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    const halfAxes = orientedBoundingBox.halfAxes;
    const u = Matrix3_default.getColumn(halfAxes, 0, fromOrientedBoundingBoxScratchU);
    const v = Matrix3_default.getColumn(halfAxes, 1, fromOrientedBoundingBoxScratchV);
    const w = Matrix3_default.getColumn(halfAxes, 2, fromOrientedBoundingBoxScratchW);
    Cartesian3_default.add(u, v, u);
    Cartesian3_default.add(u, w, u);
    result.center = Cartesian3_default.clone(orientedBoundingBox.center, result.center);
    result.radius = Cartesian3_default.magnitude(u);
    return result;
  }
  /**
   * Computes a tight-fitting bounding sphere enclosing the provided affine transformation.
   *
   * @param {Matrix4} transformation The affine transformation.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static fromTransformation(transformation, result) {
    Check_default.typeOf.object("transformation", transformation);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    const center = Matrix4_default.getTranslation(
      transformation,
      scratchFromTransformationCenter
    );
    const scale = Matrix4_default.getScale(
      transformation,
      scratchFromTransformationScale
    );
    const radius = 0.5 * Cartesian3_default.magnitude(scale);
    result.center = Cartesian3_default.clone(center, result.center);
    result.radius = radius;
    return result;
  }
  /**
   * Duplicates a BoundingSphere instance.
   *
   * @param {BoundingSphere} sphere The bounding sphere to duplicate.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided. (Returns undefined if sphere is undefined)
   */
  static clone(sphere, result) {
    if (!defined_default(sphere)) {
      return void 0;
    }
    if (!defined_default(result)) {
      return new _BoundingSphere(sphere.center, sphere.radius);
    }
    result.center = Cartesian3_default.clone(sphere.center, result.center);
    result.radius = sphere.radius;
    return result;
  }
  /**
   * Stores the provided instance into the provided array.
   *
   * @param {BoundingSphere} value The value to pack.
   * @param {number[]} array The array to pack into.
   * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {number[]} The array that was packed into
   */
  static pack(value, array, startingIndex) {
    Check_default.typeOf.object("value", value);
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    const center = value.center;
    array[startingIndex++] = center.x;
    array[startingIndex++] = center.y;
    array[startingIndex++] = center.z;
    array[startingIndex] = value.radius;
    return array;
  }
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {number[]} array The packed array.
   * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {BoundingSphere} [result] The object into which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   */
  static unpack(array, startingIndex, result) {
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    const center = result.center;
    center.x = array[startingIndex++];
    center.y = array[startingIndex++];
    center.z = array[startingIndex++];
    result.radius = array[startingIndex];
    return result;
  }
  /**
   * Computes a bounding sphere that contains both the left and right bounding spheres.
   *
   * @param {BoundingSphere} left A sphere to enclose in a bounding sphere.
   * @param {BoundingSphere} right A sphere to enclose in a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static union(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    const leftCenter = left.center;
    const leftRadius = left.radius;
    const rightCenter = right.center;
    const rightRadius = right.radius;
    const toRightCenter = Cartesian3_default.subtract(
      rightCenter,
      leftCenter,
      unionScratch
    );
    const centerSeparation = Cartesian3_default.magnitude(toRightCenter);
    if (leftRadius >= centerSeparation + rightRadius) {
      left.clone(result);
      return result;
    }
    if (rightRadius >= centerSeparation + leftRadius) {
      right.clone(result);
      return result;
    }
    const halfDistanceBetweenTangentPoints = (leftRadius + centerSeparation + rightRadius) * 0.5;
    const center = Cartesian3_default.multiplyByScalar(
      toRightCenter,
      (-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation,
      unionScratchCenter
    );
    Cartesian3_default.add(center, leftCenter, center);
    Cartesian3_default.clone(center, result.center);
    result.radius = halfDistanceBetweenTangentPoints;
    return result;
  }
  /**
   * Computes a bounding sphere by enlarging the provided sphere to contain the provided point.
   *
   * @param {BoundingSphere} sphere A sphere to expand.
   * @param {Cartesian3} point A point to enclose in a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static expand(sphere, point, result) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("point", point);
    result = _BoundingSphere.clone(sphere, result);
    const radius = Cartesian3_default.magnitude(
      Cartesian3_default.subtract(point, result.center, expandScratch)
    );
    if (radius > result.radius) {
      result.radius = radius;
    }
    return result;
  }
  /**
   * Determines which side of a plane a sphere is located.
   *
   * @param {BoundingSphere} sphere The bounding sphere to test.
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
   *                      intersects the plane.
   */
  static intersectPlane(sphere, plane) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("plane", plane);
    const center = sphere.center;
    const radius = sphere.radius;
    const normal = plane.normal;
    const distanceToPlane = Cartesian3_default.dot(normal, center) + plane.distance;
    if (distanceToPlane < -radius) {
      return Intersect_default.OUTSIDE;
    } else if (distanceToPlane < radius) {
      return Intersect_default.INTERSECTING;
    }
    return Intersect_default.INSIDE;
  }
  /**
   * Applies a 4x4 affine transformation matrix to a bounding sphere.
   *
   * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
   * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static transform(sphere, transform, result) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("transform", transform);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    result.center = Matrix4_default.multiplyByPoint(
      transform,
      sphere.center,
      result.center
    );
    result.radius = Matrix4_default.getMaximumScale(transform) * sphere.radius;
    return result;
  }
  /**
   * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
   *
   * @param {BoundingSphere} sphere The sphere.
   * @param {Cartesian3} cartesian The point
   * @returns {number} The distance squared from the bounding sphere to the point. Returns 0 if the point is inside the sphere.
   *
   * @example
   * // Sort bounding spheres from back to front
   * spheres.sort(function(a, b) {
   *     return Cesium.BoundingSphere.distanceSquaredTo(b, camera.positionWC) - Cesium.BoundingSphere.distanceSquaredTo(a, camera.positionWC);
   * });
   */
  static distanceSquaredTo(sphere, cartesian) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("cartesian", cartesian);
    const diff = Cartesian3_default.subtract(
      sphere.center,
      cartesian,
      distanceSquaredToScratch
    );
    const distance = Cartesian3_default.magnitude(diff) - sphere.radius;
    if (distance <= 0) {
      return 0;
    }
    return distance * distance;
  }
  /**
   * Applies a 4x4 affine transformation matrix to a bounding sphere where there is no scale
   * The transformation matrix is not verified to have a uniform scale of 1.
   * This method is faster than computing the general bounding sphere transform using {@link BoundingSphere.transform}.
   *
   * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
   * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
   * const boundingSphere = new Cesium.BoundingSphere();
   * const newBoundingSphere = Cesium.BoundingSphere.transformWithoutScale(boundingSphere, modelMatrix);
   */
  static transformWithoutScale(sphere, transform, result) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("transform", transform);
    if (!defined_default(result)) {
      result = new _BoundingSphere();
    }
    result.center = Matrix4_default.multiplyByPoint(
      transform,
      sphere.center,
      result.center
    );
    result.radius = sphere.radius;
    return result;
  }
  /**
   * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
   * plus/minus the radius of the bounding sphere.
   * <br>
   * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
   * closest and farthest planes from position that intersect the bounding sphere.
   *
   * @param {BoundingSphere} sphere The bounding sphere to calculate the distance to.
   * @param {Cartesian3} position The position to calculate the distance from.
   * @param {Cartesian3} direction The direction from position.
   * @param {Interval} [result] A Interval to store the nearest and farthest distances.
   * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
   */
  static computePlaneDistances(sphere, position, direction, result) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("position", position);
    Check_default.typeOf.object("direction", direction);
    if (!defined_default(result)) {
      result = new Interval_default();
    }
    const toCenter = Cartesian3_default.subtract(
      sphere.center,
      position,
      scratchCartesian3
    );
    const mag = Cartesian3_default.dot(direction, toCenter);
    result.start = mag - sphere.radius;
    result.stop = mag + sphere.radius;
    return result;
  }
  /**
   * Creates a bounding sphere in 2D from a bounding sphere in 3D world coordinates.
   *
   * @param {BoundingSphere} sphere The bounding sphere to transform to 2D.
   * @param {MapProjection} [projection=GeographicProjection] The projection to 2D.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  static projectTo2D(sphere, projection, result) {
    Check_default.typeOf.object("sphere", sphere);
    projectTo2DProjection._ellipsoid = Ellipsoid_default.default;
    projection = projection ?? projectTo2DProjection;
    const ellipsoid = projection.ellipsoid;
    let center = sphere.center;
    const radius = sphere.radius;
    let normal;
    if (Cartesian3_default.equals(center, Cartesian3_default.ZERO)) {
      normal = Cartesian3_default.clone(Cartesian3_default.UNIT_X, projectTo2DNormalScratch);
    } else {
      normal = ellipsoid.geodeticSurfaceNormal(
        center,
        projectTo2DNormalScratch
      );
    }
    const east = Cartesian3_default.cross(
      Cartesian3_default.UNIT_Z,
      normal,
      projectTo2DEastScratch
    );
    Cartesian3_default.normalize(east, east);
    const north = Cartesian3_default.cross(normal, east, projectTo2DNorthScratch);
    Cartesian3_default.normalize(north, north);
    Cartesian3_default.multiplyByScalar(normal, radius, normal);
    Cartesian3_default.multiplyByScalar(north, radius, north);
    Cartesian3_default.multiplyByScalar(east, radius, east);
    const south = Cartesian3_default.negate(north, projectTo2DSouthScratch);
    const west = Cartesian3_default.negate(east, projectTo2DWestScratch);
    const positions = projectTo2DPositionsScratch;
    let corner = positions[0];
    Cartesian3_default.add(normal, north, corner);
    Cartesian3_default.add(corner, east, corner);
    corner = positions[1];
    Cartesian3_default.add(normal, north, corner);
    Cartesian3_default.add(corner, west, corner);
    corner = positions[2];
    Cartesian3_default.add(normal, south, corner);
    Cartesian3_default.add(corner, west, corner);
    corner = positions[3];
    Cartesian3_default.add(normal, south, corner);
    Cartesian3_default.add(corner, east, corner);
    Cartesian3_default.negate(normal, normal);
    corner = positions[4];
    Cartesian3_default.add(normal, north, corner);
    Cartesian3_default.add(corner, east, corner);
    corner = positions[5];
    Cartesian3_default.add(normal, north, corner);
    Cartesian3_default.add(corner, west, corner);
    corner = positions[6];
    Cartesian3_default.add(normal, south, corner);
    Cartesian3_default.add(corner, west, corner);
    corner = positions[7];
    Cartesian3_default.add(normal, south, corner);
    Cartesian3_default.add(corner, east, corner);
    const length = positions.length;
    for (let i = 0; i < length; ++i) {
      const position = positions[i];
      Cartesian3_default.add(center, position, position);
      const cartographic = ellipsoid.cartesianToCartographic(
        position,
        projectTo2DCartographicScratch
      );
      projection.project(cartographic, position);
    }
    result = _BoundingSphere.fromPoints(positions, result);
    center = result.center;
    const x = center.x;
    const y = center.y;
    const z = center.z;
    center.x = z;
    center.y = x;
    center.z = y;
    return result;
  }
  /**
   * Determines whether or not a sphere is hidden from view by the occluder.
   *
   * @param {BoundingSphere} sphere The bounding sphere surrounding the occluded object.
   * @param {Occluder} occluder The occluder.
   * @returns {boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
   */
  static isOccluded(sphere, occluder) {
    Check_default.typeOf.object("sphere", sphere);
    Check_default.typeOf.object("occluder", occluder);
    return !occluder.isBoundingSphereVisible(sphere);
  }
  /**
   * Compares the provided BoundingSphere componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {BoundingSphere} [left] The first BoundingSphere.
   * @param {BoundingSphere} [right] The second BoundingSphere.
   * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  static equals(left, right) {
    return left === right || defined_default(left) && defined_default(right) && Cartesian3_default.equals(left.center, right.center) && left.radius === right.radius;
  }
  /**
   * Determines which side of a plane the sphere is located.
   *
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
   *                      intersects the plane.
   */
  intersectPlane(plane) {
    return _BoundingSphere.intersectPlane(this, plane);
  }
  /**
   * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
   *
   * @param {Cartesian3} cartesian The point
   * @returns {number} The estimated distance squared from the bounding sphere to the point.
   *
   * @example
   * // Sort bounding spheres from back to front
   * spheres.sort(function(a, b) {
   *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
   * });
   */
  distanceSquaredTo(cartesian) {
    return _BoundingSphere.distanceSquaredTo(this, cartesian);
  }
  /**
   * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
   * plus/minus the radius of the bounding sphere.
   * <br>
   * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
   * closest and farthest planes from position that intersect the bounding sphere.
   *
   * @param {Cartesian3} position The position to calculate the distance from.
   * @param {Cartesian3} direction The direction from position.
   * @param {Interval} [result] A Interval to store the nearest and farthest distances.
   * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
   */
  computePlaneDistances(position, direction, result) {
    return _BoundingSphere.computePlaneDistances(
      this,
      position,
      direction,
      result
    );
  }
  /**
   * Determines whether or not a sphere is hidden from view by the occluder.
   *
   * @param {Occluder} occluder The occluder.
   * @returns {boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
   */
  isOccluded(occluder) {
    return _BoundingSphere.isOccluded(this, occluder);
  }
  /**
   * Compares this BoundingSphere against the provided BoundingSphere componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {BoundingSphere} [right] The right hand side BoundingSphere.
   * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  equals(right) {
    return _BoundingSphere.equals(this, right);
  }
  /**
   * Duplicates this BoundingSphere instance.
   *
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  clone(result) {
    return _BoundingSphere.clone(this, result);
  }
  /**
   * Computes the radius of the BoundingSphere.
   * @returns {number} The radius of the BoundingSphere.
   */
  volume() {
    const radius = this.radius;
    return volumeConstant * radius * radius * radius;
  }
};
BoundingSphere.packedLength = 4;
var fromPointsXMin = new Cartesian3_default();
var fromPointsYMin = new Cartesian3_default();
var fromPointsZMin = new Cartesian3_default();
var fromPointsXMax = new Cartesian3_default();
var fromPointsYMax = new Cartesian3_default();
var fromPointsZMax = new Cartesian3_default();
var fromPointsCurrentPos = new Cartesian3_default();
var fromPointsScratch = new Cartesian3_default();
var fromPointsRitterCenter = new Cartesian3_default();
var fromPointsMinBoxPt = new Cartesian3_default();
var fromPointsMaxBoxPt = new Cartesian3_default();
var fromPointsNaiveCenterScratch = new Cartesian3_default();
var volumeConstant = 4 / 3 * Math_default.PI;
var defaultProjection = new GeographicProjection_default();
var fromRectangle2DLowerLeft = new Cartesian3_default();
var fromRectangle2DUpperRight = new Cartesian3_default();
var fromRectangle2DSouthwest = new Cartographic_default();
var fromRectangle2DNortheast = new Cartographic_default();
var fromRectangle3DScratch = (
  /** @type {Cartesian3[]} */
  []
);
var fromOrientedBoundingBoxScratchU = new Cartesian3_default();
var fromOrientedBoundingBoxScratchV = new Cartesian3_default();
var fromOrientedBoundingBoxScratchW = new Cartesian3_default();
var scratchFromTransformationCenter = new Cartesian3_default();
var scratchFromTransformationScale = new Cartesian3_default();
var unionScratch = new Cartesian3_default();
var unionScratchCenter = new Cartesian3_default();
var expandScratch = new Cartesian3_default();
var distanceSquaredToScratch = new Cartesian3_default();
var scratchCartesian3 = new Cartesian3_default();
var projectTo2DNormalScratch = new Cartesian3_default();
var projectTo2DEastScratch = new Cartesian3_default();
var projectTo2DNorthScratch = new Cartesian3_default();
var projectTo2DWestScratch = new Cartesian3_default();
var projectTo2DSouthScratch = new Cartesian3_default();
var projectTo2DCartographicScratch = new Cartographic_default();
var projectTo2DPositionsScratch = new Array(8);
for (let n = 0; n < 8; ++n) {
  projectTo2DPositionsScratch[n] = new Cartesian3_default();
}
var projectTo2DProjection = new GeographicProjection_default();
var BoundingSphere_default = BoundingSphere;

export {
  GeographicProjection_default,
  Interval_default,
  BoundingSphere_default
};
