/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    b2CreateBitSet,
    b2DestroyBitSet,
    b2GrowBitSet,
    b2InPlaceUnion,
    b2SetBitCountAndClear
} from '../bitset_c.js';

// Bit set provides fast operations on large arrays of bits
export class b2BitSet
{
    constructor()
    {
        this.bits = null;
        this.blockCapacity = 0;
        this.blockCount = 0;
    }
}

export {
    b2CreateBitSet, b2DestroyBitSet, b2SetBitCountAndClear, b2GrowBitSet, b2InPlaceUnion
};

export function b2SetBit(bitSet, bitIndex)
{
    const blockIndex = Math.floor(bitIndex / 64);
    console.assert(blockIndex < bitSet.blockCount);
    bitSet.bits[blockIndex] |= (BigInt(1) << BigInt(bitIndex % 64));
}

export function b2SetBitGrow(bitSet, bitIndex)
{
    const blockIndex = Math.floor(bitIndex / 64);

    if (blockIndex >= bitSet.blockCount)
    {
        b2GrowBitSet(bitSet, blockIndex + 1);
    }

    bitSet.bits[blockIndex] |= (BigInt(1) << BigInt(bitIndex % 64));
}

export function b2ClearBit(bitSet, bitIndex)
{
    const blockIndex = Math.floor(bitIndex / 64);

    if (blockIndex >= bitSet.blockCount)
    {
        return;
    }
    
    bitSet.bits[blockIndex] &= ~(BigInt(1) << BigInt(bitIndex % 64));
}

export function b2GetBit(bitSet, bitIndex)
{
    const blockIndex = Math.floor(bitIndex / 64);

    if (blockIndex >= bitSet.blockCount)
    {
        return false;
    }

    return (bitSet.bits[blockIndex] & (BigInt(1) << BigInt(bitIndex % 64))) !== BigInt(0);
}

export function b2GetBitSetBytes(bitSet)
{
    return bitSet.blockCapacity * 8; // 8 bytes per 64-bit block
}
