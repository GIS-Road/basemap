import { MainModule } from './build/main';
import { GaussianCloud } from './gaussianCloud';
type CoordinateSystemUnion = keyof MainModule["CoordinateSystem"];
interface ILoadSpzOptions {
    colorScaleFactor?: number;
    unpackOptions?: {
        coordinateSystem?: CoordinateSystemUnion;
    };
}
/**
 * decode .spz data to GaussianCloud
 * @param spzData .spz file binary data
 * @returns Gaussian Cloud
 */
declare const loadSpz: (spzData: Uint8Array | ArrayBuffer, options?: ILoadSpzOptions) => Promise<GaussianCloud>;
declare const loadSpzFromUrl: (url: string, options?: ILoadSpzOptions) => Promise<GaussianCloud>;
export { type ILoadSpzOptions, loadSpz, loadSpzFromUrl, type CoordinateSystemUnion, };
