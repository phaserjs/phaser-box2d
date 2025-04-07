/**
 * @namespace Distance
 */
/**
 * @import {b2ShapeCastPairInput, b2TOIInput} from './include/collision_h'
 */
/**
 * @function b2GetSweepTransform
 * @summary Computes an interpolated transform at a specified time during a sweep motion.
 * @param {b2Sweep} sweep - A sweep object containing initial (c1, q1) and final (c2, q2)
 * positions and rotations, along with a local center offset.
 * @param {number} time - Interpolation factor between 0 and 1, where 0 represents the initial
 * state and 1 represents the final state.
 * @returns {b2Transform} A transform object containing the interpolated position (p) and
 * rotation (q) at the specified time.
 * @description
 * Calculates an intermediate transform by linearly interpolating between two states
 * defined in a sweep motion. The resulting transform accounts for both translation
 * and rotation, adjusted by the local center offset.
 */
export function b2GetSweepTransform(sweep: b2Sweep, time: number): b2Transform;
export function b2SegmentDistance(p1X: any, p1Y: any, q1X: any, q1Y: any, p2X: any, p2Y: any, q2X: any, q2Y: any): b2SegmentDistanceResult;
/**
 * @function b2MakeProxy
 * @summary Creates a distance proxy from a set of vertices
 * @param {b2Vec2[]} vertices - Array of 2D vectors representing the vertices
 * @param {number} count - Number of vertices to process (max B2_MAX_POLYGON_VERTICES)
 * @param {number} radius - Radius value for the proxy
 * @returns {b2DistanceProxy} A new distance proxy containing the processed vertices
 * @throws {Error} Throws assertion error if count exceeds B2_MAX_POLYGON_VERTICES
 */
export function b2MakeProxy(vertices: b2Vec2[], count: number, radius: number): b2DistanceProxy;
/**
 * @function b2ShapeDistance
 * @description
 * Computes the distance between two convex shapes using the GJK (Gilbert-Johnson-Keerthi) algorithm.
 * @param {b2DistanceCache} cache - Cache object to store and retrieve simplex data between calls
 * @param {b2DistanceInput} input - Input parameters containing:
 * - proxyA: First shape proxy
 * - proxyB: Second shape proxy
 * - transformA: Transform for first shape
 * - transformB: Transform for second shape
 * - useRadii: Boolean flag for including shape radii in calculation
 * @param {b2Simplex[]} simplexes - Optional array to store simplex history
 * @param {number} simplexCapacity - Maximum number of simplexes to store
 * @returns {b2DistanceOutput} Output containing:
 * - pointA: Closest point on shape A
 * - pointB: Closest point on shape B
 * - distance: Distance between the shapes
 * - iterations: Number of iterations performed
 * - simplexCount: Number of simplexes stored
 */
export function b2ShapeDistance(cache: b2DistanceCache, input: b2DistanceInput, simplexes: b2Simplex[], simplexCapacity: number): b2DistanceOutput;
/**
 * @function b2ShapeCast
 * @summary Performs a shape cast between two convex shapes to detect collision.
 * @param {b2ShapeCastPairInput} input - Contains:
 * proxyA - First shape proxy
 * proxyB - Second shape proxy
 * transformA - Transform of first shape
 * transformB - Transform of second shape
 * translationB - Translation vector for second shape
 * maxFraction - Maximum fraction of motion to check
 * @returns {b2CastOutput} Contains:
 * fraction - Time of impact fraction [0,maxFraction]
 * point - Point of impact
 * normal - Surface normal at impact
 * iterations - Number of iterations used
 * hit - Whether a collision was detected
 * @description
 * Uses an iterative algorithm to determine if and when two convex shapes will collide
 * during a linear motion. Shape B is translated while shape A remains stationary.
 * The algorithm uses support points and simplexes to determine the closest points
 * between the shapes.
 */
export function b2ShapeCast(input: b2ShapeCastPairInput): b2CastOutput;
export function b2MakeSeparationFunction(cache: any, proxyA: any, sweepA: any, proxyB: any, sweepB: any, t1: any): b2SeparationFunction;
export function b2FindMinSeparation(f: any, t: any): MinSeparationReturn;
export function b2EvaluateSeparation(f: any, indexA: any, indexB: any, t: any): number;
/**
 * @function b2TimeOfImpact
 * @summary Computes the time of impact between two moving shapes. CCD is handled via the local separating axis method. This seeks progression by computing the largest time at which separation is maintained.
 * @param {b2TOIInput} input - Input parameters containing:
 * - proxyA: First shape proxy
 * - proxyB: Second shape proxy
 * - sweepA: Motion sweep for first shape
 * - sweepB: Motion sweep for second shape
 * - tMax: Maximum time interval
 * @returns {b2TOIOutput} Output containing:
 * - state: The termination state (Unknown, Failed, Overlapped, Hit, Separated)
 * - t: Time of impact (between 0 and tMax)
 * @description
 * Computes when two moving shapes first collide during their motion sweeps.
 * Uses conservative advancement and binary search to find the first time of impact
 * or determine that no impact occurs during the time interval.
 * @throws {Error} Throws assertion error if input sweeps are not normalized
 */
export function b2TimeOfImpact(input: b2TOIInput): b2TOIOutput;
import { b2Sweep } from './include/collision_h.js';
import { b2Transform } from './include/math_functions_h.js';
import { b2SegmentDistanceResult } from './include/collision_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
import { b2DistanceProxy } from './include/collision_h.js';
import { b2DistanceCache } from './include/collision_h.js';
import { b2DistanceInput } from './include/collision_h.js';
import { b2Simplex } from './include/collision_h.js';
import { b2DistanceOutput } from './include/collision_h.js';
import type { b2ShapeCastPairInput } from './include/collision_h';
import { b2CastOutput } from './include/collision_h.js';
declare class b2SeparationFunction {
    proxyA: any;
    proxyB: any;
    sweepA: any;
    sweepB: any;
    localPoint: b2Vec2;
    axis: b2Vec2;
    type: number;
}
declare class MinSeparationReturn {
    constructor(indexA: any, indexB: any, separation: any);
    indexA: any;
    indexB: any;
    separation: any;
}
import type { b2TOIInput } from './include/collision_h';
import { b2TOIOutput } from './include/collision_h.js';
export {};
