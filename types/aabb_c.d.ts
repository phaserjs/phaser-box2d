/**
 * @namespace Aabb
 */
/**
 * @import {b2AABB} from './include/math_functions_h.js'
 */
export function b2Perimeter(a: any): number;
export function b2EnlargeAABB(a: any, b: any): boolean;
export function b2AABB_Overlaps(a: any, b: any): boolean;
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
export function b2AABB_IsValid(aabb: b2Math.b2AABB): boolean;
import * as b2Math from './include/math_functions_h.js';
