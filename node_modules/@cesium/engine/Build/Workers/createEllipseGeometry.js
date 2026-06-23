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
  EllipseGeometry_default
} from "./chunk-KKOSKAZB.js";
import "./chunk-YLY7NKAB.js";
import "./chunk-FRQZECAO.js";
import "./chunk-ACXQXN46.js";
import "./chunk-7J2HKPRH.js";
import "./chunk-Y57HREW5.js";
import "./chunk-IYOUHCZB.js";
import "./chunk-VQYETPWC.js";
import "./chunk-3VFEWOBI.js";
import "./chunk-E7VQ76KE.js";
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
import {
  Ellipsoid_default
} from "./chunk-V7VQKN6N.js";
import {
  Cartesian3_default
} from "./chunk-MPZHGZU6.js";
import "./chunk-J6BWOHUF.js";
import "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Workers/createEllipseGeometry.js
function createEllipseGeometry(ellipseGeometry, offset) {
  if (defined_default(offset)) {
    ellipseGeometry = EllipseGeometry_default.unpack(ellipseGeometry, offset);
  }
  ellipseGeometry._center = Cartesian3_default.clone(ellipseGeometry._center);
  ellipseGeometry._ellipsoid = Ellipsoid_default.clone(ellipseGeometry._ellipsoid);
  return EllipseGeometry_default.createGeometry(ellipseGeometry);
}
var createEllipseGeometry_default = createEllipseGeometry;
export {
  createEllipseGeometry_default as default
};
