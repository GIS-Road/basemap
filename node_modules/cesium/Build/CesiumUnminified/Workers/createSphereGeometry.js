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
  EllipsoidGeometry_default
} from "./chunk-DOBXCNC3.js";
import "./chunk-IYOUHCZB.js";
import {
  VertexFormat_default
} from "./chunk-VQYETPWC.js";
import "./chunk-S4MCOY6I.js";
import "./chunk-KSSWJIZW.js";
import "./chunk-EBSIOBXY.js";
import "./chunk-XZMBNNDX.js";
import "./chunk-C6J67V5A.js";
import "./chunk-MYP774IS.js";
import "./chunk-Q3PY526V.js";
import "./chunk-P3CK7MCY.js";
import "./chunk-TKKIREQ6.js";
import "./chunk-Y5BF6AFU.js";
import "./chunk-V7VQKN6N.js";
import {
  Cartesian3_default
} from "./chunk-MPZHGZU6.js";
import "./chunk-J6BWOHUF.js";
import {
  Check_default
} from "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Core/SphereGeometry.js
function SphereGeometry(options) {
  const radius = options.radius ?? 1;
  const radii = new Cartesian3_default(radius, radius, radius);
  const ellipsoidOptions = {
    radii,
    stackPartitions: options.stackPartitions,
    slicePartitions: options.slicePartitions,
    vertexFormat: options.vertexFormat
  };
  this._ellipsoidGeometry = new EllipsoidGeometry_default(ellipsoidOptions);
  this._workerName = "createSphereGeometry";
}
SphereGeometry.packedLength = EllipsoidGeometry_default.packedLength;
SphereGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  return EllipsoidGeometry_default.pack(value._ellipsoidGeometry, array, startingIndex);
};
var scratchEllipsoidGeometry = new EllipsoidGeometry_default();
var scratchOptions = {
  radius: void 0,
  radii: new Cartesian3_default(),
  vertexFormat: new VertexFormat_default(),
  stackPartitions: void 0,
  slicePartitions: void 0
};
SphereGeometry.unpack = function(array, startingIndex, result) {
  const ellipsoidGeometry = EllipsoidGeometry_default.unpack(
    array,
    startingIndex,
    scratchEllipsoidGeometry
  );
  scratchOptions.vertexFormat = VertexFormat_default.clone(
    ellipsoidGeometry._vertexFormat,
    scratchOptions.vertexFormat
  );
  scratchOptions.stackPartitions = ellipsoidGeometry._stackPartitions;
  scratchOptions.slicePartitions = ellipsoidGeometry._slicePartitions;
  if (!defined_default(result)) {
    scratchOptions.radius = ellipsoidGeometry._radii.x;
    return new SphereGeometry(scratchOptions);
  }
  Cartesian3_default.clone(ellipsoidGeometry._radii, scratchOptions.radii);
  result._ellipsoidGeometry = new EllipsoidGeometry_default(scratchOptions);
  return result;
};
SphereGeometry.createGeometry = function(sphereGeometry) {
  return EllipsoidGeometry_default.createGeometry(sphereGeometry._ellipsoidGeometry);
};
var SphereGeometry_default = SphereGeometry;

// packages/engine/Source/Workers/createSphereGeometry.js
function createSphereGeometry(sphereGeometry, offset) {
  if (defined_default(offset)) {
    sphereGeometry = SphereGeometry_default.unpack(sphereGeometry, offset);
  }
  return SphereGeometry_default.createGeometry(sphereGeometry);
}
var createSphereGeometry_default = createSphereGeometry;
export {
  createSphereGeometry_default as default
};
