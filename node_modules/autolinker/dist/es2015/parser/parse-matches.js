import { UrlMatch } from '../match/url-match';
import { assertNever } from '../utils';
import { httpSchemeRe, isDomainLabelChar, isDomainLabelStartChar, isPathChar, isSchemeChar, isSchemeStartChar, isUrlSuffixStartChar, isValidIpV4Address, isValidSchemeUrl, isValidTldMatch, } from './uri-utils';
import { isEmailLocalPartChar, isEmailLocalPartStartChar, isValidEmail, mailtoSchemePrefixRe, } from './email-utils';
import { EmailMatch } from '../match/email-match';
import { isHashtagTextChar, isValidHashtag } from './hashtag-utils';
import { HashtagMatch } from '../match/hashtag-match';
import { isMentionTextChar, isValidMention } from './mention-utils';
import { MentionMatch } from '../match/mention-match';
import { isPhoneNumberSeparatorChar, isPhoneNumberControlChar, isValidPhoneNumber, } from './phone-number-utils';
import { PhoneMatch } from '../match/phone-match';
import { isAlphaNumericOrMarkChar, isCloseBraceChar, isDigitChar, isOpenBraceChar, isUrlSuffixNotAllowedAsFinalChar, } from '../char-utils';
// For debugging: search for and uncomment other "For debugging" lines
// import CliTable from 'cli-table';
/**
 * Context object containing all the state needed by the state machine functions.
 *
 * ## Historical note
 *
 * In v4.1.1, we used nested functions to handle the context via closures, but
 * this necessitated re-creating the functions for each call to `parseMatches()`,
 * which made them difficult for v8 to JIT optimize. In v4.1.2, we lifted all of
 * the functions to the top-level scope and passed the context object between
 * them, which allows the functions to be JIT compiled once and reused.
 */
var ParseMatchesContext = /** @class */ (function () {
    function ParseMatchesContext(text, args) {
        this.charIdx = 0; // Current character index being processed
        this.matches = []; // Collection of matches found
        this._stateMachines = []; // Array of active state machines
        this.schemeUrlMachinesCount = 0; // part of an optimization to remove the need to go into a slow code block when unnecessary. Since it's been so long since the initial implementation, not sure that this can ever go above 1, but keeping it as a counter to be safe
        this.text = text;
        this.tagBuilder = args.tagBuilder;
        this.stripPrefix = args.stripPrefix;
        this.stripTrailingSlash = args.stripTrailingSlash;
        this.decodePercentEncoding = args.decodePercentEncoding;
        this.hashtagServiceName = args.hashtagServiceName;
        this.mentionServiceName = args.mentionServiceName;
    }
    Object.defineProperty(ParseMatchesContext.prototype, "stateMachines", {
        get: function () {
            return this._stateMachines;
        },
        enumerable: false,
        configurable: true
    });
    ParseMatchesContext.prototype.addMachine = function (stateMachine) {
        this._stateMachines.push(stateMachine);
        if (isSchemeUrlStateMachine(stateMachine)) {
            this.schemeUrlMachinesCount++;
        }
    };
    ParseMatchesContext.prototype.removeMachine = function (stateMachine) {
        // Performance note: this was originally implemented with Array.prototype.splice()
        // and mutated the array in place. Switching to filter added ~280ops/sec
        // on the benchmark, although likely at the expense of GC time. Perhaps
        // in the future, we implement a rotating array so we never need to move
        // or clean anything up
        this._stateMachines = this._stateMachines.filter(function (m) { return m !== stateMachine; });
        // If we've removed the URL state machine, set the flag to false.
        // This flag is a quick test that helps us skip a slow section of
        // code when there is already a URL state machine present.
        if (isSchemeUrlStateMachine(stateMachine)) {
            this.schemeUrlMachinesCount--;
        }
    };
    ParseMatchesContext.prototype.hasSchemeUrlMachine = function () {
        return this.schemeUrlMachinesCount > 0;
    };
    return ParseMatchesContext;
}());
/**
 * Parses URL, email, twitter, mention, and hashtag matches from the given
 * `text`.
 */
export function parseMatches(text, args) {
    // Create the context object that will be passed to all state functions
    var context = new ParseMatchesContext(text, args);
    // For debugging: search for and uncomment other "For debugging" lines
    // const table = new CliTable({
    //     head: ['charIdx', 'char', 'code', 'type', 'states', 'startIdx', 'reached accept state'],
    // });
    for (; context.charIdx < context.text.length; context.charIdx++) {
        var char = text.charAt(context.charIdx);
        var charCode = text.charCodeAt(context.charIdx);
        if (context.stateMachines.length === 0) {
            stateNoMatch(context, char, charCode);
        }
        else {
            // Must loop through the state machines backwards for when one
            // is removed
            for (var stateIdx = context.stateMachines.length - 1; stateIdx >= 0; stateIdx--) {
                var stateMachine = context.stateMachines[stateIdx];
                switch (stateMachine.state) {
                    // Protocol-relative URL states
                    case 11 /* State.ProtocolRelativeSlash1 */:
                        stateProtocolRelativeSlash1(context, stateMachine, charCode);
                        break;
                    case 12 /* State.ProtocolRelativeSlash2 */:
                        stateProtocolRelativeSlash2(context, stateMachine, charCode);
                        break;
                    case 0 /* State.SchemeChar */:
                        stateSchemeChar(context, stateMachine, charCode);
                        break;
                    case 1 /* State.SchemeHyphen */:
                        stateSchemeHyphen(context, stateMachine, charCode);
                        break;
                    case 2 /* State.SchemeColon */:
                        stateSchemeColon(context, stateMachine, charCode);
                        break;
                    case 3 /* State.SchemeSlash1 */:
                        stateSchemeSlash1(context, stateMachine, charCode);
                        break;
                    case 4 /* State.SchemeSlash2 */:
                        stateSchemeSlash2(context, stateMachine, char, charCode);
                        break;
                    case 5 /* State.DomainLabelChar */:
                        stateDomainLabelChar(context, stateMachine, charCode);
                        break;
                    case 6 /* State.DomainHyphen */:
                        stateDomainHyphen(context, stateMachine, char, charCode);
                        break;
                    case 7 /* State.DomainDot */:
                        stateDomainDot(context, stateMachine, char, charCode);
                        break;
                    case 13 /* State.IpV4Digit */:
                        stateIpV4Digit(context, stateMachine, charCode);
                        break;
                    case 14 /* State.IpV4Dot */:
                        stateIpV4Dot(context, stateMachine, charCode);
                        break;
                    case 8 /* State.PortColon */:
                        statePortColon(context, stateMachine, charCode);
                        break;
                    case 9 /* State.PortNumber */:
                        statePortNumber(context, stateMachine, charCode);
                        break;
                    case 10 /* State.Path */:
                        statePath(context, stateMachine, charCode);
                        break;
                    // Email States
                    case 15 /* State.EmailMailto_M */:
                        stateEmailMailto_M(context, stateMachine, char, charCode);
                        break;
                    case 16 /* State.EmailMailto_A */:
                        stateEmailMailto_A(context, stateMachine, char, charCode);
                        break;
                    case 17 /* State.EmailMailto_I */:
                        stateEmailMailto_I(context, stateMachine, char, charCode);
                        break;
                    case 18 /* State.EmailMailto_L */:
                        stateEmailMailto_L(context, stateMachine, char, charCode);
                        break;
                    case 19 /* State.EmailMailto_T */:
                        stateEmailMailto_T(context, stateMachine, char, charCode);
                        break;
                    case 20 /* State.EmailMailto_O */:
                        stateEmailMailto_O(context, stateMachine, charCode);
                        break;
                    case 21 /* State.EmailMailto_Colon */:
                        stateEmailMailtoColon(context, stateMachine, charCode);
                        break;
                    case 22 /* State.EmailLocalPart */:
                        stateEmailLocalPart(context, stateMachine, charCode);
                        break;
                    case 23 /* State.EmailLocalPartDot */:
                        stateEmailLocalPartDot(context, stateMachine, charCode);
                        break;
                    case 24 /* State.EmailAtSign */:
                        stateEmailAtSign(context, stateMachine, charCode);
                        break;
                    case 25 /* State.EmailDomainChar */:
                        stateEmailDomainChar(context, stateMachine, charCode);
                        break;
                    case 26 /* State.EmailDomainHyphen */:
                        stateEmailDomainHyphen(context, stateMachine, charCode);
                        break;
                    case 27 /* State.EmailDomainDot */:
                        stateEmailDomainDot(context, stateMachine, charCode);
                        break;
                    // Hashtag states
                    case 28 /* State.HashtagHashChar */:
                        stateHashtagHashChar(context, stateMachine, charCode);
                        break;
                    case 29 /* State.HashtagTextChar */:
                        stateHashtagTextChar(context, stateMachine, charCode);
                        break;
                    // Mention states
                    case 30 /* State.MentionAtChar */:
                        stateMentionAtChar(context, stateMachine, charCode);
                        break;
                    case 31 /* State.MentionTextChar */:
                        stateMentionTextChar(context, stateMachine, charCode);
                        break;
                    // Phone number states
                    case 32 /* State.PhoneNumberOpenParen */:
                        statePhoneNumberOpenParen(context, stateMachine, char, charCode);
                        break;
                    case 33 /* State.PhoneNumberAreaCodeDigit1 */:
                        statePhoneNumberAreaCodeDigit1(context, stateMachine, charCode);
                        break;
                    case 34 /* State.PhoneNumberAreaCodeDigit2 */:
                        statePhoneNumberAreaCodeDigit2(context, stateMachine, charCode);
                        break;
                    case 35 /* State.PhoneNumberAreaCodeDigit3 */:
                        statePhoneNumberAreaCodeDigit3(context, stateMachine, charCode);
                        break;
                    case 36 /* State.PhoneNumberCloseParen */:
                        statePhoneNumberCloseParen(context, stateMachine, char, charCode);
                        break;
                    case 37 /* State.PhoneNumberPlus */:
                        statePhoneNumberPlus(context, stateMachine, char, charCode);
                        break;
                    case 38 /* State.PhoneNumberDigit */:
                        statePhoneNumberDigit(context, stateMachine, char, charCode);
                        break;
                    case 39 /* State.PhoneNumberSeparator */:
                        statePhoneNumberSeparator(context, stateMachine, char, charCode);
                        break;
                    case 40 /* State.PhoneNumberControlChar */:
                        statePhoneNumberControlChar(context, stateMachine, charCode);
                        break;
                    case 41 /* State.PhoneNumberPoundChar */:
                        statePhoneNumberPoundChar(context, stateMachine, charCode);
                        break;
                    /* istanbul ignore next */
                    default:
                        assertNever(stateMachine.state);
                }
            }
            // Special case for handling a colon (or other non-alphanumeric)
            // when preceded by another character, such as in the text:
            //     Link 1:http://google.com
            // In this case, the 'h' character after the colon wouldn't start a
            // new scheme url because we'd be in a ipv4 or tld url and the colon
            // would be interpreted as a port ':' char. Also, only start a new
            // scheme url machine if there isn't currently one so we don't start
            // new ones for colons inside a url
            //
            // TODO: The addition of this snippet (to fix the bug) in 4.0.1 lost
            // us ~500 ops/sec on the benchmarks. Optimizing it with the
            // hasSchemeUrlMachine() flag and optimizing the isSchemeStartChar()
            // method for 4.1.3 got us back about ~400ops/sec. One potential way
            // to improve this even ore is to add this snippet to individual
            // state handler functions where it can occur to prevent running it
            // on every loop interation.
            if (!context.hasSchemeUrlMachine() &&
                context.charIdx > 0 &&
                isSchemeStartChar(charCode)) {
                var prevCharCode = context.text.charCodeAt(context.charIdx - 1);
                if (!isSchemeStartChar(prevCharCode)) {
                    context.addMachine(createSchemeUrlStateMachine(context.charIdx, 0 /* State.SchemeChar */));
                }
            }
        }
        // For debugging: search for and uncomment other "For debugging" lines
        // table.push([
        //     String(context.charIdx),
        //     char,
        //     `10: ${char.charCodeAt(0)}\n0x: ${char.charCodeAt(0).toString(16)}\nU+${char.codePointAt(0)}`,
        //     context.stateMachines.map(machine => `${StateMachineType[machine.type]}${'matchType' in machine ? ` (${UrlStateMachineMatchType[machine.matchType]})` : ''}`).join('\n') || '(none)',
        //     context.stateMachines.map(machine => State[machine.state]).join('\n') || '(none)',
        //     context.stateMachines.map(m => m.startIdx).join('\n'),
        //     context.stateMachines.map(m => m.acceptStateReached).join('\n'),
        // ]);
    }
    // Capture any valid match at the end of the string
    // Note: this loop must happen in reverse because
    // captureMatchIfValidAndRemove() removes state machines from the array
    // and we'll end up skipping every other one if we remove while looping
    // forward
    for (var i = context.stateMachines.length - 1; i >= 0; i--) {
        context.stateMachines.forEach(function (stateMachine) {
            return captureMatchIfValidAndRemove(context, stateMachine);
        });
    }
    // For debugging: search for and uncomment other "For debugging" lines
    // console.log(`\nRead string:\n  ${text}`);
    // console.log(table.toString());
    return context.matches;
}
/**
 * Handles the state when we're not in a URL/email/etc. (i.e. when no state machines exist)
 */
function stateNoMatch(context, char, charCode) {
    var charIdx = context.charIdx;
    if (charCode === 35 /* Char.NumberSign */ /* '#' */) {
        // Hash char, start a Hashtag match
        context.addMachine(createHashtagStateMachine(charIdx, 28 /* State.HashtagHashChar */));
    }
    else if (charCode === 64 /* Char.AtSign */ /* '@' */) {
        // '@' char, start a Mention match
        context.addMachine(createMentionStateMachine(charIdx, 30 /* State.MentionAtChar */));
    }
    else if (charCode === 47 /* Char.Slash */ /* '/' */) {
        // A slash could begin a protocol-relative URL
        context.addMachine(createTldUrlStateMachine(charIdx, 11 /* State.ProtocolRelativeSlash1 */));
    }
    else if (charCode === 43 /* Char.Plus */ /* '+' */) {
        // A '+' char can start a Phone number
        context.addMachine(createPhoneNumberStateMachine(charIdx, 37 /* State.PhoneNumberPlus */));
    }
    else if (charCode === 40 /* Char.OpenParen */ /* '(' */) {
        context.addMachine(createPhoneNumberStateMachine(charIdx, 32 /* State.PhoneNumberOpenParen */));
    }
    else {
        if (isDigitChar(charCode)) {
            // A digit could start a phone number
            context.addMachine(createPhoneNumberStateMachine(charIdx, 38 /* State.PhoneNumberDigit */));
            // A digit could start an IP address
            context.addMachine(createIpV4UrlStateMachine(charIdx, 13 /* State.IpV4Digit */));
        }
        if (isEmailLocalPartStartChar(charCode)) {
            // Any email local part. An 'm' character in particular could
            // start a 'mailto:' match
            var startState = char.toLowerCase() === 'm' ? 15 /* State.EmailMailto_M */ : 22 /* State.EmailLocalPart */;
            context.addMachine(createEmailStateMachine(charIdx, startState));
        }
        if (isSchemeStartChar(charCode)) {
            // An uppercase or lowercase letter may start a scheme match
            context.addMachine(createSchemeUrlStateMachine(charIdx, 0 /* State.SchemeChar */));
        }
        if (isAlphaNumericOrMarkChar(charCode)) {
            // A unicode alpha character or digit could start a domain name
            // label for a TLD match
            context.addMachine(createTldUrlStateMachine(charIdx, 5 /* State.DomainLabelChar */));
        }
    }
    // Anything else, remain in the "non-url" state by not creating any
    // state machines
}
// Implements ABNF: ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
function stateSchemeChar(context, stateMachine, charCode) {
    if (charCode === 58 /* Char.Colon */ /* ':' */) {
        stateMachine.state = 2 /* State.SchemeColon */;
    }
    else if (charCode === 45 /* Char.Dash */ /* '-' */) {
        stateMachine.state = 1 /* State.SchemeHyphen */;
    }
    else if (isSchemeChar(charCode)) {
        // Stay in SchemeChar state
    }
    else {
        // Any other character, not a scheme
        context.removeMachine(stateMachine);
    }
}
function stateSchemeHyphen(context, stateMachine, charCode) {
    var charIdx = context.charIdx;
    if (charCode === 45 /* Char.Dash */ /* '-' */) {
        // Stay in SchemeHyphen state
        // TODO: Should a colon following a dash be counted as the end of the scheme?
        // } else if (char === ':') {
        //     stateMachine.state = State.SchemeColon;
    }
    else if (charCode === 47 /* Char.Slash */ /* '/' */) {
        // Not a valid scheme match, but may be the start of a
        // protocol-relative match (such as //google.com)
        context.removeMachine(stateMachine);
        context.addMachine(createTldUrlStateMachine(charIdx, 11 /* State.ProtocolRelativeSlash1 */));
    }
    else if (isSchemeChar(charCode)) {
        stateMachine.state = 0 /* State.SchemeChar */;
    }
    else {
        // Any other character, not a scheme
        context.removeMachine(stateMachine);
    }
}
// https://tools.ietf.org/html/rfc3986#appendix-A
function stateSchemeColon(context, stateMachine, charCode) {
    var charIdx = context.charIdx;
    if (charCode === 47 /* Char.Slash */ /* '/' */) {
        stateMachine.state = 3 /* State.SchemeSlash1 */;
    }
    else if (charCode === 46 /* Char.Dot */ /* '.' */) {
        // We've read something like 'hello:.' - don't capture
        context.removeMachine(stateMachine);
    }
    else if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 5 /* State.DomainLabelChar */;
        // It's possible that we read an "introduction" piece of text,
        // and the character after the current colon actually starts an
        // actual scheme. An example of this is:
        //     "The link:http://google.com"
        // Hence, start a new machine to capture this match if so
        if (isSchemeStartChar(charCode)) {
            context.addMachine(createSchemeUrlStateMachine(charIdx, 0 /* State.SchemeChar */));
        }
    }
    else {
        context.removeMachine(stateMachine);
    }
}
// https://tools.ietf.org/html/rfc3986#appendix-A
function stateSchemeSlash1(context, stateMachine, charCode) {
    if (charCode === 47 /* Char.Slash */ /* '/' */) {
        stateMachine.state = 4 /* State.SchemeSlash2 */;
    }
    else if (isPathChar(charCode)) {
        stateMachine.state = 10 /* State.Path */;
        stateMachine.acceptStateReached = true;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateSchemeSlash2(context, stateMachine, char, charCode) {
    if (charCode === 47 /* Char.Slash */ /* '/' */) {
        // 3rd slash, must be an absolute path (`path-absolute` in the
        // ABNF), such as in "file:///c:/windows/etc". See
        // https://tools.ietf.org/html/rfc3986#appendix-A
        stateMachine.state = 10 /* State.Path */;
        stateMachine.acceptStateReached = true;
    }
    else if (isDomainLabelStartChar(charCode)) {
        // start of "authority" section - see https://tools.ietf.org/html/rfc3986#appendix-A
        stateMachine.state = 5 /* State.DomainLabelChar */;
        stateMachine.acceptStateReached = true;
    }
    else {
        // not valid
        context.removeMachine(stateMachine);
    }
}
// Handles after we've read a '/' from the NonUrl state
function stateProtocolRelativeSlash1(context, stateMachine, charCode) {
    if (charCode === 47 /* Char.Slash */ /* '/' */) {
        stateMachine.state = 12 /* State.ProtocolRelativeSlash2 */;
    }
    else {
        // Anything else, cannot be the start of a protocol-relative
        // URL.
        context.removeMachine(stateMachine);
    }
}
// Handles after we've read a second '/', which could start a protocol-relative URL
function stateProtocolRelativeSlash2(context, stateMachine, charCode) {
    if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 5 /* State.DomainLabelChar */;
    }
    else {
        // Anything else, not a URL
        context.removeMachine(stateMachine);
    }
}
// Handles when we have read a domain label character
function stateDomainLabelChar(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        stateMachine.state = 7 /* State.DomainDot */;
    }
    else if (charCode === 45 /* Char.Dash */ /* '-' */) {
        stateMachine.state = 6 /* State.DomainHyphen */;
    }
    else if (charCode === 58 /* Char.Colon */ /* ':' */) {
        // Beginning of a port number, end the domain name
        stateMachine.state = 8 /* State.PortColon */;
    }
    else if (isUrlSuffixStartChar(charCode)) {
        // '/', '?', or '#'
        stateMachine.state = 10 /* State.Path */;
    }
    else if (isDomainLabelChar(charCode)) {
        // Stay in the DomainLabelChar state
    }
    else {
        // Anything else, end the domain name
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateDomainHyphen(context, stateMachine, char, charCode) {
    if (charCode === 45 /* Char.Dash */ /* '-' */) {
        // Remain in the DomainHyphen state
    }
    else if (charCode === 46 /* Char.Dot */ /* '.' */) {
        // Not valid to have a '-.' in a domain label
        captureMatchIfValidAndRemove(context, stateMachine);
    }
    else if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 5 /* State.DomainLabelChar */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateDomainDot(context, stateMachine, char, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        // domain names cannot have multiple '.'s next to each other.
        // It's possible we've already read a valid domain name though,
        // and that the '..' sequence just forms an ellipsis at the end
        // of a sentence
        captureMatchIfValidAndRemove(context, stateMachine);
    }
    else if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 5 /* State.DomainLabelChar */;
        stateMachine.acceptStateReached = true; // after hitting a dot, and then another domain label, we've reached an accept state
    }
    else {
        // Anything else, end the domain name
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateIpV4Digit(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        stateMachine.state = 14 /* State.IpV4Dot */;
    }
    else if (charCode === 58 /* Char.Colon */ /* ':' */) {
        // Beginning of a port number
        stateMachine.state = 8 /* State.PortColon */;
    }
    else if (isDigitChar(charCode)) {
        // stay in the IPv4 digit state
    }
    else if (isUrlSuffixStartChar(charCode)) {
        stateMachine.state = 10 /* State.Path */;
    }
    else if (isAlphaNumericOrMarkChar(charCode)) {
        // If we hit an alpha character, must not be an IPv4
        // Example of this: 1.2.3.4abc
        context.removeMachine(stateMachine);
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateIpV4Dot(context, stateMachine, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.octetsEncountered++;
        // Once we have encountered 4 octets, it's *potentially* a valid
        // IPv4 address. Our IPv4 regex will confirm the match later
        // though to make sure each octet is in the 0-255 range, and
        // there's exactly 4 octets (not 5 or more)
        if (stateMachine.octetsEncountered === 4) {
            stateMachine.acceptStateReached = true;
        }
        stateMachine.state = 13 /* State.IpV4Digit */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function statePortColon(context, stateMachine, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 9 /* State.PortNumber */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function statePortNumber(context, stateMachine, charCode) {
    if (isDigitChar(charCode)) {
        // Stay in port number state
    }
    else if (isUrlSuffixStartChar(charCode)) {
        // '/', '?', or '#'
        stateMachine.state = 10 /* State.Path */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function statePath(context, stateMachine, charCode) {
    if (isPathChar(charCode)) {
        // Stay in the path state
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
// Handles if we're reading a 'mailto:' prefix on the string
function stateEmailMailto_M(context, stateMachine, char, charCode) {
    if (char.toLowerCase() === 'a') {
        stateMachine.state = 16 /* State.EmailMailto_A */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailto_A(context, stateMachine, char, charCode) {
    if (char.toLowerCase() === 'i') {
        stateMachine.state = 17 /* State.EmailMailto_I */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailto_I(context, stateMachine, char, charCode) {
    if (char.toLowerCase() === 'l') {
        stateMachine.state = 18 /* State.EmailMailto_L */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailto_L(context, stateMachine, char, charCode) {
    if (char.toLowerCase() === 't') {
        stateMachine.state = 19 /* State.EmailMailto_T */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailto_T(context, stateMachine, char, charCode) {
    if (char.toLowerCase() === 'o') {
        stateMachine.state = 20 /* State.EmailMailto_O */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailto_O(context, stateMachine, charCode) {
    if (charCode === 58 /* Char.Colon */ /* ':' */) {
        stateMachine.state = 21 /* State.EmailMailto_Colon */;
    }
    else {
        stateEmailLocalPart(context, stateMachine, charCode);
    }
}
function stateEmailMailtoColon(context, stateMachine, charCode) {
    if (isEmailLocalPartChar(charCode)) {
        stateMachine.state = 22 /* State.EmailLocalPart */;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
// Handles the state when we're currently in the "local part" of an
// email address (as opposed to the "domain part")
function stateEmailLocalPart(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        stateMachine.state = 23 /* State.EmailLocalPartDot */;
    }
    else if (charCode === 64 /* Char.AtSign */ /* '@' */) {
        stateMachine.state = 24 /* State.EmailAtSign */;
    }
    else if (isEmailLocalPartChar(charCode)) {
        // stay in the "local part" of the email address
        // Note: because stateEmailLocalPart() is called from the
        // 'mailto' states (when the 'mailto' prefix itself has been
        // broken), make sure to set the state to EmailLocalPart
        stateMachine.state = 22 /* State.EmailLocalPart */;
    }
    else {
        // not an email address character
        context.removeMachine(stateMachine);
    }
}
// Handles the state where we've read a '.' character in the local part of
// the email address (i.e. the part before the '@' character)
function stateEmailLocalPartDot(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        // We read a second '.' in a row, not a valid email address
        // local part
        context.removeMachine(stateMachine);
    }
    else if (charCode === 64 /* Char.AtSign */ /* '@' */) {
        // We read the '@' character immediately after a dot ('.'), not
        // an email address
        context.removeMachine(stateMachine);
    }
    else if (isEmailLocalPartChar(charCode)) {
        stateMachine.state = 22 /* State.EmailLocalPart */;
    }
    else {
        // Anything else, not an email address
        context.removeMachine(stateMachine);
    }
}
function stateEmailAtSign(context, stateMachine, charCode) {
    if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 25 /* State.EmailDomainChar */;
    }
    else {
        // Anything else, not an email address
        context.removeMachine(stateMachine);
    }
}
function stateEmailDomainChar(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */) {
        stateMachine.state = 27 /* State.EmailDomainDot */;
    }
    else if (charCode === 45 /* Char.Dash */ /* '-' */) {
        stateMachine.state = 26 /* State.EmailDomainHyphen */;
    }
    else if (isDomainLabelChar(charCode)) {
        // Stay in the DomainChar state
    }
    else {
        // Anything else, we potentially matched if the criteria has
        // been met
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateEmailDomainHyphen(context, stateMachine, charCode) {
    if (charCode === 45 /* Char.Dash */ /* '-' */ || charCode === 46 /* Char.Dot */ /* '.' */) {
        // Not valid to have two hyphens ("--") or hypen+dot ("-.")
        captureMatchIfValidAndRemove(context, stateMachine);
    }
    else if (isDomainLabelChar(charCode)) {
        stateMachine.state = 25 /* State.EmailDomainChar */;
    }
    else {
        // Anything else
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function stateEmailDomainDot(context, stateMachine, charCode) {
    if (charCode === 46 /* Char.Dot */ /* '.' */ || charCode === 45 /* Char.Dash */ /* '-' */) {
        // not valid to have two dots ("..") or dot+hypen (".-")
        captureMatchIfValidAndRemove(context, stateMachine);
    }
    else if (isDomainLabelStartChar(charCode)) {
        stateMachine.state = 25 /* State.EmailDomainChar */;
        // After having read a '.' and then a valid domain character,
        // we now know that the domain part of the email is valid, and
        // we have found at least a partial EmailMatch (however, the
        // email address may have additional characters from this point)
        stateMachine.acceptStateReached = true;
    }
    else {
        // Anything else
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
// Handles the state when we've just encountered a '#' character
function stateHashtagHashChar(context, stateMachine, charCode) {
    if (isHashtagTextChar(charCode)) {
        // '#' char with valid hash text char following
        stateMachine.state = 29 /* State.HashtagTextChar */;
        stateMachine.acceptStateReached = true;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
// Handles the state when we're currently in the hash tag's text chars
function stateHashtagTextChar(context, stateMachine, charCode) {
    if (isHashtagTextChar(charCode)) {
        // Continue reading characters in the HashtagText state
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
// Handles the state when we've just encountered a '@' character
function stateMentionAtChar(context, stateMachine, charCode) {
    if (isMentionTextChar(charCode)) {
        // '@' char with valid mention text char following
        stateMachine.state = 31 /* State.MentionTextChar */;
        stateMachine.acceptStateReached = true;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
// Handles the state when we're currently in the mention's text chars
function stateMentionTextChar(context, stateMachine, charCode) {
    if (isMentionTextChar(charCode)) {
        // Continue reading characters in the HashtagText state
    }
    else if (isAlphaNumericOrMarkChar(charCode)) {
        // Char is invalid for a mention text char, not a valid match.
        // Note that ascii alphanumeric chars are okay (which are tested
        // in the previous 'if' statement, but others are not)
        context.removeMachine(stateMachine);
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
function statePhoneNumberPlus(context, stateMachine, char, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 38 /* State.PhoneNumberDigit */;
    }
    else {
        context.removeMachine(stateMachine);
        // This character may start a new match. Add states for it
        stateNoMatch(context, char, charCode);
    }
}
function statePhoneNumberOpenParen(context, stateMachine, char, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 33 /* State.PhoneNumberAreaCodeDigit1 */;
    }
    else {
        context.removeMachine(stateMachine);
    }
    // It's also possible that the paren was just an open brace for
    // a piece of text. Start other machines
    stateNoMatch(context, char, charCode);
}
function statePhoneNumberAreaCodeDigit1(context, stateMachine, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 34 /* State.PhoneNumberAreaCodeDigit2 */;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
function statePhoneNumberAreaCodeDigit2(context, stateMachine, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 35 /* State.PhoneNumberAreaCodeDigit3 */;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
function statePhoneNumberAreaCodeDigit3(context, stateMachine, charCode) {
    if (charCode === 41 /* Char.CloseParen */ /* ')' */) {
        stateMachine.state = 36 /* State.PhoneNumberCloseParen */;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
function statePhoneNumberCloseParen(context, stateMachine, char, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 38 /* State.PhoneNumberDigit */;
    }
    else if (isPhoneNumberSeparatorChar(charCode)) {
        stateMachine.state = 39 /* State.PhoneNumberSeparator */;
    }
    else {
        context.removeMachine(stateMachine);
    }
}
function statePhoneNumberDigit(context, stateMachine, char, charCode) {
    var charIdx = context.charIdx;
    // For now, if we've reached any digits, we'll say that the machine
    // has reached its accept state. The phone regex will confirm the
    // match later.
    // Alternatively, we could count the number of digits to avoid
    // invoking the phone number regex
    stateMachine.acceptStateReached = true;
    if (isPhoneNumberControlChar(charCode)) {
        stateMachine.state = 40 /* State.PhoneNumberControlChar */;
    }
    else if (charCode === 35 /* Char.NumberSign */ /* '#' */) {
        stateMachine.state = 41 /* State.PhoneNumberPoundChar */;
    }
    else if (isDigitChar(charCode)) {
        // Stay in the phone number digit state
    }
    else if (charCode === 40 /* Char.OpenParen */ /* '(' */) {
        stateMachine.state = 32 /* State.PhoneNumberOpenParen */;
    }
    else if (isPhoneNumberSeparatorChar(charCode)) {
        stateMachine.state = 39 /* State.PhoneNumberSeparator */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
        // The transition from a digit character to a letter can be the
        // start of a new scheme URL match
        if (isSchemeStartChar(charCode)) {
            context.addMachine(createSchemeUrlStateMachine(charIdx, 0 /* State.SchemeChar */));
        }
    }
}
function statePhoneNumberSeparator(context, stateMachine, char, charCode) {
    if (isDigitChar(charCode)) {
        stateMachine.state = 38 /* State.PhoneNumberDigit */;
    }
    else if (charCode === 40 /* Char.OpenParen */ /* '(' */) {
        stateMachine.state = 32 /* State.PhoneNumberOpenParen */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
        // This character may start a new match. Add states for it
        stateNoMatch(context, char, charCode);
    }
}
// The ";" characters is "wait" in a phone number
// The "," characters is "pause" in a phone number
function statePhoneNumberControlChar(context, stateMachine, charCode) {
    if (isPhoneNumberControlChar(charCode)) {
        // Stay in the "control char" state
    }
    else if (charCode === 35 /* Char.NumberSign */ /* '#' */) {
        stateMachine.state = 41 /* State.PhoneNumberPoundChar */;
    }
    else if (isDigitChar(charCode)) {
        stateMachine.state = 38 /* State.PhoneNumberDigit */;
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
// The "#" characters is "pound" in a phone number
function statePhoneNumberPoundChar(context, stateMachine, charCode) {
    if (isPhoneNumberControlChar(charCode)) {
        stateMachine.state = 40 /* State.PhoneNumberControlChar */;
    }
    else if (isDigitChar(charCode)) {
        // According to some of the older tests, if there's a digit
        // after a '#' sign, the match is invalid. TODO: Revisit if this is true
        context.removeMachine(stateMachine);
    }
    else {
        captureMatchIfValidAndRemove(context, stateMachine);
    }
}
/*
 * Captures a match if it is valid (i.e. has a full domain name for a
 * TLD match). If a match is not valid, it is possible that we want to
 * keep reading characters in order to make a full match.
 */
function captureMatchIfValidAndRemove(context, stateMachine) {
    var matches = context.matches, text = context.text, charIdx = context.charIdx, tagBuilder = context.tagBuilder, stripPrefix = context.stripPrefix, stripTrailingSlash = context.stripTrailingSlash, decodePercentEncoding = context.decodePercentEncoding, hashtagServiceName = context.hashtagServiceName, mentionServiceName = context.mentionServiceName;
    // Remove the state machine first. There are a number of code paths
    // which return out of this function early, so make sure we have
    // this done
    context.removeMachine(stateMachine);
    // Make sure the state machine being checked has actually reached an
    // "accept" state. If it hasn't reach one, it can't be a match
    if (!stateMachine.acceptStateReached) {
        return;
    }
    var startIdx = stateMachine.startIdx;
    var matchedText = text.slice(stateMachine.startIdx, charIdx);
    // Handle any unbalanced braces (parens, square brackets, or curly
    // brackets) inside the URL. This handles situations like:
    //     The link (google.com)
    // and
    //     Check out this link here (en.wikipedia.org/wiki/IANA_(disambiguation))
    //
    // And also remove any punctuation chars at the end such as:
    //     '?', ',', ':', '.', etc.
    matchedText = excludeUnbalancedTrailingBracesAndPunctuation(matchedText);
    switch (stateMachine.type) {
        case 0 /* StateMachineType.Url */: {
            // We don't want to accidentally match a URL that is preceded by an
            // '@' character, which would be an email address
            var charBeforeUrlMatch = text.charCodeAt(stateMachine.startIdx - 1);
            if (charBeforeUrlMatch === 64 /* Char.AtSign */ /* '@' */) {
                return;
            }
            switch (stateMachine.matchType) {
                case 0 /* UrlStateMachineMatchType.Scheme */: {
                    // Autolinker accepts many characters in a url's scheme (like `fake://test.com`).
                    // However, in cases where a URL is missing whitespace before an obvious link,
                    // (for example: `nowhitespacehttp://www.test.com`), we only want the match to start
                    // at the http:// part. We will check if the match contains a common scheme and then
                    // shift the match to start from there.
                    var httpSchemeMatch = httpSchemeRe.exec(matchedText);
                    if (httpSchemeMatch) {
                        // If we found an overmatched URL, we want to find the index
                        // of where the match should start and shift the match to
                        // start from the beginning of the common scheme
                        startIdx = startIdx + httpSchemeMatch.index;
                        matchedText = matchedText.slice(httpSchemeMatch.index);
                    }
                    if (!isValidSchemeUrl(matchedText)) {
                        return; // not a valid match
                    }
                    break;
                }
                case 1 /* UrlStateMachineMatchType.Tld */: {
                    if (!isValidTldMatch(matchedText)) {
                        return; // not a valid match
                    }
                    break;
                }
                case 2 /* UrlStateMachineMatchType.IpV4 */: {
                    if (!isValidIpV4Address(matchedText)) {
                        return; // not a valid match
                    }
                    break;
                }
                /* istanbul ignore next */
                default:
                    assertNever(stateMachine);
            }
            matches.push(new UrlMatch({
                tagBuilder: tagBuilder,
                matchedText: matchedText,
                offset: startIdx,
                urlMatchType: toUrlMatchType(stateMachine.matchType),
                url: matchedText,
                protocolRelativeMatch: matchedText.slice(0, 2) === '//',
                // TODO: Do these settings need to be passed to the match,
                // or should we handle them here in UrlMatcher?
                stripPrefix: stripPrefix,
                stripTrailingSlash: stripTrailingSlash,
                decodePercentEncoding: decodePercentEncoding,
            }));
            break;
        }
        case 1 /* StateMachineType.Email */: {
            // if the email address has a valid TLD, add it to the list of matches
            if (isValidEmail(matchedText)) {
                matches.push(new EmailMatch({
                    tagBuilder: tagBuilder,
                    matchedText: matchedText,
                    offset: startIdx,
                    email: matchedText.replace(mailtoSchemePrefixRe, ''),
                }));
            }
            break;
        }
        case 2 /* StateMachineType.Hashtag */: {
            if (isValidHashtag(matchedText)) {
                matches.push(new HashtagMatch({
                    tagBuilder: tagBuilder,
                    matchedText: matchedText,
                    offset: startIdx,
                    serviceName: hashtagServiceName,
                    hashtag: matchedText.slice(1),
                }));
            }
            break;
        }
        case 3 /* StateMachineType.Mention */: {
            if (isValidMention(matchedText, mentionServiceName)) {
                matches.push(new MentionMatch({
                    tagBuilder: tagBuilder,
                    matchedText: matchedText,
                    offset: startIdx,
                    serviceName: mentionServiceName,
                    mention: matchedText.slice(1), // strip off the '@' character at the beginning
                }));
            }
            break;
        }
        case 4 /* StateMachineType.Phone */: {
            // remove any trailing spaces that were considered as "separator"
            // chars by the state machine
            matchedText = matchedText.replace(/ +$/g, '');
            if (isValidPhoneNumber(matchedText)) {
                var cleanNumber = matchedText.replace(/[^0-9,;#]/g, ''); // strip out non-digit characters exclude comma semicolon and #
                matches.push(new PhoneMatch({
                    tagBuilder: tagBuilder,
                    matchedText: matchedText,
                    offset: startIdx,
                    number: cleanNumber,
                    plusSign: matchedText.charAt(0) === '+',
                }));
            }
            break;
        }
        /* istanbul ignore next */
        default:
            assertNever(stateMachine);
    }
}
/**
 * Helper function to convert a UrlStateMachineMatchType value to its
 * UrlMatchType equivalent.
 */
function toUrlMatchType(stateMachineMatchType) {
    switch (stateMachineMatchType) {
        case 0 /* UrlStateMachineMatchType.Scheme */:
            return 'scheme';
        case 1 /* UrlStateMachineMatchType.Tld */:
            return 'tld';
        case 2 /* UrlStateMachineMatchType.IpV4 */:
            return 'ipV4';
        /* istanbul ignore next */
        default:
            assertNever(stateMachineMatchType);
    }
}
var oppositeBrace = {
    ')': '(',
    '}': '{',
    ']': '[',
};
/**
 * Determines if a match found has unmatched closing parenthesis,
 * square brackets or curly brackets. If so, these unbalanced symbol(s) will be
 * removed from the URL match itself.
 *
 * A match may have an extra closing parenthesis/square brackets/curly brackets
 * at the end of the match because these are valid URL path characters. For
 * example, "wikipedia.com/something_(disambiguation)" should be auto-linked.
 *
 * However, an extra parenthesis *will* be included when the URL itself is
 * wrapped in parenthesis, such as in the case of:
 *
 *     "(wikipedia.com/something_(disambiguation))"
 *
 * In this case, the last closing parenthesis should *not* be part of the
 * URL itself, and this method will exclude it from the returned URL.
 *
 * For square brackets in URLs such as in PHP arrays, the same behavior as
 * parenthesis discussed above should happen:
 *
 *     "[http://www.example.com/foo.php?bar[]=1&bar[]=2&bar[]=3]"
 *
 * The very last closing square bracket should not be part of the URL itself,
 * and therefore this method will remove it.
 *
 * @param matchedText The full matched URL/email/hashtag/etc. from the state
 *   machine parser.
 * @return The updated matched text with extraneous suffix characters removed.
 */
export function excludeUnbalancedTrailingBracesAndPunctuation(matchedText) {
    var braceCounts = {
        '(': 0,
        '{': 0,
        '[': 0,
    };
    for (var i = 0; i < matchedText.length; i++) {
        var char = matchedText.charAt(i);
        var charCode = matchedText.charCodeAt(i);
        if (isOpenBraceChar(charCode)) {
            braceCounts[char]++;
        }
        else if (isCloseBraceChar(charCode)) {
            braceCounts[oppositeBrace[char]]--;
        }
    }
    var endIdx = matchedText.length - 1;
    while (endIdx >= 0) {
        var char = matchedText.charAt(endIdx);
        var charCode = matchedText.charCodeAt(endIdx);
        if (isCloseBraceChar(charCode)) {
            var oppositeBraceChar = oppositeBrace[char];
            if (braceCounts[oppositeBraceChar] < 0) {
                braceCounts[oppositeBraceChar]++;
                endIdx--;
            }
            else {
                break;
            }
        }
        else if (isUrlSuffixNotAllowedAsFinalChar(charCode)) {
            // Walk back a punctuation char like '?', ',', ':', '.', etc.
            endIdx--;
        }
        else {
            break;
        }
    }
    return matchedText.slice(0, endIdx + 1);
}
function createSchemeUrlStateMachine(startIdx, state) {
    return {
        type: 0 /* StateMachineType.Url */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
        matchType: 0 /* UrlStateMachineMatchType.Scheme */,
    };
}
function createTldUrlStateMachine(startIdx, state) {
    return {
        type: 0 /* StateMachineType.Url */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
        matchType: 1 /* UrlStateMachineMatchType.Tld */,
    };
}
function createIpV4UrlStateMachine(startIdx, state) {
    return {
        type: 0 /* StateMachineType.Url */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
        matchType: 2 /* UrlStateMachineMatchType.IpV4 */,
        octetsEncountered: 1, // starts at 1 because we create this machine when encountering the first octet
    };
}
function createEmailStateMachine(startIdx, state) {
    return {
        type: 1 /* StateMachineType.Email */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
    };
}
function createHashtagStateMachine(startIdx, state) {
    return {
        type: 2 /* StateMachineType.Hashtag */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
    };
}
function createMentionStateMachine(startIdx, state) {
    return {
        type: 3 /* StateMachineType.Mention */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
    };
}
function createPhoneNumberStateMachine(startIdx, state) {
    return {
        type: 4 /* StateMachineType.Phone */,
        startIdx: startIdx,
        state: state,
        acceptStateReached: false,
    };
}
function isSchemeUrlStateMachine(machine) {
    return (machine.type === 0 /* StateMachineType.Url */ &&
        machine.matchType === 0 /* UrlStateMachineMatchType.Scheme */);
}
//# sourceMappingURL=parse-matches.js.map