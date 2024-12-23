/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export function b2IsPowerOf2(x)
{
    return (x & (x - 1)) === 0;
}

export function b2BoundingPowerOf2(x)
{
    if (x <= 1)
    {
        return 1;
    }

    return 32 - Math.clz32(x - 1);
}

export function b2RoundUpPowerOf2(x)
{
    if (x <= 1)
    {
        return 1;
    }

    return 1 << (32 - Math.clz32(x - 1));
}

export function b2CTZ64(block)
{
    // 64; PJB closer to the _BitScanForward64 implementation
    if (block === 0n)
    {
        return 0;
    }
    
    const low32 = Number(block & 0xFFFFFFFFn);

    if (low32 !== 0)
    {
        return Math.clz32(low32 & -low32) ^ 31;
    }
    else
    {
        const high32 = Number(block >> 32n);

        return Math.clz32(high32 & -high32) ^ 31 | 32;
    }
}
