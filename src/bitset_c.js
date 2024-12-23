/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2BitSet } from './include/bitset_h.js';

/**
 * @namespace BitSet
 */

const b2_64bits = 8;

export function b2CreateBitSet(bitCapacity)
{
    const bitSet = new b2BitSet();
    const cap = Math.floor((bitCapacity + b2_64bits * 8 - 1) / (b2_64bits * 8));

    bitSet.blockCapacity = cap;
    bitSet.blockCount = 0;
    bitSet.bits = new BigUint64Array(bitSet.blockCapacity);
    bitSet.bits.fill(0n);

    return bitSet;
}

export function b2DestroyBitSet(bitSet)
{
    bitSet.blockCapacity = 0;
    bitSet.blockCount = 0;
    bitSet.bits = null;
}

export function b2SetBitCountAndClear(bitSet, bitCount)
{
    const blockCount = Math.floor((bitCount + b2_64bits * 8 - 1) / (b2_64bits * 8));

    if (bitSet.blockCapacity < blockCount)
    {
        b2DestroyBitSet(bitSet);
        const newBitCapacity = bitCount + (bitCount >> 1);
        bitSet = b2CreateBitSet(newBitCapacity);
    }

    bitSet.blockCount = blockCount;
    bitSet.bits.fill(0n);

    return bitSet;
}

export function b2GrowBitSet(bitSet, blockCount)
{
    console.assert(blockCount > bitSet.blockCount, "grow is unnecessary here");

    if (blockCount > bitSet.blockCapacity)
    {
        const oldCapacity = bitSet.blockCapacity;
        bitSet.blockCapacity = blockCount + (blockCount >> 1);
        const newBits = new BigUint64Array(bitSet.blockCapacity);
        newBits.fill(0n);

        if (bitSet.blockCount > 0)
        {
            newBits.set(bitSet.bits.subarray(0, oldCapacity));
        }

        bitSet.bits = newBits;
    }

    bitSet.blockCount = blockCount;
}

export function b2InPlaceUnion(setA, setB)
{
    console.assert(setA.blockCount == setB.blockCount);
    const blockCount = setA.blockCount;

    for (let i = 0; i < blockCount; ++i)
    {
        setA.bits[i] |= setB.bits[i];
    }
}
