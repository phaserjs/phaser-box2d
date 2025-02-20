/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_MAX_POLYGON_VERTICES, b2Capsule, b2DistanceInput, b2ManifoldPoint, b2Polygon } from './include/collision_h.js';
import {
    b2ClampFloat,
    b2Cross,
    b2DistanceSquared,
    b2Dot,
    b2DotSub,
    b2GetLengthAndNormalize,
    b2InvMulTransformsOut,
    b2LeftPerp,
    b2LengthXY,
    b2Lerp,
    b2MulAdd,
    b2MulAddOut,
    b2MulSV,
    b2Neg,
    b2Normalize,
    b2RightPerp,
    b2Rot,
    b2RotateVector,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2TransformPointOut,
    b2Vec2,
    eps,
    epsSqr
} from './include/math_functions_h.js';
import { b2MakeProxy, b2SegmentDistance, b2ShapeDistance } from './include/distance_h.js';
import { b2_linearSlop, b2_speculativeDistance } from './include/core_h.js';

import { resetProperties } from './body_c.js';

/**
 * @namespace Manifold
 */

/**
 * @import {b2Segment, b2Circle, b2ChainSegment, b2DistanceCache, b2Manifold} from './include/collision_h.js'
 */

const B2_MAKE_ID = (A, B) => ((A & 0xFF) << 8) | (B & 0xFF);

const xf = new b2Transform(new b2Vec2(), new b2Rot());
const xf1 = new b2Transform(new b2Vec2(), new b2Rot());
const p1 = new b2Vec2();
const p2 = new b2Vec2();
const q1 = new b2Vec2();
const q2 = new b2Vec2();

function b2MakeCapsule(p1, p2, radius)
{
    const d = b2Sub(p2, p1);
    const axis = b2Normalize(d);
    const normal = b2RightPerp(axis);

    const shape = new b2Polygon();
    shape.vertices = [ p1, p2 ];
    shape.centroid = b2Lerp(p1, p2, 0.5);
    shape.normals = [ normal, b2Neg(normal) ];
    shape.count = 2;
    shape.radius = radius;

    return shape;
}

/**
 * @function b2CollideCircles
 * @description
 * Computes collision information between two circles transformed by their respective transforms.
 * @param {b2Circle} circleA - The first circle
 * @param {b2Transform} xfA - Transform for the first circle
 * @param {b2Circle} circleB - The second circle
 * @param {b2Transform} xfB - Transform for the second circle
 * @param {b2Manifold} manifold - The output collision manifold
 * @returns {b2Manifold} The collision manifold containing contact points, normal, and separation
 * information. If no collision is detected, returns a cleared manifold.
 */
export function b2CollideCircles(circleA, xfA, circleB, xfB, manifold)
{
    // let manifold = new b2Manifold();

    b2InvMulTransformsOut(xfA, xfB, xf);

    const pointA = circleA.center;

    // let pointB = b2TransformPoint(xf, circleB.center);
    const pointBX = (xf.q.c * circleB.center.x - xf.q.s * circleB.center.y) + xf.p.x;
    const pointBY = (xf.q.s * circleB.center.x + xf.q.c * circleB.center.y) + xf.p.y;

    const sx = pointBX - pointA.x;
    const sy = pointBY - pointA.y;
    const distance = Math.sqrt(sx * sx + sy * sy);
    let normalX = 0,
        normalY = 0;

    if (distance >= eps)
    {
        normalX = sx / distance;
        normalY = sy / distance;
    }
    const radiusA = circleA.radius;
    const radiusB = circleB.radius;
    const separation = distance - radiusA - radiusB;

    if (separation > b2_speculativeDistance)
    {
        return manifold.clear();
    }
    const cAx = pointA.x + radiusA * normalX;
    const cAy = pointA.y + radiusA * normalY;
    const cBx = pointBX + (-radiusB) * normalX;
    const cBy = pointBY + (-radiusB) * normalY;
    const contactPointAx = cAx + 0.5 * (cBx - cAx);
    const contactPointAy = cAy + 0.5 * (cBy - cAy);
    manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
    manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
    manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
    manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
    const mp = manifold.points[0];
    mp.anchorAX = xfA.q.c * contactPointAx - xfA.q.s * contactPointAy;
    mp.anchorAY = xfA.q.s * contactPointAx + xfA.q.c * contactPointAy;
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = separation;
    mp.id = 0;
    manifold.pointCount = 1;

    return manifold;
}

/**
 * @function b2CollideCapsuleAndCircle
 * @description
 * Computes collision information between a capsule shape and a circle shape.
 * @param {b2Capsule} capsuleA - The capsule shape A with properties center1, center2, and radius
 * @param {b2Transform} xfA - Transform for shape A containing position (p) and rotation (q)
 * @param {b2Circle} circleB - The circle shape B with properties center and radius
 * @param {b2Transform} xfB - Transform for shape B containing position (p) and rotation (q)
 * @param {b2Manifold} manifold - Output collision manifold to be populated
 * @returns {b2Manifold} The populated collision manifold containing contact points,
 * normal, separation, and other collision data
 */
export function b2CollideCapsuleAndCircle(capsuleA, xfA, circleB, xfB, manifold)
{
    // let manifold = new b2Manifold();

    b2InvMulTransformsOut(xfA, xfB, xf);

    // Compute circle position in the frame of the capsule.
    const pB = b2TransformPoint(xf, circleB.center);

    // Compute closest point
    const p1 = capsuleA.center1;
    const p2 = capsuleA.center2;

    const e = b2Sub(p2, p1);

    // dot(p - pA, e) = 0
    // dot(p - (p1 + s1 * e), e) = 0
    // s1 = dot(p - p1, e)
    let pA;
    const s1 = b2Dot(b2Sub(pB, p1), e);
    const s2 = b2Dot(b2Sub(p2, pB), e);

    if (s1 < 0.0)
    {
        // p1 region
        pA = p1;
    }
    else if (s2 < 0.0)
    {
        // p2 region
        pA = p2;
    }
    else
    {
        // circle colliding with segment interior
        const s = s1 / b2Dot(e, e);
        pA = b2MulAdd(p1, s, e);
    }

    const res = b2GetLengthAndNormalize(b2Sub(pB, pA));
    const distance = res.length;
    const normal = res.normal;

    const radiusA = capsuleA.radius;
    const radiusB = circleB.radius;
    const separation = distance - radiusA - radiusB;

    if (separation > b2_speculativeDistance)
    {
        return manifold.clear();
    }

    const cA = b2MulAdd(pA, radiusA, normal);
    const cB = b2MulAdd(pB, -radiusB, normal);
    const contactPointA = b2Lerp(cA, cB, 0.5);

    // manifold.normal = b2RotateVector(xfA.q, normal);
    manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
    manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;
    const mp = manifold.points[0];

    // mp.anchorA = b2RotateVector(xfA.q, contactPointA);
    mp.anchorAX = xfA.q.c * contactPointA.x - xfA.q.s * contactPointA.y;
    mp.anchorAY = xfA.q.s * contactPointA.x + xfA.q.c * contactPointA.y;

    // mp.anchorB = b2Add(mp.anchorA, b2Sub(xfA.p, xfB.p));
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);

    // mp.point = b2Add(xfA.p, mp.anchorA);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = separation;
    mp.id = 0;
    manifold.pointCount = 1;

    return manifold;
}

const c = new b2Vec2();

/**
 * @function b2CollidePolygonAndCircle
 * @description
 * Computes collision information between a polygon and a circle.
 * @param {b2Polygon} polygonA - The polygon shape
 * @param {b2Transform} xfA - Transform for polygon A
 * @param {b2Circle} circleB - The circle shape
 * @param {b2Transform} xfB - Transform for circle B
 * @param {b2Manifold} manifold - Output collision manifold
 * @returns {b2Manifold} The collision manifold containing contact points, normal, and separation
 * @note The manifold is cleared and returned if no collision is detected.
 * The function handles three cases:
 * 1. Circle center closest to polygon vertex 1
 * 2. Circle center closest to polygon vertex 2
 * 3. Circle center closest to polygon edge
 */
export function b2CollidePolygonAndCircle(polygonA, xfA, circleB, xfB, manifold)
{
    const speculativeDistance = b2_speculativeDistance;

    b2InvMulTransformsOut(xfA, xfB, xf);

    // Compute circle position in the frame of the polygon.
    b2TransformPointOut(xf, circleB.center, c);
    const radiusA = polygonA.radius;
    const radiusB = circleB.radius;
    const radius = radiusA + radiusB;

    // Find the min separating edge.
    let normalIndex = 0;
    let separation = -Number.MAX_VALUE;
    const vertexCount = polygonA.count;
    const vertices = polygonA.vertices;
    const normals = polygonA.normals;

    for (let i = 0; i < vertexCount; ++i)
    {
        // let s = b2Dot(normals[i], b2Sub(c, vertices[i]));
        const s = normals[i].x * (c.x - vertices[i].x) + normals[i].y * (c.y - vertices[i].y);

        if (s > separation)
        {
            separation = s;
            normalIndex = i;
        }
    }

    if (separation > radius + speculativeDistance)
    {
        return manifold.clear();
    }

    // Vertices of the reference edge.
    const vertIndex1 = normalIndex;
    const vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
    const v1 = vertices[vertIndex1];
    const v2 = vertices[vertIndex2];

    // Compute barycentric coordinates
    const u1 = (c.x - v1.x) * (v2.x - v1.x) + (c.y - v1.y) * (v2.y - v1.y);
    const u2 = (c.x - v2.x) * (v1.x - v2.x) + (c.y - v2.y) * (v1.y - v2.y);

    if (u1 < 0.0 && separation > eps)
    {
        // Circle center is closest to v1 and safely outside the polygon
        const x = c.x - v1.x;
        const y = c.y - v1.y;
        const length = Math.sqrt(x * x + y * y);
        let normalX = 0,
            normalY = 0;

        if (length > eps)
        {
            const invLength = 1 / length;
            normalX = x * invLength;
            normalY = y * invLength;
        }

        separation = (c.x - v1.x) * normalX + (c.y - v1.y) * normalY;

        if (separation > radius + speculativeDistance)
        {
            return manifold.clear();
        }

        const cAX = v1.x + radiusA * normalX;
        const cAY = v1.y + radiusA * normalY;
        const cBX = c.x - radiusB * normalX;
        const cBY = c.y - radiusB * normalY;
        const contactPointAX = 0.5 * (cAX + cBX);
        const contactPointAY = 0.5 * (cAY + cBY);

        manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
        manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
        const mp = manifold.points[0];
        mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
        mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
        mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
        mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
        mp.pointX = xfA.p.x + mp.anchorAX;
        mp.pointY = xfA.p.y + mp.anchorAY;
        mp.separation = (cBX - cAX) * normalX + (cBY - cAY) * normalY;
        mp.id = 0;
        manifold.pointCount = 1;
    }
    else if (u2 < 0.0 && separation > eps)
    {
        // Circle center is closest to v2 and safely outside the polygon
        const x = c.x - v2.x;
        const y = c.y - v2.y;
        const length = Math.sqrt(x * x + y * y);
        let normalX = 0,
            normalY = 0;

        if (length > eps)
        {
            const invLength = 1 / length;
            normalX = x * invLength;
            normalY = y * invLength;
        }

        separation = (c.x - v2.x) * normalX + (c.y - v2.y) * normalY;

        if (separation > radius + speculativeDistance)
        {
            return manifold.clear();
        }

        const cAX = v2.x + radiusA * normalX;
        const cAY = v2.y + radiusA * normalY;
        const cBX = c.x - radiusB * normalX;
        const cBY = c.y - radiusB * normalY;
        const contactPointAX = 0.5 * (cAX + cBX);
        const contactPointAY = 0.5 * (cAY + cBY);

        manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
        manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
        const mp = manifold.points[0];
        mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
        mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
        mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
        mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
        mp.pointX = xfA.p.x + mp.anchorAX;
        mp.pointY = xfA.p.y + mp.anchorAY;
        mp.separation = (cBX - cAX) * normalX + (cBY - cAY) * normalY;
        mp.id = 0;
        manifold.pointCount = 1;
    }
    else
    {
        // Circle center is between v1 and v2. Center may be inside polygon
        const normalX = normals[normalIndex].x;
        const normalY = normals[normalIndex].y;
        manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
        manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;

        // cA is the projection of the circle center onto to the reference edge
        const d = radiusA - ((c.x - v1.x) * normalX + (c.y - v1.y) * normalY);
        const cAX = c.x + d * normalX;
        const cAY = c.y + d * normalY;

        // cB is the deepest point on the circle with respect to the reference edge
        const cBX = c.x - radiusB * normalX;
        const cBY = c.y - radiusB * normalY;

        // contactPointA is the midpoint between cA and cB
        const contactPointAX = (cAX + cBX) * 0.5;
        const contactPointAY = (cAY + cBY) * 0.5;

        // The contact point is the midpoint in world space
        const mp = manifold.points[0];
        mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
        mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
        mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
        mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
        mp.pointX = xfA.p.x + mp.anchorAX;
        mp.pointY = xfA.p.y + mp.anchorAY;
        mp.separation = separation - radius;
        mp.id = 0;
        manifold.pointCount = 1;
    }

    return manifold;
}

// PJB - with allocation avoidance edits

/**
 * @function b2CollideCapsules
 * @description
 * Computes the collision manifold between two capsule shapes in 2D space.
 * A capsule is defined by two endpoints and a radius.
 * @param {b2Capsule} capsuleA - The first capsule shape
 * @param {b2Transform} xfA - Transform for the first capsule
 * @param {b2Capsule} capsuleB - The second capsule shape
 * @param {b2Transform} xfB - Transform for the second capsule
 * @param {b2Manifold} manifold - Output collision manifold
 * @returns {void} Modifies the manifold parameter with collision data:
 * - normalX/Y: Collision normal vector
 * - pointCount: Number of contact points (0-2)
 * - points[]: Contact point data including:
 * - anchorA/B: Contact points in local coordinates
 * - separation: Penetration depth
 * - id: Contact ID
 */
export function b2CollideCapsules(capsuleA, xfA, capsuleB, xfB, manifold)
{
    const origin = capsuleA.center1;

    // let sfA = {
    //     p: b2Add(xfA.p, b2RotateVector(xfA.q, origin)),
    //     q: xfA.q
    // };
    b2MulAddOut(xfA.p, 1, b2RotateVector(xfA.q, origin), xf1.p);
    xf1.q = xfA.q;
    b2InvMulTransformsOut(xf1, xfB, xf);

    // let p1 = new b2Vec2(0, 0);
    p1.x = 0;
    p1.y = 0;

    // let q1 = b2Sub(capsuleA.center2, origin);
    q1.x = capsuleA.center2.x - origin.x;
    q1.y = capsuleA.center2.y - origin.y;

    // let p2 = b2TransformPoint(xf, capsuleB.center1);
    b2TransformPointOut(xf, capsuleB.center1, p2);

    // let q2 = b2TransformPoint(xf, capsuleB.center2);
    b2TransformPointOut(xf, capsuleB.center2, q2);
    const d1X = q1.x;
    const d1Y = q1.y;
    const d2X = q2.x - p2.x;
    const d2Y = q2.y - p2.y;
    const dd1 = d1X * d1X + d1Y * d1Y;
    const dd2 = d2X * d2X + d2Y * d2Y;
    console.assert(dd1 > epsSqr && dd2 > epsSqr, `dd1=${dd1} dd2=${dd2} (both should be > epsilon squared)`);
    const rX = p1.x - p2.x;
    const rY = p1.y - p2.y;
    const rd1 = rX * d1X + rY * d1Y;
    const rd2 = rX * d2X + rY * d2Y;
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

    // let closest1 = b2MulAdd(p1, f1, d1);
    const closest1 = { x: p1.x + f1 * d1X, y: p1.y + f1 * d1Y };

    // let closest2 = b2MulAdd(p2, f2, d2);
    const closest2 = { x: p2.x + f2 * d2X, y: p2.y + f2 * d2Y };
    const distanceSquared = b2DistanceSquared(closest1, closest2);
    const radiusA = capsuleA.radius;
    const radiusB = capsuleB.radius;
    const radius = radiusA + radiusB;
    const maxDistance = radius + b2_speculativeDistance;

    if (distanceSquared > maxDistance * maxDistance)
    {
        resetProperties(manifold);

        return;
    }
    const distance = Math.sqrt(distanceSquared);
    const length1 = b2LengthXY(d1X, d1Y);
    const u1X = d1X * 1.0 / length1;
    const u1Y = d1Y * 1.0 / length1;
    const length2 = b2LengthXY(d2X, d2Y);
    const u2X = d2X * 1.0 / length2;
    const u2Y = d2Y * 1.0 / length2;

    // let fp2 = b2Dot({ x: p2.x - p1.x, y: p2.y - p1.y }, u1n);
    const fp2 = (p2.x - p1.x) * u1X + (p2.y - p1.y) * u1Y;
    const fq2 = (q2.x - p1.x) * u1X + (q2.y - p1.y) * u1Y;
    const outsideA = (fp2 <= 0.0 && fq2 <= 0.0) || (fp2 >= length1 && fq2 >= length1);

    // let fp1 = b2Dot({ x: p1.x - p2.x, y: p1.y - p2.y }, u2n);
    // let fq1 = b2Dot({ x: q1.x - p2.x, y: q1.y - p2.y }, u2n);
    const fp1 = (p1.x - p2.x) * u1X + (p1.y - p2.y) * u2Y;
    const fq1 = (q1.x - p2.x) * u1X + (q1.y - p2.y) * u2Y;
    const outsideB = (fp1 <= 0.0 && fq1 <= 0.0) || (fp1 >= length2 && fq1 >= length2);

    manifold.pointCount = 0;
    
    if (outsideA === false && outsideB === false)
    {
        let normalAX, normalAY, separationA;

        {
            // normal = b2LeftPerp(u1n);
            normalAX = -u1Y;
            normalAY = u1X;

            // let ss1 = b2Dot({ x: p2.x - p1.x, y: p2.y - p1.y }, normalA);
            // let ss2 = b2Dot({ x: q2.x - p1.x, y: q2.y - p1.y }, normalA);
            const ss1 = (p2.x - p1.x) * normalAX + (p2.y - p1.y) * normalAY;
            const ss2 = (q2.x - p1.x) * normalAX + (q2.y - p1.y) * normalAY;
            const s1p = Math.min(ss1, ss2);
            const s1n = Math.max(-ss1, -ss2);

            if (s1p > s1n)
            {
                separationA = s1p;
            }
            else
            {
                separationA = s1n;

                // normalA = { x: -normalA.x, y: -normalA.y };
                normalAX = -normalAX;
                normalAY = -normalAY;
            }
        }
        let normalBX, normalBY, separationB;

        {
            // normalB = b2LeftPerp(u2n);
            normalBX = -u2Y;
            normalBY = u2X;

            // let ss1 = b2Dot({ x: p1.x - p2.x, y: p1.y - p2.y }, normalB);
            // let ss2 = b2Dot({ x: q1.x - p2.x, y: q1.y - p2.y }, normalB);
            const ss1 = (p1.x - p2.x) * normalBX + (p1.y - p2.y) * normalBY;
            const ss2 = (q1.x - p2.x) * normalBX + (q1.y - p2.y) * normalBY;
            const s1p = Math.min(ss1, ss2);
            const s1n = Math.max(-ss1, -ss2);

            if (s1p > s1n)
            {
                separationB = s1p;
            }
            else
            {
                separationB = s1n;

                // normalB = { x: -normalB.x, y: -normalB.y };
                normalBX = -normalBX;
                normalBY = -normalBY;
            }
        }

        if (separationA >= separationB)
        {
            manifold.normalX = normalAX;
            manifold.normalY = normalAY;
            let cpX = p2.x;
            let cpY = p2.y;
            let cqX = q2.x;
            let cqY = q2.y;

            if (fp2 < 0.0 && fq2 > 0.0)
            {
                const t = (0.0 - fp2) / (fq2 - fp2);
                cpX = p2.x + t * (q2.x - p2.x);
                cpY = p2.y + t * (q2.y - p2.y);
            }
            else if (fq2 < 0.0 && fp2 > 0.0)
            {
                const t = (0.0 - fq2) / (fp2 - fq2);
                cqX = q2.x + t * (p2.x - q2.x);
                cqY = q2.y + t * (p2.y - q2.y);
            }

            if (fp2 > length1 && fq2 < length1)
            {
                const t = (fp2 - length1) / (fp2 - fq2);
                cpX = p2.x + t * (q2.x - p2.x);
                cpY = p2.y + t * (q2.y - p2.y);
            }
            else if (fq2 > length1 && fp2 < length1)
            {
                const t = (fq2 - length1) / (fq2 - fp2);
                cqX = q2.x + t * (p2.x - q2.x);
                cqY = q2.y + t * (p2.y - q2.y);
            }

            // let sp = b2Dot({ x: cpX - p1.x, y: cpY - p1.y }, { x: normalAX, y: normalAY });
            // let sq = b2Dot({ x: cqX - p1.x, y: cqY - p1.y }, { x: normalAX, y: normalAY });
            const sp = (cpX - p1.x) * normalAX + (cpY - p1.y) * normalAY;
            const sq = (cqX - p1.x) * normalAX + (cqY - p1.y) * normalAY;

            if (sp <= distance + b2_linearSlop || sq <= distance + b2_linearSlop)
            {
                let s = 0.5 * (radiusA - radiusB - sp);
                manifold.points[0].anchorAX = cpX + s * normalAX;
                manifold.points[0].anchorAY = cpY + s * normalAY;
                manifold.points[0].separation = sp - radius;
                manifold.points[0].id = B2_MAKE_ID(0, 0);
                s = 0.5 * (radiusA - radiusB - sq);
                manifold.points[1].anchorAX = cqX + s * normalAX;
                manifold.points[1].anchorAY = cqY + s * normalAY;
                manifold.points[1].separation = sq - radius;
                manifold.points[1].id = B2_MAKE_ID(0, 1);
                manifold.pointCount = 2;
            }
        }
        else
        {
            manifold.normalX = -normalBX;
            manifold.normalY = -normalBY;
            let cpX = p1.x;
            let cpY = p1.y;
            let cqX = q1.x;
            let cqY = q1.y;

            if (fp1 < 0.0 && fq1 > 0.0)
            {
                const t = (0.0 - fp1) / (fq1 - fp1);
                cpX = p1.x + t * (q1.x - p1.x);
                cpY = p1.y + t * (q1.y - p1.y);
            }
            else if (fq1 < 0.0 && fp1 > 0.0)
            {
                const t = (0.0 - fq1) / (fp1 - fq1);
                cqX = q1.x + t * (p1.x - q1.x);
                cqY = q1.y + t * (p1.y - q1.y);
            }

            if (fp1 > length2 && fq1 < length2)
            {
                const t = (fp1 - length2) / (fp1 - fq1);
                cpX = p1.x + t * (q1.x - p1.x);
                cpY = p1.y + t * (q1.y - p1.y);
            }
            else if (fq1 > length2 && fp1 < length2)
            {
                const t = (fq1 - length2) / (fq1 - fp1);
                cqX = q1.x + t * (p1.x - q1.x);
                cqY = q1.y + t * (p1.y - q1.y);
            }
            const sp = (cpX - p2.x) * normalBX + (cpY - p2.y) * normalBY;
            const sq = (cqX - p2.x) * normalBX + (cqY - p2.y) * normalBY;

            if (sp <= distance + b2_linearSlop || sq <= distance + b2_linearSlop)
            {
                let s = 0.5 * (radiusB - radiusA - sp);
                manifold.points[0].anchorAX = cpX + s * normalBX;
                manifold.points[0].anchorAY = cpY + s * normalBY;
                manifold.points[0].separation = sp - radius;
                manifold.points[0].id = B2_MAKE_ID(0, 0);
                
                s = 0.5 * (radiusB - radiusA - sq);
                manifold.points[1].anchorAX = cqX + s * normalBX;
                manifold.points[1].anchorAY = cqY + s * normalBY;
                manifold.points[1].separation = sq - radius;
                manifold.points[1].id = B2_MAKE_ID(1, 0);
                manifold.pointCount = 2;
            }
        }
    }

    if (manifold.pointCount === 0)
    {
        let normalX = closest2.x - closest1.x;
        let normalY = closest2.y - closest1.y;
        const lengthSq = normalX * normalX + normalY * normalY;

        if (lengthSq > epsSqr)
        {
            const length = Math.sqrt(lengthSq);
            normalX /= length;
            normalY /= length;
        }
        else
        {
            // const leftPerp = b2LeftPerp(u1);
            normalX = -u1Y; // leftPerp.x;
            normalY = u1X;  // leftPerp.y;
        }
        const c1X = closest1.x + radiusA * normalX;
        const c1Y = closest1.y + radiusA * normalY;
        const c2X = closest2.x - radiusB * normalX;
        const c2Y = closest2.y - radiusB * normalY;
        const i1 = f1 === 0.0 ? 0 : 1;
        const i2 = f2 === 0.0 ? 0 : 1;
        manifold.normalX = normalX;
        manifold.normalY = normalY;
        manifold.points[0].anchorAX = (c1X + c2X) * 0.5;
        manifold.points[0].anchorAY = (c1Y + c2Y) * 0.5;
        manifold.points[0].separation = Math.sqrt(distanceSquared) - radius;
        manifold.points[0].id = B2_MAKE_ID(i1, i2);
        manifold.pointCount = 1;
    }

    if (manifold.pointCount > 0)
    {
        const rotatedNormalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
        const rotatedNormalY = xfA.q.s * manifold.normalX + xfA.q.c * manifold.normalY;
        manifold.normalX = rotatedNormalX;
        manifold.normalY = rotatedNormalY;

        for (let i = 0; i < manifold.pointCount; ++i)
        {
            const mp = manifold.points[i];
            const vx = mp.anchorAX + origin.x;
            const vy = mp.anchorAY + origin.y;
            const rotatedVecX = xfA.q.c * vx - xfA.q.s * vy;
            const rotatedVecY = xfA.q.s * vx + xfA.q.c * vy;
            mp.anchorAX = rotatedVecX;
            mp.anchorAY = rotatedVecY;
            mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
            mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
            mp.pointX = xfA.p.x + mp.anchorAX;
            mp.pointY = xfA.p.y + mp.anchorAY;
        }
    }

    return;
}

const constCapsule = new b2Capsule();

/**
 * @function b2CollideSegmentAndCapsule
 * @summary Computes collision between a line segment and a capsule.
 * @param {b2Segment} segmentA - A line segment defined by two points (point1, point2)
 * @param {b2Transform} xfA - Transform for segmentA containing position and rotation
 * @param {b2Capsule} capsuleB - A capsule shape defined by two points and a radius
 * @param {b2Transform} xfB - Transform for capsuleB containing position and rotation
 * @param {b2Manifold} manifold - Output collision manifold
 * @returns {void} Modifies the manifold parameter with collision data:
 * - normalX/Y: Collision normal vector
 * - pointCount: Number of contact points (0-2)
 * - points[]: Contact point data including:
 * - anchorA/B: Contact points in local coordinates
 * - separation: Penetration depth
 * - id: Contact ID
 * @description
 * Converts the segment to a zero-radius capsule and delegates to b2CollideCapsules
 * for the actual collision computation.
 */
export function b2CollideSegmentAndCapsule(segmentA, xfA, capsuleB, xfB, manifold)
{
    constCapsule.center1 = segmentA.point1;
    constCapsule.center2 = segmentA.point2;
    constCapsule.radius = 0;

    return b2CollideCapsules(constCapsule, xfA, capsuleB, xfB);
}

/**
 * @function b2CollidePolygonAndCapsule
 * @description
 * Computes collision manifold between a polygon and a capsule by converting the capsule
 * to a polygon and using polygon-polygon collision detection.
 * @param {b2Polygon} polygonA - The first collision shape (polygon)
 * @param {b2Transform} xfA - Transform for polygon A, containing position and rotation
 * @param {b2Capsule} capsuleB - The second collision shape (capsule) defined by two centers and a radius
 * @param {b2Transform} xfB - Transform for capsule B, containing position and rotation
 * @param {b2Manifold} manifold - The output collision manifold to be populated
 * @returns {b2Manifold} The collision manifold containing contact points and normal
 */
export function b2CollidePolygonAndCapsule(polygonA, xfA, capsuleB, xfB, manifold)
{
    const polyB = b2MakeCapsule(capsuleB.center1, capsuleB.center2, capsuleB.radius);

    return b2CollidePolygons(polygonA, xfA, polyB, xfB, manifold);
}

// Polygon clipper used to compute contact points when there are potentially two contact points.
function b2ClipPolygons(polyA, polyB, edgeA, edgeB, flip, manifold)
{
    // reference polygon
    let poly1, i11, i12;

    // incident polygon
    let poly2, i21, i22;

    if (flip)
    {
        poly1 = polyB;
        poly2 = polyA;
        i11 = edgeB;
        i12 = edgeB + 1 < polyB.count ? edgeB + 1 : 0;
        i21 = edgeA;
        i22 = edgeA + 1 < polyA.count ? edgeA + 1 : 0;
    }
    else
    {
        poly1 = polyA;
        poly2 = polyB;
        i11 = edgeA;
        i12 = edgeA + 1 < polyA.count ? edgeA + 1 : 0;
        i21 = edgeB;
        i22 = edgeB + 1 < polyB.count ? edgeB + 1 : 0;
    }

    const normal = poly1.normals[i11];

    // Reference edge vertices
    const v11 = poly1.vertices[i11];
    const v12 = poly1.vertices[i12];

    // Incident edge vertices
    const v21 = poly2.vertices[i21];
    const v22 = poly2.vertices[i22];

    // const tangent = b2CrossSV(1.0, normal);
    const tangentX = -1.0 * normal.y;
    const tangentY = 1.0 * normal.x;

    const lower1 = 0.0;

    // const upper1 = b2Dot(b2Sub(v12, v11), tangent);
    let subX = v12.x - v11.x;
    let subY = v12.y - v11.y;
    const upper1 = subX * tangentX + subY * tangentY;

    // Incident edge points opposite of tangent due to CCW winding
    // const upper2 = b2Dot(b2Sub(v21, v11), tangent);
    subX = v21.x - v11.x;
    subY = v21.y - v11.y;
    const upper2 = subX * tangentX + subY * tangentY;

    // const lower2 = b2Dot(b2Sub(v22, v11), tangent);
    subX = v22.x - v11.x;
    subY = v22.y - v11.y;
    const lower2 = subX * tangentX + subY * tangentY;

    let vLower;

    if (lower2 < lower1 && upper2 - lower2 > eps)
    {
        vLower = b2Lerp(v22, v21, (lower1 - lower2) / (upper2 - lower2));
    }
    else
    {
        vLower = v22;
    }

    let vUpper;

    if (upper2 > upper1 && upper2 - lower2 > eps)
    {
        vUpper = b2Lerp(v22, v21, (upper1 - lower2) / (upper2 - lower2));
    }
    else
    {
        vUpper = v21;
    }

    // const separationLower = b2Dot(b2Sub(vLower, v11), normal);
    // const separationUpper = b2Dot(b2Sub(vUpper, v11), normal);
    const separationLower = b2DotSub(vLower, v11, normal);
    const separationUpper = b2DotSub(vUpper, v11, normal);

    const r1 = poly1.radius;
    const r2 = poly2.radius;

    // Put contact points at midpoint, accounting for radii
    // vLower = b2MulAdd(vLower, 0.5 * (r1 - r2 - separationLower), normal);
    // vUpper = b2MulAdd(vUpper, 0.5 * (r1 - r2 - separationUpper), normal);
    b2MulAddOut(vLower, 0.5 * (r1 - r2 - separationLower), normal, p1);
    b2MulAddOut(vUpper, 0.5 * (r1 - r2 - separationUpper), normal, p2);

    const radius = r1 + r2;

    if (flip === false)
    {
        manifold.normalX = normal.x;
        manifold.normalY = normal.y;
        let mp = manifold.points[0];
        mp.anchorAX = p1.x;
        mp.anchorAY = p1.y;
        mp.separation = separationLower - radius;
        mp.id = B2_MAKE_ID(i11, i22);

        mp = manifold.points[1];
        mp.anchorAX = p2.x;
        mp.anchorAY = p2.y;
        mp.separation = separationUpper - radius;
        mp.id = B2_MAKE_ID(i12, i21);
        manifold.pointCount = 2;
    }
    else
    {
        // manifold.normal = b2Neg(normal);
        manifold.normalX = -normal.x;
        manifold.normalY = -normal.y;
        let mp = manifold.points[0];
        mp.anchorAX = p2.x;
        mp.anchorAY = p2.y;
        mp.separation = separationUpper - radius;
        mp.id = B2_MAKE_ID(i21, i12);

        mp = manifold.points[1];
        mp.anchorAX = p1.x;
        mp.anchorAY = p1.y;
        mp.separation = separationLower - radius;
        mp.id = B2_MAKE_ID(i22, i11);
        manifold.pointCount = 2;
    }

    return manifold;
}

// Find the max separation between poly1 and poly2 using edge normals from poly1.
function b2FindMaxSeparation(poly1, poly2)
{
    const count1 = poly1.count;
    const count2 = poly2.count;
    const n1s = poly1.normals;
    const v1s = poly1.vertices;
    const v2s = poly2.vertices;

    let bestIndex = 0;
    let maxSeparation = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < count1; ++i)
    {
        // Get poly1 normal in frame2.
        const n = n1s[i];
        const vx = v1s[i].x,
            vy = v1s[i].y;

        // Find the deepest point for normal i.
        let si = Number.POSITIVE_INFINITY;

        for (let j = 0; j < count2; ++j)
        {
            const dx = v2s[j].x - vx;
            const dy = v2s[j].y - vy;
            const sij = n.x * dx + n.y * dy;

            // const sij = b2Dot(n, b2Sub(v2s[j], v1));
            if (sij < si)
            {
                si = sij;
            }
        }

        if (si > maxSeparation)
        {
            maxSeparation = si;
            bestIndex = i;
        }
    }

    return { edgeIndex: bestIndex, maxSeparation: maxSeparation };  // PJB = the C version returns float maxSeparation here and bestIndex through *edgeIndex parameter
}

// Due to speculation, every polygon is rounded
// Algorithm:
//
// compute edge separation using the separating axis test (SAT)
// if (separation > speculation_distance)
//   return
// find reference and incident edge
// if separation >= 0.1f * b2_linearSlop
//   compute closest points between reference and incident edge
//   if vertices are closest
//      single vertex-vertex contact
//   else
//      clip edges
//   end
// else
//   clip edges
// end

const localPolyA = new b2Polygon(B2_MAX_POLYGON_VERTICES);
const localPolyB = new b2Polygon(B2_MAX_POLYGON_VERTICES);
const p = new b2Vec2();
const sfA = new b2Transform();

/**
 * @function b2CollidePolygons
 * @description
 * Computes collision manifold between two polygons using their transforms.
 * @param {b2Polygon} polygonA - First polygon
 * @param {b2Transform} xfA - Transform for first polygon containing position (p) and rotation (q)
 * @param {b2Polygon} polygonB - Second polygon
 * @param {b2Transform} xfB - Transform for second polygon containing position (p) and rotation (q)
 * @param {b2Manifold} manifold - Output manifold to store collision data
 * @returns {b2Manifold} The collision manifold containing contact points, normal and separation
 * @description
 * Detects collision between two polygons and generates contact information.
 * Transforms the polygons into a common frame, finds the separating axes,
 * and generates contact points. The manifold includes contact points with
 * anchor positions, separation distance, contact IDs and collision normal.
 */
export function b2CollidePolygons(polygonA, xfA, polygonB, xfB, manifold)
{
    const originX = polygonA.vertices[0].x;
    const originY = polygonA.vertices[0].y;

    p.x = xfA.p.x + (xfA.q.c * originX - xfA.q.s * originY);
    p.y = xfA.p.y + (xfA.q.s * originX + xfA.q.c * originY);
    sfA.p = p;
    sfA.q = xfA.q;
    b2InvMulTransformsOut(sfA, xfB, xf);

    // Shift polyA to origin, retain rotation
    localPolyA.centroid = null;
    
    localPolyA.count = polygonA.count;
    localPolyA.radius = polygonA.radius;
    localPolyA.vertices[0].x = 0;
    localPolyA.vertices[0].y = 0;
    localPolyA.normals[0].x = polygonA.normals[0].x;
    localPolyA.normals[0].y = polygonA.normals[0].y;

    for (let i = 1; i < localPolyA.count; ++i)
    {
        const v = localPolyA.vertices[i];
        v.x = polygonA.vertices[i].x - originX;
        v.y = polygonA.vertices[i].y - originY;
        const n = localPolyA.normals[i];
        n.x = polygonA.normals[i].x;
        n.y = polygonA.normals[i].y;
    }

    // Put polyB in polyA's frame to reduce round-off error
    localPolyA.centroid = null;

    localPolyB.count = polygonB.count;
    localPolyB.radius = polygonB.radius;

    for (let i = 0; i < localPolyB.count; ++i)
    {
        const v = localPolyB.vertices[i];
        const p = polygonB.vertices[i];
        v.x = (xf.q.c * p.x - xf.q.s * p.y) + xf.p.x;
        v.y = (xf.q.s * p.x + xf.q.c * p.y) + xf.p.y;
        const n = localPolyB.normals[i];
        n.x = xf.q.c * polygonB.normals[i].x - xf.q.s * polygonB.normals[i].y;
        n.y = xf.q.s * polygonB.normals[i].x + xf.q.c * polygonB.normals[i].y;
    }

    const ret1 = b2FindMaxSeparation(localPolyA, localPolyB);
    let edgeA = ret1.edgeIndex;
    const separationA = ret1.maxSeparation;

    const ret2 = b2FindMaxSeparation(localPolyB, localPolyA);
    let edgeB = ret2.edgeIndex;
    const separationB = ret2.maxSeparation;

    const radius = localPolyA.radius + localPolyB.radius;

    if (separationA > b2_speculativeDistance + radius || separationB > b2_speculativeDistance + radius)
    {
        return manifold.clear();
    }

    // Find incident edge
    let flip;

    if (separationA >= separationB)
    {
        flip = false;

        const searchDirection = localPolyA.normals[edgeA];

        // Find the incident edge on polyB
        const count = localPolyB.count;
        const normals = localPolyB.normals;
        edgeB = 0;
        let minDot = Number.MAX_VALUE;

        for (let i = 0; i < count; ++i)
        {
            const dot = searchDirection.x * normals[i].x + searchDirection.y * normals[i].y;

            if (dot < minDot)
            {
                minDot = dot;
                edgeB = i;
            }
        }
    }
    else
    {
        flip = true;

        const searchDirection = localPolyB.normals[edgeB];

        // Find the incident edge on polyA
        const count = localPolyA.count;
        const normals = localPolyA.normals;
        edgeA = 0;
        let minDot = Number.MAX_VALUE;

        for (let i = 0; i < count; ++i)
        {
            const dot = searchDirection.x * normals[i].x + searchDirection.y * normals[i].y;

            if (dot < minDot)
            {
                minDot = dot;
                edgeA = i;
            }
        }
    }

    // let manifold = new b2Manifold();

    // Using slop here to ensure vertex-vertex normal vectors can be safely normalized
    // todo this means edge clipping needs to handle slightly non-overlapping edges.
    if (separationA > 0.1 * b2_linearSlop || separationB > 0.1 * b2_linearSlop)
    {
        // Polygons are disjoint. Find closest points between reference edge and incident edge
        // Reference edge on polygon A
        const i11 = edgeA;
        const i12 = edgeA + 1 < localPolyA.count ? edgeA + 1 : 0;
        const i21 = edgeB;
        const i22 = edgeB + 1 < localPolyB.count ? edgeB + 1 : 0;

        const v11 = localPolyA.vertices[i11];
        const v12 = localPolyA.vertices[i12];
        const v21 = localPolyB.vertices[i21];
        const v22 = localPolyB.vertices[i22];

        const result = b2SegmentDistance(v11.x, v11.y, v12.x, v12.y, v21.x, v21.y, v22.x, v22.y);

        // return {
        //     fraction1,
        //     fraction2,
        //     distanceSquared
        // };

        if (result.fraction1 === 0.0 && result.fraction2 === 0.0)
        {
            // v11 - v21
            let normalX = v21.x - v11.x;
            let normalY = v21.y - v11.y;
            console.assert(result.distanceSquared > 0.0);
            const distance = Math.sqrt(result.distanceSquared);

            if (distance > b2_speculativeDistance + radius)
            {
                return manifold.clear();
            }
            const invDistance = 1.0 / distance;
            normalX *= invDistance;
            normalY *= invDistance;

            const c1X = v11.x + localPolyA.radius * normalX;
            const c1Y = v11.y + localPolyA.radius * normalY;
            const c2X = v21.x - localPolyB.radius * normalX;
            const c2Y = v21.y - localPolyB.radius * normalY;

            // manifold.normal = new b2Vec2(normalX, normalY);
            manifold.normalX = normalX;
            manifold.normalY = normalY;
            const mp = manifold.points[0];
            mp.anchorAX = (c1X + c2X) * 0.5;
            mp.anchorAY = (c1Y + c2Y) * 0.5;
            mp.separation = distance - radius;
            mp.id = B2_MAKE_ID(i11, i21);
            manifold.pointCount = 1;
        }
        else if (result.fraction1 === 0.0 && result.fraction2 === 1.0)
        {
            // v11 - v22
            let normalX = v22.x - v11.x;
            let normalY = v22.y - v11.y;
            console.assert(result.distanceSquared > 0.0);
            const distance = Math.sqrt(result.distanceSquared);

            if (distance > b2_speculativeDistance + radius)
            {
                return manifold.clear();
            }
            const invDistance = 1.0 / distance;
            normalX *= invDistance;
            normalY *= invDistance;

            const c1X = v11.x + localPolyA.radius * normalX;
            const c1Y = v11.y + localPolyA.radius * normalY;
            const c2X = v22.x - localPolyB.radius * normalX;
            const c2Y = v22.y - localPolyB.radius * normalY;

            manifold.normalX = normalX;
            manifold.normalY = normalY;
            const mp = new b2ManifoldPoint();
            mp.anchorAX = (c1X + c2X) * 0.5;
            mp.anchorAY = (c1Y + c2Y) * 0.5;
            mp.separation = distance - radius;
            mp.id = B2_MAKE_ID(i11, i22);
            manifold.points[0] = mp;
            manifold.pointCount = 1;
        }
        else if (result.fraction1 === 1.0 && result.fraction2 === 0.0)
        {
            // v12 - v21
            let normalX = v21.x - v12.x;
            let normalY = v21.y - v12.y;
            console.assert(result.distanceSquared > 0.0);
            const distance = Math.sqrt(result.distanceSquared);

            if (distance > b2_speculativeDistance + radius)
            {
                return manifold.clear();
            }
            const invDistance = 1.0 / distance;
            normalX *= invDistance;
            normalY *= invDistance;

            const c1X = v12.x + localPolyA.radius * normalX;
            const c1Y = v12.y + localPolyA.radius * normalY;
            const c2X = v21.x - localPolyB.radius * normalX;
            const c2Y = v21.y - localPolyB.radius * normalY;

            manifold.normalX = normalX;
            manifold.normalY = normalY;
            const mp = new b2ManifoldPoint();
            mp.anchorAX = (c1X + c2X) * 0.5;
            mp.anchorAY = (c1Y + c2Y) * 0.5;
            mp.separation = distance - radius;
            mp.id = B2_MAKE_ID(i12, i21);
            manifold.points[0] = mp;
            manifold.pointCount = 1;
        }
        else if (result.fraction1 === 1.0 && result.fraction2 === 1.0)
        {
            // v12 - v22
            let normalX = v22.x - v12.x;
            let normalY = v22.y - v12.y;
            console.assert(result.distanceSquared > 0.0);
            const distance = Math.sqrt(result.distanceSquared);

            if (distance > b2_speculativeDistance + radius)
            {
                return manifold.clear();
            }
            const invDistance = 1.0 / distance;
            normalX *= invDistance;
            normalY *= invDistance;

            const c1X = v12.x + localPolyA.radius * normalX;
            const c1Y = v12.y + localPolyA.radius * normalY;
            const c2X = v22.x - localPolyB.radius * normalX;
            const c2Y = v22.y - localPolyB.radius * normalY;

            manifold.normalX = normalX;
            manifold.normalY = normalY;
            const mp = new b2ManifoldPoint();
            mp.anchorAX = (c1X + c2X) * 0.5;
            mp.anchorAY = (c1Y + c2Y) * 0.5;
            mp.separation = distance - radius;
            mp.id = B2_MAKE_ID(i12, i22);
            manifold.points[0] = mp;
            manifold.pointCount = 1;
        }
        else
        {
            // Edge region
            b2ClipPolygons(localPolyA, localPolyB, edgeA, edgeB, flip, manifold);
        }
    }
    else
    {
        // Polygons overlap
        b2ClipPolygons(localPolyA, localPolyB, edgeA, edgeB, flip, manifold);
    }

    // Convert manifold to world space
    if (manifold.pointCount > 0)
    {
        const tmpx = manifold.normalX;
        manifold.normalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
        manifold.normalY = xfA.q.s * tmpx + xfA.q.c * manifold.normalY;

        for (let i = 0; i < manifold.pointCount; ++i)
        {
            const mp = manifold.points[i];

            const addX = mp.anchorAX + originX;
            const addY = mp.anchorAY + originY;
            mp.anchorAX = xfA.q.c * addX - xfA.q.s * addY;
            mp.anchorAY = xfA.q.s * addX + xfA.q.c * addY;
            mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
            mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
            mp.pointX = xfA.p.x + mp.anchorAX;
            mp.pointY = xfA.p.y + mp.anchorAY;
        }
    }

    return manifold;
}

/**
 * @function b2CollideSegmentAndCircle
 * @description
 * Computes collision detection between a line segment and a circle by converting
 * the segment to a zero-radius capsule and using capsule-circle collision.
 * @param {b2Segment} segmentA - The line segment shape
 * @param {b2Transform} xfA - Transform for segmentA
 * @param {b2Circle} circleB - The circle shape
 * @param {b2Transform} xfB - Transform for circleB
 * @param {b2Manifold} manifold - The collision manifold to populate
 * @returns {b2Manifold} The collision manifold containing contact information
 */
export function b2CollideSegmentAndCircle(segmentA, xfA, circleB, xfB, manifold)
{
    const capsuleA = new b2Capsule();
    capsuleA.center1 = segmentA.point1;
    capsuleA.center2 = segmentA.point2;
    capsuleA.radius = 0.0;

    return b2CollideCapsuleAndCircle(capsuleA, xfA, circleB, xfB, manifold);
}

/**
 * @function b2CollideSegmentAndPolygon
 * @description
 * Computes collision manifold between a line segment and a polygon by converting
 * the segment into a zero-width capsule and using polygon collision detection.
 * @param {b2Segment} segmentA - The line segment
 * @param {b2Transform} xfA - Transform for segmentA
 * @param {b2Polygon} polygonB - The polygon to test collision against
 * @param {b2Transform} xfB - Transform for polygonB
 * @param {b2Manifold} manifold - The manifold to populate with collision data
 * @returns {b2Manifold} Collision manifold containing contact points and normal
 */
export function b2CollideSegmentAndPolygon(segmentA, xfA, polygonB, xfB, manifold)
{
    const polygonA = b2MakeCapsule(segmentA.point1, segmentA.point2, 0.0);

    return b2CollidePolygons(polygonA, xfA, polygonB, xfB, manifold);
}

// Assuming similar structures exist for b2Manifold, b2Transform, b2ChainSegment, b2Circle, etc.
/**
 * @function b2CollideChainSegmentAndCircle
 * @description
 * Computes collision detection between a chain segment and a circle.
 * @param {Object} chainSegmentA - A chain segment with properties segment (containing point1 and point2) and ghost points (ghost1, ghost2)
 * @param {Object} xfA - Transform for chain segment containing position (p) and rotation (q)
 * @param {Object} circleB - Circle object with center point and radius
 * @param {Object} xfB - Transform for circle containing position (p) and rotation (q)
 * @param {Object} manifold - Contact manifold to store collision results
 * @returns {Object} The manifold object containing collision data:
 * - normalX/Y: collision normal in world coordinates
 * - points: array with contact point data including:
 * - anchorA/B: contact points in local coordinates
 * - point: contact point in world coordinates
 * - separation: distance between shapes
 * - id: contact ID
 * - pointCount: number of contact points
 */
export function b2CollideChainSegmentAndCircle(chainSegmentA, xfA, circleB, xfB, manifold)
{
    // let manifold = new b2Manifold();

    b2InvMulTransformsOut(xfA, xfB, xf);

    // Compute circle in frame of segment
    const pB = b2TransformPoint(xf, circleB.center);

    const p1 = chainSegmentA.segment.point1;
    const p2 = chainSegmentA.segment.point2;
    const e = b2Sub(p2, p1);

    // Normal points to the right
    const offset = b2Dot(b2RightPerp(e), b2Sub(pB, p1));

    if (offset < 0.0)
    {
        // collision is one-sided
        return manifold.clear();
    }

    // Barycentric coordinates
    const u = b2Dot(e, b2Sub(p2, pB));
    const v = b2Dot(e, b2Sub(pB, p1));

    let pA;

    if (v <= 0.0)
    {
        // Behind point1?
        // Is pB in the Voronoi region of the previous edge?
        const prevEdge = b2Sub(p1, chainSegmentA.ghost1);
        const uPrev = b2Dot(prevEdge, b2Sub(pB, p1));

        if (uPrev <= 0.0)
        {
            return manifold.clear();
        }

        pA = p1;
    }
    else if (u <= 0.0)
    {
        // Ahead of point2?
        const nextEdge = b2Sub(chainSegmentA.ghost2, p2);
        const vNext = b2Dot(nextEdge, b2Sub(pB, p2));

        // Is pB in the Voronoi region of the next edge?
        if (vNext > 0.0)
        {
            return manifold.clear();
        }

        pA = p2;
    }
    else
    {
        const ee = b2Dot(e, e);
        pA = new b2Vec2(u * p1.x + v * p2.x, u * p1.y + v * p2.y);
        pA = ee > 0.0 ? b2MulSV(1.0 / ee, pA) : p1;
    }

    const res = b2GetLengthAndNormalize(b2Sub(pB, pA));
    const distance = res.length;
    const normal = res.normal;

    const radius = circleB.radius;
    const separation = distance - radius;

    if (separation > b2_speculativeDistance)
    {
        return manifold.clear();
    }

    const cA = pA;
    const cB = b2MulAdd(pB, -radius, normal);
    const contactPointA = b2Lerp(cA, cB, 0.5);

    // manifold.normal = b2RotateVector(xfA.q, normal);
    manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
    manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;

    const mp = manifold.points[0];

    // mp.anchorA = b2RotateVector(xfA.q, contactPointA);
    mp.anchorAX = xfA.q.c * contactPointA.x - xfA.q.s * contactPointA.y;
    mp.anchorAY = xfA.q.s * contactPointA.x + xfA.q.c * contactPointA.y;

    // mp.anchorB = b2Add(mp.anchorA, b2Sub(xfA.p, xfB.p));
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);

    // mp.point = b2Add(xfA.p, mp.anchorA);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = separation;
    mp.id = 0;
    manifold.pointCount = 1;

    return manifold;
}

/**
 * @function b2CollideChainSegmentAndCapsule
 * @description
 * Computes collision between a chain segment and a capsule by converting the capsule
 * to a polygon and delegating to the segment-polygon collision function.
 * @param {b2ChainSegment} segmentA - The chain segment shape
 * @param {b2Transform} xfA - Transform for segmentA
 * @param {b2Capsule} capsuleB - The capsule shape defined by two centers and a radius
 * @param {b2Transform} xfB - Transform for capsuleB
 * @param {b2DistanceCache} cache - Simplex cache for persistent contact information
 * @param {b2Manifold} manifold - Contact manifold to store collision results
 * @returns {b2Manifold} - Modified manifold
 */
export function b2CollideChainSegmentAndCapsule(segmentA, xfA, capsuleB, xfB, cache, manifold)
{
    const polyB = b2MakeCapsule(capsuleB.center1, capsuleB.center2, capsuleB.radius);

    return b2CollideChainSegmentAndPolygon(segmentA, xfA, polyB, xfB, cache, manifold);
}

function b2ClipSegments(a1, a2, b1, b2, normal, ra, rb, id1, id2, manifold)
{
    const tangent = b2LeftPerp(normal);

    // Barycentric coordinates of each point relative to a1 along tangent
    const lower1 = 0.0;
    const upper1 = b2Dot(b2Sub(a2, a1), tangent);

    // Incident edge points opposite of tangent due to CCW winding
    const upper2 = b2Dot(b2Sub(b1, a1), tangent);
    const lower2 = b2Dot(b2Sub(b2, a1), tangent);

    // Do segments overlap?
    if (upper2 < lower1 || upper1 < lower2)
    {
        return manifold.clear();
    }

    let vLower;

    if (lower2 < lower1 && upper2 - lower2 > eps)
    {
        vLower = b2Lerp(b2, b1, (lower1 - lower2) / (upper2 - lower2));
    }
    else
    {
        vLower = b2;
    }

    let vUpper;

    if (upper2 > upper1 && upper2 - lower2 > eps)
    {
        vUpper = b2Lerp(b2, b1, (upper1 - lower2) / (upper2 - lower2));
    }
    else
    {
        vUpper = b1;
    }

    // todo vLower can be very close to vUpper, reduce to one point?

    const separationLower = b2Dot(b2Sub(vLower, a1), normal);
    const separationUpper = b2Dot(b2Sub(vUpper, a1), normal);

    // Put contact points at midpoint, accounting for radii
    vLower = b2MulAdd(vLower, 0.5 * (ra - rb - separationLower), normal);
    vUpper = b2MulAdd(vUpper, 0.5 * (ra - rb - separationUpper), normal);

    const radius = ra + rb;

    manifold.normalX = normal.x;        // PJB - manifold.normal = normal;  <<< reference copy!!
    manifold.normalY = normal.y;

    const p0 = manifold.points[0];
    p0.anchorAX = vLower.x;
    p0.anchorAY = vLower.y;
    p0.separation = separationLower - radius;
    p0.id = id1;

    const p1 = manifold.points[1];

    // p1.anchorA = vUpper;
    p1.anchorAX = vUpper.x;
    p1.anchorAY = vUpper.y;
    p1.separation = separationUpper - radius;
    p1.id = id2;

    manifold.pointCount = 2;

    return manifold;
}

const b2NormalType = {
    b2_normalSkip: 0,
    b2_normalAdmit: 1,
    b2_normalSnap: 2
};

function b2ClassifyNormal(params, normal)
{
    const sinTol = 0.01;

    if (b2Dot(normal, params.edge1) <= 0.0)
    {
        // Normal points towards the segment tail
        if (params.convex1)
        {
            if (b2Cross(normal, params.normal0) > sinTol)
            {
                return b2NormalType.b2_normalSkip;
            }

            return b2NormalType.b2_normalAdmit;
        }
        else
        {
            return b2NormalType.b2_normalSnap;
        }
    }
    else
    {
        // Normal points towards segment head
        if (params.convex2)
        {
            if (b2Cross(params.normal2, normal) > sinTol)
            {
                return b2NormalType.b2_normalSkip;
            }

            return b2NormalType.b2_normalAdmit;
        }
        else
        {
            return b2NormalType.b2_normalSnap;
        }
    }
}

class b2ChainSegmentParams
{
    constructor()
    {
        this.edge1 = new b2Vec2();
        this.normal0 = new b2Vec2();
        this.normal2 = new b2Vec2();
        this.convex1 = false;
        this.convex2 = false;
        
    }
};

/**
 * @function b2CollideChainSegmentAndPolygon
 * @param {b2ChainSegment} chainSegmentA - The chain segment shape A
 * @param {b2Transform} xfA - Transform for shape A
 * @param {b2Polygon} polygonB - The polygon shape B
 * @param {b2Transform} xfB - Transform for shape B
 * @param {b2DistanceCache} cache - Cache for distance calculations
 * @param {b2Manifold} manifold - The contact manifold to populate
 * @returns {b2Manifold} The populated contact manifold
 * @description
 * Computes the collision manifold between a chain segment (a segment with rounded corners)
 * and a polygon. The function handles edge cases including convex/concave corners and
 * determines contact points and normals. The manifold is populated with contact points
 * and can contain 0, 1 or 2 contact points depending on the collision configuration.
 */
export function b2CollideChainSegmentAndPolygon(chainSegmentA, xfA, polygonB, xfB, cache, manifold)
{
    b2InvMulTransformsOut(xfA, xfB, xf);

    const centroidB = b2TransformPoint(xf, polygonB.centroid);
    const radiusB = polygonB.radius;

    const p1 = chainSegmentA.segment.point1;
    const p2 = chainSegmentA.segment.point2;

    const edge1 = b2Normalize(b2Sub(p2, p1));

    const chainParams = new b2ChainSegmentParams();
    chainParams.edge1 = edge1.clone();

    const convexTol = 0.01;
    const edge0 = b2Normalize(b2Sub(p1, chainSegmentA.ghost1));
    chainParams.normal0 = b2RightPerp(edge0);
    chainParams.convex1 = b2Cross(edge0, edge1) >= convexTol;

    const edge2 = b2Normalize(b2Sub(chainSegmentA.ghost2, p2));
    chainParams.normal2 = b2RightPerp(edge2);
    chainParams.convex2 = b2Cross(edge1, edge2) >= convexTol;

    const normal1 = b2RightPerp(edge1);
    const behind1 = b2Dot(normal1, b2Sub(centroidB, p1)) < 0.0;
    let behind0 = true;
    let behind2 = true;

    if (chainParams.convex1)
    {
        behind0 = b2Dot(chainParams.normal0, b2Sub(centroidB, p1)) < 0.0;
    }

    if (chainParams.convex2)
    {
        behind2 = b2Dot(chainParams.normal2, b2Sub(centroidB, p2)) < 0.0;
    }

    if (behind1 && behind0 && behind2)
    {
        return manifold.clear();
    }

    const count = polygonB.count;
    const vertices = [];
    const normals = [];

    for (let i = 0; i < count; ++i)
    {
        vertices[i] = b2TransformPoint(xf, polygonB.vertices[i]);
        normals[i] = b2RotateVector(xf.q, polygonB.normals[i]);
    }

    const input = new b2DistanceInput();
    input.proxyA = b2MakeProxy([ chainSegmentA.segment.point1, chainSegmentA.segment.point2 ], 2, 0.0);
    input.proxyB = b2MakeProxy(vertices, count, 0.0);
    input.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.useRadii = false;

    const output = b2ShapeDistance(cache, input, null, 0);

    if (output.distance > radiusB + b2_speculativeDistance)
    {
        return manifold.clear();
    }

    const n0 = chainParams.convex1 ? chainParams.normal0 : normal1;
    const n2 = chainParams.convex2 ? chainParams.normal2 : normal1;

    let incidentIndex = -1;
    let incidentNormal = -1;

    if (behind1 == false && output.distance > 0.1 * b2_linearSlop)
    {
        if (cache.count == 1)
        {
            const pA = output.pointA;
            const pB = output.pointB;

            const normal = b2Normalize(b2Sub(pB, pA));

            const type = b2ClassifyNormal(chainParams, normal);

            if (type == b2NormalType.b2_normalSkip)
            {
                return manifold.clear();
            }

            if (type == b2NormalType.b2_normalAdmit)
            {
                // manifold.normal = b2RotateVector(xfA.q, normal);
                manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
                manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;

                // PJB - renamed cp to mp (it's a manifold point, not a contact/constraint point... confirmed from the C)
                const mp = new b2ManifoldPoint();

                // mp.anchorA = b2RotateVector(xfA.q, contactPointA);
                mp.anchorAX = xfA.q.c * pA.x - xfA.q.s * pA.y;
                mp.anchorAY = xfA.q.s * pA.x + xfA.q.c * pA.y;

                // mp.anchorB = b2Add(mp.anchorA, b2Sub(xfA.p, xfB.p));
                mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
                mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);

                // mp.point = b2Add(xfA.p, mp.anchorA);
                mp.pointX = xfA.p.x + mp.anchorAX;
                mp.pointY = xfA.p.y + mp.anchorAY;
                mp.separation = output.distance - radiusB;
                mp.id = B2_MAKE_ID(cache.indexA[0], cache.indexB[0]);
                manifold.points[0] = mp;
                manifold.pointCount = 1;

                return manifold;
            }

            incidentIndex = cache.indexB[0];
        }
        else
        {
            console.assert(cache.count == 2);

            const ia1 = cache.indexA[0];
            const ia2 = cache.indexA[1];
            let ib1 = cache.indexB[0];
            let ib2 = cache.indexB[1];

            if (ia1 == ia2)
            {
                console.assert(ib1 != ib2);

                let normalB = b2Sub(output.pointA, output.pointB);
                let dot1 = b2Dot(normalB, normals[ib1]);
                let dot2 = b2Dot(normalB, normals[ib2]);
                const ib = dot1 > dot2 ? ib1 : ib2;

                normalB = normals[ib];

                const type = b2ClassifyNormal(chainParams, b2Neg(normalB));

                if (type == b2NormalType.b2_normalSkip)
                {
                    return manifold.clear();
                }

                if (type == b2NormalType.b2_normalAdmit)
                {
                    ib1 = ib;
                    ib2 = ib < count - 1 ? ib + 1 : 0;

                    const b1 = vertices[ib1];
                    const b2 = vertices[ib2];

                    dot1 = b2Dot(normalB, b2Sub(p1, b1));
                    dot2 = b2Dot(normalB, b2Sub(p2, b1));

                    if (dot1 < dot2)
                    {
                        if (b2Dot(n0, normalB) < b2Dot(normal1, normalB))
                        {
                            return manifold.clear();
                        }
                    }
                    else
                    {
                        if (b2Dot(n2, normalB) < b2Dot(normal1, normalB))
                        {
                            return manifold.clear();
                        }
                    }

                    b2ClipSegments(b1, b2, p1, p2, normalB, radiusB, 0.0, B2_MAKE_ID(ib1, 1), B2_MAKE_ID(ib2, 0), manifold);

                    // manifold.normal = b2RotateVector(xfA.q, b2Neg(normalB));
                    manifold.normalX = xfA.q.c * -normalB.x - xfA.q.s * -normalB.y;
                    manifold.normalY = xfA.q.s * -normalB.x + xfA.q.c * -normalB.y;

                    // manifold.points[0].anchorA = b2RotateVector(xfA.q, manifold.points[0].anchorA);
                    manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
                    manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;

                    // manifold.points[1].anchorA = b2RotateVector(xfA.q, manifold.points[1].anchorA);
                    manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
                    manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
                    const pAB = b2Sub(xfA.p, xfB.p);

                    // manifold.points[0].anchorB = b2Add(manifold.points[0].anchorA, pAB);
                    manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB.x;
                    manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB.y;

                    // manifold.points[1].anchorB = b2Add(manifold.points[1].anchorA, pAB);
                    manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB.x;
                    manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB.y;

                    // manifold.points[0].point = b2Add(xfA.p, manifold.points[0].anchorA);
                    manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
                    manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;

                    // manifold.points[1].point = b2Add(xfA.p, manifold.points[1].anchorA);
                    manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
                    manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;

                    return manifold;
                }

                incidentNormal = ib;
            }
            else
            {
                const dot1 = b2Dot(normal1, b2Sub(vertices[ib1], p1));
                const dot2 = b2Dot(normal1, b2Sub(vertices[ib2], p2));
                incidentIndex = dot1 < dot2 ? ib1 : ib2;
            }
        }
    }
    else
    {
        // SAT edge normal
        let edgeSeparation = Number.MAX_VALUE;

        for (let i = 0; i < count; ++i)
        {
            const s = b2Dot(normal1, b2Sub(vertices[i], p1));

            if (s < edgeSeparation)
            {
                edgeSeparation = s;
                incidentIndex = i;
            }
        }

        // Check convex neighbor for edge separation
        if (chainParams.convex1)
        {
            let s0 = Number.MAX_VALUE;

            for (let i = 0; i < count; ++i)
            {
                const s = b2Dot(chainParams.normal0, b2Sub(vertices[i], p1));

                if (s < s0)
                {
                    s0 = s;
                }
            }

            if (s0 > edgeSeparation)
            {
                edgeSeparation = s0;
                incidentIndex = -1;
            }
        }

        if (chainParams.convex2)
        {
            let s2 = Number.MAX_VALUE;

            for (let i = 0; i < count; ++i)
            {
                const s = b2Dot(chainParams.normal2, b2Sub(vertices[i], p2));

                if (s < s2)
                {
                    s2 = s;
                }
            }

            if (s2 > edgeSeparation)
            {
                edgeSeparation = s2;
                incidentIndex = -1;
            }
        }

        // SAT polygon normals
        let polygonSeparation = -Number.MAX_VALUE;
        let referenceIndex = -1;

        for (let i = 0; i < count; ++i)
        {
            const n = normals[i];

            const type = b2ClassifyNormal(chainParams, b2Neg(n));

            if (type != b2NormalType.b2_normalAdmit)
            {
                continue;
            }

            const p = vertices[i];
            const s = Math.min(b2Dot(n, b2Sub(p2, p)), b2Dot(n, b2Sub(p1, p)));

            if (s > polygonSeparation)
            {
                polygonSeparation = s;
                referenceIndex = i;
            }
        }

        if (polygonSeparation > edgeSeparation)
        {
            const ia1 = referenceIndex;
            const ia2 = ia1 < count - 1 ? ia1 + 1 : 0;
            const a1 = vertices[ia1];
            const a2 = vertices[ia2];

            const n = normals[ia1];

            const dot1 = b2Dot(n, b2Sub(p1, a1));
            const dot2 = b2Dot(n, b2Sub(p2, a1));

            if (dot1 < dot2)
            {
                if (b2Dot(n0, n) < b2Dot(normal1, n))
                {
                    return manifold.clear();
                }
            }
            else
            {
                if (b2Dot(n2, n) < b2Dot(normal1, n))
                {
                    return manifold.clear(0);
                }
            }

            b2ClipSegments(a1, a2, p1, p2, normals[ia1], radiusB, 0.0, B2_MAKE_ID(ia1, 1), B2_MAKE_ID(ia2, 0), manifold);

            // manifold.normal = b2RotateVector(xfA.q, b2Neg(normals[ia1]));
            manifold.normalX = xfA.q.c * -normals[ia1].x - xfA.q.s * -normals[ia1].y;
            manifold.normalY = xfA.q.s * -normals[ia1].x + xfA.q.c * -normals[ia1].y;

            // manifold.points[0].anchorA = b2RotateVector(xfA.q, manifold.points[0].anchorA);
            manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
            manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;

            // manifold.points[1].anchorA = b2RotateVector(xfA.q, manifold.points[1].anchorA);
            manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
            manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
            const pAB = b2Sub(xfA.p, xfB.p);

            // manifold.points[0].anchorB = b2Add(manifold.points[0].anchorA, pAB);
            manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB.x;
            manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB.y;

            // manifold.points[1].anchorB = b2Add(manifold.points[1].anchorA, pAB);
            manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB.x;
            manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB.y;

            // manifold.points[0].point = b2Add(xfA.p, manifold.points[0].anchorA);
            manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
            manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;

            // manifold.points[1].point = b2Add(xfA.p, manifold.points[1].anchorA);
            manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
            manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;

            return manifold;
        }

        if (incidentIndex == -1)
        {
            return manifold.clear();
        }
    }

    console.assert(incidentNormal != -1 || incidentIndex != -1);

    let b1, b2;
    let ib1, ib2;

    if (incidentNormal != -1)
    {
        ib1 = incidentNormal;
        ib2 = ib1 < count - 1 ? ib1 + 1 : 0;
        b1 = vertices[ib1];
        b2 = vertices[ib2];
    }
    else
    {
        const i2 = incidentIndex;
        const i1 = i2 > 0 ? i2 - 1 : count - 1;
        const d1 = b2Dot(normal1, normals[i1]);
        const d2 = b2Dot(normal1, normals[i2]);

        if (d1 < d2)
        {
            ib1 = i1;
            ib2 = i2;
            b1 = vertices[ib1];
            b2 = vertices[ib2];
        }
        else
        {
            ib1 = i2;
            ib2 = i2 < count - 1 ? i2 + 1 : 0;
            b1 = vertices[ib1];
            b2 = vertices[ib2];
        }
    }

    b2ClipSegments(p1, p2, b1, b2, normal1, 0.0, radiusB, B2_MAKE_ID(0, ib2), B2_MAKE_ID(1, ib1), manifold);

    // manifold.normal = b2RotateVector(xfA.q, manifold.normal);
    manifold.normalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
    manifold.normalY = xfA.q.s * manifold.normalX + xfA.q.c * manifold.normalY;

    // manifold.points[0].anchorA = b2RotateVector(xfA.q, manifold.points[0].anchorA);
    manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
    manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;

    // manifold.points[1].anchorA = b2RotateVector(xfA.q, manifold.points[1].anchorA);
    manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
    manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
    const pAB = b2Sub(xfA.p, xfB.p);

    // manifold.points[0].anchorB = b2Add(manifold.points[0].anchorA, pAB);
    manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB.x;
    manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB.y;

    // manifold.points[1].anchorB = b2Add(manifold.points[1].anchorA, pAB);
    manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB.x;
    manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB.y;

    // manifold.points[0].point = b2Add(xfA.p, manifold.points[0].anchorA);
    manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
    manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;

    // manifold.points[1].point = b2Add(xfA.p, manifold.points[1].anchorA);
    manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
    manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;

    return manifold;
}
