"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHtml = parseHtml;
var tslib_1 = require("tslib");
var char_utils_1 = require("../char-utils");
var utils_1 = require("../utils");
// For debugging: search for other "For debugging" lines
// import CliTable from 'cli-table';
var CurrentTag = /** @class */ (function () {
    function CurrentTag(cfg) {
        if (cfg === void 0) { cfg = {}; }
        this.idx = cfg.idx !== undefined ? cfg.idx : -1;
        this.type = cfg.type || 'tag';
        this.name = cfg.name || '';
        this.isOpening = !!cfg.isOpening;
        this.isClosing = !!cfg.isClosing;
    }
    return CurrentTag;
}());
var noCurrentTag = new CurrentTag(); // shared reference for when there is no current tag currently being read
/**
 * Context object containing all the state needed by the HTML parsing state
 * machine function.
 *
 * ## Historical note
 *
 * In v4.1.5, we used nested functions to handle the context via closures, but
 * this necessitated re-creating the functions for each call to `parseHtml()`,
 * which made them difficult for v8 to JIT optimize. In v4.1.6, we lifted all of
 * the functions to the top-level scope and passed the context object between
 * them, which allows the functions to be JIT compiled once and reused.
 */
var ParseHtmlContext = /** @class */ (function () {
    function ParseHtmlContext(html, callbacks) {
        this.charIdx = 0; // Current character index being processed
        this.state = 0 /* State.Data */; // begin in the Data state
        this.currentDataIdx = 0; // where the current data start index is
        this.currentTag = noCurrentTag; // describes the current tag that is being read
        this.html = html;
        this.callbacks = callbacks;
    }
    return ParseHtmlContext;
}());
/**
 * Parses an HTML string, calling the callbacks to notify of tags and text.
 *
 * ## History
 *
 * This file previously used a regular expression to find html tags in the input
 * text. Unfortunately, we ran into a bunch of catastrophic backtracking issues
 * with certain input text, causing Autolinker to either hang or just take a
 * really long time to parse the string.
 *
 * The current code is intended to be a O(n) algorithm that walks through
 * the string in one pass, and tries to be as cheap as possible. We don't need
 * to implement the full HTML spec, but rather simply determine where the string
 * looks like an HTML tag, and where it looks like text (so that we can autolink
 * that).
 *
 * This state machine parser is intended just to be a simple but performant
 * parser of HTML for the subset of requirements we have. We simply need to:
 *
 * 1. Determine where HTML tags are
 * 2. Determine the tag name (Autolinker specifically only cares about <a>,
 *    <script>, and <style> tags, so as not to link any text within them)
 *
 * We don't need to:
 *
 * 1. Create a parse tree
 * 2. Auto-close tags with invalid markup
 * 3. etc.
 *
 * The other intention behind this is that we didn't want to add external
 * dependencies on the Autolinker utility which would increase its size. For
 * instance, adding htmlparser2 adds 125kb to the minified output file,
 * increasing its final size from 47kb to 172kb (at the time of writing). It
 * also doesn't work exactly correctly, treating the string "<3 blah blah blah"
 * as an HTML tag.
 *
 * Reference for HTML spec:
 *
 *     https://www.w3.org/TR/html51/syntax.html#sec-tokenization
 *
 * @param {String} html The HTML to parse
 * @param {Object} callbacks
 * @param {Function} callbacks.onOpenTag Callback function to call when an open
 *   tag is parsed. Called with the tagName as its argument.
 * @param {Function} callbacks.onCloseTag Callback function to call when a close
 *   tag is parsed. Called with the tagName as its argument. If a self-closing
 *   tag is found, `onCloseTag` is called immediately after `onOpenTag`.
 * @param {Function} callbacks.onText Callback function to call when text (i.e
 *   not an HTML tag) is parsed. Called with the text (string) as its first
 *   argument, and offset (number) into the string as its second.
 */
function parseHtml(html, callbacks) {
    var context = new ParseHtmlContext(html, callbacks);
    // For debugging: search for other "For debugging" lines
    // const table = new CliTable( {
    // 	head: [ 'charIdx', 'char', 'state', 'currentDataIdx', 'currentOpenTagIdx', 'tag.type' ]
    // } );
    var len = html.length;
    while (context.charIdx < len) {
        var char = html.charAt(context.charIdx);
        var charCode = html.charCodeAt(context.charIdx);
        // For debugging: search for other "For debugging" lines
        // ALSO: Temporarily remove the 'const' keyword on the State enum
        // table.push([
        //     String(charIdx),
        //     char,
        //     State[state],
        //     String(currentDataIdx),
        //     String(currentTag.idx),
        //     currentTag.idx === -1 ? '' : currentTag.type
        // ]);
        switch (context.state) {
            case 0 /* State.Data */:
                stateData(context, char);
                break;
            case 1 /* State.TagOpen */:
                stateTagOpen(context, char, charCode);
                break;
            case 2 /* State.EndTagOpen */:
                stateEndTagOpen(context, char, charCode);
                break;
            case 3 /* State.TagName */:
                stateTagName(context, char, charCode);
                break;
            case 4 /* State.BeforeAttributeName */:
                stateBeforeAttributeName(context, char, charCode);
                break;
            case 5 /* State.AttributeName */:
                stateAttributeName(context, char, charCode);
                break;
            case 6 /* State.AfterAttributeName */:
                stateAfterAttributeName(context, char, charCode);
                break;
            case 7 /* State.BeforeAttributeValue */:
                stateBeforeAttributeValue(context, char, charCode);
                break;
            case 8 /* State.AttributeValueDoubleQuoted */:
                stateAttributeValueDoubleQuoted(context, char);
                break;
            case 9 /* State.AttributeValueSingleQuoted */:
                stateAttributeValueSingleQuoted(context, char);
                break;
            case 10 /* State.AttributeValueUnquoted */:
                stateAttributeValueUnquoted(context, char, charCode);
                break;
            case 11 /* State.AfterAttributeValueQuoted */:
                stateAfterAttributeValueQuoted(context, char, charCode);
                break;
            case 12 /* State.SelfClosingStartTag */:
                stateSelfClosingStartTag(context, char);
                break;
            case 13 /* State.MarkupDeclarationOpenState */:
                stateMarkupDeclarationOpen(context);
                break;
            case 14 /* State.CommentStart */:
                stateCommentStart(context, char);
                break;
            case 15 /* State.CommentStartDash */:
                stateCommentStartDash(context, char);
                break;
            case 16 /* State.Comment */:
                stateComment(context, char);
                break;
            case 17 /* State.CommentEndDash */:
                stateCommentEndDash(context, char);
                break;
            case 18 /* State.CommentEnd */:
                stateCommentEnd(context, char);
                break;
            case 19 /* State.CommentEndBang */:
                stateCommentEndBang(context, char);
                break;
            case 20 /* State.Doctype */:
                stateDoctype(context, char);
                break;
            /* istanbul ignore next */
            default:
                (0, utils_1.assertNever)(context.state);
        }
        // For debugging: search for other "For debugging" lines
        // ALSO: Temporarily remove the 'const' keyword on the State enum
        // table.push([
        //     String(context.charIdx),
        //     char,
        //     State[context.state],
        //     String(context.currentDataIdx),
        //     String(context.currentTag.idx),
        //     context.currentTag.idx === -1 ? '' : context.currentTag.type
        // ]);
        context.charIdx++;
    }
    if (context.currentDataIdx < context.charIdx) {
        emitText(context);
    }
    // For debugging: search for other "For debugging" lines
    // console.log( '\n' + table.toString() );
}
// Called when non-tags are being read (i.e. the text around HTML †ags)
// https://www.w3.org/TR/html51/syntax.html#data-state
function stateData(context, char) {
    if (char === '<') {
        startNewTag(context);
    }
}
// Called after a '<' is read from the Data state
// https://www.w3.org/TR/html51/syntax.html#tag-open-state
function stateTagOpen(context, char, charCode) {
    if (char === '!') {
        context.state = 13 /* State.MarkupDeclarationOpenState */;
    }
    else if (char === '/') {
        context.state = 2 /* State.EndTagOpen */;
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { isClosing: true }));
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else if ((0, char_utils_1.isAsciiLetterChar)(charCode)) {
        // tag name start (and no '/' read)
        context.state = 3 /* State.TagName */;
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { isOpening: true }));
    }
    else {
        // Any other
        context.state = 0 /* State.Data */;
        context.currentTag = noCurrentTag;
    }
}
// After a '<x', '</x' sequence is read (where 'x' is a letter character),
// this is to continue reading the tag name
// https://www.w3.org/TR/html51/syntax.html#tag-name-state
function stateTagName(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { name: captureTagName(context) }));
        context.state = 4 /* State.BeforeAttributeName */;
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else if (char === '/') {
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { name: captureTagName(context) }));
        context.state = 12 /* State.SelfClosingStartTag */;
    }
    else if (char === '>') {
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { name: captureTagName(context) }));
        emitTagAndPreviousTextNode(context); // resets to Data state as well
    }
    else if (!(0, char_utils_1.isAsciiLetterChar)(charCode) && !(0, char_utils_1.isDigitChar)(charCode) && char !== ':') {
        // Anything else that does not form an html tag. Note: the colon
        // character is accepted for XML namespaced tags
        resetToDataState(context);
    }
    else {
        // continue reading tag name
    }
}
// Called after the '/' is read from a '</' sequence
// https://www.w3.org/TR/html51/syntax.html#end-tag-open-state
function stateEndTagOpen(context, char, charCode) {
    if (char === '>') {
        // parse error. Encountered "</>". Skip it without treating as a tag
        resetToDataState(context);
    }
    else if ((0, char_utils_1.isAsciiLetterChar)(charCode)) {
        context.state = 3 /* State.TagName */;
    }
    else {
        // some other non-tag-like character, don't treat this as a tag
        resetToDataState(context);
    }
}
// https://www.w3.org/TR/html51/syntax.html#before-attribute-name-state
function stateBeforeAttributeName(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        // stay in BeforeAttributeName state - continue reading chars
    }
    else if (char === '/') {
        context.state = 12 /* State.SelfClosingStartTag */;
    }
    else if (char === '>') {
        emitTagAndPreviousTextNode(context); // resets to Data state as well
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else if (char === "=" || (0, char_utils_1.isQuoteChar)(charCode) || (0, char_utils_1.isControlChar)(charCode)) {
        // "Parse error" characters that, according to the spec, should be
        // appended to the attribute name, but we'll treat these characters
        // as not forming a real HTML tag
        resetToDataState(context);
    }
    else {
        // Any other char, start of a new attribute name
        context.state = 5 /* State.AttributeName */;
    }
}
// https://www.w3.org/TR/html51/syntax.html#attribute-name-state
function stateAttributeName(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        context.state = 6 /* State.AfterAttributeName */;
    }
    else if (char === '/') {
        context.state = 12 /* State.SelfClosingStartTag */;
    }
    else if (char === '=') {
        context.state = 7 /* State.BeforeAttributeValue */;
    }
    else if (char === '>') {
        emitTagAndPreviousTextNode(context); // resets to Data state as well
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else if ((0, char_utils_1.isQuoteChar)(charCode)) {
        // "Parse error" characters that, according to the spec, should be
        // appended to the attribute name, but we'll treat these characters
        // as not forming a real HTML tag
        resetToDataState(context);
    }
    else {
        // anything else: continue reading attribute name
    }
}
// https://www.w3.org/TR/html51/syntax.html#after-attribute-name-state
function stateAfterAttributeName(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        // ignore the character - continue reading
    }
    else if (char === '/') {
        context.state = 12 /* State.SelfClosingStartTag */;
    }
    else if (char === '=') {
        context.state = 7 /* State.BeforeAttributeValue */;
    }
    else if (char === '>') {
        emitTagAndPreviousTextNode(context);
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else if ((0, char_utils_1.isQuoteChar)(charCode)) {
        // "Parse error" characters that, according to the spec, should be
        // appended to the attribute name, but we'll treat these characters
        // as not forming a real HTML tag
        resetToDataState(context);
    }
    else {
        // Any other character, start a new attribute in the current tag
        context.state = 5 /* State.AttributeName */;
    }
}
// https://www.w3.org/TR/html51/syntax.html#before-attribute-value-state
function stateBeforeAttributeValue(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        // ignore the character - continue reading
    }
    else if (char === "\"") {
        context.state = 8 /* State.AttributeValueDoubleQuoted */;
    }
    else if (char === "'") {
        context.state = 9 /* State.AttributeValueSingleQuoted */;
    }
    else if (/[>=`]/.test(char)) {
        // Invalid chars after an '=' for an attribute value, don't count
        // the current tag as an HTML tag
        resetToDataState(context);
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else {
        // Any other character, consider it an unquoted attribute value
        context.state = 10 /* State.AttributeValueUnquoted */;
    }
}
// https://www.w3.org/TR/html51/syntax.html#attribute-value-double-quoted-state
function stateAttributeValueDoubleQuoted(context, char) {
    if (char === "\"") {
        // end the current double-quoted attribute
        context.state = 11 /* State.AfterAttributeValueQuoted */;
    }
    else {
        // consume the character as part of the double-quoted attribute value
    }
}
// https://www.w3.org/TR/html51/syntax.html#attribute-value-single-quoted-state
function stateAttributeValueSingleQuoted(context, char) {
    if (char === "'") {
        // end the current single-quoted attribute
        context.state = 11 /* State.AfterAttributeValueQuoted */;
    }
    else {
        // consume the character as part of the double-quoted attribute value
    }
}
// https://www.w3.org/TR/html51/syntax.html#attribute-value-unquoted-state
function stateAttributeValueUnquoted(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        context.state = 4 /* State.BeforeAttributeName */;
    }
    else if (char === '>') {
        emitTagAndPreviousTextNode(context);
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else {
        // Any other character, treat it as part of the attribute value
    }
}
// Called after a double-quoted or single-quoted attribute value is read
// (i.e. after the closing quote character)
// https://www.w3.org/TR/html51/syntax.html#after-attribute-value-quoted-state
function stateAfterAttributeValueQuoted(context, char, charCode) {
    if ((0, char_utils_1.isWhitespaceChar)(charCode)) {
        context.state = 4 /* State.BeforeAttributeName */;
    }
    else if (char === '/') {
        context.state = 12 /* State.SelfClosingStartTag */;
    }
    else if (char === '>') {
        emitTagAndPreviousTextNode(context);
    }
    else if (char === '<') {
        // start of another tag (ignore the previous, incomplete one)
        startNewTag(context);
    }
    else {
        // Any other character, "parse error". Spec says to switch to the
        // BeforeAttributeState and re-consume the character, as it may be
        // the start of a new attribute name
        context.state = 4 /* State.BeforeAttributeName */;
        reconsumeCurrentChar(context);
    }
}
// A '/' has just been read in the current tag (presumably for '/>'), and
// this handles the next character
// https://www.w3.org/TR/html51/syntax.html#self-closing-start-tag-state
function stateSelfClosingStartTag(context, char) {
    if (char === '>') {
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { isClosing: true }));
        emitTagAndPreviousTextNode(context); // resets to Data state as well
    }
    else {
        // Note: the spec calls for a character after a '/' within a start
        // tag to go back into the BeforeAttributeName state (in order to
        // read more attributes, but for the purposes of Autolinker, this is
        // most likely not a valid HTML tag. For example: "<something / other>"
        // state = State.BeforeAttributeName;
        // Instead, just treat as regular text
        resetToDataState(context);
    }
}
// https://www.w3.org/TR/html51/syntax.html#markup-declaration-open-state
// (HTML Comments or !DOCTYPE)
function stateMarkupDeclarationOpen(context) {
    var html = context.html, charIdx = context.charIdx;
    if (html.slice(charIdx, charIdx + 2) === '--') {
        // html comment
        context.charIdx++; // "consume" the second '-' character. Next loop iteration will consume the character after the '<!--' sequence
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { type: 'comment' }));
        context.state = 14 /* State.CommentStart */;
    }
    else if (html.slice(charIdx, charIdx + 7).toUpperCase() === 'DOCTYPE') {
        context.charIdx += 6; // "consume" the characters "OCTYPE" (the current loop iteraction consumed the 'D'). Next loop iteration will consume the character after the '<!DOCTYPE' sequence
        context.currentTag = new CurrentTag(tslib_1.__assign(tslib_1.__assign({}, context.currentTag), { type: 'doctype' }));
        context.state = 20 /* State.Doctype */;
    }
    else {
        // At this point, the spec specifies that the state machine should
        // enter the "bogus comment" state, in which case any character(s)
        // after the '<!' that were read should become an HTML comment up
        // until the first '>' that is read (or EOF). Instead, we'll assume
        // that a user just typed '<!' as part of some piece of non-html
        // text
        resetToDataState(context);
    }
}
// Handles after the sequence '<!--' has been read
// https://www.w3.org/TR/html51/syntax.html#comment-start-state
function stateCommentStart(context, char) {
    if (char === '-') {
        // We've read the sequence '<!---' at this point (3 dashes)
        context.state = 15 /* State.CommentStartDash */;
    }
    else if (char === '>') {
        // At this point, we'll assume the comment wasn't a real comment
        // so we'll just emit it as data. We basically read the sequence
        // '<!-->'
        resetToDataState(context);
    }
    else {
        // Any other char, take it as part of the comment
        context.state = 16 /* State.Comment */;
    }
}
// We've read the sequence '<!---' at this point (3 dashes)
// https://www.w3.org/TR/html51/syntax.html#comment-start-dash-state
function stateCommentStartDash(context, char) {
    if (char === '-') {
        // We've read '<!----' (4 dashes) at this point
        context.state = 18 /* State.CommentEnd */;
    }
    else if (char === '>') {
        // At this point, we'll assume the comment wasn't a real comment
        // so we'll just emit it as data. We basically read the sequence
        // '<!--->'
        resetToDataState(context);
    }
    else {
        // Anything else, take it as a valid comment
        context.state = 16 /* State.Comment */;
    }
}
// Currently reading the comment's text (data)
// https://www.w3.org/TR/html51/syntax.html#comment-state
function stateComment(context, char) {
    if (char === '-') {
        context.state = 17 /* State.CommentEndDash */;
    }
    else {
        // Any other character, stay in the Comment state
    }
}
// When we we've read the first dash inside a comment, it may signal the
// end of the comment if we read another dash
// https://www.w3.org/TR/html51/syntax.html#comment-end-dash-state
function stateCommentEndDash(context, char) {
    if (char === '-') {
        context.state = 18 /* State.CommentEnd */;
    }
    else {
        // Wasn't a dash, must still be part of the comment
        context.state = 16 /* State.Comment */;
    }
}
// After we've read two dashes inside a comment, it may signal the end of
// the comment if we then read a '>' char
// https://www.w3.org/TR/html51/syntax.html#comment-end-state
function stateCommentEnd(context, char) {
    if (char === '>') {
        emitTagAndPreviousTextNode(context);
    }
    else if (char === '!') {
        context.state = 19 /* State.CommentEndBang */;
    }
    else if (char === '-') {
        // A 3rd '-' has been read: stay in the CommentEnd state
    }
    else {
        // Anything else, switch back to the comment state since we didn't
        // read the full "end comment" sequence (i.e. '-->')
        context.state = 16 /* State.Comment */;
    }
}
// We've read the sequence '--!' inside of a comment
// https://www.w3.org/TR/html51/syntax.html#comment-end-bang-state
function stateCommentEndBang(context, char) {
    if (char === '-') {
        // We read the sequence '--!-' inside of a comment. The last dash
        // could signify that the comment is going to close
        context.state = 17 /* State.CommentEndDash */;
    }
    else if (char === '>') {
        // End of comment with the sequence '--!>'
        emitTagAndPreviousTextNode(context);
    }
    else {
        // The '--!' was not followed by a '>', continue reading the
        // comment's text
        context.state = 16 /* State.Comment */;
    }
}
/**
 * For DOCTYPES in particular, we don't care about the attributes. Just
 * advance to the '>' character and emit the tag, unless we find a '<'
 * character in which case we'll start a new tag.
 *
 * Example doctype tag:
 *    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
 *
 * Actual spec: https://www.w3.org/TR/html51/syntax.html#doctype-state
 */
function stateDoctype(context, char) {
    if (char === '>') {
        emitTagAndPreviousTextNode(context);
    }
    else if (char === '<') {
        startNewTag(context);
    }
    else {
        // stay in the Doctype state
    }
}
/**
 * Resets the state back to the Data state, and removes the current tag.
 *
 * We'll generally run this function whenever a "parse error" is
 * encountered, where the current tag that is being read no longer looks
 * like a real HTML tag.
 */
function resetToDataState(context) {
    context.state = 0 /* State.Data */;
    context.currentTag = noCurrentTag;
}
/**
 * Starts a new HTML tag at the current index, ignoring any previous HTML
 * tag that was being read.
 *
 * We'll generally run this function whenever we read a new '<' character,
 * including when we read a '<' character inside of an HTML tag that we were
 * previously reading.
 */
function startNewTag(context) {
    context.state = 1 /* State.TagOpen */;
    context.currentTag = new CurrentTag({ idx: context.charIdx });
}
/**
 * Once we've decided to emit an open tag, that means we can also emit the
 * text node before it.
 */
function emitTagAndPreviousTextNode(context) {
    var textBeforeTag = context.html.slice(context.currentDataIdx, context.currentTag.idx);
    if (textBeforeTag) {
        // the html tag was the first element in the html string, or two
        // tags next to each other, in which case we should not emit a text
        // node
        context.callbacks.onText(textBeforeTag, context.currentDataIdx);
    }
    var currentTag = context.currentTag;
    if (currentTag.type === 'comment') {
        context.callbacks.onComment(currentTag.idx);
    }
    else if (currentTag.type === 'doctype') {
        context.callbacks.onDoctype(currentTag.idx);
    }
    else {
        if (currentTag.isOpening) {
            context.callbacks.onOpenTag(currentTag.name, currentTag.idx);
        }
        if (currentTag.isClosing) {
            // note: self-closing tags will emit both opening and closing
            context.callbacks.onCloseTag(currentTag.name, currentTag.idx);
        }
    }
    // Since we just emitted a tag, reset to the data state for the next char
    resetToDataState(context);
    context.currentDataIdx = context.charIdx + 1;
}
function emitText(context) {
    var text = context.html.slice(context.currentDataIdx, context.charIdx);
    context.callbacks.onText(text, context.currentDataIdx);
    context.currentDataIdx = context.charIdx + 1;
}
/**
 * Captures the tag name from the start of the tag to the current character
 * index, and converts it to lower case
 */
function captureTagName(context) {
    var startIdx = context.currentTag.idx + (context.currentTag.isClosing ? 2 : 1);
    return context.html.slice(startIdx, context.charIdx).toLowerCase();
}
/**
 * Causes the main loop to re-consume the current character, such as after
 * encountering a "parse error" that changed state and needs to reconsume
 * the same character in that new state.
 */
function reconsumeCurrentChar(context) {
    context.charIdx--;
}
//# sourceMappingURL=parse-html.js.map