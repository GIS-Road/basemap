"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateSmart = truncateSmart;
/**
 * Date: 2015-10-05
 * Author: Kasper Søfren <soefritz@gmail.com> (https://github.com/kafoso)
 *
 * A truncation feature, where the ellipsis will be placed at a section within
 * the URL making it still somewhat human readable.
 *
 * @param {String} url						 A URL.
 * @param {Number} truncateLen		 The maximum length of the truncated output URL string.
 * @param {String} ellipsisChars	 The characters to place within the url, e.g. "...".
 * @return {String} The truncated URL.
 */
function truncateSmart(url, truncateLen, ellipsisChars) {
    var ellipsisLengthBeforeParsing;
    var ellipsisLength;
    if (ellipsisChars == null) {
        ellipsisChars = '&hellip;';
        ellipsisLength = 3;
        ellipsisLengthBeforeParsing = 8;
    }
    else {
        ellipsisLength = ellipsisChars.length;
        ellipsisLengthBeforeParsing = ellipsisChars.length;
    }
    // If the URL is shorter than the truncate length, return it as is
    if (url.length <= truncateLen) {
        return url;
    }
    var availableLength = truncateLen - ellipsisLength;
    var urlObj = parseUrl(url);
    // Clean up the URL by removing any malformed query string
    // (e.g. "?foo=bar?ignorethis")
    if (urlObj.query) {
        var matchQuery = urlObj.query.match(/^(.*?)(?=(\?|#))(.*?)$/i);
        if (matchQuery) {
            // Malformed URL; two or more "?". Removed any content behind the 2nd.
            urlObj.query = urlObj.query.substr(0, matchQuery[1].length);
            url = buildUrl(urlObj);
        }
    }
    if (url.length <= truncateLen) {
        return url; // removing a malformed query string brought the URL under the truncateLength
    }
    // Clean up the URL by removing 'www.' from the host if it exists
    if (urlObj.host) {
        urlObj.host = urlObj.host.replace(/^www\./, '');
        url = buildUrl(urlObj);
    }
    if (url.length <= truncateLen) {
        return url; // removing 'www.' brought the URL under the truncateLength
    }
    // Process and build the truncated URL, starting with the hostname
    var truncatedUrl = '';
    if (urlObj.host) {
        truncatedUrl += urlObj.host;
    }
    if (truncatedUrl.length >= availableLength) {
        if (urlObj.host.length === truncateLen) {
            return (urlObj.host.substr(0, truncateLen - ellipsisLength) + ellipsisChars).substr(0, availableLength + ellipsisLengthBeforeParsing);
        }
        return buildSegment(truncatedUrl, availableLength, ellipsisChars).substr(0, availableLength + ellipsisLengthBeforeParsing);
    }
    // If we still have available chars left, add the path and query string
    var pathAndQuery = '';
    if (urlObj.path) {
        pathAndQuery += '/' + urlObj.path;
    }
    if (urlObj.query) {
        pathAndQuery += '?' + urlObj.query;
    }
    if (pathAndQuery) {
        if ((truncatedUrl + pathAndQuery).length >= availableLength) {
            if ((truncatedUrl + pathAndQuery).length == truncateLen) {
                return (truncatedUrl + pathAndQuery).substr(0, truncateLen);
            }
            var remainingAvailableLength = availableLength - truncatedUrl.length;
            return (truncatedUrl + buildSegment(pathAndQuery, remainingAvailableLength, ellipsisChars)).substr(0, availableLength + ellipsisLengthBeforeParsing);
        }
        else {
            truncatedUrl += pathAndQuery;
        }
    }
    // If we still have available chars left, add the fragment
    if (urlObj.fragment) {
        var fragment = '#' + urlObj.fragment;
        if ((truncatedUrl + fragment).length >= availableLength) {
            if ((truncatedUrl + fragment).length == truncateLen) {
                return (truncatedUrl + fragment).substr(0, truncateLen);
            }
            var remainingAvailableLength2 = availableLength - truncatedUrl.length;
            return (truncatedUrl + buildSegment(fragment, remainingAvailableLength2, ellipsisChars)).substr(0, availableLength + ellipsisLengthBeforeParsing);
        }
        else {
            truncatedUrl += fragment;
        }
    }
    // If we still have available chars left, add the scheme
    if (urlObj.scheme && urlObj.host) {
        var scheme = urlObj.scheme + '://';
        if ((truncatedUrl + scheme).length < availableLength) {
            return (scheme + truncatedUrl).substr(0, truncateLen);
        }
    }
    if (truncatedUrl.length <= truncateLen) {
        return truncatedUrl;
    }
    var end = '';
    if (availableLength > 0) {
        end = truncatedUrl.substr(-1 * Math.floor(availableLength / 2));
    }
    return (truncatedUrl.substr(0, Math.ceil(availableLength / 2)) + ellipsisChars + end).substr(0, availableLength + ellipsisLengthBeforeParsing);
}
/**
 * Parses a URL into its components: scheme, host, path, query, and fragment.
 */
function parseUrl(url) {
    // Functionality inspired by PHP function of same name
    var urlObj = {};
    var urlSub = url;
    // Parse scheme
    var match = urlSub.match(/^([a-z]+):\/\//i);
    if (match) {
        urlObj.scheme = match[1];
        urlSub = urlSub.slice(match[0].length);
    }
    // Parse host
    match = urlSub.match(/^(.*?)(?=(\?|#|\/|$))/i);
    if (match) {
        urlObj.host = match[1];
        urlSub = urlSub.slice(match[0].length);
    }
    // Parse path
    match = urlSub.match(/^\/(.*?)(?=(\?|#|$))/i);
    if (match) {
        urlObj.path = match[1];
        urlSub = urlSub.slice(match[0].length);
    }
    // Parse query
    match = urlSub.match(/^\?(.*?)(?=(#|$))/i);
    if (match) {
        urlObj.query = match[1];
        urlSub = urlSub.slice(match[0].length);
    }
    // Parse fragment
    match = urlSub.match(/^#(.*?)$/i);
    if (match) {
        urlObj.fragment = match[1];
        //urlSub = urlSub.slice(match[0].length);  -- not used. Uncomment if adding another block.
    }
    return urlObj;
}
function buildUrl(urlObj) {
    var url = '';
    if (urlObj.scheme && urlObj.host) {
        url += urlObj.scheme + '://';
    }
    if (urlObj.host) {
        url += urlObj.host;
    }
    if (urlObj.path) {
        url += '/' + urlObj.path;
    }
    if (urlObj.query) {
        url += '?' + urlObj.query;
    }
    if (urlObj.fragment) {
        url += '#' + urlObj.fragment;
    }
    return url;
}
function buildSegment(segment, remainingAvailableLength, ellipsisChars) {
    var remainingAvailableLengthHalf = remainingAvailableLength / 2;
    var startOffset = Math.ceil(remainingAvailableLengthHalf);
    var endOffset = -1 * Math.floor(remainingAvailableLengthHalf);
    var end = '';
    if (endOffset < 0) {
        end = segment.substr(endOffset);
    }
    return segment.substr(0, startOffset) + ellipsisChars + end;
}
//# sourceMappingURL=truncate-smart.js.map