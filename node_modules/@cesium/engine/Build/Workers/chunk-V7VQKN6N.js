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
  Cartesian3_default
} from "./chunk-MPZHGZU6.js";
import {
  Math_default
} from "./chunk-J6BWOHUF.js";
import {
  Check_default,
  DeveloperError_default
} from "./chunk-AYKR4VBR.js";
import {
  __publicField,
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Core/scaleToGeodeticSurface.js
var scaleToGeodeticSurfaceIntersection = new Cartesian3_default();
var scaleToGeodeticSurfaceGradient = new Cartesian3_default();
function scaleToGeodeticSurface(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared, result) {
  if (!defined_default(cartesian)) {
    throw new DeveloperError_default("cartesian is required.");
  }
  if (!defined_default(oneOverRadii)) {
    throw new DeveloperError_default("oneOverRadii is required.");
  }
  if (!defined_default(oneOverRadiiSquared)) {
    throw new DeveloperError_default("oneOverRadiiSquared is required.");
  }
  if (!defined_default(centerToleranceSquared)) {
    throw new DeveloperError_default("centerToleranceSquared is required.");
  }
  const positionX = cartesian.x;
  const positionY = cartesian.y;
  const positionZ = cartesian.z;
  const oneOverRadiiX = oneOverRadii.x;
  const oneOverRadiiY = oneOverRadii.y;
  const oneOverRadiiZ = oneOverRadii.z;
  const x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
  const y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
  const z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;
  const squaredNorm = x2 + y2 + z2;
  const ratio = Math.sqrt(1 / squaredNorm);
  const intersection = Cartesian3_default.multiplyByScalar(
    cartesian,
    ratio,
    scaleToGeodeticSurfaceIntersection
  );
  if (squaredNorm < centerToleranceSquared) {
    return !isFinite(ratio) ? void 0 : Cartesian3_default.clone(intersection, result);
  }
  const oneOverRadiiSquaredX = oneOverRadiiSquared.x;
  const oneOverRadiiSquaredY = oneOverRadiiSquared.y;
  const oneOverRadiiSquaredZ = oneOverRadiiSquared.z;
  const gradient = scaleToGeodeticSurfaceGradient;
  gradient.x = intersection.x * oneOverRadiiSquaredX * 2;
  gradient.y = intersection.y * oneOverRadiiSquaredY * 2;
  gradient.z = intersection.z * oneOverRadiiSquaredZ * 2;
  let lambda = (1 - ratio) * Cartesian3_default.magnitude(cartesian) / (0.5 * Cartesian3_default.magnitude(gradient));
  let correction = 0;
  let func;
  let denominator;
  let xMultiplier;
  let yMultiplier;
  let zMultiplier;
  let xMultiplier2;
  let yMultiplier2;
  let zMultiplier2;
  let xMultiplier3;
  let yMultiplier3;
  let zMultiplier3;
  do {
    lambda -= correction;
    xMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredX);
    yMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredY);
    zMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredZ);
    xMultiplier2 = xMultiplier * xMultiplier;
    yMultiplier2 = yMultiplier * yMultiplier;
    zMultiplier2 = zMultiplier * zMultiplier;
    xMultiplier3 = xMultiplier2 * xMultiplier;
    yMultiplier3 = yMultiplier2 * yMultiplier;
    zMultiplier3 = zMultiplier2 * zMultiplier;
    func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1;
    denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;
    const derivative = -2 * denominator;
    correction = func / derivative;
  } while (Math.abs(func) > Math_default.EPSILON12);
  if (!defined_default(result)) {
    return new Cartesian3_default(
      positionX * xMultiplier,
      positionY * yMultiplier,
      positionZ * zMultiplier
    );
  }
  result.x = positionX * xMultiplier;
  result.y = positionY * yMultiplier;
  result.z = positionZ * zMultiplier;
  return result;
}
var scaleToGeodeticSurface_default = scaleToGeodeticSurface;

// packages/engine/Source/Core/Cartographic.js
var _Cartographic = class _Cartographic {
  /**
   * @param {number} [longitude=0.0] The longitude, in radians.
   * @param {number} [latitude=0.0] The latitude, in radians.
   * @param {number} [height=0.0] The height, in meters, above the ellipsoid.
   */
  constructor(longitude, latitude, height) {
    this.longitude = longitude ?? 0;
    this.latitude = latitude ?? 0;
    this.height = height ?? 0;
  }
  /**
   * Creates a new Cartographic instance from longitude and latitude
   * specified in radians.
   *
   * @param {number} longitude The longitude, in radians.
   * @param {number} latitude The latitude, in radians.
   * @param {number} [height=0.0] The height, in meters, above the ellipsoid.
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
   */
  static fromRadians(longitude, latitude, height, result) {
    Check_default.typeOf.number("longitude", longitude);
    Check_default.typeOf.number("latitude", latitude);
    height = height ?? 0;
    if (!defined_default(result)) {
      return new _Cartographic(longitude, latitude, height);
    }
    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  }
  /**
   * Creates a new Cartographic instance from longitude and latitude
   * specified in degrees.  The values in the resulting object will
   * be in radians.
   *
   * @param {number} longitude The longitude, in degrees.
   * @param {number} latitude The latitude, in degrees.
   * @param {number} [height=0.0] The height, in meters, above the ellipsoid.
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
   */
  static fromDegrees(longitude, latitude, height, result) {
    Check_default.typeOf.number("longitude", longitude);
    Check_default.typeOf.number("latitude", latitude);
    longitude = Math_default.toRadians(longitude);
    latitude = Math_default.toRadians(latitude);
    return _Cartographic.fromRadians(longitude, latitude, height, result);
  }
  /**
   * Creates a new Cartographic instance from a Cartesian position. The values in the
   * resulting object will be in radians.
   *
   * @param {Cartesian3} cartesian The Cartesian position to convert to cartographic representation.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter, new Cartographic instance if none was provided, or undefined if the cartesian is at the center of the ellipsoid.
   */
  static fromCartesian(cartesian, ellipsoid, result) {
    const oneOverRadii = defined_default(ellipsoid) ? ellipsoid.oneOverRadii : _Cartographic._ellipsoidOneOverRadii;
    const oneOverRadiiSquared = defined_default(ellipsoid) ? ellipsoid.oneOverRadiiSquared : _Cartographic._ellipsoidOneOverRadiiSquared;
    const centerToleranceSquared = defined_default(ellipsoid) ? ellipsoid._centerToleranceSquared : _Cartographic._ellipsoidCenterToleranceSquared;
    const p = scaleToGeodeticSurface_default(
      cartesian,
      oneOverRadii,
      oneOverRadiiSquared,
      centerToleranceSquared,
      cartesianToCartographicP
    );
    if (!defined_default(p)) {
      return void 0;
    }
    let n = Cartesian3_default.multiplyComponents(
      p,
      oneOverRadiiSquared,
      cartesianToCartographicN
    );
    n = Cartesian3_default.normalize(n, n);
    const h = Cartesian3_default.subtract(cartesian, p, cartesianToCartographicH);
    const longitude = Math.atan2(n.y, n.x);
    const latitude = Math.asin(n.z);
    const height = Math_default.sign(Cartesian3_default.dot(h, cartesian)) * Cartesian3_default.magnitude(h);
    if (!defined_default(result)) {
      return new _Cartographic(longitude, latitude, height);
    }
    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  }
  /**
   * Creates a new Cartesian3 instance from a Cartographic input. The values in the inputted
   * object should be in radians.
   *
   * @param {Cartographic} cartographic Input to be converted into a Cartesian3 output.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The position
   */
  static toCartesian(cartographic, ellipsoid, result) {
    Check_default.defined("cartographic", cartographic);
    return Cartesian3_default.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height,
      ellipsoid,
      result
    );
  }
  /**
   * Duplicates a Cartographic instance.
   *
   * @param {Cartographic} cartographic The cartographic to duplicate.
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided. (Returns undefined if cartographic is undefined)
   */
  static clone(cartographic, result) {
    if (!defined_default(cartographic)) {
      return void 0;
    }
    if (!defined_default(result)) {
      return new _Cartographic(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      );
    }
    result.longitude = cartographic.longitude;
    result.latitude = cartographic.latitude;
    result.height = cartographic.height;
    return result;
  }
  /**
   * Compares the provided cartographics componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartographic} [left] The first cartographic.
   * @param {Cartographic} [right] The second cartographic.
   * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  static equals(left, right) {
    return left === right || defined_default(left) && defined_default(right) && left.longitude === right.longitude && left.latitude === right.latitude && left.height === right.height;
  }
  /**
   * Compares the provided cartographics componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Cartographic} [left] The first cartographic.
   * @param {Cartographic} [right] The second cartographic.
   * @param {number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  static equalsEpsilon(left, right, epsilon) {
    epsilon = epsilon ?? 0;
    return left === right || defined_default(left) && defined_default(right) && Math.abs(left.longitude - right.longitude) <= epsilon && Math.abs(left.latitude - right.latitude) <= epsilon && Math.abs(left.height - right.height) <= epsilon;
  }
  /**
   * Duplicates this instance.
   *
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter or a new Cartographic instance if one was not provided.
   */
  clone(result) {
    return _Cartographic.clone(this, result);
  }
  /**
   * Compares the provided against this cartographic componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartographic} [right] The second cartographic.
   * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  equals(right) {
    return _Cartographic.equals(this, right);
  }
  /**
   * Compares the provided against this cartographic componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Cartographic} [right] The second cartographic.
   * @param {number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  equalsEpsilon(right, epsilon) {
    return _Cartographic.equalsEpsilon(this, right, epsilon);
  }
  /**
   * Creates a string representing this cartographic in the format '(longitude, latitude, height)'.
   *
   * @returns {string} A string representing the provided cartographic in the format '(longitude, latitude, height)'.
   */
  toString() {
    return `(${this.longitude}, ${this.latitude}, ${this.height})`;
  }
};
// To avoid circular dependencies, these are set by Ellipsoid when Ellipsoid.default is set.
__publicField(_Cartographic, "_ellipsoidOneOverRadii", new Cartesian3_default(
  1 / 6378137,
  1 / 6378137,
  1 / 6356752314245179e-9
));
__publicField(_Cartographic, "_ellipsoidOneOverRadiiSquared", new Cartesian3_default(
  1 / (6378137 * 6378137),
  1 / (6378137 * 6378137),
  1 / (6356752314245179e-9 * 6356752314245179e-9)
));
__publicField(_Cartographic, "_ellipsoidCenterToleranceSquared", Math_default.EPSILON1);
var Cartographic = _Cartographic;
Cartographic.ZERO = Object.freeze(new Cartographic(0, 0, 0));
var cartesianToCartographicN = new Cartesian3_default();
var cartesianToCartographicP = new Cartesian3_default();
var cartesianToCartographicH = new Cartesian3_default();
var Cartographic_default = Cartographic;

// packages/engine/Source/Core/Cartesian2.js
var Cartesian2 = class _Cartesian2 {
  /**
   * @param {number} [x=0.0] The X component.
   * @param {number} [y=0.0] The Y component.
   */
  constructor(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }
  /**
   * Creates a Cartesian2 instance from x and y coordinates.
   *
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
   */
  static fromElements(x, y, result) {
    if (!defined_default(result)) {
      return new _Cartesian2(x, y);
    }
    result.x = x;
    result.y = y;
    return result;
  }
  /**
   * Duplicates a Cartesian2 instance.
   *
   * @param {Cartesian2} cartesian The Cartesian to duplicate.
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided. (Returns undefined if cartesian is undefined)
   */
  static clone(cartesian, result) {
    if (!defined_default(cartesian)) {
      return void 0;
    }
    if (!defined_default(result)) {
      return new _Cartesian2(cartesian.x, cartesian.y);
    }
    result.x = cartesian.x;
    result.y = cartesian.y;
    return result;
  }
  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Cartesian2} value The value to pack.
   * @param {number[]} array The array to pack into.
   * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {number[]} The array that was packed into
   */
  static pack(value, array, startingIndex) {
    Check_default.typeOf.object("value", value);
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    array[startingIndex++] = value.x;
    array[startingIndex] = value.y;
    return array;
  }
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {number[]} array The packed array.
   * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Cartesian2} [result] The object into which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
   */
  static unpack(array, startingIndex, result) {
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    if (!defined_default(result)) {
      result = new _Cartesian2();
    }
    result.x = array[startingIndex++];
    result.y = array[startingIndex];
    return result;
  }
  /**
   * Flattens an array of Cartesian2s into an array of components.
   *
   * @param {Cartesian2[]} array The array of cartesians to pack.
   * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 2 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 2) elements.
   * @returns {number[]} The packed array.
   */
  static packArray(array, result) {
    Check_default.defined("array", array);
    const length = array.length;
    const resultLength = length * 2;
    if (!defined_default(result)) {
      result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
      throw new DeveloperError_default(
        "If result is a typed array, it must have exactly array.length * 2 elements"
      );
    } else if (result.length !== resultLength) {
      result.length = resultLength;
    }
    for (let i = 0; i < length; ++i) {
      _Cartesian2.pack(array[i], result, i * 2);
    }
    return result;
  }
  /**
   * Unpacks an array of cartesian components into an array of Cartesian2s.
   *
   * @param {number[]} array The array of components to unpack.
   * @param {Cartesian2[]} [result] The array onto which to store the result.
   * @returns {Cartesian2[]} The unpacked array.
   */
  static unpackArray(array, result) {
    Check_default.defined("array", array);
    Check_default.typeOf.number.greaterThanOrEquals("array.length", array.length, 2);
    if (array.length % 2 !== 0) {
      throw new DeveloperError_default("array length must be a multiple of 2.");
    }
    const length = array.length;
    if (!defined_default(result)) {
      result = new Array(length / 2);
    } else {
      result.length = length / 2;
    }
    for (let i = 0; i < length; i += 2) {
      const index = i / 2;
      result[index] = _Cartesian2.unpack(array, i, result[index]);
    }
    return result;
  }
  /**
   * Computes the value of the maximum component for the supplied Cartesian.
   *
   * @param {Cartesian2} cartesian The cartesian to use.
   * @returns {number} The value of the maximum component.
   */
  static maximumComponent(cartesian) {
    Check_default.typeOf.object("cartesian", cartesian);
    return Math.max(cartesian.x, cartesian.y);
  }
  /**
   * Computes the value of the minimum component for the supplied Cartesian.
   *
   * @param {Cartesian2} cartesian The cartesian to use.
   * @returns {number} The value of the minimum component.
   */
  static minimumComponent(cartesian) {
    Check_default.typeOf.object("cartesian", cartesian);
    return Math.min(cartesian.x, cartesian.y);
  }
  /**
   * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
   *
   * @param {Cartesian2} first A cartesian to compare.
   * @param {Cartesian2} second A cartesian to compare.
   * @param {Cartesian2} result The object into which to store the result.
   * @returns {Cartesian2} A cartesian with the minimum components.
   */
  static minimumByComponent(first, second, result) {
    Check_default.typeOf.object("first", first);
    Check_default.typeOf.object("second", second);
    Check_default.typeOf.object("result", result);
    result.x = Math.min(first.x, second.x);
    result.y = Math.min(first.y, second.y);
    return result;
  }
  /**
   * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
   *
   * @param {Cartesian2} first A cartesian to compare.
   * @param {Cartesian2} second A cartesian to compare.
   * @param {Cartesian2} result The object into which to store the result.
   * @returns {Cartesian2} A cartesian with the maximum components.
   */
  static maximumByComponent(first, second, result) {
    Check_default.typeOf.object("first", first);
    Check_default.typeOf.object("second", second);
    Check_default.typeOf.object("result", result);
    result.x = Math.max(first.x, second.x);
    result.y = Math.max(first.y, second.y);
    return result;
  }
  /**
   * Constrain a value to lie between two values.
   *
   * @param {Cartesian2} value The value to clamp.
   * @param {Cartesian2} min The minimum bound.
   * @param {Cartesian2} max The maximum bound.
   * @param {Cartesian2} result The object into which to store the result.
   * @returns {Cartesian2} The clamped value such that min <= result <= max.
   */
  static clamp(value, min, max, result) {
    Check_default.typeOf.object("value", value);
    Check_default.typeOf.object("min", min);
    Check_default.typeOf.object("max", max);
    Check_default.typeOf.object("result", result);
    const x = Math_default.clamp(value.x, min.x, max.x);
    const y = Math_default.clamp(value.y, min.y, max.y);
    result.x = x;
    result.y = y;
    return result;
  }
  /**
   * Computes the provided Cartesian's squared magnitude.
   *
   * @param {Cartesian2} cartesian The Cartesian instance whose squared magnitude is to be computed.
   * @returns {number} The squared magnitude.
   */
  static magnitudeSquared(cartesian) {
    Check_default.typeOf.object("cartesian", cartesian);
    return cartesian.x * cartesian.x + cartesian.y * cartesian.y;
  }
  /**
   * Computes the Cartesian's magnitude (length).
   *
   * @param {Cartesian2} cartesian The Cartesian instance whose magnitude is to be computed.
   * @returns {number} The magnitude.
   */
  static magnitude(cartesian) {
    return Math.sqrt(_Cartesian2.magnitudeSquared(cartesian));
  }
  /**
   * Computes the distance between two points.
   *
   * @param {Cartesian2} left The first point to compute the distance from.
   * @param {Cartesian2} right The second point to compute the distance to.
   * @returns {number} The distance between two points.
   *
   * @example
   * // Returns 1.0
   * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(2.0, 0.0));
   */
  static distance(left, right) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    _Cartesian2.subtract(left, right, distanceScratch);
    return _Cartesian2.magnitude(distanceScratch);
  }
  /**
   * Computes the squared distance between two points.  Comparing squared distances
   * using this function is more efficient than comparing distances using {@link Cartesian2#distance}.
   *
   * @param {Cartesian2} left The first point to compute the distance from.
   * @param {Cartesian2} right The second point to compute the distance to.
   * @returns {number} The distance between two points.
   *
   * @example
   * // Returns 4.0, not 2.0
   * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(3.0, 0.0));
   */
  static distanceSquared(left, right) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    _Cartesian2.subtract(left, right, distanceScratch);
    return _Cartesian2.magnitudeSquared(distanceScratch);
  }
  /**
   * Computes the normalized form of the supplied Cartesian.
   *
   * @param {Cartesian2} cartesian The Cartesian to be normalized.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static normalize(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.object("result", result);
    const magnitude = _Cartesian2.magnitude(cartesian);
    result.x = cartesian.x / magnitude;
    result.y = cartesian.y / magnitude;
    if (isNaN(result.x) || isNaN(result.y)) {
      throw new DeveloperError_default("normalized result is not a number");
    }
    return result;
  }
  /**
   * Computes the dot (scalar) product of two Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @returns {number} The dot product.
   */
  static dot(left, right) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    return left.x * right.x + left.y * right.y;
  }
  /**
   * Computes the magnitude of the cross product that would result from implicitly setting the Z coordinate of the input vectors to 0
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @returns {number} The cross product.
   */
  static cross(left, right) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    return left.x * right.y - left.y * right.x;
  }
  /**
   * Computes the componentwise product of two Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static multiplyComponents(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.x = left.x * right.x;
    result.y = left.y * right.y;
    return result;
  }
  /**
   * Computes the componentwise quotient of two Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static divideComponents(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.x = left.x / right.x;
    result.y = left.y / right.y;
    return result;
  }
  /**
   * Computes the componentwise sum of two Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static add(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.x = left.x + right.x;
    result.y = left.y + right.y;
    return result;
  }
  /**
   * Computes the componentwise difference of two Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static subtract(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.x = left.x - right.x;
    result.y = left.y - right.y;
    return result;
  }
  /**
   * Multiplies the provided Cartesian componentwise by the provided scalar.
   *
   * @param {Cartesian2} cartesian The Cartesian to be scaled.
   * @param {number} scalar The scalar to multiply with.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static multiplyByScalar(cartesian, scalar, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.number("scalar", scalar);
    Check_default.typeOf.object("result", result);
    result.x = cartesian.x * scalar;
    result.y = cartesian.y * scalar;
    return result;
  }
  /**
   * Divides the provided Cartesian componentwise by the provided scalar.
   *
   * @param {Cartesian2} cartesian The Cartesian to be divided.
   * @param {number} scalar The scalar to divide by.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static divideByScalar(cartesian, scalar, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.number("scalar", scalar);
    Check_default.typeOf.object("result", result);
    result.x = cartesian.x / scalar;
    result.y = cartesian.y / scalar;
    return result;
  }
  /**
   * Negates the provided Cartesian.
   *
   * @param {Cartesian2} cartesian The Cartesian to be negated.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static negate(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.object("result", result);
    result.x = -cartesian.x;
    result.y = -cartesian.y;
    return result;
  }
  /**
   * Computes the absolute value of the provided Cartesian.
   *
   * @param {Cartesian2} cartesian The Cartesian whose absolute value is to be computed.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static abs(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.object("result", result);
    result.x = Math.abs(cartesian.x);
    result.y = Math.abs(cartesian.y);
    return result;
  }
  /**
   * Computes the linear interpolation or extrapolation at t using the provided cartesians.
   *
   * @param {Cartesian2} start The value corresponding to t at 0.0.
   * @param {Cartesian2} end The value corresponding to t at 1.0.
   * @param {number} t The point along t at which to interpolate.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  static lerp(start, end, t, result) {
    Check_default.typeOf.object("start", start);
    Check_default.typeOf.object("end", end);
    Check_default.typeOf.number("t", t);
    Check_default.typeOf.object("result", result);
    _Cartesian2.multiplyByScalar(end, t, lerpScratch);
    result = _Cartesian2.multiplyByScalar(start, 1 - t, result);
    return _Cartesian2.add(lerpScratch, result, result);
  }
  /**
   * Returns the angle, in radians, between the provided Cartesians.
   *
   * @param {Cartesian2} left The first Cartesian.
   * @param {Cartesian2} right The second Cartesian.
   * @returns {number} The angle between the Cartesians.
   */
  static angleBetween(left, right) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    _Cartesian2.normalize(left, angleBetweenScratch);
    _Cartesian2.normalize(right, angleBetweenScratch2);
    return Math_default.acosClamped(
      _Cartesian2.dot(angleBetweenScratch, angleBetweenScratch2)
    );
  }
  /**
   * Returns the axis that is most orthogonal to the provided Cartesian.
   *
   * @param {Cartesian2} cartesian The Cartesian on which to find the most orthogonal axis.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The most orthogonal axis.
   */
  static mostOrthogonalAxis(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    Check_default.typeOf.object("result", result);
    const f = _Cartesian2.normalize(cartesian, mostOrthogonalAxisScratch);
    _Cartesian2.abs(f, f);
    if (f.x <= f.y) {
      result = _Cartesian2.clone(_Cartesian2.UNIT_X, result);
    } else {
      result = _Cartesian2.clone(_Cartesian2.UNIT_Y, result);
    }
    return result;
  }
  /**
   * Compares the provided Cartesians componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartesian2} [left] The first Cartesian.
   * @param {Cartesian2} [right] The second Cartesian.
   * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  static equals(left, right) {
    return left === right || defined_default(left) && defined_default(right) && left.x === right.x && left.y === right.y;
  }
  /**
   * @param {Cartesian2} cartesian
   * @param {number[]} array
   * @param {number} offset
   * @ignore
   */
  static equalsArray(cartesian, array, offset) {
    return cartesian.x === array[offset] && cartesian.y === array[offset + 1];
  }
  /**
   * Compares the provided Cartesians componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {Cartesian2} [left] The first Cartesian.
   * @param {Cartesian2} [right] The second Cartesian.
   * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  static equalsEpsilon(left, right, relativeEpsilon, absoluteEpsilon) {
    return left === right || defined_default(left) && defined_default(right) && Math_default.equalsEpsilon(
      left.x,
      right.x,
      relativeEpsilon,
      absoluteEpsilon
    ) && Math_default.equalsEpsilon(
      left.y,
      right.y,
      relativeEpsilon,
      absoluteEpsilon
    );
  }
  /**
   * Duplicates this Cartesian2 instance.
   *
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
   */
  clone(result) {
    return _Cartesian2.clone(this, result);
  }
  /**
   * Compares this Cartesian against the provided Cartesian componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartesian2} [right] The right hand side Cartesian.
   * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  equals(right) {
    return _Cartesian2.equals(this, right);
  }
  /**
   * Compares this Cartesian against the provided Cartesian componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {Cartesian2} [right] The right hand side Cartesian.
   * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  equalsEpsilon(right, relativeEpsilon, absoluteEpsilon) {
    return _Cartesian2.equalsEpsilon(
      this,
      right,
      relativeEpsilon,
      absoluteEpsilon
    );
  }
  /**
   * Creates a string representing this Cartesian in the format '(x, y)'.
   *
   * @returns {string} A string representing the provided Cartesian in the format '(x, y)'.
   */
  toString() {
    return `(${this.x}, ${this.y})`;
  }
};
Cartesian2.fromCartesian3 = Cartesian2.clone;
Cartesian2.fromCartesian4 = Cartesian2.clone;
Cartesian2.packedLength = 2;
Cartesian2.fromArray = Cartesian2.unpack;
var distanceScratch = new Cartesian2();
var lerpScratch = new Cartesian2();
var angleBetweenScratch = new Cartesian2();
var angleBetweenScratch2 = new Cartesian2();
var mostOrthogonalAxisScratch = new Cartesian2();
Cartesian2.ZERO = Object.freeze(new Cartesian2(0, 0));
Cartesian2.ONE = Object.freeze(new Cartesian2(1, 1));
Cartesian2.UNIT_X = Object.freeze(new Cartesian2(1, 0));
Cartesian2.UNIT_Y = Object.freeze(new Cartesian2(0, 1));
var Cartesian2_default = Cartesian2;

// packages/engine/Source/Core/Ellipsoid.js
function initialize(ellipsoid, x, y, z) {
  x = x ?? 0;
  y = y ?? 0;
  z = z ?? 0;
  Check_default.typeOf.number.greaterThanOrEquals("x", x, 0);
  Check_default.typeOf.number.greaterThanOrEquals("y", y, 0);
  Check_default.typeOf.number.greaterThanOrEquals("z", z, 0);
  ellipsoid._radii = new Cartesian3_default(x, y, z);
  ellipsoid._radiiSquared = new Cartesian3_default(x * x, y * y, z * z);
  ellipsoid._radiiToTheFourth = new Cartesian3_default(
    x * x * x * x,
    y * y * y * y,
    z * z * z * z
  );
  ellipsoid._oneOverRadii = new Cartesian3_default(
    x === 0 ? 0 : 1 / x,
    y === 0 ? 0 : 1 / y,
    z === 0 ? 0 : 1 / z
  );
  ellipsoid._oneOverRadiiSquared = new Cartesian3_default(
    x === 0 ? 0 : 1 / (x * x),
    y === 0 ? 0 : 1 / (y * y),
    z === 0 ? 0 : 1 / (z * z)
  );
  ellipsoid._minimumRadius = Math.min(x, y, z);
  ellipsoid._maximumRadius = Math.max(x, y, z);
  ellipsoid._centerToleranceSquared = Math_default.EPSILON1;
  if (ellipsoid._radiiSquared.z !== 0) {
    ellipsoid._squaredXOverSquaredZ = ellipsoid._radiiSquared.x / ellipsoid._radiiSquared.z;
  }
}
var Ellipsoid = class _Ellipsoid {
  /**
   * @param {number} [x=0] The radius in the x direction.
   * @param {number} [y=0] The radius in the y direction.
   * @param {number} [z=0] The radius in the z direction.
   *
   * @exception {DeveloperError} All radii components must be greater than or equal to zero.
   */
  constructor(x, y, z) {
    this._radii = void 0;
    this._radiiSquared = void 0;
    this._radiiToTheFourth = void 0;
    this._oneOverRadii = void 0;
    this._oneOverRadiiSquared = void 0;
    this._minimumRadius = void 0;
    this._maximumRadius = void 0;
    this._centerToleranceSquared = void 0;
    this._squaredXOverSquaredZ = void 0;
    initialize(this, x, y, z);
  }
  /**
   * Gets the radii of the ellipsoid.
   * @type {Cartesian3}
   * @readonly
   */
  get radii() {
    return this._radii;
  }
  /**
   * Gets the squared radii of the ellipsoid.
   * @type {Cartesian3}
   * @readonly
   */
  get radiiSquared() {
    return this._radiiSquared;
  }
  /**
   * Gets the radii of the ellipsoid raise to the fourth power.
   * @type {Cartesian3}
   * @readonly
   */
  get radiiToTheFourth() {
    return this._radiiToTheFourth;
  }
  /**
   * Gets one over the radii of the ellipsoid.
   * @type {Cartesian3}
   * @readonly
   */
  get oneOverRadii() {
    return this._oneOverRadii;
  }
  /**
   * Gets one over the squared radii of the ellipsoid.
   * @type {Cartesian3}
   * @readonly
   */
  get oneOverRadiiSquared() {
    return this._oneOverRadiiSquared;
  }
  /**
   * Gets the minimum radius of the ellipsoid.
   * @type {number}
   * @readonly
   */
  get minimumRadius() {
    return this._minimumRadius;
  }
  /**
   * Gets the maximum radius of the ellipsoid.
   * @type {number}
   * @readonly
   */
  get maximumRadius() {
    return this._maximumRadius;
  }
  /**
   * Duplicates an Ellipsoid instance.
   *
   * @param {Ellipsoid} ellipsoid The ellipsoid to duplicate.
   * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
   *                    instance should be created.
   * @returns {Ellipsoid} The cloned Ellipsoid. (Returns undefined if ellipsoid is undefined)
   */
  static clone(ellipsoid, result) {
    if (!defined_default(ellipsoid)) {
      return void 0;
    }
    const radii = ellipsoid._radii;
    if (!defined_default(result)) {
      return new _Ellipsoid(radii.x, radii.y, radii.z);
    }
    Cartesian3_default.clone(radii, result._radii);
    Cartesian3_default.clone(ellipsoid._radiiSquared, result._radiiSquared);
    Cartesian3_default.clone(ellipsoid._radiiToTheFourth, result._radiiToTheFourth);
    Cartesian3_default.clone(ellipsoid._oneOverRadii, result._oneOverRadii);
    Cartesian3_default.clone(
      ellipsoid._oneOverRadiiSquared,
      result._oneOverRadiiSquared
    );
    result._minimumRadius = ellipsoid._minimumRadius;
    result._maximumRadius = ellipsoid._maximumRadius;
    result._centerToleranceSquared = ellipsoid._centerToleranceSquared;
    return result;
  }
  /**
   * Computes an Ellipsoid from a Cartesian specifying the radii in x, y, and z directions.
   *
   * @param {Cartesian3} [cartesian=Cartesian3.ZERO] The ellipsoid's radius in the x, y, and z directions.
   * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
   *                    instance should be created.
   * @returns {Ellipsoid} A new Ellipsoid instance.
   *
   * @exception {DeveloperError} All radii components must be greater than or equal to zero.
   *
   * @see Ellipsoid.WGS84
   * @see Ellipsoid.UNIT_SPHERE
   */
  static fromCartesian3(cartesian, result) {
    if (!defined_default(result)) {
      result = new _Ellipsoid();
    }
    if (!defined_default(cartesian)) {
      return result;
    }
    initialize(result, cartesian.x, cartesian.y, cartesian.z);
    return result;
  }
  /**
   * The default ellipsoid used when not otherwise specified.
   * @type {Ellipsoid}
   * @example
   * Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;
   *
   * // Apollo 11 landing site
   * const position = Cesium.Cartesian3.fromRadians(
   *   0.67416,
   *   23.47315,
   * );
   */
  static get default() {
    return _Ellipsoid._default;
  }
  static set default(value) {
    Check_default.typeOf.object("value", value);
    _Ellipsoid._default = value;
    Cartesian3_default._ellipsoidRadiiSquared = value.radiiSquared;
    Cartographic_default._ellipsoidOneOverRadii = value.oneOverRadii;
    Cartographic_default._ellipsoidOneOverRadiiSquared = value.oneOverRadiiSquared;
    Cartographic_default._ellipsoidCenterToleranceSquared = value._centerToleranceSquared;
  }
  /**
   * Duplicates an Ellipsoid instance.
   *
   * @param {Ellipsoid} [result] The object onto which to store the result, or undefined if a new
   *                    instance should be created.
   * @returns {Ellipsoid} The cloned Ellipsoid.
   */
  clone(result) {
    return _Ellipsoid.clone(this, result);
  }
  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Ellipsoid} value The value to pack.
   * @param {number[]} array The array to pack into.
   * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {number[]} The array that was packed into
   */
  static pack(value, array, startingIndex) {
    Check_default.typeOf.object("value", value);
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    Cartesian3_default.pack(value._radii, array, startingIndex);
    return array;
  }
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {number[]} array The packed array.
   * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Ellipsoid} [result] The object into which to store the result.
   * @returns {Ellipsoid} The modified result parameter or a new Ellipsoid instance if one was not provided.
   */
  static unpack(array, startingIndex, result) {
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    const radii = Cartesian3_default.unpack(array, startingIndex);
    return _Ellipsoid.fromCartesian3(radii, result);
  }
  /**
   * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
   *
   * @param {Cartographic} cartographic The cartographic position for which to to determine the geodetic normal.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
   */
  geodeticSurfaceNormalCartographic(cartographic, result) {
    Check_default.typeOf.object("cartographic", cartographic);
    const longitude = cartographic.longitude;
    const latitude = cartographic.latitude;
    const cosLatitude = Math.cos(latitude);
    const x = cosLatitude * Math.cos(longitude);
    const y = cosLatitude * Math.sin(longitude);
    const z = Math.sin(latitude);
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    result.x = x;
    result.y = y;
    result.z = z;
    return Cartesian3_default.normalize(result, result);
  }
  /**
   * Computes the normal of the plane tangent to the surface of the ellipsoid at the provided position.
   *
   * @param {Cartesian3} cartesian The Cartesian position for which to to determine the surface normal.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided, or undefined if a normal cannot be found.
   */
  geodeticSurfaceNormal(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    if (isNaN(cartesian.x) || isNaN(cartesian.y) || isNaN(cartesian.z)) {
      throw new DeveloperError_default("cartesian has a NaN component");
    }
    if (Cartesian3_default.equalsEpsilon(cartesian, Cartesian3_default.ZERO, Math_default.EPSILON14)) {
      return void 0;
    }
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    result = Cartesian3_default.multiplyComponents(
      cartesian,
      this._oneOverRadiiSquared,
      result
    );
    return Cartesian3_default.normalize(result, result);
  }
  /**
   * Converts the provided cartographic to Cartesian representation.
   *
   * @param {Cartographic} cartographic The cartographic position.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
   *
   * @example
   * //Create a Cartographic and determine it's Cartesian representation on a WGS84 ellipsoid.
   * const position = new Cesium.Cartographic(Cesium.Math.toRadians(21), Cesium.Math.toRadians(78), 5000);
   * const cartesianPosition = Cesium.Ellipsoid.WGS84.cartographicToCartesian(position);
   */
  cartographicToCartesian(cartographic, result) {
    const n = cartographicToCartesianNormal;
    const k = cartographicToCartesianK;
    this.geodeticSurfaceNormalCartographic(cartographic, n);
    Cartesian3_default.multiplyComponents(this._radiiSquared, n, k);
    const gamma = Math.sqrt(Cartesian3_default.dot(n, k));
    Cartesian3_default.divideByScalar(k, gamma, k);
    Cartesian3_default.multiplyByScalar(n, cartographic.height, n);
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    return Cartesian3_default.add(k, n, result);
  }
  /**
   * Converts the provided array of cartographics to an array of Cartesians.
   *
   * @param {Cartographic[]} cartographics An array of cartographic positions.
   * @param {Cartesian3[]} [result] The object onto which to store the result.
   * @returns {Cartesian3[]} The modified result parameter or a new Array instance if none was provided.
   *
   * @example
   * //Convert an array of Cartographics and determine their Cartesian representation on a WGS84 ellipsoid.
   * const positions = [new Cesium.Cartographic(Cesium.Math.toRadians(21), Cesium.Math.toRadians(78), 0),
   *                  new Cesium.Cartographic(Cesium.Math.toRadians(21.321), Cesium.Math.toRadians(78.123), 100),
   *                  new Cesium.Cartographic(Cesium.Math.toRadians(21.645), Cesium.Math.toRadians(78.456), 250)];
   * const cartesianPositions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(positions);
   */
  cartographicArrayToCartesianArray(cartographics, result) {
    Check_default.defined("cartographics", cartographics);
    const length = cartographics.length;
    if (!defined_default(result)) {
      result = new Array(length);
    } else {
      result.length = length;
    }
    for (let i = 0; i < length; i++) {
      result[i] = this.cartographicToCartesian(cartographics[i], result[i]);
    }
    return result;
  }
  /**
   * Converts the provided cartesian to cartographic representation.
   * The cartesian is undefined at the center of the ellipsoid.
   *
   * @param {Cartesian3} cartesian The Cartesian position to convert to cartographic representation.
   * @param {Cartographic} [result] The object onto which to store the result.
   * @returns {Cartographic} The modified result parameter, new Cartographic instance if none was provided, or undefined if the cartesian is at the center of the ellipsoid.
   *
   * @example
   * //Create a Cartesian and determine it's Cartographic representation on a WGS84 ellipsoid.
   * const position = new Cesium.Cartesian3(17832.12, 83234.52, 952313.73);
   * const cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
   */
  cartesianToCartographic(cartesian, result) {
    const p = this.scaleToGeodeticSurface(cartesian, cartesianToCartographicP2);
    if (!defined_default(p)) {
      return void 0;
    }
    const n = this.geodeticSurfaceNormal(p, cartesianToCartographicN2);
    const h = Cartesian3_default.subtract(cartesian, p, cartesianToCartographicH2);
    const longitude = Math.atan2(n.y, n.x);
    const latitude = Math.asin(n.z);
    const height = Math_default.sign(Cartesian3_default.dot(h, cartesian)) * Cartesian3_default.magnitude(h);
    if (!defined_default(result)) {
      return new Cartographic_default(longitude, latitude, height);
    }
    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  }
  /**
   * Converts the provided array of cartesians to an array of cartographics.
   *
   * @param {Cartesian3[]} cartesians An array of Cartesian positions.
   * @param {Cartographic[]} [result] The object onto which to store the result.
   * @returns {Cartographic[]} The modified result parameter or a new Array instance if none was provided.
   *
   * @example
   * //Create an array of Cartesians and determine their Cartographic representation on a WGS84 ellipsoid.
   * const positions = [new Cesium.Cartesian3(17832.12, 83234.52, 952313.73),
   *                  new Cesium.Cartesian3(17832.13, 83234.53, 952313.73),
   *                  new Cesium.Cartesian3(17832.14, 83234.54, 952313.73)]
   * const cartographicPositions = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(positions);
   */
  cartesianArrayToCartographicArray(cartesians, result) {
    Check_default.defined("cartesians", cartesians);
    const length = cartesians.length;
    if (!defined_default(result)) {
      result = new Array(length);
    } else {
      result.length = length;
    }
    for (let i = 0; i < length; ++i) {
      result[i] = this.cartesianToCartographic(cartesians[i], result[i]);
    }
    return result;
  }
  /**
   * Scales the provided Cartesian position along the geodetic surface normal
   * so that it is on the surface of this ellipsoid.  If the position is
   * at the center of the ellipsoid, this function returns undefined.
   *
   * @param {Cartesian3} cartesian The Cartesian position to scale.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter, a new Cartesian3 instance if none was provided, or undefined if the position is at the center.
   */
  scaleToGeodeticSurface(cartesian, result) {
    return scaleToGeodeticSurface_default(
      cartesian,
      this._oneOverRadii,
      this._oneOverRadiiSquared,
      this._centerToleranceSquared,
      result
    );
  }
  /**
   * Scales the provided Cartesian position along the geocentric surface normal
   * so that it is on the surface of this ellipsoid.
   *
   * @param {Cartesian3} cartesian The Cartesian position to scale.
   * @param {Cartesian3} [result] The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
   */
  scaleToGeocentricSurface(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    const positionX = cartesian.x;
    const positionY = cartesian.y;
    const positionZ = cartesian.z;
    const oneOverRadiiSquared = this._oneOverRadiiSquared;
    const beta = 1 / Math.sqrt(
      positionX * positionX * oneOverRadiiSquared.x + positionY * positionY * oneOverRadiiSquared.y + positionZ * positionZ * oneOverRadiiSquared.z
    );
    return Cartesian3_default.multiplyByScalar(cartesian, beta, result);
  }
  /**
   * Transforms a Cartesian X, Y, Z position to the ellipsoid-scaled space by multiplying
   * its components by the result of {@link Ellipsoid#oneOverRadii}.
   *
   * @param {Cartesian3} position The position to transform.
   * @param {Cartesian3} [result] The position to which to copy the result, or undefined to create and
   *        return a new instance.
   * @returns {Cartesian3} The position expressed in the scaled space.  The returned instance is the
   *          one passed as the result parameter if it is not undefined, or a new instance of it is.
   */
  transformPositionToScaledSpace(position, result) {
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    return Cartesian3_default.multiplyComponents(position, this._oneOverRadii, result);
  }
  /**
   * Transforms a Cartesian X, Y, Z position from the ellipsoid-scaled space by multiplying
   * its components by the result of {@link Ellipsoid#radii}.
   *
   * @param {Cartesian3} position The position to transform.
   * @param {Cartesian3} [result] The position to which to copy the result, or undefined to create and
   *        return a new instance.
   * @returns {Cartesian3} The position expressed in the unscaled space.  The returned instance is the
   *          one passed as the result parameter if it is not undefined, or a new instance of it is.
   */
  transformPositionFromScaledSpace(position, result) {
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    return Cartesian3_default.multiplyComponents(position, this._radii, result);
  }
  /**
   * Compares this Ellipsoid against the provided Ellipsoid componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Ellipsoid} [right] The other Ellipsoid.
   * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  equals(right) {
    return this === right || defined_default(right) && Cartesian3_default.equals(this._radii, right._radii);
  }
  /**
   * Creates a string representing this Ellipsoid in the format '(radii.x, radii.y, radii.z)'.
   *
   * @returns {string} A string representing this ellipsoid in the format '(radii.x, radii.y, radii.z)'.
   */
  toString() {
    return this._radii.toString();
  }
  /**
   * Computes a point which is the intersection of the surface normal with the z-axis.
   *
   * @param {Cartesian3} position the position. must be on the surface of the ellipsoid.
   * @param {number} [buffer = 0.0] A buffer to subtract from the ellipsoid size when checking if the point is inside the ellipsoid.
   *                                In earth case, with common earth datums, there is no need for this buffer since the intersection point is always (relatively) very close to the center.
   *                                In WGS84 datum, intersection point is at max z = +-42841.31151331382 (0.673% of z-axis).
   *                                Intersection point could be outside the ellipsoid if the ratio of MajorAxis / AxisOfRotation is bigger than the square root of 2
   * @param {Cartesian3} [result] The cartesian to which to copy the result, or undefined to create and
   *        return a new instance.
   * @returns {Cartesian3 | undefined} the intersection point if it's inside the ellipsoid, undefined otherwise
   *
   * @exception {DeveloperError} position is required.
   * @exception {DeveloperError} Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y).
   * @exception {DeveloperError} Ellipsoid.radii.z must be greater than 0.
   */
  getSurfaceNormalIntersectionWithZAxis(position, buffer, result) {
    Check_default.typeOf.object("position", position);
    if (!Math_default.equalsEpsilon(
      this._radii.x,
      this._radii.y,
      Math_default.EPSILON15
    )) {
      throw new DeveloperError_default(
        "Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)"
      );
    }
    Check_default.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0);
    buffer = buffer ?? 0;
    const squaredXOverSquaredZ = this._squaredXOverSquaredZ;
    if (!defined_default(result)) {
      result = new Cartesian3_default();
    }
    result.x = 0;
    result.y = 0;
    result.z = position.z * (1 - squaredXOverSquaredZ);
    if (Math.abs(result.z) >= this._radii.z - buffer) {
      return void 0;
    }
    return result;
  }
  /**
   * Computes the ellipsoid curvatures at a given position on the surface.
   *
   * @param {Cartesian3} surfacePosition The position on the ellipsoid surface where curvatures will be calculated.
   * @param {Cartesian2} [result] The cartesian to which to copy the result, or undefined to create and return a new instance.
   * @returns {Cartesian2} The local curvature of the ellipsoid surface at the provided position, in east and north directions.
   *
   * @exception {DeveloperError} position is required.
   */
  getLocalCurvature(surfacePosition, result) {
    Check_default.typeOf.object("surfacePosition", surfacePosition);
    if (!defined_default(result)) {
      result = new Cartesian2_default();
    }
    const primeVerticalEndpoint = this.getSurfaceNormalIntersectionWithZAxis(
      surfacePosition,
      0,
      scratchEndpoint
    );
    const primeVerticalRadius = Cartesian3_default.distance(
      surfacePosition,
      primeVerticalEndpoint
    );
    const radiusRatio = this.minimumRadius * primeVerticalRadius / this.maximumRadius ** 2;
    const meridionalRadius = primeVerticalRadius * radiusRatio ** 2;
    return Cartesian2_default.fromElements(
      1 / primeVerticalRadius,
      1 / meridionalRadius,
      result
    );
  }
  /**
   * Computes an approximation of the surface area of a rectangle on the surface of an ellipsoid using
   * Gauss-Legendre 10th order quadrature.
   *
   * @param {Rectangle} rectangle The rectangle used for computing the surface area.
   * @returns {number} The approximate area of the rectangle on the surface of this ellipsoid.
   */
  surfaceArea(rectangle) {
    Check_default.typeOf.object("rectangle", rectangle);
    const minLongitude = rectangle.west;
    let maxLongitude = rectangle.east;
    const minLatitude = rectangle.south;
    const maxLatitude = rectangle.north;
    while (maxLongitude < minLongitude) {
      maxLongitude += Math_default.TWO_PI;
    }
    const radiiSquared = this._radiiSquared;
    const a2 = radiiSquared.x;
    const b2 = radiiSquared.y;
    const c2 = radiiSquared.z;
    const a2b2 = a2 * b2;
    return gaussLegendreQuadrature(minLatitude, maxLatitude, function(lat) {
      const sinPhi = Math.cos(lat);
      const cosPhi = Math.sin(lat);
      return Math.cos(lat) * gaussLegendreQuadrature(minLongitude, maxLongitude, function(lon) {
        const cosTheta = Math.cos(lon);
        const sinTheta = Math.sin(lon);
        return Math.sqrt(
          a2b2 * cosPhi * cosPhi + c2 * (b2 * cosTheta * cosTheta + a2 * sinTheta * sinTheta) * sinPhi * sinPhi
        );
      });
    });
  }
};
Ellipsoid.WGS84 = Object.freeze(
  new Ellipsoid(6378137, 6378137, 6356752314245179e-9)
);
Ellipsoid.UNIT_SPHERE = Object.freeze(new Ellipsoid(1, 1, 1));
Ellipsoid.MOON = Object.freeze(
  new Ellipsoid(
    Math_default.LUNAR_RADIUS,
    Math_default.LUNAR_RADIUS,
    Math_default.LUNAR_RADIUS
  )
);
Ellipsoid.MARS = Object.freeze(new Ellipsoid(3396190, 3396190, 3376200));
Ellipsoid._default = Ellipsoid.WGS84;
Ellipsoid.packedLength = Cartesian3_default.packedLength;
Ellipsoid.prototype.geocentricSurfaceNormal = Cartesian3_default.normalize;
var cartographicToCartesianNormal = new Cartesian3_default();
var cartographicToCartesianK = new Cartesian3_default();
var cartesianToCartographicN2 = new Cartesian3_default();
var cartesianToCartographicP2 = new Cartesian3_default();
var cartesianToCartographicH2 = new Cartesian3_default();
var scratchEndpoint = new Cartesian3_default();
var abscissas = [
  0.14887433898163,
  0.43339539412925,
  0.67940956829902,
  0.86506336668898,
  0.97390652851717,
  0
];
var weights = [
  0.29552422471475,
  0.26926671930999,
  0.21908636251598,
  0.14945134915058,
  0.066671344308684,
  0
];
function gaussLegendreQuadrature(a, b, func) {
  Check_default.typeOf.number("a", a);
  Check_default.typeOf.number("b", b);
  Check_default.typeOf.func("func", func);
  const xMean = 0.5 * (b + a);
  const xRange = 0.5 * (b - a);
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    const dx = xRange * abscissas[i];
    sum += weights[i] * (func(xMean + dx) + func(xMean - dx));
  }
  sum *= xRange;
  return sum;
}
var Ellipsoid_default = Ellipsoid;

// packages/engine/Source/Core/Fullscreen.js
var _supportsFullscreen;
var _names = {
  requestFullscreen: void 0,
  exitFullscreen: void 0,
  fullscreenEnabled: void 0,
  fullscreenElement: void 0,
  fullscreenchange: void 0,
  fullscreenerror: void 0
};
var Fullscreen = {};
Object.defineProperties(Fullscreen, {
  /**
   * The element that is currently fullscreen, if any.  To simply check if the
   * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
   * @memberof Fullscreen
   * @type {object}
   * @readonly
   */
  element: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return document[_names.fullscreenElement];
    }
  },
  /**
   * The name of the event on the document that is fired when fullscreen is
   * entered or exited.  This event name is intended for use with addEventListener.
   * In your event handler, to determine if the browser is in fullscreen mode or not,
   * use {@link Fullscreen#fullscreen}.
   * @memberof Fullscreen
   * @type {string}
   * @readonly
   */
  changeEventName: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return _names.fullscreenchange;
    }
  },
  /**
   * The name of the event that is fired when a fullscreen error
   * occurs.  This event name is intended for use with addEventListener.
   * @memberof Fullscreen
   * @type {string}
   * @readonly
   */
  errorEventName: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return _names.fullscreenerror;
    }
  },
  /**
   * Determine whether the browser will allow an element to be made fullscreen, or not.
   * For example, by default, iframes cannot go fullscreen unless the containing page
   * adds an "allowfullscreen" attribute (or prefixed equivalent).
   * @memberof Fullscreen
   * @type {boolean}
   * @readonly
   */
  enabled: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return document[_names.fullscreenEnabled];
    }
  },
  /**
   * Determines if the browser is currently in fullscreen mode.
   * @memberof Fullscreen
   * @type {boolean}
   * @readonly
   */
  fullscreen: {
    get: function() {
      if (!Fullscreen.supportsFullscreen()) {
        return void 0;
      }
      return Fullscreen.element !== null;
    }
  }
});
Fullscreen.supportsFullscreen = function() {
  if (defined_default(_supportsFullscreen)) {
    return _supportsFullscreen;
  }
  _supportsFullscreen = false;
  const body = document.body;
  if (typeof body.requestFullscreen === "function") {
    _names.requestFullscreen = "requestFullscreen";
    _names.exitFullscreen = "exitFullscreen";
    _names.fullscreenEnabled = "fullscreenEnabled";
    _names.fullscreenElement = "fullscreenElement";
    _names.fullscreenchange = "fullscreenchange";
    _names.fullscreenerror = "fullscreenerror";
    _supportsFullscreen = true;
    return _supportsFullscreen;
  }
  const prefixes = ["webkit", "moz", "o", "ms", "khtml"];
  let name;
  for (let i = 0, len = prefixes.length; i < len; ++i) {
    const prefix = prefixes[i];
    name = `${prefix}RequestFullscreen`;
    if (typeof body[name] === "function") {
      _names.requestFullscreen = name;
      _supportsFullscreen = true;
    } else {
      name = `${prefix}RequestFullScreen`;
      if (typeof body[name] === "function") {
        _names.requestFullscreen = name;
        _supportsFullscreen = true;
      }
    }
    name = `${prefix}ExitFullscreen`;
    if (typeof document[name] === "function") {
      _names.exitFullscreen = name;
    } else {
      name = `${prefix}CancelFullScreen`;
      if (typeof document[name] === "function") {
        _names.exitFullscreen = name;
      }
    }
    name = `${prefix}FullscreenEnabled`;
    if (document[name] !== void 0) {
      _names.fullscreenEnabled = name;
    } else {
      name = `${prefix}FullScreenEnabled`;
      if (document[name] !== void 0) {
        _names.fullscreenEnabled = name;
      }
    }
    name = `${prefix}FullscreenElement`;
    if (document[name] !== void 0) {
      _names.fullscreenElement = name;
    } else {
      name = `${prefix}FullScreenElement`;
      if (document[name] !== void 0) {
        _names.fullscreenElement = name;
      }
    }
    name = `${prefix}fullscreenchange`;
    if (document[`on${name}`] !== void 0) {
      if (prefix === "ms") {
        name = "MSFullscreenChange";
      }
      _names.fullscreenchange = name;
    }
    name = `${prefix}fullscreenerror`;
    if (document[`on${name}`] !== void 0) {
      if (prefix === "ms") {
        name = "MSFullscreenError";
      }
      _names.fullscreenerror = name;
    }
  }
  return _supportsFullscreen;
};
Fullscreen.requestFullscreen = function(element, vrDevice) {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }
  element[_names.requestFullscreen]({ vrDisplay: vrDevice });
};
Fullscreen.exitFullscreen = function() {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }
  document[_names.exitFullscreen]();
};
Fullscreen._names = _names;
var Fullscreen_default = Fullscreen;

// packages/engine/Source/Core/FeatureDetection.js
var theNavigator;
if (typeof navigator !== "undefined") {
  theNavigator = navigator;
} else {
  theNavigator = {};
}
function extractVersion(versionString) {
  const parts = versionString.split(".");
  for (let i = 0, len = parts.length; i < len; ++i) {
    parts[i] = parseInt(parts[i], 10);
  }
  return parts;
}
var isChromeResult;
var chromeVersionResult;
function isChrome() {
  if (!defined_default(isChromeResult)) {
    isChromeResult = false;
    if (!isEdge()) {
      const fields = / Chrome\/([\.0-9]+)/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isChromeResult = true;
        chromeVersionResult = extractVersion(fields[1]);
      }
    }
  }
  return isChromeResult;
}
function chromeVersion() {
  return isChrome() && chromeVersionResult;
}
var isSafariResult;
var safariVersionResult;
function isSafari() {
  if (!defined_default(isSafariResult)) {
    isSafariResult = false;
    if (!isChrome() && !isEdge() && / Safari\/[\.0-9]+/.test(theNavigator.userAgent)) {
      const fields = / Version\/([\.0-9]+)/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isSafariResult = true;
        safariVersionResult = extractVersion(fields[1]);
      }
    }
  }
  return isSafariResult;
}
function safariVersion() {
  return isSafari() && safariVersionResult;
}
var isWebkitResult;
var webkitVersionResult;
function isWebkit() {
  if (!defined_default(isWebkitResult)) {
    isWebkitResult = false;
    const fields = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isWebkitResult = true;
      webkitVersionResult = extractVersion(fields[1]);
      webkitVersionResult.isNightly = !!fields[2];
    }
  }
  return isWebkitResult;
}
function webkitVersion() {
  return isWebkit() && webkitVersionResult;
}
var isEdgeResult;
var edgeVersionResult;
function isEdge() {
  if (!defined_default(isEdgeResult)) {
    isEdgeResult = false;
    const fields = / Edg\/([\.0-9]+)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isEdgeResult = true;
      edgeVersionResult = extractVersion(fields[1]);
    }
  }
  return isEdgeResult;
}
function edgeVersion() {
  return isEdge() && edgeVersionResult;
}
var isFirefoxResult;
var firefoxVersionResult;
function isFirefox() {
  if (!defined_default(isFirefoxResult)) {
    isFirefoxResult = false;
    const fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
    if (fields !== null) {
      isFirefoxResult = true;
      firefoxVersionResult = extractVersion(fields[1]);
    }
  }
  return isFirefoxResult;
}
var isWindowsResult;
function isWindows() {
  if (!defined_default(isWindowsResult)) {
    isWindowsResult = /Windows/i.test(theNavigator.appVersion);
  }
  return isWindowsResult;
}
var isIPadOrIOSResult;
function isIPadOrIOS() {
  if (!defined_default(isIPadOrIOSResult)) {
    isIPadOrIOSResult = navigator.platform === "iPhone" || navigator.platform === "iPod" || navigator.platform === "iPad";
  }
  return isIPadOrIOSResult;
}
function firefoxVersion() {
  return isFirefox() && firefoxVersionResult;
}
var hasPointerEvents;
function supportsPointerEvents() {
  if (!defined_default(hasPointerEvents)) {
    hasPointerEvents = !isFirefox() && typeof PointerEvent !== "undefined" && (!defined_default(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
  }
  return hasPointerEvents;
}
var imageRenderingValueResult;
var supportsImageRenderingPixelatedResult;
function supportsImageRenderingPixelated() {
  if (!defined_default(supportsImageRenderingPixelatedResult)) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute(
      "style",
      "image-rendering: -moz-crisp-edges;image-rendering: pixelated;"
    );
    const tmp = canvas.style.imageRendering;
    supportsImageRenderingPixelatedResult = defined_default(tmp) && tmp !== "";
    if (supportsImageRenderingPixelatedResult) {
      imageRenderingValueResult = tmp;
    }
  }
  return supportsImageRenderingPixelatedResult;
}
function imageRenderingValue() {
  return supportsImageRenderingPixelated() ? imageRenderingValueResult : void 0;
}
function supportsWebP() {
  if (!supportsWebP.initialized) {
    throw new DeveloperError_default(
      "You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP"
    );
  }
  return supportsWebP._result;
}
supportsWebP._promise = void 0;
supportsWebP._result = void 0;
supportsWebP.initialize = function() {
  if (defined_default(supportsWebP._promise)) {
    return supportsWebP._promise;
  }
  supportsWebP._promise = new Promise((resolve) => {
    const image = new Image();
    image.onload = function() {
      supportsWebP._result = image.width > 0 && image.height > 0;
      resolve(supportsWebP._result);
    };
    image.onerror = function() {
      supportsWebP._result = false;
      resolve(supportsWebP._result);
    };
    image.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
  });
  return supportsWebP._promise;
};
Object.defineProperties(supportsWebP, {
  initialized: {
    get: function() {
      return defined_default(supportsWebP._result);
    }
  }
});
var typedArrayTypes = [];
if (typeof ArrayBuffer !== "undefined") {
  typedArrayTypes.push(
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  );
  if (typeof Uint8ClampedArray !== "undefined") {
    typedArrayTypes.push(Uint8ClampedArray);
  }
  if (typeof Uint8ClampedArray !== "undefined") {
    typedArrayTypes.push(Uint8ClampedArray);
  }
  if (typeof BigInt64Array !== "undefined") {
    typedArrayTypes.push(BigInt64Array);
  }
  if (typeof BigUint64Array !== "undefined") {
    typedArrayTypes.push(BigUint64Array);
  }
}
var FeatureDetection = {
  isChrome,
  chromeVersion,
  isSafari,
  safariVersion,
  isWebkit,
  webkitVersion,
  isEdge,
  edgeVersion,
  isFirefox,
  firefoxVersion,
  isWindows,
  isIPadOrIOS,
  hardwareConcurrency: theNavigator.hardwareConcurrency ?? 3,
  supportsPointerEvents,
  supportsImageRenderingPixelated,
  supportsWebP,
  imageRenderingValue,
  typedArrayTypes
};
FeatureDetection.supportsBasis = function(scene) {
  return FeatureDetection.supportsWebAssembly() && scene.context.supportsBasis;
};
FeatureDetection.supportsFullscreen = function() {
  return Fullscreen_default.supportsFullscreen();
};
FeatureDetection.supportsTypedArrays = function() {
  return typeof ArrayBuffer !== "undefined";
};
FeatureDetection.supportsBigInt64Array = function() {
  return typeof BigInt64Array !== "undefined";
};
FeatureDetection.supportsBigUint64Array = function() {
  return typeof BigUint64Array !== "undefined";
};
FeatureDetection.supportsBigInt = function() {
  return typeof BigInt !== "undefined";
};
FeatureDetection.supportsWebWorkers = function() {
  return typeof Worker !== "undefined";
};
FeatureDetection.supportsWebAssembly = function() {
  return typeof WebAssembly !== "undefined";
};
FeatureDetection.supportsWebgl2 = function(scene) {
  Check_default.defined("scene", scene);
  return scene.context.webgl2;
};
FeatureDetection.supportsEsmWebWorkers = function() {
  return !isFirefox() || parseInt(firefoxVersionResult) >= 114;
};
var FeatureDetection_default = FeatureDetection;

export {
  Cartographic_default,
  Cartesian2_default,
  Ellipsoid_default,
  FeatureDetection_default
};
