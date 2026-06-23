import { isAlphaNumericOrMarkChar } from '../char-utils';
/**
 * Determines if the given `char` is a an allowed character in a hashtag. These
 * are underscores or any alphanumeric char.
 */
export function isHashtagTextChar(charCode) {
    return charCode === 95 /* Char.Underscore */ || isAlphaNumericOrMarkChar(charCode);
}
/**
 * Determines if a hashtag match is valid.
 */
export function isValidHashtag(hashtag) {
    // Max length of 140 for a hashtag ('#' char + 139 word chars)
    return hashtag.length <= 140;
}
export var hashtagServices = [
    'twitter',
    'facebook',
    'instagram',
    'tiktok',
    'youtube',
];
//# sourceMappingURL=hashtag-utils.js.map