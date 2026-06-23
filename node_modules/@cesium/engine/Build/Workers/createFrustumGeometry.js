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
  FrustumGeometry_default
} from "./chunk-EF2QYXGA.js";
import "./chunk-VQYETPWC.js";
import "./chunk-E7VQ76KE.js";
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
import "./chunk-MPZHGZU6.js";
import "./chunk-J6BWOHUF.js";
import "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Workers/createFrustumGeometry.js
function createFrustumGeometry(frustumGeometry, offset) {
  if (defined_default(offset)) {
    frustumGeometry = FrustumGeometry_default.unpack(frustumGeometry, offset);
  }
  return FrustumGeometry_default.createGeometry(frustumGeometry);
}
var createFrustumGeometry_default = createFrustumGeometry;
export {
  createFrustumGeometry_default as default
};
