"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashtagServices = void 0;
exports.isHashtagTextChar = isHashtagTextChar;
exports.isValidHashtag = isValidHashtag;
var char_utils_1 = require("../char-utils");
/**
 * Determines if the given `char` is a an allowed character in a hashtag. These
 * are underscores or any alphanumeric char.
 */
function isHashtagTextChar(charCode) {
    return charCode === 95 /* Char.Underscore */ || (0, char_utils_1.isAlphaNumericOrMarkChar)(charCode);
}
/**
 * Determines if a hashtag match is valid.
 */
function isValidHashtag(hashtag) {
    // Max length of 140 for a hashtag ('#' char + 139 word chars)
    return hashtag.length <= 140;
}
exports.hashtagServices = [
    'twitter',
    'facebook',
    'instagram',
    'tiktok',
    'youtube',
];
//# sourceMappingURL=hashtag-utils.js.map