/**
 * Determines if the given character can be part of a mention's text characters.
 *
 * Accepts characters that match the RegExp `/[-\w.]/`, which are the possible
 * mention characters for any service.
 *
 * We'll confirm the match based on the user-configured service name after the
 * match is found.
 */
export declare function isMentionTextChar(charCode: number): boolean;
/**
 * Determines if the given `mention` text is valid.
 */
export declare function isValidMention(mention: string, serviceName: MentionService): boolean;
export type MentionService = 'twitter' | 'instagram' | 'soundcloud' | 'tiktok' | 'youtube';
export declare const mentionServices: MentionService[];
