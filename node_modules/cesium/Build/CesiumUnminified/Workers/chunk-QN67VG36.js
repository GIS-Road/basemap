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
  FeatureDetection_default
} from "./chunk-V7VQKN6N.js";
import {
  Frozen_default
} from "./chunk-MPZHGZU6.js";
import {
  Math_default
} from "./chunk-J6BWOHUF.js";
import {
  Check_default
} from "./chunk-AYKR4VBR.js";
import {
  defined_default
} from "./chunk-ZP7JMQV4.js";

// packages/engine/Source/Core/Color.js
function hue2rgb(m1, m2, h) {
  if (h < 0) {
    h += 1;
  }
  if (h > 1) {
    h -= 1;
  }
  if (h * 6 < 1) {
    return m1 + (m2 - m1) * 6 * h;
  }
  if (h * 2 < 1) {
    return m2;
  }
  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }
  return m1;
}
var Color = class _Color {
  /**
   * @param {number} [red=1.0] The red component.
   * @param {number} [green=1.0] The green component.
   * @param {number} [blue=1.0] The blue component.
   * @param {number} [alpha=1.0] The alpha component.
   */
  constructor(red, green, blue, alpha) {
    this.red = red ?? 1;
    this.green = green ?? 1;
    this.blue = blue ?? 1;
    this.alpha = alpha ?? 1;
  }
  /**
   * Creates a Color instance from a {@link Cartesian4}. <code>x</code>, <code>y</code>, <code>z</code>,
   * and <code>w</code> map to <code>red</code>, <code>green</code>, <code>blue</code>, and <code>alpha</code>, respectively.
   *
   * @param {Cartesian4} cartesian The source cartesian.
   * @param {Color} [result] The object onto which to store the result.
   * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
   */
  static fromCartesian4(cartesian, result) {
    Check_default.typeOf.object("cartesian", cartesian);
    if (!defined_default(result)) {
      return new _Color(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    }
    result.red = cartesian.x;
    result.green = cartesian.y;
    result.blue = cartesian.z;
    result.alpha = cartesian.w;
    return result;
  }
  /**
   * Creates a new Color specified using red, green, blue, and alpha values
   * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
   *
   * @param {number} [red=255] The red component.
   * @param {number} [green=255] The green component.
   * @param {number} [blue=255] The blue component.
   * @param {number} [alpha=255] The alpha component.
   * @param {Color} [result] The object onto which to store the result.
   * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
   */
  static fromBytes(red, green, blue, alpha, result) {
    red = _Color.byteToFloat(red ?? 255);
    green = _Color.byteToFloat(green ?? 255);
    blue = _Color.byteToFloat(blue ?? 255);
    alpha = _Color.byteToFloat(alpha ?? 255);
    if (!defined_default(result)) {
      return new _Color(red, green, blue, alpha);
    }
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
  }
  /**
   * Creates a new Color that has the same red, green, and blue components
   * of the specified color, but with the specified alpha value.
   *
   * @param {Color} color The base color
   * @param {number} alpha The new alpha component.
   * @param {Color} [result] The object onto which to store the result.
   * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
   *
   * @example const translucentRed = Cesium.Color.fromAlpha(Cesium.Color.RED, 0.9);
   */
  static fromAlpha(color, alpha, result) {
    Check_default.typeOf.object("color", color);
    Check_default.typeOf.number("alpha", alpha);
    if (!defined_default(result)) {
      return new _Color(color.red, color.green, color.blue, alpha);
    }
    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = alpha;
    return result;
  }
  /**
   * Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
   * of the system.
   *
   * @param {number} rgba A single numeric unsigned 32-bit RGBA value.
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The color object.
   *
   * @example
   * const color = Cesium.Color.fromRgba(0x67ADDFFF);
   *
   * @see Color#toRgba
   */
  static fromRgba(rgba, result) {
    scratchUint32Array[0] = rgba;
    return _Color.fromBytes(
      scratchUint8Array[0],
      scratchUint8Array[1],
      scratchUint8Array[2],
      scratchUint8Array[3],
      result
    );
  }
  /**
   * Creates a Color instance from hue, saturation, and lightness.
   *
   * @param {number} [hue=0] The hue angle 0...1
   * @param {number} [saturation=0] The saturation value 0...1
   * @param {number} [lightness=0] The lightness value 0...1
   * @param {number} [alpha=1.0] The alpha component 0...1
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The color object.
   *
   * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS color values}
   */
  static fromHsl(hue, saturation, lightness, alpha, result) {
    hue = (hue ?? 0) % 1;
    saturation = saturation ?? 0;
    lightness = lightness ?? 0;
    alpha = alpha ?? 1;
    let red = lightness;
    let green = lightness;
    let blue = lightness;
    if (saturation !== 0) {
      let m2;
      if (lightness < 0.5) {
        m2 = lightness * (1 + saturation);
      } else {
        m2 = lightness + saturation - lightness * saturation;
      }
      const m1 = 2 * lightness - m2;
      red = hue2rgb(m1, m2, hue + 1 / 3);
      green = hue2rgb(m1, m2, hue);
      blue = hue2rgb(m1, m2, hue - 1 / 3);
    }
    if (!defined_default(result)) {
      return new _Color(red, green, blue, alpha);
    }
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
  }
  /**
   * Creates a random color using the provided options. For reproducible random colors, you should
   * call {@link CesiumMath#setRandomNumberSeed} once at the beginning of your application.
   *
   * @param {object} [options] Object with the following properties:
   * @param {number} [options.red] If specified, the red component to use instead of a randomized value.
   * @param {number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
   * @param {number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
   * @param {number} [options.green] If specified, the green component to use instead of a randomized value.
   * @param {number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
   * @param {number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
   * @param {number} [options.blue] If specified, the blue component to use instead of a randomized value.
   * @param {number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
   * @param {number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
   * @param {number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
   * @param {number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
   * @param {number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The modified result parameter or a new instance if result was undefined.
   *
   * @exception {DeveloperError} minimumRed must be less than or equal to maximumRed.
   * @exception {DeveloperError} minimumGreen must be less than or equal to maximumGreen.
   * @exception {DeveloperError} minimumBlue must be less than or equal to maximumBlue.
   * @exception {DeveloperError} minimumAlpha must be less than or equal to maximumAlpha.
   *
   * @example
   * //Create a completely random color
   * const color = Cesium.Color.fromRandom();
   *
   * //Create a random shade of yellow.
   * const color1 = Cesium.Color.fromRandom({
   *     red : 1.0,
   *     green : 1.0,
   *     alpha : 1.0
   * });
   *
   * //Create a random bright color.
   * const color2 = Cesium.Color.fromRandom({
   *     minimumRed : 0.75,
   *     minimumGreen : 0.75,
   *     minimumBlue : 0.75,
   *     alpha : 1.0
   * });
   */
  static fromRandom(options, result) {
    options = options ?? Frozen_default.EMPTY_OBJECT;
    let red = options.red;
    if (!defined_default(red)) {
      const minimumRed = options.minimumRed ?? 0;
      const maximumRed = options.maximumRed ?? 1;
      Check_default.typeOf.number.lessThanOrEquals(
        "minimumRed",
        minimumRed,
        maximumRed
      );
      red = minimumRed + Math_default.nextRandomNumber() * (maximumRed - minimumRed);
    }
    let green = options.green;
    if (!defined_default(green)) {
      const minimumGreen = options.minimumGreen ?? 0;
      const maximumGreen = options.maximumGreen ?? 1;
      Check_default.typeOf.number.lessThanOrEquals(
        "minimumGreen",
        minimumGreen,
        maximumGreen
      );
      green = minimumGreen + Math_default.nextRandomNumber() * (maximumGreen - minimumGreen);
    }
    let blue = options.blue;
    if (!defined_default(blue)) {
      const minimumBlue = options.minimumBlue ?? 0;
      const maximumBlue = options.maximumBlue ?? 1;
      Check_default.typeOf.number.lessThanOrEquals(
        "minimumBlue",
        minimumBlue,
        maximumBlue
      );
      blue = minimumBlue + Math_default.nextRandomNumber() * (maximumBlue - minimumBlue);
    }
    let alpha = options.alpha;
    if (!defined_default(alpha)) {
      const minimumAlpha = options.minimumAlpha ?? 0;
      const maximumAlpha = options.maximumAlpha ?? 1;
      Check_default.typeOf.number.lessThanOrEquals(
        "minimumAlpha",
        minimumAlpha,
        maximumAlpha
      );
      alpha = minimumAlpha + Math_default.nextRandomNumber() * (maximumAlpha - minimumAlpha);
    }
    if (!defined_default(result)) {
      return new _Color(red, green, blue, alpha);
    }
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
  }
  /**
   * Creates a Color instance from a CSS color value.
   *
   * @param {string} color The CSS color value in #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), or hsla() format.
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The color object, or undefined if the string was not a valid CSS color.
   *
   *
   * @example
   * const cesiumBlue = Cesium.Color.fromCssColorString('#67ADDF');
   * const green = Cesium.Color.fromCssColorString('green');
   *
   * @see {@link http://www.w3.org/TR/css3-color|CSS color values}
   */
  static fromCssColorString(color, result) {
    Check_default.typeOf.string("color", color);
    if (!defined_default(result)) {
      result = new _Color();
    }
    color = color.trim();
    const namedColor = _Color[color.toUpperCase()];
    if (defined_default(namedColor)) {
      _Color.clone(namedColor, result);
      return result;
    }
    let matches = rgbaMatcher.exec(color);
    if (matches !== null) {
      result.red = parseInt(matches[1], 16) / 15;
      result.green = parseInt(matches[2], 16) / 15;
      result.blue = parseInt(matches[3], 16) / 15;
      result.alpha = parseInt(matches[4] ?? "f", 16) / 15;
      return result;
    }
    matches = rrggbbaaMatcher.exec(color);
    if (matches !== null) {
      result.red = parseInt(matches[1], 16) / 255;
      result.green = parseInt(matches[2], 16) / 255;
      result.blue = parseInt(matches[3], 16) / 255;
      result.alpha = parseInt(matches[4] ?? "ff", 16) / 255;
      return result;
    }
    matches = rgbParenthesesMatcher.exec(color);
    if (matches !== null) {
      result.red = parseFloat(matches[1]) / ("%" === matches[1].substr(-1) ? 100 : 255);
      result.green = parseFloat(matches[2]) / ("%" === matches[2].substr(-1) ? 100 : 255);
      result.blue = parseFloat(matches[3]) / ("%" === matches[3].substr(-1) ? 100 : 255);
      result.alpha = parseFloat(matches[4] ?? "1.0");
      return result;
    }
    matches = hslParenthesesMatcher.exec(color);
    if (matches !== null) {
      return _Color.fromHsl(
        parseFloat(matches[1]) / 360,
        parseFloat(matches[2]) / 100,
        parseFloat(matches[3]) / 100,
        parseFloat(matches[4] ?? "1.0"),
        result
      );
    }
    result = void 0;
    return result;
  }
  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Color} value The value to pack.
   * @param {number[]|TypedArray} array The array to pack into.
   * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {number[]|TypedArray} The array that was packed into
   */
  static pack(value, array, startingIndex) {
    Check_default.typeOf.object("value", value);
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    array[startingIndex++] = value.red;
    array[startingIndex++] = value.green;
    array[startingIndex++] = value.blue;
    array[startingIndex] = value.alpha;
    return array;
  }
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {number[]|TypedArray} array The packed array.
   * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Color} [result] The object into which to store the result.
   * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
   */
  static unpack(array, startingIndex, result) {
    Check_default.defined("array", array);
    startingIndex = startingIndex ?? 0;
    if (!defined_default(result)) {
      result = new _Color();
    }
    result.red = array[startingIndex++];
    result.green = array[startingIndex++];
    result.blue = array[startingIndex++];
    result.alpha = array[startingIndex];
    return result;
  }
  /**
   * Converts a 'byte' color component in the range of 0 to 255 into
   * a 'float' color component in the range of 0 to 1.0.
   *
   * @param {number} number The number to be converted.
   * @returns {number} The converted number.
   */
  static byteToFloat(number) {
    return number / 255;
  }
  /**
   * Converts a 'float' color component in the range of 0 to 1.0 into
   * a 'byte' color component in the range of 0 to 255.
   *
   * @param {number} number The number to be converted.
   * @returns {number} The converted number.
   */
  static floatToByte(number) {
    return number === 1 ? 255 : number * 256 | 0;
  }
  /**
   * Duplicates a Color.
   *
   * @param {Color} color The Color to duplicate.
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
   */
  static clone(color, result) {
    if (!defined_default(color)) {
      return void 0;
    }
    if (!defined_default(result)) {
      return new _Color(color.red, color.green, color.blue, color.alpha);
    }
    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = color.alpha;
    return result;
  }
  /**
   * Returns true if the first Color equals the second color.
   *
   * @param {Color} [left] The first Color to compare for equality.
   * @param {Color} [right] The second Color to compare for equality.
   * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
   */
  static equals(left, right) {
    return left === right || //
    defined_default(left) && //
    defined_default(right) && //
    left.red === right.red && //
    left.green === right.green && //
    left.blue === right.blue && //
    left.alpha === right.alpha;
  }
  /**
   * @private
   */
  static equalsArray(color, array, offset) {
    return color.red === array[offset] && color.green === array[offset + 1] && color.blue === array[offset + 2] && color.alpha === array[offset + 3];
  }
  /**
   * Returns a duplicate of a Color instance.
   *
   * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
   * @returns {Color} The modified result parameter or a new instance if result was undefined.
   */
  clone(result) {
    return _Color.clone(this, result);
  }
  /**
   * Returns true if this Color equals other.
   *
   * @param {Color} [other] The Color to compare for equality.
   * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
   */
  equals(other) {
    return _Color.equals(this, other);
  }
  /**
   * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
   *
   * @param {Color} other The Color to compare for equality.
   * @param {number} [epsilon=0.0] The epsilon to use for equality testing.
   * @returns {boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
   */
  equalsEpsilon(other, epsilon) {
    return this === other || //
    defined_default(other) && //
    Math.abs(this.red - other.red) <= epsilon && //
    Math.abs(this.green - other.green) <= epsilon && //
    Math.abs(this.blue - other.blue) <= epsilon && //
    Math.abs(this.alpha - other.alpha) <= epsilon;
  }
  /**
   * Creates a string representing this Color in the format '(red, green, blue, alpha)'.
   *
   * @returns {string} A string representing this Color in the format '(red, green, blue, alpha)'.
   */
  toString() {
    return `(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }
  /**
   * Creates a string containing the CSS color value for this color.
   *
   * @returns {string} The CSS equivalent of this color.
   *
   * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB or RGBA color values}
   */
  toCssColorString() {
    const red = _Color.floatToByte(this.red);
    const green = _Color.floatToByte(this.green);
    const blue = _Color.floatToByte(this.blue);
    if (this.alpha === 1) {
      return `rgb(${red},${green},${blue})`;
    }
    return `rgba(${red},${green},${blue},${this.alpha})`;
  }
  /**
   * Creates a string containing CSS hex string color value for this color.
   *
   * @returns {string} The CSS hex string equivalent of this color.
   */
  toCssHexString() {
    let r = _Color.floatToByte(this.red).toString(16);
    if (r.length < 2) {
      r = `0${r}`;
    }
    let g = _Color.floatToByte(this.green).toString(16);
    if (g.length < 2) {
      g = `0${g}`;
    }
    let b = _Color.floatToByte(this.blue).toString(16);
    if (b.length < 2) {
      b = `0${b}`;
    }
    if (this.alpha < 1) {
      let hexAlpha = _Color.floatToByte(this.alpha).toString(16);
      if (hexAlpha.length < 2) {
        hexAlpha = `0${hexAlpha}`;
      }
      return `#${r}${g}${b}${hexAlpha}`;
    }
    return `#${r}${g}${b}`;
  }
  /**
   * Converts this color to an array of red, green, blue, and alpha values
   * that are in the range of 0 to 255.
   *
   * @param {number[]} [result] The array to store the result in, if undefined a new instance will be created.
   * @returns {number[]} The modified result parameter or a new instance if result was undefined.
   */
  toBytes(result) {
    const red = _Color.floatToByte(this.red);
    const green = _Color.floatToByte(this.green);
    const blue = _Color.floatToByte(this.blue);
    const alpha = _Color.floatToByte(this.alpha);
    if (!defined_default(result)) {
      return [red, green, blue, alpha];
    }
    result[0] = red;
    result[1] = green;
    result[2] = blue;
    result[3] = alpha;
    return result;
  }
  /**
   * Converts RGBA values in bytes to a single numeric unsigned 32-bit RGBA value, using the endianness
   * of the system.
   *
   * @returns {number} A single numeric unsigned 32-bit RGBA value.
   *
   * @see Color.toRgba
   */
  static bytesToRgba(red, green, blue, alpha) {
    scratchUint8Array[0] = red;
    scratchUint8Array[1] = green;
    scratchUint8Array[2] = blue;
    scratchUint8Array[3] = alpha;
    return scratchUint32Array[0];
  }
  /**
   * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
   * of the system.
   *
   * @returns {number} A single numeric unsigned 32-bit RGBA value.
   *
   *
   * @example
   * const rgba = Cesium.Color.BLUE.toRgba();
   *
   * @see Color.fromRgba
   */
  toRgba() {
    return _Color.bytesToRgba(
      _Color.floatToByte(this.red),
      _Color.floatToByte(this.green),
      _Color.floatToByte(this.blue),
      _Color.floatToByte(this.alpha)
    );
  }
  /**
   * Brightens this color by the provided magnitude.
   *
   * @param {number} magnitude A positive number indicating the amount to brighten.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   *
   * @example
   * const brightBlue = Cesium.Color.BLUE.brighten(0.5, new Cesium.Color());
   */
  brighten(magnitude, result) {
    Check_default.typeOf.number("magnitude", magnitude);
    Check_default.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0);
    Check_default.typeOf.object("result", result);
    magnitude = 1 - magnitude;
    result.red = 1 - (1 - this.red) * magnitude;
    result.green = 1 - (1 - this.green) * magnitude;
    result.blue = 1 - (1 - this.blue) * magnitude;
    result.alpha = this.alpha;
    return result;
  }
  /**
   * Darkens this color by the provided magnitude.
   *
   * @param {number} magnitude A positive number indicating the amount to darken.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   *
   * @example
   * const darkBlue = Cesium.Color.BLUE.darken(0.5, new Cesium.Color());
   */
  darken(magnitude, result) {
    Check_default.typeOf.number("magnitude", magnitude);
    Check_default.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0);
    Check_default.typeOf.object("result", result);
    magnitude = 1 - magnitude;
    result.red = this.red * magnitude;
    result.green = this.green * magnitude;
    result.blue = this.blue * magnitude;
    result.alpha = this.alpha;
    return result;
  }
  /**
   * Creates a new Color that has the same red, green, and blue components
   * as this Color, but with the specified alpha value.
   *
   * @param {number} alpha The new alpha component.
   * @param {Color} [result] The object onto which to store the result.
   * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
   *
   * @example const translucentRed = Cesium.Color.RED.withAlpha(0.9);
   */
  withAlpha(alpha, result) {
    return _Color.fromAlpha(this, alpha, result);
  }
  /**
   * Computes the componentwise sum of two Colors.
   *
   * @param {Color} left The first Color.
   * @param {Color} right The second Color.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static add(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.red = left.red + right.red;
    result.green = left.green + right.green;
    result.blue = left.blue + right.blue;
    result.alpha = left.alpha + right.alpha;
    return result;
  }
  /**
   * Computes the componentwise difference of two Colors.
   *
   * @param {Color} left The first Color.
   * @param {Color} right The second Color.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static subtract(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.red = left.red - right.red;
    result.green = left.green - right.green;
    result.blue = left.blue - right.blue;
    result.alpha = left.alpha - right.alpha;
    return result;
  }
  /**
   * Computes the componentwise product of two Colors.
   *
   * @param {Color} left The first Color.
   * @param {Color} right The second Color.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static multiply(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.red = left.red * right.red;
    result.green = left.green * right.green;
    result.blue = left.blue * right.blue;
    result.alpha = left.alpha * right.alpha;
    return result;
  }
  /**
   * Computes the componentwise quotient of two Colors.
   *
   * @param {Color} left The first Color.
   * @param {Color} right The second Color.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static divide(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.red = left.red / right.red;
    result.green = left.green / right.green;
    result.blue = left.blue / right.blue;
    result.alpha = left.alpha / right.alpha;
    return result;
  }
  /**
   * Computes the componentwise modulus of two Colors.
   *
   * @param {Color} left The first Color.
   * @param {Color} right The second Color.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static mod(left, right, result) {
    Check_default.typeOf.object("left", left);
    Check_default.typeOf.object("right", right);
    Check_default.typeOf.object("result", result);
    result.red = left.red % right.red;
    result.green = left.green % right.green;
    result.blue = left.blue % right.blue;
    result.alpha = left.alpha % right.alpha;
    return result;
  }
  /**
   * Computes the linear interpolation or extrapolation at t between the provided colors.
   *
   * @param {Color} start The color corresponding to t at 0.0.
   * @param {Color} end The color corresponding to t at 1.0.
   * @param {number} t The point along t at which to interpolate.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static lerp(start, end, t, result) {
    Check_default.typeOf.object("start", start);
    Check_default.typeOf.object("end", end);
    Check_default.typeOf.number("t", t);
    Check_default.typeOf.object("result", result);
    result.red = Math_default.lerp(start.red, end.red, t);
    result.green = Math_default.lerp(start.green, end.green, t);
    result.blue = Math_default.lerp(start.blue, end.blue, t);
    result.alpha = Math_default.lerp(start.alpha, end.alpha, t);
    return result;
  }
  /**
   * Multiplies the provided Color componentwise by the provided scalar.
   *
   * @param {Color} color The Color to be scaled.
   * @param {number} scalar The scalar to multiply with.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static multiplyByScalar(color, scalar, result) {
    Check_default.typeOf.object("color", color);
    Check_default.typeOf.number("scalar", scalar);
    Check_default.typeOf.object("result", result);
    result.red = color.red * scalar;
    result.green = color.green * scalar;
    result.blue = color.blue * scalar;
    result.alpha = color.alpha * scalar;
    return result;
  }
  /**
   * Divides the provided Color componentwise by the provided scalar.
   *
   * @param {Color} color The Color to be divided.
   * @param {number} scalar The scalar to divide with.
   * @param {Color} result The object onto which to store the result.
   * @returns {Color} The modified result parameter.
   */
  static divideByScalar(color, scalar, result) {
    Check_default.typeOf.object("color", color);
    Check_default.typeOf.number("scalar", scalar);
    Check_default.typeOf.object("result", result);
    result.red = color.red / scalar;
    result.green = color.green / scalar;
    result.blue = color.blue / scalar;
    result.alpha = color.alpha / scalar;
    return result;
  }
};
var scratchArrayBuffer;
var scratchUint32Array;
var scratchUint8Array;
if (FeatureDetection_default.supportsTypedArrays()) {
  scratchArrayBuffer = new ArrayBuffer(4);
  scratchUint32Array = new Uint32Array(scratchArrayBuffer);
  scratchUint8Array = new Uint8Array(scratchArrayBuffer);
}
var rgbaMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
var rrggbbaaMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
var rgbParenthesesMatcher = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
var hslParenthesesMatcher = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
Color.packedLength = 4;
Color.ALICEBLUE = Object.freeze(Color.fromCssColorString("#F0F8FF"));
Color.ANTIQUEWHITE = Object.freeze(Color.fromCssColorString("#FAEBD7"));
Color.AQUA = Object.freeze(Color.fromCssColorString("#00FFFF"));
Color.AQUAMARINE = Object.freeze(Color.fromCssColorString("#7FFFD4"));
Color.AZURE = Object.freeze(Color.fromCssColorString("#F0FFFF"));
Color.BEIGE = Object.freeze(Color.fromCssColorString("#F5F5DC"));
Color.BISQUE = Object.freeze(Color.fromCssColorString("#FFE4C4"));
Color.BLACK = Object.freeze(Color.fromCssColorString("#000000"));
Color.BLANCHEDALMOND = Object.freeze(Color.fromCssColorString("#FFEBCD"));
Color.BLUE = Object.freeze(Color.fromCssColorString("#0000FF"));
Color.BLUEVIOLET = Object.freeze(Color.fromCssColorString("#8A2BE2"));
Color.BROWN = Object.freeze(Color.fromCssColorString("#A52A2A"));
Color.BURLYWOOD = Object.freeze(Color.fromCssColorString("#DEB887"));
Color.CADETBLUE = Object.freeze(Color.fromCssColorString("#5F9EA0"));
Color.CHARTREUSE = Object.freeze(Color.fromCssColorString("#7FFF00"));
Color.CHOCOLATE = Object.freeze(Color.fromCssColorString("#D2691E"));
Color.CORAL = Object.freeze(Color.fromCssColorString("#FF7F50"));
Color.CORNFLOWERBLUE = Object.freeze(Color.fromCssColorString("#6495ED"));
Color.CORNSILK = Object.freeze(Color.fromCssColorString("#FFF8DC"));
Color.CRIMSON = Object.freeze(Color.fromCssColorString("#DC143C"));
Color.CYAN = Object.freeze(Color.fromCssColorString("#00FFFF"));
Color.DARKBLUE = Object.freeze(Color.fromCssColorString("#00008B"));
Color.DARKCYAN = Object.freeze(Color.fromCssColorString("#008B8B"));
Color.DARKGOLDENROD = Object.freeze(Color.fromCssColorString("#B8860B"));
Color.DARKGRAY = Object.freeze(Color.fromCssColorString("#A9A9A9"));
Color.DARKGREEN = Object.freeze(Color.fromCssColorString("#006400"));
Color.DARKGREY = Color.DARKGRAY;
Color.DARKKHAKI = Object.freeze(Color.fromCssColorString("#BDB76B"));
Color.DARKMAGENTA = Object.freeze(Color.fromCssColorString("#8B008B"));
Color.DARKOLIVEGREEN = Object.freeze(Color.fromCssColorString("#556B2F"));
Color.DARKORANGE = Object.freeze(Color.fromCssColorString("#FF8C00"));
Color.DARKORCHID = Object.freeze(Color.fromCssColorString("#9932CC"));
Color.DARKRED = Object.freeze(Color.fromCssColorString("#8B0000"));
Color.DARKSALMON = Object.freeze(Color.fromCssColorString("#E9967A"));
Color.DARKSEAGREEN = Object.freeze(Color.fromCssColorString("#8FBC8F"));
Color.DARKSLATEBLUE = Object.freeze(Color.fromCssColorString("#483D8B"));
Color.DARKSLATEGRAY = Object.freeze(Color.fromCssColorString("#2F4F4F"));
Color.DARKSLATEGREY = Color.DARKSLATEGRAY;
Color.DARKTURQUOISE = Object.freeze(Color.fromCssColorString("#00CED1"));
Color.DARKVIOLET = Object.freeze(Color.fromCssColorString("#9400D3"));
Color.DEEPPINK = Object.freeze(Color.fromCssColorString("#FF1493"));
Color.DEEPSKYBLUE = Object.freeze(Color.fromCssColorString("#00BFFF"));
Color.DIMGRAY = Object.freeze(Color.fromCssColorString("#696969"));
Color.DIMGREY = Color.DIMGRAY;
Color.DODGERBLUE = Object.freeze(Color.fromCssColorString("#1E90FF"));
Color.FIREBRICK = Object.freeze(Color.fromCssColorString("#B22222"));
Color.FLORALWHITE = Object.freeze(Color.fromCssColorString("#FFFAF0"));
Color.FORESTGREEN = Object.freeze(Color.fromCssColorString("#228B22"));
Color.FUCHSIA = Object.freeze(Color.fromCssColorString("#FF00FF"));
Color.GAINSBORO = Object.freeze(Color.fromCssColorString("#DCDCDC"));
Color.GHOSTWHITE = Object.freeze(Color.fromCssColorString("#F8F8FF"));
Color.GOLD = Object.freeze(Color.fromCssColorString("#FFD700"));
Color.GOLDENROD = Object.freeze(Color.fromCssColorString("#DAA520"));
Color.GRAY = Object.freeze(Color.fromCssColorString("#808080"));
Color.GREEN = Object.freeze(Color.fromCssColorString("#008000"));
Color.GREENYELLOW = Object.freeze(Color.fromCssColorString("#ADFF2F"));
Color.GREY = Color.GRAY;
Color.HONEYDEW = Object.freeze(Color.fromCssColorString("#F0FFF0"));
Color.HOTPINK = Object.freeze(Color.fromCssColorString("#FF69B4"));
Color.INDIANRED = Object.freeze(Color.fromCssColorString("#CD5C5C"));
Color.INDIGO = Object.freeze(Color.fromCssColorString("#4B0082"));
Color.IVORY = Object.freeze(Color.fromCssColorString("#FFFFF0"));
Color.KHAKI = Object.freeze(Color.fromCssColorString("#F0E68C"));
Color.LAVENDER = Object.freeze(Color.fromCssColorString("#E6E6FA"));
Color.LAVENDAR_BLUSH = Object.freeze(Color.fromCssColorString("#FFF0F5"));
Color.LAWNGREEN = Object.freeze(Color.fromCssColorString("#7CFC00"));
Color.LEMONCHIFFON = Object.freeze(Color.fromCssColorString("#FFFACD"));
Color.LIGHTBLUE = Object.freeze(Color.fromCssColorString("#ADD8E6"));
Color.LIGHTCORAL = Object.freeze(Color.fromCssColorString("#F08080"));
Color.LIGHTCYAN = Object.freeze(Color.fromCssColorString("#E0FFFF"));
Color.LIGHTGOLDENRODYELLOW = Object.freeze(Color.fromCssColorString("#FAFAD2"));
Color.LIGHTGRAY = Object.freeze(Color.fromCssColorString("#D3D3D3"));
Color.LIGHTGREEN = Object.freeze(Color.fromCssColorString("#90EE90"));
Color.LIGHTGREY = Color.LIGHTGRAY;
Color.LIGHTPINK = Object.freeze(Color.fromCssColorString("#FFB6C1"));
Color.LIGHTSEAGREEN = Object.freeze(Color.fromCssColorString("#20B2AA"));
Color.LIGHTSKYBLUE = Object.freeze(Color.fromCssColorString("#87CEFA"));
Color.LIGHTSLATEGRAY = Object.freeze(Color.fromCssColorString("#778899"));
Color.LIGHTSLATEGREY = Color.LIGHTSLATEGRAY;
Color.LIGHTSTEELBLUE = Object.freeze(Color.fromCssColorString("#B0C4DE"));
Color.LIGHTYELLOW = Object.freeze(Color.fromCssColorString("#FFFFE0"));
Color.LIME = Object.freeze(Color.fromCssColorString("#00FF00"));
Color.LIMEGREEN = Object.freeze(Color.fromCssColorString("#32CD32"));
Color.LINEN = Object.freeze(Color.fromCssColorString("#FAF0E6"));
Color.MAGENTA = Object.freeze(Color.fromCssColorString("#FF00FF"));
Color.MAROON = Object.freeze(Color.fromCssColorString("#800000"));
Color.MEDIUMAQUAMARINE = Object.freeze(Color.fromCssColorString("#66CDAA"));
Color.MEDIUMBLUE = Object.freeze(Color.fromCssColorString("#0000CD"));
Color.MEDIUMORCHID = Object.freeze(Color.fromCssColorString("#BA55D3"));
Color.MEDIUMPURPLE = Object.freeze(Color.fromCssColorString("#9370DB"));
Color.MEDIUMSEAGREEN = Object.freeze(Color.fromCssColorString("#3CB371"));
Color.MEDIUMSLATEBLUE = Object.freeze(Color.fromCssColorString("#7B68EE"));
Color.MEDIUMSPRINGGREEN = Object.freeze(Color.fromCssColorString("#00FA9A"));
Color.MEDIUMTURQUOISE = Object.freeze(Color.fromCssColorString("#48D1CC"));
Color.MEDIUMVIOLETRED = Object.freeze(Color.fromCssColorString("#C71585"));
Color.MIDNIGHTBLUE = Object.freeze(Color.fromCssColorString("#191970"));
Color.MINTCREAM = Object.freeze(Color.fromCssColorString("#F5FFFA"));
Color.MISTYROSE = Object.freeze(Color.fromCssColorString("#FFE4E1"));
Color.MOCCASIN = Object.freeze(Color.fromCssColorString("#FFE4B5"));
Color.NAVAJOWHITE = Object.freeze(Color.fromCssColorString("#FFDEAD"));
Color.NAVY = Object.freeze(Color.fromCssColorString("#000080"));
Color.OLDLACE = Object.freeze(Color.fromCssColorString("#FDF5E6"));
Color.OLIVE = Object.freeze(Color.fromCssColorString("#808000"));
Color.OLIVEDRAB = Object.freeze(Color.fromCssColorString("#6B8E23"));
Color.ORANGE = Object.freeze(Color.fromCssColorString("#FFA500"));
Color.ORANGERED = Object.freeze(Color.fromCssColorString("#FF4500"));
Color.ORCHID = Object.freeze(Color.fromCssColorString("#DA70D6"));
Color.PALEGOLDENROD = Object.freeze(Color.fromCssColorString("#EEE8AA"));
Color.PALEGREEN = Object.freeze(Color.fromCssColorString("#98FB98"));
Color.PALETURQUOISE = Object.freeze(Color.fromCssColorString("#AFEEEE"));
Color.PALEVIOLETRED = Object.freeze(Color.fromCssColorString("#DB7093"));
Color.PAPAYAWHIP = Object.freeze(Color.fromCssColorString("#FFEFD5"));
Color.PEACHPUFF = Object.freeze(Color.fromCssColorString("#FFDAB9"));
Color.PERU = Object.freeze(Color.fromCssColorString("#CD853F"));
Color.PINK = Object.freeze(Color.fromCssColorString("#FFC0CB"));
Color.PLUM = Object.freeze(Color.fromCssColorString("#DDA0DD"));
Color.POWDERBLUE = Object.freeze(Color.fromCssColorString("#B0E0E6"));
Color.PURPLE = Object.freeze(Color.fromCssColorString("#800080"));
Color.RED = Object.freeze(Color.fromCssColorString("#FF0000"));
Color.ROSYBROWN = Object.freeze(Color.fromCssColorString("#BC8F8F"));
Color.ROYALBLUE = Object.freeze(Color.fromCssColorString("#4169E1"));
Color.SADDLEBROWN = Object.freeze(Color.fromCssColorString("#8B4513"));
Color.SALMON = Object.freeze(Color.fromCssColorString("#FA8072"));
Color.SANDYBROWN = Object.freeze(Color.fromCssColorString("#F4A460"));
Color.SEAGREEN = Object.freeze(Color.fromCssColorString("#2E8B57"));
Color.SEASHELL = Object.freeze(Color.fromCssColorString("#FFF5EE"));
Color.SIENNA = Object.freeze(Color.fromCssColorString("#A0522D"));
Color.SILVER = Object.freeze(Color.fromCssColorString("#C0C0C0"));
Color.SKYBLUE = Object.freeze(Color.fromCssColorString("#87CEEB"));
Color.SLATEBLUE = Object.freeze(Color.fromCssColorString("#6A5ACD"));
Color.SLATEGRAY = Object.freeze(Color.fromCssColorString("#708090"));
Color.SLATEGREY = Color.SLATEGRAY;
Color.SNOW = Object.freeze(Color.fromCssColorString("#FFFAFA"));
Color.SPRINGGREEN = Object.freeze(Color.fromCssColorString("#00FF7F"));
Color.STEELBLUE = Object.freeze(Color.fromCssColorString("#4682B4"));
Color.TAN = Object.freeze(Color.fromCssColorString("#D2B48C"));
Color.TEAL = Object.freeze(Color.fromCssColorString("#008080"));
Color.THISTLE = Object.freeze(Color.fromCssColorString("#D8BFD8"));
Color.TOMATO = Object.freeze(Color.fromCssColorString("#FF6347"));
Color.TURQUOISE = Object.freeze(Color.fromCssColorString("#40E0D0"));
Color.VIOLET = Object.freeze(Color.fromCssColorString("#EE82EE"));
Color.WHEAT = Object.freeze(Color.fromCssColorString("#F5DEB3"));
Color.WHITE = Object.freeze(Color.fromCssColorString("#FFFFFF"));
Color.WHITESMOKE = Object.freeze(Color.fromCssColorString("#F5F5F5"));
Color.YELLOW = Object.freeze(Color.fromCssColorString("#FFFF00"));
Color.YELLOWGREEN = Object.freeze(Color.fromCssColorString("#9ACD32"));
Color.TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));
var Color_default = Color;

export {
  Color_default
};
