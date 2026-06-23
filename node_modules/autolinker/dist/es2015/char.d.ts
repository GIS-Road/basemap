/**
 * Common UTF-16 character codes used in the program.
 *
 * This is a 'const' enum, meaning that the numerical value will be inlined into
 * the code when TypeScript is compiled.
 */
export declare const enum Char {
    A = 65,
    Z = 90,
    a = 97,
    z = 122,
    DoubleQuote = 34,// char code for "
    SingleQuote = 39,// char code for '
    Zero = 48,// char code for '0'
    Nine = 57,// char code for '9'
    Space = 32,// U+0020 Space <SP> Normal space
    NumberSign = 35,// '#' char
    OpenParen = 40,// '(' char
    CloseParen = 41,// ')' char
    Plus = 43,// '+' char
    Comma = 44,// ',' char
    Dash = 45,// '-' char
    Dot = 46,// '.' char
    Slash = 47,// '/' char
    Colon = 58,// ':' char
    SemiColon = 59,// ';' char
    Question = 63,// '?' char
    AtSign = 64,// '@' char
    Underscore = 95
}
