import type { KTX2Container } from './container.js';
/**
 * Creates a 'default' {@link KTX2Container} object, initialized with common
 * configuration wfor BT709 primaries and sRGB transfer, without pixel data.
 * There's nothing particularly special about the 'default' container; creating
 * the KTX2Container object explicitly is also fine.
 */
export declare function createDefaultContainer(): KTX2Container;
