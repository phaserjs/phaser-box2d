/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_MAX_POLYGON_VERTICES, b2Hull } from './include/collision_h.js';
import { b2AABB, b2AABB_Center, b2Cross, b2DistanceSquared, b2Normalize, b2Sub } from './include/math_functions_h.js';

import { b2Validation } from './include/types_h.js';
import { b2_linearSlop } from './include/core_h.js';

/**
 * @namespace Hull
 */

/**
 * @import {b2Vec2} from './include/math_functions_h.js'
 */

// quickhull recursion
function b2RecurseHull(p1, p2, ps, count)
{
    const hull = new b2Hull();

    if (count === 0)
    {
        return hull;
    }

    // create an edge vector pointing from p1 to p2
    const e = b2Normalize(b2Sub(p2, p1));

    // discard points left of e and find point furthest to the right of e
    const rightPoints = [];
    let rightCount = 0;

    let bestIndex = 0;
    let bestDistance = b2Cross(b2Sub(ps[bestIndex], p1), e);

    if (bestDistance > 0.0)
    {
        rightPoints[rightCount++] = ps[bestIndex];
    }

    for (let i = 1; i < count; ++i)
    {
        const distance = b2Cross(b2Sub(ps[i], p1), e);

        if (distance > bestDistance)
        {
            bestIndex = i;
            bestDistance = distance;
        }

        if (distance > 0.0)
        {
            rightPoints[rightCount++] = ps[i];
        }
    }

    if (bestDistance < 2.0 * b2_linearSlop)
    {
        return hull;
    }

    const bestPoint = ps[bestIndex];

    // compute hull to the right of p1-bestPoint
    const hull1 = b2RecurseHull(p1, bestPoint, rightPoints, rightCount);

    // compute hull to the right of bestPoint-p2
    const hull2 = b2RecurseHull(bestPoint, p2, rightPoints, rightCount);

    // stitch together hulls
    for (let i = 0; i < hull1.count; ++i)
    {
        hull.points[hull.count++] = hull1.points[i];
    }

    hull.points[hull.count++] = bestPoint;

    for (let i = 0; i < hull2.count; ++i)
    {
        hull.points[hull.count++] = hull2.points[i];
    }

    return hull;
}

export function b2IsPolygonCCW(points, count)
{
    let area = 0;

    for (let i = 0; i < count; i++)
    {
        const j = (i + 1) % count;
        area += (points[j].x - points[i].x) * (points[j].y + points[i].y);
    }

    return area < 0;
}

export function b2ReverseWinding(points, count)
{
    for (let i = 0; i < count / 2; i++)
    {
        const temp = points[i];
        points[i] = points[count - 1 - i];
        points[count - 1 - i] = temp;
    }

    return points;
}

// quickhull algorithm
// - merges vertices based on b2_linearSlop
// - removes collinear points using b2_linearSlop
// - returns an empty hull if it fails

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
export function b2ComputeHull(points, count)
{
    const hull = new b2Hull();

    if (count < 3 || count > B2_MAX_POLYGON_VERTICES)
    {
        // check your data
        console.assert(false, "WARNING: not enough points in the hull.");

        return hull;
    }

    // count = Math.min(count, B2_MAX_POLYGON_VERTICES);

    const aabb = new b2AABB(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    // Perform aggressive point welding. First point always remains.
    // Also compute the bounding box for later.
    const ps = [];
    let n = 0;
    const tolSqr = 16.0 * b2_linearSlop * b2_linearSlop;

    for (let i = 0; i < count; ++i)
    {
        // aabb.lowerBound = b2Min(aabb.lowerBound, points[i]);
        aabb.lowerBoundX = Math.min(aabb.lowerBoundX, points[i].x);
        aabb.lowerBoundY = Math.min(aabb.lowerBoundY, points[i].y);

        // aabb.upperBound = b2Max(aabb.upperBound, points[i]);
        aabb.upperBoundX = Math.max(aabb.upperBoundX, points[i].x);
        aabb.upperBoundY = Math.max(aabb.upperBoundY, points[i].y);

        const vi = points[i];

        let unique = true;

        for (let j = 0; j < i; ++j)
        {
            const vj = points[j];

            const distSqr = b2DistanceSquared(vi, vj);

            if (distSqr < tolSqr)
            {
                unique = false;

                break;
            }
        }

        if (unique)
        {
            ps[n++] = vi;
        }
    }

    if (n < 3)
    {
        // too many points very close together, check your data and check your scale
        return hull;
    }

    // Find an extreme point as the first point on the hull
    const c = b2AABB_Center(aabb);
    let f1 = 0;
    let dsq1 = b2DistanceSquared(c, ps[f1]);

    for (let i = 1; i < n; ++i)
    {
        const dsq = b2DistanceSquared(c, ps[i]);

        if (dsq > dsq1)
        {
            f1 = i;
            dsq1 = dsq;
        }
    }

    // remove p1 from working set
    const p1 = ps[f1];
    ps[f1] = ps[n - 1];
    n = n - 1;

    let f2 = 0;
    let dsq2 = b2DistanceSquared(p1, ps[f2]);

    for (let i = 1; i < n; ++i)
    {
        const dsq = b2DistanceSquared(p1, ps[i]);

        if (dsq > dsq2)
        {
            f2 = i;
            dsq2 = dsq;
        }
    }

    // remove p2 from working set
    const p2 = ps[f2];
    ps[f2] = ps[n - 1];
    n = n - 1;

    // split the points into points that are left and right of the line p1-p2.
    const rightPoints = [];
    let rightCount = 0;

    const leftPoints = [];
    let leftCount = 0;

    const e = b2Normalize(b2Sub(p2, p1));

    for (let i = 0; i < n; ++i)
    {
        const d = b2Cross(b2Sub(ps[i], p1), e);

        // slop used here to skip points that are very close to the line p1-p2
        if (d >= 2.0 * b2_linearSlop)
        {
            rightPoints[rightCount++] = ps[i];
        }
        else if (d <= -2.0 * b2_linearSlop)
        {
            leftPoints[leftCount++] = ps[i];
        }
    }

    // compute hulls on right and left
    const hull1 = b2RecurseHull(p1, p2, rightPoints, rightCount);
    const hull2 = b2RecurseHull(p2, p1, leftPoints, leftCount);

    if (hull1.count === 0 && hull2.count === 0)
    {
        // all points collinear
        return hull;
    }

    // stitch hulls together, preserving CCW winding order
    hull.points[hull.count++] = p1;

    for (let i = 0; i < hull1.count; ++i)
    {
        hull.points[hull.count++] = hull1.points[i];
    }

    hull.points[hull.count++] = p2;

    for (let i = 0; i < hull2.count; ++i)
    {
        hull.points[hull.count++] = hull2.points[i];
    }

    console.assert(hull.count <= B2_MAX_POLYGON_VERTICES);

    // merge collinear
    let searching = true;

    while (searching && hull.count > 2)
    {
        searching = false;

        for (let i = 0; i < hull.count; ++i)
        {
            const i1 = i;
            const i2 = (i + 1) % hull.count;
            const i3 = (i + 2) % hull.count;

            const s1 = hull.points[i1];
            const s2 = hull.points[i2];
            const s3 = hull.points[i3];

            // unit edge vector for s1-s3
            const r = b2Normalize(b2Sub(s3, s1));

            const distance = b2Cross(b2Sub(s2, s1), r);

            if (distance <= 2.0 * b2_linearSlop)
            {
                // remove midpoint from hull
                for (let j = i2; j < hull.count - 1; ++j)
                {
                    hull.points[j] = hull.points[j + 1];
                }
                hull.count -= 1;

                // continue searching for collinear points
                searching = true;

                break;
            }
        }
    }

    if (hull.count < 3)
    {
        // too many points collinear, shouldn't be reached since this was validated above
        hull.count = 0;
    }

    return hull;
}

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
export function b2ValidateHull(hull)
{
    if (!b2Validation)
    {
        return true;
    }

    if (hull.count < 3 || B2_MAX_POLYGON_VERTICES < hull.count)
    {
        console.warn("WARNING: hull does not have enough points.");

        return false;
    }

    // hull must have CCW winding order for points
    if (!b2IsPolygonCCW(hull.points, hull.count))
    {
        console.warn("WARNING: hull does not have CCW winding.");

        return false;
    }

    // test that every point is behind every edge
    for (let i = 0; i < hull.count; ++i)
    {
        // create an edge vector
        const i1 = i;
        const i2 = i < hull.count - 1 ? i1 + 1 : 0;
        const p = hull.points[i1];
        const e = b2Normalize(b2Sub(hull.points[i2], p));

        for (let j = 0; j < hull.count; ++j)
        {
            // skip points that subtend the current edge
            if (j === i1 || j === i2)
            {
                continue;
            }

            const distance = b2Cross(b2Sub(hull.points[j], p), e);

            if (distance >= 0.0)
            {
                console.warn("WARNING: hull points are not behind edges (?)");

                return false;
            }
        }
    }

    // test for collinear points
    for (let i = 0; i < hull.count; ++i)
    {
        const i1 = i;
        const i2 = (i + 1) % hull.count;
        const i3 = (i + 2) % hull.count;

        const p1 = hull.points[i1];
        const p2 = hull.points[i2];
        const p3 = hull.points[i3];

        const e = b2Normalize(b2Sub(p3, p1));

        const distance = b2Cross(b2Sub(p2, p1), e);

        if (distance <= b2_linearSlop)
        {
            // p1-p2-p3 are collinear
            console.warn("WARNING: hull has collinear points.");

            return false;
        }
    }

    return true;
}
