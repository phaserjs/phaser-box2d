/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import * as b2Math from './include/math_functions_h.js';

/**
 * @namespace Aabb
 */

/**
 * @import {b2AABB} from './include/math_functions_h.js'
 */

// Get surface area of an AABB (the perimeter length)
export function b2Perimeter(a)
{
    const wx = a.upperBoundX - a.lowerBoundX;
    const wy = a.upperBoundY - a.lowerBoundY;

    return 2.0 * (wx + wy);
}

export function b2EnlargeAABB(a, b)
{
    let changed = false;

    if (b.lowerBoundX < a.lowerBoundX)
    {
        a.lowerBoundX = b.lowerBoundX;
        changed = true;
    }

    if (b.lowerBoundY < a.lowerBoundY)
    {
        a.lowerBoundY = b.lowerBoundY;
        changed = true;
    }

    if (a.upperBoundX < b.upperBoundX)
    {
        a.upperBoundX = b.upperBoundX;
        changed = true;
    }

    if (a.upperBoundY < b.upperBoundY)
    {
        a.upperBoundY = b.upperBoundY;
        changed = true;
    }

    return changed;
}

export function b2AABB_Overlaps(a, b)
{
    return !(a.lowerBoundX >= b.upperBoundX ||
             a.upperBoundX <= b.lowerBoundX ||
             a.lowerBoundY >= b.upperBoundY ||
             a.upperBoundY <= b.lowerBoundY);
}

/**
 * Validates an Axis-Aligned Bounding Box (AABB)
 * @function b2AABB_IsValid
 * @param {b2AABB} aabb - The AABB to validate
 * @returns {boolean} True if the AABB exists and has valid dimensions and coordinates
 * @description
 * Checks if an AABB is valid by verifying:
 * 1. The AABB object exists
 * 2. The width (upperBoundX - lowerBoundX) is non-negative
 * 3. The height (upperBoundY - lowerBoundY) is non-negative
 * 4. All coordinate values are valid numbers
 */
export function b2AABB_IsValid(aabb)
{
    const dx = aabb.upperBoundX - aabb.lowerBoundX;   // b2Math.b2Sub(a.upperBound, a.lowerBound);
    const dy = aabb.upperBoundY - aabb.lowerBoundY;
    let valid = dx >= 0.0 && dy >= 0.0;
    valid = valid && b2Math.b2IsValid(aabb.lowerBoundX) && b2Math.b2IsValid(aabb.lowerBoundY)
                && b2Math.b2IsValid(aabb.upperBoundX) && b2Math.b2IsValid(aabb.upperBoundY);

    return valid;
}
