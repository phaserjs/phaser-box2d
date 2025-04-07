/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    B2_MAX_POLYGON_VERTICES,
    b2CastOutput,
    b2DistanceCache,
    b2DistanceInput,
    b2DistanceOutput,
    b2DistanceProxy,
    b2SegmentDistanceResult,
    b2Simplex,
    b2SimplexVertex,
    b2Sweep,
    b2TOIOutput,
    b2TOIState
} from './include/collision_h.js';
import {
    b2Add,
    b2ClampFloat,
    b2Cross,
    b2CrossVS,
    b2Distance,
    b2Dot,
    b2InvMulTransforms,
    b2InvRotateVector,
    b2IsNormalized,
    b2LeftPerp,
    b2Length,
    b2MulSV,
    b2Neg,
    b2Normalize,
    b2NormalizeRot,
    b2RightPerp,
    b2Rot,
    b2RotateVector,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2Vec2,
    eps,
    epsSqr
} from './include/math_functions_h.js';

import { b2_linearSlop } from './include/core_h.js';

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
export function b2GetSweepTransform(sweep, time)
{
    const xf = new b2Transform();
    xf.p = b2Add(b2MulSV(1.0 - time, sweep.c1), b2MulSV(time, sweep.c2));

    const q = new b2Rot((1.0 - time) * sweep.q1.c + time * sweep.q2.c,
        (1.0 - time) * sweep.q1.s + time * sweep.q2.s);

    xf.q = b2NormalizeRot(q);
    
    xf.p = b2Sub(xf.p, b2RotateVector(xf.q, sweep.localCenter));

    return xf;
}

/**
 * @function b2SegmentDistance
 * @description
 * Calculates the minimum distance between two line segments defined by their endpoints.
 * @param {number} p1X - X coordinate of the first point of segment 1
 * @param {number} p1Y - Y coordinate of the first point of segment 1
 * @param {number} q1X - X coordinate of the second point of segment 1
 * @param {number} q1Y - Y coordinate of the second point of segment 1
 * @param {number} p2X - X coordinate of the first point of segment 2
 * @param {number} p2Y - Y coordinate of the first point of segment 2
 * @param {number} q2X - X coordinate of the second point of segment 2
 * @param {number} q2Y - Y coordinate of the second point of segment 2
 * @returns {b2SegmentDistanceResult} An object containing:
 * - fraction1: {number} Parameter along segment 1 for closest point (0-1)
 * - fraction2: {number} Parameter along segment 2 for closest point (0-1)
 * - distanceSquared: {number} Square of the minimum distance between segments
 */
const sdResult = new b2SegmentDistanceResult();

export function b2SegmentDistance(p1X, p1Y, q1X, q1Y, p2X, p2Y, q2X, q2Y)
{
    let fraction1 = 0;
    let fraction2 = 0;

    const d1X = q1X - p1X;
    const d1Y = q1Y - p1Y;
    const d2X = q2X - p2X;
    const d2Y = q2Y - p2Y;
    const rX = p1X - p2X;
    const rY = p1Y - p2Y;
    const dd1 = d1X * d1X + d1Y * d1Y;
    const dd2 = d2X * d2X + d2Y * d2Y;
    const rd2 = rX * d2X + rY * d2Y;
    const rd1 = rX * d1X + rY * d1Y;

    if (dd1 < epsSqr || dd2 < epsSqr)
    {
        if (dd1 >= epsSqr)
        {
            fraction1 = b2ClampFloat(-rd1 / dd1, 0.0, 1.0);
            fraction2 = 0.0;
        }
        else if (dd2 >= epsSqr)
        {
            fraction1 = 0.0;
            fraction2 = b2ClampFloat(rd2 / dd2, 0.0, 1.0);
        }
    }
    else
    {
        const d12 = d1X * d2X + d1Y * d2Y;
        const denom = dd1 * dd2 - d12 * d12;

        let f1 = 0.0;

        if (denom !== 0.0)
        {
            f1 = b2ClampFloat((d12 * rd2 - rd1 * dd2) / denom, 0.0, 1.0);
        }

        let f2 = (d12 * f1 + rd2) / dd2;

        if (f2 < 0.0)
        {
            f2 = 0.0;
            f1 = b2ClampFloat(-rd1 / dd1, 0.0, 1.0);
        }
        else if (f2 > 1.0)
        {
            f2 = 1.0;
            f1 = b2ClampFloat((d12 - rd1) / dd1, 0.0, 1.0);
        }

        fraction1 = f1;
        fraction2 = f2;
    }

    const closest1X = p1X + fraction1 * d1X;
    const closest1Y = p1Y + fraction1 * d1Y;
    const closest2X = p2X + fraction2 * d2X;
    const closest2Y = p2Y + fraction2 * d2Y;
    
    const dX = closest1X - closest2X;
    const dY = closest1Y - closest2Y;
    const distanceSquared = dX * dX + dY * dY;

    sdResult.closest1 = sdResult.closest2 = null;
    sdResult.fraction1 = fraction1;
    sdResult.fraction2 = fraction2;
    sdResult.distanceSquared = distanceSquared;

    return sdResult;
}

/**
 * @function b2MakeProxy
 * @summary Creates a distance proxy from a set of vertices
 * @param {b2Vec2[]} vertices - Array of 2D vectors representing the vertices
 * @param {number} count - Number of vertices to process (max B2_MAX_POLYGON_VERTICES)
 * @param {number} radius - Radius value for the proxy
 * @returns {b2DistanceProxy} A new distance proxy containing the processed vertices
 * @throws {Error} Throws assertion error if count exceeds B2_MAX_POLYGON_VERTICES
 */
export function b2MakeProxy(vertices, count, radius)
{
    console.assert(count <= B2_MAX_POLYGON_VERTICES);
    
    count = Math.min(count, B2_MAX_POLYGON_VERTICES);
    
    const proxy = new b2DistanceProxy();
    proxy.points = [];
    proxy.count = count;
    proxy.radius = radius;

    for (let i = 0; i < count; ++i)
    {
        proxy.points[i] = vertices[i].clone();
    }

    return proxy;
}

function b2Weight2(a1, w1, a2, w2)
{
    return new b2Vec2(a1 * w1.x + a2 * w2.x, a1 * w1.y + a2 * w2.y);
}

function b2Weight3(a1, w1, a2, w2, a3, w3)
{
    return new b2Vec2(a1 * w1.x + a2 * w2.x + a3 * w3.x, a1 * w1.y + a2 * w2.y + a3 * w3.y);
}

function b2FindSupport(proxy, direction)
{
    let bestIndex = 0;
    let bestValue = b2Dot(proxy.points[0], direction);

    for (let i = 1; i < proxy.count; ++i)
    {
        const value = b2Dot(proxy.points[i], direction);

        if (value > bestValue)
        {
            bestIndex = i;
            bestValue = value;
        }
    }

    return bestIndex;
}

function b2MakeSimplexFromCache(cache, proxyA, transformA, proxyB, transformB)
{
    const s = new b2Simplex();
    s.count = cache.count;

    const vertices = [ s.v1, s.v2, s.v3 ];

    for (let i = 0; i < s.count; ++i)
    {
        const v = vertices[i];
        v.indexA = cache.indexA[i];
        v.indexB = cache.indexB[i];
        const wALocal = proxyA.points[v.indexA];
        const wBLocal = proxyB.points[v.indexB];
        v.wA = b2TransformPoint(transformA, wALocal);
        v.wB = b2TransformPoint(transformB, wBLocal);
        v.w = b2Sub(v.wB, v.wA);
        v.a = -1.0;
    }

    if (s.count === 0)
    {
        const v = vertices[0];
        v.indexA = 0;
        v.indexB = 0;
        const wALocal = proxyA.points[0];
        const wBLocal = proxyB.points[0];
        v.wA = b2TransformPoint(transformA, wALocal);
        v.wB = b2TransformPoint(transformB, wBLocal);
        v.w = b2Sub(v.wB, v.wA);
        v.a = 1.0;
        s.count = 1;
    }

    return s;
}

function b2MakeSimplexCache(cache, simplex)
{
    cache.count = simplex.count;
    const vertices = [ simplex.v1, simplex.v2, simplex.v3 ];

    for (let i = 0; i < simplex.count; ++i)
    {
        cache.indexA[i] = vertices[i].indexA;
        cache.indexB[i] = vertices[i].indexB;
    }
}

function b2ComputeSimplexSearchDirection(simplex)
{
    switch (simplex.count)
    {
        case 1:
            return b2Neg(simplex.v1.w);

        case 2:
            const e12 = b2Sub(simplex.v2.w, simplex.v1.w);
            const sgn = b2Cross(e12, b2Neg(simplex.v1.w));

            if (sgn > 0.0)
            {
                return b2LeftPerp(e12);
            }
            else
            {
                return b2RightPerp(e12);
            }

        default:
            console.assert(false);

            return new b2Vec2(0, 0);
    }
}

function b2ComputeSimplexClosestPoint(s)
{
    switch (s.count)
    {
        case 0:
            console.assert(false);

            return new b2Vec2(0, 0);

        case 1:
            return s.v1.w;

        case 2:
            return b2Weight2(s.v1.a, s.v1.w, s.v2.a, s.v2.w);

        case 3:
            return new b2Vec2(0, 0);

        default:
            console.assert(false);

            return new b2Vec2(0, 0);
    }
}

function b2ComputeSimplexWitnessPoints(a, b, s)
{
    switch (s.count)
    {
        case 0:
            console.assert(false);

            break;

        case 1:
            a.x = s.v1.wA.x;
            a.y = s.v1.wA.y;
            b.x = s.v1.wB.x;
            b.y = s.v1.wB.y;

            break;

        case 2:
            a.x = b2Weight2(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA).x;
            a.y = b2Weight2(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA).y;
            b.x = b2Weight2(s.v1.a, s.v1.wB, s.v2.a, s.v2.wB).x;
            b.y = b2Weight2(s.v1.a, s.v1.wB, s.v2.a, s.v2.wB).y;

            break;

        case 3:
            a.x = b2Weight3(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA, s.v3.a, s.v3.wA).x;
            a.y = b2Weight3(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA, s.v3.a, s.v3.wA).y;
            b.x = a.x;
            b.y = a.y;

            break;

        default:
            console.assert(false);

            break;
    }
}

function b2SolveSimplex2(s)
{
    const w1 = s.v1.w;
    const w2 = s.v2.w;
    const e12 = b2Sub(w2, w1);

    const d12_2 = -b2Dot(w1, e12);

    if (d12_2 <= 0.0)
    {
        s.v1.a = 1.0;
        s.count = 1;

        return;
    }

    const d12_1 = b2Dot(w2, e12);

    if (d12_1 <= 0.0)
    {
        s.v2.a = 1.0;
        s.count = 1;
        s.v1 = s.v2;

        return;
    }

    const inv_d12 = 1.0 / (d12_1 + d12_2);
    s.v1.a = d12_1 * inv_d12;
    s.v2.a = d12_2 * inv_d12;
    s.count = 2;
}

function b2SolveSimplex3(s)
{
    const w1 = s.v1.w;
    const w2 = s.v2.w;
    const w3 = s.v3.w;

    const e12 = b2Sub(w2, w1);
    const w1e12 = b2Dot(w1, e12);
    const w2e12 = b2Dot(w2, e12);
    const d12_1 = w2e12;
    const d12_2 = -w1e12;

    const e13 = b2Sub(w3, w1);
    const w1e13 = b2Dot(w1, e13);
    const w3e13 = b2Dot(w3, e13);
    const d13_1 = w3e13;
    const d13_2 = -w1e13;

    const e23 = b2Sub(w3, w2);
    const w2e23 = b2Dot(w2, e23);
    const w3e23 = b2Dot(w3, e23);
    const d23_1 = w3e23;
    const d23_2 = -w2e23;

    const n123 = b2Cross(e12, e13);

    const d123_1 = n123 * b2Cross(w2, w3);
    const d123_2 = n123 * b2Cross(w3, w1);
    const d123_3 = n123 * b2Cross(w1, w2);

    if (d12_2 <= 0.0 && d13_2 <= 0.0)
    {
        s.v1.a = 1.0;
        s.count = 1;

        return;
    }

    if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0)
    {
        const inv_d12 = 1.0 / (d12_1 + d12_2);
        s.v1.a = d12_1 * inv_d12;
        s.v2.a = d12_2 * inv_d12;
        s.count = 2;

        return;
    }

    if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0)
    {
        const inv_d13 = 1.0 / (d13_1 + d13_2);
        s.v1.a = d13_1 * inv_d13;
        s.v3.a = d13_2 * inv_d13;
        s.count = 2;
        s.v2 = s.v3.clone();

        return;
    }

    if (d12_1 <= 0.0 && d23_2 <= 0.0)
    {
        s.v2.a = 1.0;
        s.count = 1;
        s.v1 = s.v2.clone();

        return;
    }

    if (d13_1 <= 0.0 && d23_1 <= 0.0)
    {
        s.v3.a = 1.0;
        s.count = 1;
        s.v1 = s.v3.clone();

        return;
    }

    if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0)
    {
        const inv_d23 = 1.0 / (d23_1 + d23_2);
        s.v2.a = d23_1 * inv_d23;
        s.v3.a = d23_2 * inv_d23;
        s.count = 2;
        s.v1 = s.v3.clone();

        return;
    }

    const inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
    s.v1.a = d123_1 * inv_d123;
    s.v2.a = d123_2 * inv_d123;
    s.v3.a = d123_3 * inv_d123;
    s.count = 3;
}

const p0 = new b2Vec2();

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
export function b2ShapeDistance(cache, input, simplexes, simplexCapacity)
{
    const output = new b2DistanceOutput();

    const proxyA = input.proxyA;
    const proxyB = input.proxyB;

    const transformA = input.transformA;
    const transformB = input.transformB;

    const simplex = b2MakeSimplexFromCache(cache, proxyA, transformA, proxyB, transformB);

    let simplexIndex = 0;

    if (simplexes !== null && simplexIndex < simplexCapacity)
    {
        simplexes[simplexIndex] = simplex;
        simplexIndex += 1;
    }

    const vertices = [ simplex.v1, simplex.v2, simplex.v3 ];
    const k_maxIters = 20;

    const saveA = [ 0, 0, 0 ];
    const saveB = [ 0, 0, 0 ];

    console.assert(simplex.v2 !== simplex.v3);

    let iter = 0;

    while (iter < k_maxIters)
    {
        const saveCount = simplex.count;

        for (let i = 0; i < saveCount; ++i)
        {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
        }

        switch (simplex.count)
        {
            case 1:
                break;

            case 2:
                b2SolveSimplex2(simplex);

                break;

            case 3:
                b2SolveSimplex3(simplex);

                break;

            default:
                console.assert(false);

                break;
        }

        if (simplex.count === 3)
        {
            break;
        }

        if (simplexes !== null && simplexIndex < simplexCapacity)
        {
            simplexes[simplexIndex] = simplex;
            simplexIndex += 1;
        }

        const d = b2ComputeSimplexSearchDirection(simplex);

        if (b2Dot(d, d) < eps * eps)
        {
            break;
        }

        const vertex = vertices[simplex.count];
        vertex.indexA = b2FindSupport(proxyA, b2InvRotateVector(transformA.q, b2Neg(d)));
        vertex.wA = b2TransformPoint(transformA, proxyA.points[vertex.indexA]);
        vertex.indexB = b2FindSupport(proxyB, b2InvRotateVector(transformB.q, d));
        vertex.wB = b2TransformPoint(transformB, proxyB.points[vertex.indexB]);
        vertex.w = b2Sub(vertex.wB, vertex.wA);

        ++iter;

        let duplicate = false;

        for (let i = 0; i < saveCount; ++i)
        {
            if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i])
            {
                duplicate = true;

                break;
            }
        }

        if (duplicate)
        {
            break;
        }

        ++simplex.count;
    }

    if (simplexes !== null && simplexIndex < simplexCapacity)
    {
        simplexes[simplexIndex] = simplex;
        simplexIndex += 1;
    }

    b2ComputeSimplexWitnessPoints(output.pointA, output.pointB, simplex);
    output.distance = b2Distance(output.pointA, output.pointB);
    output.iterations = iter;
    output.simplexCount = simplexIndex;

    b2MakeSimplexCache(cache, simplex);

    if (input.useRadii)
    {
        if (output.distance < eps)
        {
            p0.x = 0.5 * (output.pointA.x + output.pointB.x);
            p0.y = 0.5 * (output.pointA.y + output.pointB.y);
            output.pointA.x = p0.x;
            output.pointA.y = p0.y;
            output.pointB.x = p0.x;
            output.pointB.y = p0.y;
            output.distance = 0.0;
        }
        else
        {
            const rA = proxyA.radius;
            const rB = proxyB.radius;
            output.distance = Math.max(0.0, output.distance - rA - rB);
            const normal = b2Normalize(b2Sub(output.pointB, output.pointA));
            const offsetAX = rA * normal.x;
            const offsetAY = rA * normal.y;
            const offsetBX = rB * normal.x;
            const offsetBY = rB * normal.y;
            output.pointA.x += offsetAX;
            output.pointA.y += offsetAY;
            output.pointB.x -= offsetBX;
            output.pointB.y -= offsetBY;
        }
    }

    return output;
}

const rayPoint = new b2Vec2(0, 0);
const rayNormal = new b2Vec2(0, 1);

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
export function b2ShapeCast(input)
{
    const output = new b2CastOutput(rayNormal, rayPoint);
    output.fraction = input.maxFraction;

    const proxyA = input.proxyA;

    const xfA = input.transformA;
    const xfB = input.transformB;
    const xf = b2InvMulTransforms(xfA, xfB);

    const proxyB = new b2DistanceProxy();
    proxyB.count = input.proxyB.count;
    proxyB.radius = input.proxyB.radius;
    proxyB.points = [];

    for (let i = 0; i < proxyB.count; ++i)
    {
        proxyB.points[i] = b2TransformPoint(xf, input.proxyB.points[i]);
    }

    const radius = proxyA.radius + proxyB.radius;

    const r = b2RotateVector(xf.q, input.translationB);
    let lambda = 0.0;
    const maxFraction = input.maxFraction;

    const simplex = new b2Simplex();
    simplex.count = 0;
    simplex.v1 = new b2SimplexVertex();
    simplex.v2 = new b2SimplexVertex();
    simplex.v3 = new b2SimplexVertex();

    const vertices = [ simplex.v1, simplex.v2, simplex.v3 ];

    let indexA = b2FindSupport(proxyA, b2Neg(r));
    let wA = proxyA.points[indexA];
    let indexB = b2FindSupport(proxyB, r);
    let wB = proxyB.points[indexB];
    let v = b2Sub(wA, wB);

    const linearSlop = 0.005;
    const sigma = Math.max(linearSlop, radius - linearSlop);

    const k_maxIters = 20;
    let iter = 0;

    while (iter < k_maxIters && b2Length(v) > sigma + 0.5 * linearSlop)
    {
        console.assert(simplex.count < 3);

        output.iterations += 1;

        indexA = b2FindSupport(proxyA, b2Neg(v));
        wA = proxyA.points[indexA];
        indexB = b2FindSupport(proxyB, v);
        wB = proxyB.points[indexB];
        const p = b2Sub(wA, wB);

        v = b2Normalize(v);

        const vp = b2Dot(v, p);
        const vr = b2Dot(v, r);

        if (vp - sigma > lambda * vr)
        {
            if (vr <= 0.0)
            {
                return output;
            }

            lambda = (vp - sigma) / vr;

            if (lambda > maxFraction)
            {
                return output;
            }

            simplex.count = 0;
        }

        const vertex = vertices[simplex.count];
        vertex.indexA = indexB;
        vertex.wA = new b2Vec2(wB.x + lambda * r.x, wB.y + lambda * r.y);
        vertex.indexB = indexA;
        vertex.wB = wA.clone();
        vertex.w = b2Sub(vertex.wB, vertex.wA);
        vertex.a = 1.0;
        simplex.count += 1;

        switch (simplex.count)
        {
            case 1:
                break;

            case 2:
                b2SolveSimplex2(simplex);

                break;

            case 3:
                b2SolveSimplex3(simplex);

                break;

            default:
                console.assert(false);
        }

        if (simplex.count === 3)
        {
            return output;
        }

        v = b2ComputeSimplexClosestPoint(simplex);

        ++iter;
    }

    if (iter === 0 || lambda === 0.0)
    {
        return output;
    }

    const pointA = new b2Vec2();
    const pointB = new b2Vec2();
    b2ComputeSimplexWitnessPoints(pointB, pointA, simplex);

    const n = b2Normalize(b2Neg(v));
    const point = new b2Vec2(pointA.x + proxyA.radius * n.x, pointA.y + proxyA.radius * n.y);

    output.point = b2TransformPoint(xfA, point);
    output.normal = b2RotateVector(xfA.q, n);
    output.fraction = lambda;
    output.iterations = iter;
    output.hit = true;

    return output;
}

// #define B2_TOI_DEBUG 0

// Warning: writing to these globals significantly slows multithreading performance
/*
#if B2_TOI_DEBUG
float b2_toiTime, b2_toiMaxTime;
int b2_toiCalls, b2_toiIters, b2_toiMaxIters;
int b2_toiRootIters, b2_toiMaxRootIters;
#endif
*/

const b2SeparationType = {
    b2_pointsType: 0,
    b2_faceAType: 1,
    b2_faceBType: 2
};

class b2SeparationFunction
{
    constructor()
    {
        this.proxyA = null;
        this.proxyB = null;
        this.sweepA = null;
        this.sweepB = null;
        this.localPoint = new b2Vec2();
        this.axis = new b2Vec2();
        this.type = 0;
    }
}

export function b2MakeSeparationFunction(cache, proxyA, sweepA, proxyB, sweepB, t1)
{
    const f = new b2SeparationFunction();
    f.proxyA = proxyA;
    f.proxyB = proxyB;
    const count = cache.count;
    console.assert(0 < count && count < 3);

    f.sweepA = new b2Sweep();
    Object.assign(f.sweepA, sweepA);
    f.sweepB = new b2Sweep();
    Object.assign(f.sweepB, sweepB);
    f.localPoint = new b2Vec2();
    f.axis = new b2Vec2();
    f.type = 0;

    const xfA = b2GetSweepTransform(sweepA, t1);
    const xfB = b2GetSweepTransform(sweepB, t1);

    if (count === 1)
    {
        f.type = b2SeparationType.b2_pointsType;
        const localPointA = proxyA.points[cache.indexA[0]];
        const localPointB = proxyB.points[cache.indexB[0]];
        const pointA = b2TransformPoint(xfA, localPointA);
        const pointB = b2TransformPoint(xfB, localPointB);
        f.axis = b2Normalize(b2Sub(pointB, pointA));
        f.localPoint = new b2Vec2();

        return f;
    }

    if (cache.indexA[0] === cache.indexA[1])
    {
        // Two points on B and one on A.
        f.type = b2SeparationType.b2_faceBType;
        const localPointB1 = proxyB.points[cache.indexB[0]];
        const localPointB2 = proxyB.points[cache.indexB[1]];

        f.axis = b2CrossVS(b2Sub(localPointB2, localPointB1), 1.0);
        f.axis = b2Normalize(f.axis);
        const normal = b2RotateVector(xfB.q, f.axis);

        f.localPoint = new b2Vec2(0.5 * (localPointB1.x + localPointB2.x), 0.5 * (localPointB1.y + localPointB2.y));
        const pointB = b2TransformPoint(xfB, f.localPoint);

        const localPointA = proxyA.points[cache.indexA[0]];
        const pointA = b2TransformPoint(xfA, localPointA);

        const s = b2Dot(b2Sub(pointA, pointB), normal);

        if (s < 0.0)
        {
            f.axis = b2Neg(f.axis);
        }

        return f;
    }

    // Two points on A and one or two points on B.
    f.type = b2SeparationType.b2_faceAType;
    const localPointA1 = proxyA.points[cache.indexA[0]];
    const localPointA2 = proxyA.points[cache.indexA[1]];

    f.axis = b2CrossVS(b2Sub(localPointA2, localPointA1), 1.0);
    f.axis = b2Normalize(f.axis);
    const normal = b2RotateVector(xfA.q, f.axis);

    f.localPoint = new b2Vec2(0.5 * (localPointA1.x + localPointA2.x), 0.5 * (localPointA1.y + localPointA2.y));
    const pointA = b2TransformPoint(xfA, f.localPoint);

    const localPointB = proxyB.points[cache.indexB[0]];
    const pointB = b2TransformPoint(xfB, localPointB);

    const s = b2Dot(b2Sub(pointB, pointA), normal);

    if (s < 0.0)
    {
        f.axis = b2Neg(f.axis);
    }

    return f;
}

class MinSeparationReturn
{
    constructor(indexA, indexB, separation)
    {
        this.indexA = indexA;
        this.indexB = indexB;
        this.separation = separation;
        
    }
}

export function b2FindMinSeparation(f, t)
{
    const xfA = b2GetSweepTransform(f.sweepA, t);
    const xfB = b2GetSweepTransform(f.sweepB, t);

    switch (f.type)
    {
        case b2SeparationType.b2_pointsType:
        {
            const axisA = b2InvRotateVector(xfA.q, f.axis);
            const axisB = b2InvRotateVector(xfB.q, b2Neg(f.axis));

            const indexA = b2FindSupport(f.proxyA, axisA);
            const indexB = b2FindSupport(f.proxyB, axisB);

            const localPointA = f.proxyA.points[indexA];
            const localPointB = f.proxyB.points[indexB];

            const pointA = b2TransformPoint(xfA, localPointA);
            const pointB = b2TransformPoint(xfB, localPointB);

            const separation = b2Dot(b2Sub(pointB, pointA), f.axis);

            return new MinSeparationReturn(indexA, indexB, separation);
        }

        case b2SeparationType.b2_faceAType:
        {
            const normal = b2RotateVector(xfA.q, f.axis);
            const pointA = b2TransformPoint(xfA, f.localPoint);

            const axisB = b2InvRotateVector(xfB.q, b2Neg(normal));

            const indexA = -1;
            const indexB = b2FindSupport(f.proxyB, axisB);

            const localPointB = f.proxyB.points[indexB];
            const pointB = b2TransformPoint(xfB, localPointB);

            const separation = b2Dot(b2Sub(pointB, pointA), normal);

            return new MinSeparationReturn(indexA, indexB, separation);
        }

        case b2SeparationType.b2_faceBType:
        {
            const normal = b2RotateVector(xfB.q, f.axis);
            const pointB = b2TransformPoint(xfB, f.localPoint);

            const axisA = b2InvRotateVector(xfA.q, b2Neg(normal));

            const indexB = -1;
            const indexA = b2FindSupport(f.proxyA, axisA);

            const localPointA = f.proxyA.points[indexA];
            const pointA = b2TransformPoint(xfA, localPointA);

            const separation = b2Dot(b2Sub(pointA, pointB), normal);

            return new MinSeparationReturn(indexA, indexB, separation);
        }

        default:
            console.assert(false);

            return new MinSeparationReturn(-1, -1, 0.0);
    }
}

export function b2EvaluateSeparation(f, indexA, indexB, t)
{
    const xfA = b2GetSweepTransform(f.sweepA, t);
    const xfB = b2GetSweepTransform(f.sweepB, t);

    switch (f.type)
    {
        case b2SeparationType.b2_pointsType:
        {
            const localPointA = f.proxyA.points[indexA];
            const localPointB = f.proxyB.points[indexB];
            const pointA = b2TransformPoint(xfA, localPointA);
            const pointB = b2TransformPoint(xfB, localPointB);
            const separation = b2Dot(b2Sub(pointB, pointA), f.axis);

            return separation;
        }

        case b2SeparationType.b2_faceAType:
        {
            const normal = b2RotateVector(xfA.q, f.axis);
            const pointA = b2TransformPoint(xfA, f.localPoint);
            const localPointB = f.proxyB.points[indexB];
            const pointB = b2TransformPoint(xfB, localPointB);
            const separation = b2Dot(b2Sub(pointB, pointA), normal);

            return separation;
        }

        case b2SeparationType.b2_faceBType:
        {
            const normal = b2RotateVector(xfB.q, f.axis);
            const pointB = b2TransformPoint(xfB, f.localPoint);
            const localPointA = f.proxyA.points[indexA];
            const pointA = b2TransformPoint(xfA, localPointA);
            const separation = b2Dot(b2Sub(pointA, pointB), normal);

            return separation;
        }

        default:
            console.assert(false);

            return 0.0;
    }
}

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
export function b2TimeOfImpact(input)
{
    const output = new b2TOIOutput();
    output.state = b2TOIState.b2_toiStateUnknown;
    output.t = input.tMax;

    const proxyA = input.proxyA;
    const proxyB = input.proxyB;

    const sweepA = input.sweepA;
    const sweepB = input.sweepB;
    console.assert( b2IsNormalized( sweepA.q1 ) && b2IsNormalized( sweepA.q2 ), `sweepA not normalized q1:${sweepA.q1.s*sweepA.q1.s+sweepA.q1.c*sweepA.q1.c} q2:${sweepA.q2.s*sweepA.q2.s+sweepA.q2.c*sweepA.q2.c}` );
    console.assert( b2IsNormalized( sweepB.q1 ) && b2IsNormalized( sweepB.q2 ), `sweepB not normalized q1:${sweepB.q1.s*sweepB.q1.s+sweepB.q1.c*sweepB.q1.c} q2:${sweepB.q2.s*sweepB.q2.s+sweepB.q2.c*sweepB.q2.c}` );

    const tMax = input.tMax;

    const totalRadius = proxyA.radius + proxyB.radius;
    const target = Math.max(b2_linearSlop, totalRadius - b2_linearSlop);
    const tolerance = 0.25 * b2_linearSlop;
    console.assert( target > tolerance );

    let t1 = 0.0;
    const k_maxIterations = 20;
    let iter = 0;

    // Prepare input for distance query.
    const cache = new b2DistanceCache();
    const distanceInput = new b2DistanceInput();
    distanceInput.proxyA = input.proxyA;
    distanceInput.proxyB = input.proxyB;
    distanceInput.useRadii = false;

    // The outer loop progressively attempts to compute new separating axes.
    // This loop terminates when an axis is repeated (no progress is made).
    for (;;)
    {
        const xfA = b2GetSweepTransform(sweepA, t1);
        const xfB = b2GetSweepTransform(sweepB, t1);

        // Get the distance between shapes. We can also use the results
        // to get a separating axis.
        distanceInput.transformA = xfA;
        distanceInput.transformB = xfB;
        const distanceOutput = b2ShapeDistance(cache, distanceInput, null, 0);

        // If the shapes are overlapped, we give up on continuous collision.
        if (distanceOutput.distance <= 0.0)
        {
            // Failure!
            // console.warn("SAT gives up on CCD " + distanceOutput.distance);
            output.state = b2TOIState.b2_toiStateOverlapped;
            output.t = 0.0;

            break;
        }

        if (distanceOutput.distance < target + tolerance)
        {
            // Victory!
            output.state = b2TOIState.b2_toiStateHit;
            output.t = t1;

            break;
        }

        // Initialize the separating axis.
        const fcn = b2MakeSeparationFunction(cache, proxyA, sweepA, proxyB, sweepB, t1);

        // Compute the TOI on the separating axis. We do this by successively
        // resolving the deepest point. This loop is bounded by the number of vertices.
        let done = false;
        let t2 = tMax;
        let pushBackIter = 0;

        for (;;)
        {
            // Find the deepest point at t2. Store the witness point indices.
            const ret = b2FindMinSeparation(fcn, t2);
            let s2 = ret.separation;
            const indexA = ret.indexA;
            const indexB = ret.indexB;

            // Is the final configuration separated?
            if (s2 > target + tolerance)
            {
                // Victory!
                output.state = b2TOIState.b2_toiStateSeparated;
                output.t = tMax;
                done = true;

                break;
            }

            // Has the separation reached tolerance?
            if (s2 > target - tolerance)
            {
                // Advance the sweeps
                t1 = t2;

                break;
            }

            // Compute the initial separation of the witness points.
            let s1 = b2EvaluateSeparation(fcn, indexA, indexB, t1);

            // Check for initial overlap. This might happen if the root finder
            // runs out of iterations.
            if (s1 < target - tolerance)
            {
                output.state = b2TOIState.b2_toiStateFailed;
                output.t = t1;
                done = true;

                break;
            }

            // Check for touching
            if (s1 <= target + tolerance)
            {
                // Victory! t1 should hold the TOI (could be 0.0).
                output.state = b2TOIState.b2_toiStateHit;
                output.t = t1;
                done = true;

                break;
            }

            // Compute 1D root of: f(x) - target = 0
            let rootIterCount = 0;
            let a1 = t1,
                a2 = t2;

            for (;;)
            {
                // Use a mix of the secant rule and bisection.
                let t;

                if (rootIterCount & 1)
                {
                    // Secant rule to improve convergence.
                    t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                }
                else
                {
                    // Bisection to guarantee progress.
                    t = 0.5 * (a1 + a2);
                }

                ++rootIterCount;

                const s = b2EvaluateSeparation(fcn, indexA, indexB, t);

                if (Math.abs(s - target) < tolerance)
                {
                    // t2 holds a tentative value for t1
                    t2 = t;

                    break;
                }

                // Ensure we continue to bracket the root.
                if (s > target)
                {
                    a1 = t;
                    s1 = s;
                }
                else
                {
                    a2 = t;
                    s2 = s;
                }

                if (rootIterCount == 50)
                {
                    break;
                }
            }

            ++pushBackIter;

            if (pushBackIter == B2_MAX_POLYGON_VERTICES)
            {
                break;
            }
        }

        ++iter;

        if (done)
        {
            break;
        }

        if (iter == k_maxIterations)
        {
            // Root finder got stuck. Semi-victory.
            output.state = b2TOIState.b2_toiStateFailed;
            output.t = t1;

            break;
        }
    }

    return output;
}
