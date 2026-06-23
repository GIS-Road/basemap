/* tslint:disable */
/* eslint-disable */
/**
 * Generate a splat texture from the given attributes.
 *
 * Wraps the [`texture_gen::generate_texture_from_attrs`] function for access from JavaScript.
 */
export function generate_splat_texture(positions: Float32Array, scales: Float32Array, rotations: Float32Array, colors: Uint8Array, count: number): TextureData;
/**
 * Sorts the Gaussian Splats by depth using a radix sort.
 *
 * Wraps the [`radix::radix_sort_gaussians_indexes`] function for access from JavaScript.
 */
export function radix_sort_gaussians_indexes(positions_arr: Float32Array, model_view_arr: Float32Array, count: number): Uint32Array;
/**
 * A structure representing texture data. This is used to pass the texture data from generation in [`texture_gen`] to the JavaScript side.
 */
export class TextureData {
  private constructor();
  free(): void;
  /**
   * Creates a new texture data object with the underlying data, width, and height.
   */
  static new(data: Uint32Array, width: number, height: number): TextureData;
  /**
   * Getter for the underlying texture data. Always returns a copy.
   */
  readonly data: Uint32Array;
  /**
   * Getter for the width of the texture in pixels.
   */
  readonly width: number;
  /**
   * Getter for the height of the texture in pixels.
   */
  readonly height: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_texturedata_free: (a: number, b: number) => void;
  readonly texturedata_data: (a: number) => [number, number];
  readonly texturedata_width: (a: number) => number;
  readonly texturedata_height: (a: number) => number;
  readonly texturedata_new: (a: number, b: number, c: number, d: number) => number;
  readonly generate_splat_texture: (a: any, b: any, c: any, d: any, e: number) => [number, number, number];
  readonly radix_sort_gaussians_indexes: (a: any, b: any, c: number) => [number, number, number];
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
