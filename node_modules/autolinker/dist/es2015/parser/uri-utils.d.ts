/**
 * Regular expression to match an http:// or https:// scheme.
 */
export declare const httpSchemeRe: RegExp;
/**
 * Regular expression to match an http:// or https:// scheme as the prefix of
 * a string.
 */
export declare const httpSchemePrefixRe: RegExp;
/**
 * A regular expression used to determine the schemes we should not autolink
 */
export declare const invalidSchemeRe: RegExp;
export declare const schemeUrlRe: RegExp;
export declare const tldUrlHostRe: RegExp;
/**
 * Determines if the given character code represents a character that may start
 * a scheme (ex: the 'h' in 'http')
 */
export declare const isSchemeStartChar: (code: number) => boolean;
/**
 * Determines if the given character is a valid character in a scheme (such as
 * 'http' or 'ssh+git'), but only after the start char (which is handled by
 * {@link isSchemeStartChar}.
 */
export declare function isSchemeChar(charCode: number): boolean;
/**
 * Determines if the character can begin a domain label, which must be an
 * alphanumeric character and not an underscore or dash.
 *
 * A domain label is a segment of a hostname such as subdomain.google.com.
 */
export declare const isDomainLabelStartChar: (charCode: number) => boolean;
/**
 * Determines if the character is part of a domain label (but not a domain label
 * start character).
 *
 * A domain label is a segment of a hostname such as subdomain.google.com.
 */
export declare function isDomainLabelChar(charCode: number): boolean;
/**
 * Determines if the character is a path character ("pchar") as defined by
 * https://tools.ietf.org/html/rfc3986#appendix-A
 *
 *     pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *
 *     unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *     pct-encoded   = "%" HEXDIG HEXDIG
 *     sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                   / "*" / "+" / "," / ";" / "="
 *
 * Note that this implementation doesn't follow the spec exactly, but rather
 * follows URL path characters found out in the wild (spec might be out of date?)
 */
export declare function isPathChar(charCode: number): boolean;
/**
 * Determines if the character given may begin the "URL Suffix" section of a
 * URI (i.e. the path, query, or hash section). These are the '/', '?' and '#'
 * characters.
 *
 * See https://tools.ietf.org/html/rfc3986#appendix-A
 */
export declare function isUrlSuffixStartChar(charCode: number): boolean;
/**
 * Determines if the top-level domain (TLD) read in the host is a known TLD.
 *
 * Example: 'com' would be a known TLD (for a host of 'google.com'), but
 * 'local' would not (for a domain name of 'my-computer.local').
 */
export declare function isKnownTld(tld: string): boolean;
/**
 * Determines if the given `url` is a valid scheme-prefixed URL.
 */
export declare function isValidSchemeUrl(url: string): boolean;
/**
 * Determines if the given `url` is a match with a valid TLD.
 */
export declare function isValidTldMatch(url: string): boolean;
/**
 * Determines if the given URL is a valid IPv4-prefixed URL.
 */
export declare function isValidIpV4Address(url: string): boolean;
