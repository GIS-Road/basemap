export declare const hasOwnProperty: (v: PropertyKey) => boolean;
/**
 * Simpler helper method to check for a boolean type simply for the benefit of
 * gaining better compression when minified by not needing to have multiple
 * `typeof` comparisons in the codebase.
 */
export declare function isBoolean(value: unknown): value is boolean;
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
export declare function ellipsis(str: string, truncateLen: number, ellipsisChars?: string): string;
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
export declare function removeWithPredicate<T>(arr: T[], fn: (item: T) => boolean): void;
/**
 * Function that should never be called but is used to check that every
 * enum value is handled using TypeScript's 'never' type.
 */
export declare function assertNever(theValue: never): never;
