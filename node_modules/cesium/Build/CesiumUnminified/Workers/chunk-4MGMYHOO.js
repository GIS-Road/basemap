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
  Cartographic_default,
  Ellipsoid_default
} from "./chunk-V7VQKN6N.js";
import {
  Cartesian3_default
} from "./chunk-MPZHGZU6.js";
import {
  Math_default
} from "./chunk-J6BWOHUF.js";
import {
  DeveloperError_default
} from "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Core/WebMercatorProjection.js
var WebMercatorProjection = class _WebMercatorProjection {
  /**
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
   */
  constructor(ellipsoid) {
    this._ellipsoid = ellipsoid ?? Ellipsoid_default.WGS84;
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
   * Converts a Mercator angle, in the range -PI to PI, to a geodetic latitude
   * in the range -PI/2 to PI/2.
   *
   * @param {number} mercatorAngle The angle to convert.
   * @returns {number} The geodetic latitude in radians.
   */
  static mercatorAngleToGeodeticLatitude(mercatorAngle) {
    return Math_default.PI_OVER_TWO - 2 * Math.atan(Math.exp(-mercatorAngle));
  }
  /**
   * Converts a geodetic latitude in radians, in the range -PI/2 to PI/2, to a Mercator
   * angle in the range -PI to PI.
   *
   * @param {number} latitude The geodetic latitude in radians.
   * @returns {number} The Mercator angle.
   */
  static geodeticLatitudeToMercatorAngle(latitude) {
    if (latitude > _WebMercatorProjection.MaximumLatitude) {
      latitude = _WebMercatorProjection.MaximumLatitude;
    } else if (latitude < -_WebMercatorProjection.MaximumLatitude) {
      latitude = -_WebMercatorProjection.MaximumLatitude;
    }
    const sinLatitude = Math.sin(latitude);
    return 0.5 * Math.log((1 + sinLatitude) / (1 - sinLatitude));
  }
  /**
   * Converts geodetic ellipsoid coordinates, in radians, to the equivalent Web Mercator
   * X, Y, Z coordinates expressed in meters and returned in a {@link Cartesian3}.  The height
   * is copied unmodified to the Z coordinate.
   *
   * @param {Cartographic} cartographic The cartographic coordinates in radians.
   * @param {Cartesian3} [result] The instance to which to copy the result, or undefined if a
   *        new instance should be created.
   * @returns {Cartesian3} The equivalent web mercator X, Y, Z coordinates, in meters.
   */
  project(cartographic, result) {
    const semimajorAxis = this._semimajorAxis;
    const x = cartographic.longitude * semimajorAxis;
    const y = _WebMercatorProjection.geodeticLatitudeToMercatorAngle(
      cartographic.latitude
    ) * semimajorAxis;
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
   * Converts Web Mercator X, Y coordinates, expressed in meters, to a {@link Cartographic}
   * containing geodetic ellipsoid coordinates.  The Z coordinate is copied unmodified to the
   * height.
   *
   * @param {Cartesian3} cartesian The web mercator Cartesian position to unrproject with height (z) in meters.
   * @param {Cartographic} [result] The instance to which to copy the result, or undefined if a
   *        new instance should be created.
   * @returns {Cartographic} The equivalent cartographic coordinates.
   */
  unproject(cartesian, result) {
    if (!defined_default(cartesian)) {
      throw new DeveloperError_default("cartesian is required");
    }
    const oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
    const longitude = cartesian.x * oneOverEarthSemimajorAxis;
    const latitude = _WebMercatorProjection.mercatorAngleToGeodeticLatitude(
      cartesian.y * oneOverEarthSemimajorAxis
    );
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
WebMercatorProjection.MaximumLatitude = WebMercatorProjection.mercatorAngleToGeodeticLatitude(Math.PI);
var WebMercatorProjection_default = WebMercatorProjection;

export {
  WebMercatorProjection_default
};
