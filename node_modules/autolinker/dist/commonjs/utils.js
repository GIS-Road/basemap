"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwnProperty = void 0;
exports.isBoolean = isBoolean;
exports.ellipsis = ellipsis;
exports.removeWithPredicate = removeWithPredicate;
exports.assertNever = assertNever;
exports.hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Simpler helper method to check for a boolean type simply for the benefit of
 * gaining better compression when minified by not needing to have multiple
 * `typeof` comparisons in the codebase.
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
 * end of the string (by default, two periods: '..'). If the `str` length does not exceed
 * `len`, the string will be returned unchanged.
 *
 * @param {String} str The string to truncate and add an ellipsis to.
 * @param {Number} truncateLen The length to truncate the string at.
 * @param {String} [ellipsisChars=...] The ellipsis character(s) to add to the end of `str`
 *   when truncated. Defaults to '...'
 */
function ellipsis(str, truncateLen, ellipsisChars) {
    var ellipsisLength;
    if (str.length > truncateLen) {
        if (ellipsisChars == null) {
            ellipsisChars = '&hellip;';
            ellipsisLength = 3;
        }
        else {
            ellipsisLength = ellipsisChars.length;
        }
        str = str.substring(0, truncateLen - ellipsisLength) + ellipsisChars;
    }
    return str;
}
/**
 * Removes array elements based on a filtering function. Mutates the input
 * array.
 *
 * Using this instead of the ES5 Array.prototype.filter() function to prevent
 * creating many new arrays in memory for filtering.
 *
 * @param arr The array to remove elements from. This array is mutated.
 * @param fn The predicate function which should return `true` to remove an
 *   element.
 */
function removeWithPredicate(arr, fn) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (fn(arr[i]) === true) {
            arr.splice(i, 1);
        }
    }
}
/**
 * Function that should never be called but is used to check that every
 * enum value is handled using TypeScript's 'never' type.
 */
/* istanbul ignore next */
function assertNever(theValue) {
    throw new Error("Unhandled case for value: '".concat(theValue, "'"));
}
//# sourceMappingURL=utils.js.map