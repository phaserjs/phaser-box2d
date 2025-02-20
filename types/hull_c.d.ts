export function b2IsPolygonCCW(points: any, count: any): boolean;
export function b2ReverseWinding(points: any, count: any): any;
/**
 * @function b2ComputeHull
 * @param {b2Vec2[]} points - Array of 2D points to compute hull from
 * @param {number} count - Number of points in the array
 * @returns {b2Hull} A hull object containing the computed convex hull vertices
 * @description
 * Computes the convex hull of a set of 2D points. The function:
 * - Filters duplicate points within a tolerance
 * - Finds extreme points to establish initial hull edges
 * - Recursively adds points to build the complete hull
 * - Removes collinear/near-collinear points from final hull
 * @throws {Error} If count < 3 or count > B2_MAX_POLYGON_VERTICES
 */
export function b2ComputeHull(points: b2Vec2[], count: number): b2Hull;
/**
 * @function b2ValidateHull
 * @description
 * Validates that a hull meets the requirements for a valid convex polygon:
 * - Has between 3 and B2_MAX_POLYGON_VERTICES points
 * - Points are in counter-clockwise order
 * - All points are behind the edges
 * - No collinear points within b2_linearSlop tolerance
 * @param {b2Hull} hull - The hull to validate, containing points array and count
 * @returns {boolean} True if the hull is valid, false otherwise
 * @throws {Warning} Console warnings are issued explaining validation failures
 */
export function b2ValidateHull(hull: b2Hull): boolean;
import type { b2Vec2 } from './include/math_functions_h.js';
import { b2Hull } from './include/collision_h.js';
