export function b2SetBit(bitSet: any, bitIndex: any): void;
export function b2SetBitGrow(bitSet: any, bitIndex: any): void;
export function b2ClearBit(bitSet: any, bitIndex: any): void;
export function b2GetBit(bitSet: any, bitIndex: any): boolean;
export function b2GetBitSetBytes(bitSet: any): number;
export class b2BitSet {
    bits: any;
    blockCapacity: number;
    blockCount: number;
}
import { b2CreateBitSet } from '../bitset_c.js';
import { b2DestroyBitSet } from '../bitset_c.js';
import { b2SetBitCountAndClear } from '../bitset_c.js';
import { b2GrowBitSet } from '../bitset_c.js';
import { b2InPlaceUnion } from '../bitset_c.js';
export { b2CreateBitSet, b2DestroyBitSet, b2SetBitCountAndClear, b2GrowBitSet, b2InPlaceUnion };
