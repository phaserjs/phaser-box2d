/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_MAX_POLYGON_VERTICES, b2Capsule, b2CastOutput, b2Circle, b2DistanceCache, b2DistanceInput, b2MassData, b2Polygon, b2ShapeCastPairInput } from './include/collision_h.js';
import {
    b2AABB,
    b2Add,
    b2ClampFloat,
    b2Cross,
    b2CrossVS,
    b2DistanceSquared,
    b2Dot,
    b2GetLengthAndNormalize,
    b2IsValid,
    b2Length,
    b2Lerp,
    b2Max,
    b2Min,
    b2MulAdd,
    b2MulSV,
    b2MulSub,
    b2Neg,
    b2Normalize,
    b2RightPerp,
    b2Rot,
    b2RotateVector,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2Vec2,
    b2Vec2_IsValid,
    eps
} from './include/math_functions_h.js';
import { b2MakeProxy, b2ShapeCast, b2ShapeDistance } from './include/distance_h.js';

import { B2_HUGE } from './include/core_h.js';
import { b2ValidateHull } from './include/hull_h.js';

/**
 * @namespace Geometry
 */

/**
 * @import {b2Hull, b2RayCastInput, b2Segment, b2ShapeCastInput} from './include/collision_h.js'
 */

/**
 * Validates a ray cast input structure.
 * @function b2IsValidRay
 * @param {b2RayCastInput} input - The ray cast input to validate, containing:
 * - origin: b2Vec2 - Starting point of the ray
 * - translation: b2Vec2 - Direction and length of the ray
 * - maxFraction: number - Maximum fraction of translation to check
 * @returns {boolean} True if the ray cast input is valid, false otherwise.
 * @description
 * Checks if a ray cast input is valid by verifying:
 * - The origin vector is valid
 * - The translation vector is valid
 * - The maxFraction is a valid number
 * - The maxFraction is between 0 and B2_HUGE(exclusive)
 */
export function b2IsValidRay(input)
{
    const isValid = b2Vec2_IsValid(input.origin) && b2Vec2_IsValid(input.translation) && b2IsValid(input.maxFraction) &&
                  0.0 <= input.maxFraction && input.maxFraction < B2_HUGE;

    return isValid;
}

function b2ComputePolygonCentroid(vertices, count)
{
    let center = new b2Vec2(0.0, 0.0);
    let area = 0.0;

    // Get a reference point for forming triangles.
    // Use the first vertex to reduce round-off errors.
    const origin = vertices[0];

    const inv3 = 1.0 / 3.0;

    for (let i = 1; i < count - 1; ++i)
    {
        // Triangle edges
        const e1 = b2Sub(vertices[i], origin);
        const e2 = b2Sub(vertices[i + 1], origin);
        const a = 0.5 * b2Cross(e1, e2);

        // Area weighted centroid
        center = b2MulAdd(center, a * inv3, b2Add(e1, e2));
        area += a;
    }

    // Centroid
    console.assert(area > eps);
    const invArea = 1.0 / area;
    center.x *= invArea;
    center.y *= invArea;

    // Restore offset
    center = b2Add(origin, center);

    return center;
}

// default to forceCheck: true - turn this off at your own peril, it validates the hull
/**
 * @function b2MakePolygon
 * @summary Creates a polygon shape from a hull with rounded corners.
 * @param {b2Hull} hull - A convex hull structure containing points that define the polygon vertices
 * @param {number} radius - The radius used to round the corners of the polygon
 * @param {boolean} [forceCheck=true] - Whether to enforce hull validation
 * @returns {b2Polygon} A new polygon shape with computed vertices, normals, and centroid
 * @throws {Error} Throws an assertion error if the hull is invalid
 * @description
 * Creates a b2Polygon from a convex hull. If the hull has fewer than 3 points, returns a
 * square shape. The function computes the polygon's vertices, edge normals, and centroid.
 * Each edge normal is a unit vector perpendicular to the corresponding edge.
 */
export function b2MakePolygon(hull, radius, forceCheck = true)
{
    if (forceCheck && !b2ValidateHull(hull))
    {
        console.warn("Invalid hull.");

        return null;
    }

    if (hull.count < 3)
    {
        // Handle a bad hull when assertions are disabled
        return b2MakeSquare(0.5);
    }

    const shape = new b2Polygon();
    shape.count = hull.count;
    shape.radius = radius;

    // Copy vertices
    for (let i = 0; i < shape.count; ++i)
    {
        shape.vertices[i] = hull.points[i];
    }

    // Compute normals. Ensure the edges have non-zero length.
    for (let i = 0; i < shape.count; ++i)
    {
        const i1 = i;
        const i2 = i + 1 < shape.count ? i + 1 : 0;
        const edge = b2Sub(shape.vertices[i2], shape.vertices[i1]);
        console.assert(b2Dot(edge, edge) > eps * eps);
        shape.normals[i] = b2Normalize(b2CrossVS(edge, 1.0));
    }

    shape.centroid = b2ComputePolygonCentroid(shape.vertices, shape.count);

    return shape;
}

// default to forceCheck: true - turn this off at your own peril, it validates the hull
/**
 * @function b2MakeOffsetPolygon
 * @description Creates a polygon shape from a hull with specified radius and transform
 * @param {b2Hull} hull - The input hull to create the polygon from
 * @param {number} radius - The radius to offset the polygon vertices
 * @param {b2Transform} transform - Transform to apply to the hull points
 * @param {boolean} [forceCheck=true] - Whether to force validation check of the hull
 * @returns {b2Polygon} A new polygon shape with transformed vertices, computed normals and centroid
 * @throws {Error} Throws assertion error if hull validation fails
 * @note Returns a square polygon of size 0.5 if hull has less than 3 points
 */
export function b2MakeOffsetPolygon(hull, radius, transform, forceCheck = true)
{
    console.assert(forceCheck && b2ValidateHull(hull), "Invalid hull.");

    if (hull.count < 3)
    {
        // Handle a bad hull when assertions are disabled
        return b2MakeSquare(0.5);
    }

    const shape = new b2Polygon();
    shape.count = hull.count;
    shape.radius = radius;

    // Copy vertices
    for (let i = 0; i < shape.count; ++i)
    {
        shape.vertices[i] = b2TransformPoint(transform, hull.points[i]);
    }

    // Compute normals. Ensure the edges have non-zero length.
    for (let i = 0; i < shape.count; ++i)
    {
        const i1 = i;
        const i2 = i + 1 < shape.count ? i + 1 : 0;
        const edge = b2Sub(shape.vertices[i2], shape.vertices[i1]);
        console.assert(b2Dot(edge, edge) > eps * eps);
        shape.normals[i] = b2Normalize(b2CrossVS(edge, 1.0));
    }

    shape.centroid = b2ComputePolygonCentroid(shape.vertices, shape.count);

    return shape;
}

/**
 * Creates a square polygon with equal width and height.
 * @function b2MakeSquare
 * @param {number} h - The half-width and half-height of the square.
 * @returns {b2Polygon} A polygon object representing a square centered at the origin.
 * @description
 * Creates a square polygon by calling b2MakeBox with equal dimensions.
 * The square is centered at the origin with sides of length 2h.
 */
export function b2MakeSquare(h)
{
    return b2MakeBox(h, h);
}

/**
 * @function b2MakeBox
 * @description
 * Creates a rectangular polygon shape centered at the origin with specified half-widths.
 * The vertices are arranged counter-clockwise starting from the bottom-left corner.
 * The shape includes pre-computed normals for each edge.
 * @param {number} hx - Half-width of the box in the x-direction (must be positive)
 * @param {number} hy - Half-height of the box in the y-direction (must be positive)
 * @returns {b2Polygon} A polygon shape representing a rectangle with:
 * - 4 vertices at (-hx,-hy), (hx,-hy), (hx,hy), (-hx,hy)
 * - 4 normals pointing outward from each edge
 * - radius of 0
 * - centroid at (0,0)
 * @throws {Error} Throws an assertion error if hx or hy are not valid positive numbers
 */
export function b2MakeBox(hx, hy)
{
    console.assert(b2IsValid(hx) && hx > 0.0);
    console.assert(b2IsValid(hy) && hy > 0.0);

    const shape = new b2Polygon();
    shape.count = 4;
    shape.vertices[0] = new b2Vec2(-hx, -hy);
    shape.vertices[1] = new b2Vec2(hx, -hy);
    shape.vertices[2] = new b2Vec2(hx, hy);
    shape.vertices[3] = new b2Vec2(-hx, hy);
    shape.normals[0] = new b2Vec2(0.0, -1.0);
    shape.normals[1] = new b2Vec2(1.0, 0.0);
    shape.normals[2] = new b2Vec2(0.0, 1.0);
    shape.normals[3] = new b2Vec2(-1.0, 0.0);
    shape.radius = 0.0;
    shape.centroid = new b2Vec2(0,0);

    return shape;
}

/**
 * Creates a rounded box shape by generating a box with specified dimensions and corner radius.
 * @function b2MakeRoundedBox
 * @param {number} hx - Half-width of the box along the x-axis
 * @param {number} hy - Half-height of the box along the y-axis
 * @param {number} radius - Radius of the rounded corners
 * @returns {b2Polygon} A polygon shape representing a rounded box
 */
export function b2MakeRoundedBox(hx, hy, radius)
{
    const shape = b2MakeBox(hx, hy);
    shape.radius = radius;

    return shape;
}

/**
 * Creates a rectangular polygon shape with specified dimensions, position, and rotation.
 * @function b2MakeOffsetBox
 * @param {number} hx - Half-width of the box along the x-axis
 * @param {number} hy - Half-height of the box along the y-axis
 * @param {b2Vec2} center - The center position of the box
 * @param {b2Rot} rotation - The 2D rotation of the box
 * @returns {b2Polygon} A polygon shape representing the box with 4 vertices and normals
 * @description
 * Creates a b2Polygon representing a rectangle with the given dimensions. The box is centered
 * at the specified position and rotated by the given angle. The resulting polygon includes
 * 4 vertices, 4 normals, and has its centroid set to the center position.
 */
export function b2MakeOffsetBox(hx, hy, center, rotation)
{
    const xf = new b2Transform();
    xf.p = center;
    xf.q = rotation;

    const shape = new b2Polygon();
    shape.count = 4;
    shape.vertices[0] = b2TransformPoint(xf, new b2Vec2(-hx, -hy));
    shape.vertices[1] = b2TransformPoint(xf, new b2Vec2(hx, -hy));
    shape.vertices[2] = b2TransformPoint(xf, new b2Vec2(hx, hy));
    shape.vertices[3] = b2TransformPoint(xf, new b2Vec2(-hx, hy));
    shape.normals[0] = b2RotateVector(xf.q, new b2Vec2(0.0, -1.0));
    shape.normals[1] = b2RotateVector(xf.q, new b2Vec2(1.0, 0.0));
    shape.normals[2] = b2RotateVector(xf.q, new b2Vec2(0.0, 1.0));
    shape.normals[3] = b2RotateVector(xf.q, new b2Vec2(-1.0, 0.0));
    shape.radius = 0.0;
    shape.centroid = center;

    return shape;
}

/**
 * @function b2TransformPolygon
 * @summary Transforms a polygon by applying a rigid body transformation.
 * @param {b2Transform} transform - The transformation to apply, consisting of a position vector and rotation.
 * @param {b2Polygon} polygon - The polygon to transform, containing vertices, normals and centroid.
 * @returns {b2Polygon} The transformed polygon with updated vertices, normals and centroid.
 * @description
 * Applies a rigid body transformation to a polygon by:
 * 1. Transforming each vertex using the full transform
 * 2. Rotating each normal vector using only the rotation component
 * 3. Transforming the centroid using the full transform
 */
export function b2TransformPolygon(transform, polygon)
{
    const p = polygon;

    for (let i = 0; i < p.count; ++i)
    {
        p.vertices[i] = b2TransformPoint(transform, p.vertices[i]);
        p.normals[i] = b2RotateVector(transform.q, p.normals[i]);
    }

    p.centroid = b2TransformPoint(transform, p.centroid);

    return p;
}

/**
 * @function b2ComputeCircleMass
 * @summary Computes mass properties for a circle shape.
 * @param {b2Circle} shape - A circle shape object containing radius and center properties
 * @param {number} density - The density of the circle in mass per unit area
 * @returns {b2MassData} An object containing:
 * - mass: The total mass of the circle
 * - center: The center of mass (copied from shape.center)
 * - rotationalInertia: The rotational inertia about the center of mass
 * @description
 * Calculates the mass, center of mass, and rotational inertia for a circle shape
 * with given density. The rotational inertia is computed about the center of mass
 * using the parallel axis theorem when the circle's center is offset from the origin.
 */
export function b2ComputeCircleMass(shape, density)
{
    const rr = shape.radius * shape.radius;

    const massData = new b2MassData();
    massData.mass = density * Math.PI * rr;
    massData.center = shape.center.clone();

    // inertia about the local origin
    massData.rotationalInertia = massData.mass * (0.5 * rr + b2Dot(shape.center, shape.center));

    return massData;
}

/**
 * @function b2ComputeCapsuleMass
 * @description
 * Computes mass properties for a capsule shape, including total mass, center of mass,
 * and rotational inertia. A capsule consists of a rectangle with semicircles at both ends.
 * @param {b2Capsule} shape - A capsule shape defined by two centers (center1, center2) and a radius
 * @param {number} density - The density of the capsule in mass per unit area
 * @returns {b2MassData} An object containing:
 * - mass: The total mass of the capsule
 * - center: A b2Vec2 representing the center of mass
 * - rotationalInertia: The moment of inertia about the center of mass
 */
export function b2ComputeCapsuleMass(shape, density)
{
    const radius = shape.radius;
    const rr = radius * radius;
    const p1 = shape.center1;
    const p2 = shape.center2;
    const length = b2Length(b2Sub(p2, p1));
    const ll = length * length;

    const circleMass = density * Math.PI * rr;
    const boxMass = density * (2.0 * radius * length);

    const massData = new b2MassData();
    massData.mass = circleMass + boxMass;
    massData.center = new b2Vec2(0.5 * (p1.x + p2.x), 0.5 * (p1.y + p2.y));

    // two offset half circles, both halves add up to full circle and each half is offset by half length
    // semi-circle centroid = 4 r / 3 pi
    // Need to apply parallel-axis theorem twice:
    // 1. shift semi-circle centroid to origin
    // 2. shift semi-circle to box end
    // m * ((h + lc)^2 - lc^2) = m * (h^2 + 2 * h * lc)
    // See = https://en.wikipedia.org/wiki/Parallel_axis_theorem
    // I verified this formula by computing the convex hull of a 128 vertex capsule

    // half circle centroid
    const lc = 4.0 * radius / (3.0 * Math.PI);

    // half length of rectangular portion of capsule
    const h = 0.5 * length;

    const circleInertia = circleMass * (0.5 * rr + h * h + 2.0 * h * lc);
    const boxInertia = boxMass * (4.0 * rr + ll) / 12.0;
    massData.rotationalInertia = circleInertia + boxInertia;

    // inertia about the local origin
    massData.rotationalInertia += massData.mass * b2Dot(massData.center, massData.center);

    return massData;
}

/**
 * @function b2ComputePolygonMass
 * @description
 * Computes mass properties for a polygon shape, including mass, center of mass, and rotational inertia.
 * Handles special cases for 1-vertex (circle) and 2-vertex (capsule) polygons.
 * For polygons with 3 or more vertices, calculates properties using triangulation.
 * @param {b2Polygon} shape - The polygon shape containing vertices, normals, count, and radius
 * @param {number} density - The density of the shape in mass per unit area
 * @returns {b2MassData} Object containing:
 * - mass: Total mass of the shape
 * - center: Center of mass as b2Vec2
 * - rotationalInertia: Moment of inertia about the center of mass
 * @throws {Error} Throws assertion error if shape.count is 0 or exceeds B2_MAX_POLYGON_VERTICES
 */
export function b2ComputePolygonMass(shape, density)
{
    console.assert(shape.count > 0);

    if (shape.count == 1)
    {
        const circle = new b2Circle();
        circle.center = shape.vertices[0].clone();
        circle.radius = shape.radius;

        return b2ComputeCircleMass(circle, density);
    }

    if (shape.count == 2)
    {
        const capsule = new b2Capsule();
        capsule.center1 = shape.vertices[0].clone();
        capsule.center2 = shape.vertices[1].clone();
        capsule.radius = shape.radius;

        return b2ComputeCapsuleMass(capsule, density);
    }

    const vertices = new Array(B2_MAX_POLYGON_VERTICES);
    const count = shape.count;
    const radius = shape.radius;
    console.assert(count <= B2_MAX_POLYGON_VERTICES);     // PJB: ragdolls crash at 8, maxPolygonVertices == 8, coincidence?

    if (radius > 0.0)
    {
        // Approximate mass of rounded polygons by pushing out the vertices.
        const sqrt2 = 1.412;

        for (let i = 0; i < count; ++i)
        {
            const j = i == 0 ? count - 1 : i - 1;
            const n1 = shape.normals[j];
            const n2 = shape.normals[i];

            const mid = b2Normalize(b2Add(n1, n2));
            vertices[i] = b2MulAdd(shape.vertices[i], sqrt2 * radius, mid);
        }
    }
    else
    {
        for (let i = 0; i < count; ++i)
        {
            vertices[i] = shape.vertices[i];
        }
    }

    let center = new b2Vec2(0.0, 0.0);
    let area = 0.0;
    let rotationalInertia = 0.0;

    // Get a reference point for forming triangles.
    // Use the first vertex to reduce round-off errors.
    const r = vertices[0];

    const inv3 = 1.0 / 3.0;

    for (let i = 1; i < count - 1; ++i)
    {
        // Triangle edges
        const e1 = b2Sub(vertices[i], r);
        const e2 = b2Sub(vertices[i + 1], r);

        const D = b2Cross(e1, e2);

        const triangleArea = 0.5 * D;
        area += triangleArea;

        // Area weighted centroid, r at origin
        center = b2MulAdd(center, triangleArea * inv3, b2Add(e1, e2));

        const ex1 = e1.x,
            ey1 = e1.y;
        const ex2 = e2.x,
            ey2 = e2.y;

        const intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
        const inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;

        rotationalInertia += (0.25 * inv3 * D) * (intx2 + inty2);
    }

    const massData = new b2MassData();

    // Total mass
    massData.mass = density * area;

    // Center of mass, shift back from origin at r
    console.assert(area > eps);
    const invArea = 1.0 / area;
    center.x *= invArea;
    center.y *= invArea;
    massData.center = b2Add(r, center);

    // Inertia tensor relative to the local origin (point s).
    massData.rotationalInertia = density * rotationalInertia;

    // Shift to center of mass then to original body origin.
    massData.rotationalInertia += massData.mass * (b2Dot(massData.center, massData.center) - b2Dot(center, center));

    return massData;
}

/**
 * @function b2ComputeCircleAABB
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a circle shape after applying a transform.
 * @param {b2Circle} shape - The circle shape containing center point and radius.
 * @param {b2Transform} xf - The transform to be applied, consisting of a position (p) and rotation (q).
 * @returns {b2AABB} An AABB object defined by minimum and maximum points that bound the transformed circle.
 * @description
 * Calculates the AABB by transforming the circle's center point using the provided transform
 * and extending the bounds by the circle's radius in each direction.
 */
export function b2ComputeCircleAABB(shape, xf)
{
    // let p = b2TransformPoint(xf, shape.center);
    const pX = (xf.q.c * shape.center.x - xf.q.s * shape.center.y) + xf.p.x;
    const pY = (xf.q.s * shape.center.x + xf.q.c * shape.center.y) + xf.p.y;
    const r = shape.radius;

    const aabb = new b2AABB(pX - r, pY - r, pX + r, pY + r);

    return aabb;
}

/**
 * @function b2ComputeCapsuleAABB
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a capsule shape.
 * @param {b2Capsule} shape - A capsule shape defined by two centers and a radius.
 * @param {b2Transform} xf - A transform containing position and rotation to be applied to the capsule.
 * @returns {b2AABB} An AABB that encompasses the transformed capsule shape.
 * @description
 * Calculates the minimum and maximum bounds of a capsule after applying a transform.
 * The AABB is computed by transforming the capsule's center points and extending
 * the bounds by the capsule's radius in all directions.
 */
export function b2ComputeCapsuleAABB(shape, xf)
{
    const v1 = b2TransformPoint(xf, shape.center1);
    const v2 = b2TransformPoint(xf, shape.center2);

    const lowerX = Math.min(v1.x, v2.x) - shape.radius;
    const lowerY = Math.min(v1.y, v2.y) - shape.radius;
    const upperX = Math.max(v1.x, v2.x) + shape.radius;
    const upperY = Math.max(v1.y, v2.y) + shape.radius;

    const aabb = new b2AABB(lowerX, lowerY, upperX, upperY);

    return aabb;
}

/**
 * @function b2ComputePolygonAABB
 * @description
 * Computes the Axis-Aligned Bounding Box (AABB) for a polygon shape after applying a transform.
 * The AABB includes the polygon's radius in its calculations.
 * @param {b2Polygon} shape - The polygon shape containing vertices and radius
 * @param {b2Transform} xf - The transform to apply, consisting of position (p) and rotation (q)
 * @returns {b2AABB} An AABB object with lower and upper bounds that encompass the transformed polygon
 */
export function b2ComputePolygonAABB(shape, xf)
{
    // let lower = b2TransformPoint(xf, shape.vertices[0]);
    const sv = shape.vertices[0];
    let lowerX = (xf.q.c * sv.x - xf.q.s * sv.y) + xf.p.x;
    let lowerY = (xf.q.s * sv.x + xf.q.c * sv.y) + xf.p.y;
    let upperX = lowerX,
        upperY = lowerY;

    for (let i = 1; i < shape.count; ++i)
    {
        // let v = b2TransformPoint(xf, shape.vertices[i]);
        const sv = shape.vertices[i];
        const vx = (xf.q.c * sv.x - xf.q.s * sv.y) + xf.p.x;
        const vy = (xf.q.s * sv.x + xf.q.c * sv.y) + xf.p.y;

        // lower = b2Min(lower, v);
        lowerX = Math.min(lowerX, vx);
        lowerY = Math.min(lowerY, vy);

        // upper = b2Max(upper, v);
        upperX = Math.max(upperX, vx);
        upperY = Math.max(upperY, vy);
    }

    const r = shape.radius;

    // lower = b2Sub(lower, r);
    lowerX -= r;
    lowerY -= r;

    // upper = b2Add(upper, r);
    upperX += r;
    upperY += r;

    const aabb = new b2AABB(lowerX, lowerY, upperX, upperY);

    return aabb;
}

/**
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a line segment.
 * @function b2ComputeSegmentAABB
 * @param {b2Segment} shape - A line segment defined by two points (point1 and point2)
 * @param {b2Transform} xf - A transform containing position and rotation to be applied to the segment
 * @returns {b2AABB} An AABB that contains the transformed line segment
 * @description
 * Transforms the segment's endpoints using the provided transform, then creates an AABB
 * that encompasses the transformed segment by finding the minimum and maximum coordinates
 * of the transformed endpoints.
 */
export function b2ComputeSegmentAABB(shape, xf)
{
    const v1 = b2TransformPoint(xf, shape.point1);
    const v2 = b2TransformPoint(xf, shape.point2);

    const lower = b2Min(v1, v2);
    const upper = b2Max(v1, v2);

    const aabb = new b2AABB(lower.x, lower.y, upper.x, upper.y);

    return aabb;
}

/**
 * @summary Determines if a point lies within a circle.
 * @function b2PointInCircle
 * @param {b2Vec2} point - The point to test, represented as a 2D vector.
 * @param {b2Circle} shape - The circle to test against, containing center and radius properties.
 * @returns {boolean} True if the point lies within or on the circle's boundary, false otherwise.
 * @description
 * Tests if a point lies within a circle by comparing the squared distance between
 * the point and circle's center against the circle's squared radius.
 */
export function b2PointInCircle(point, shape)
{
    const center = shape.center;

    return b2DistanceSquared(point, center) <= shape.radius * shape.radius;
}

/**
 * @function b2PointInCapsule
 * @summary Tests if a point lies inside a capsule shape.
 * @param {b2Vec2} point - The point to test
 * @param {b2Capsule} shape - The capsule shape defined by two centers and a radius
 * @returns {boolean} True if the point lies inside or on the capsule, false otherwise
 * @description
 * A capsule is defined by two end centers (center1 and center2) and a radius.
 * The function calculates if the given point lies within the capsule by:
 * 1. Testing if the capsule has zero length (centers are identical)
 * 2. If not, finding the closest point on the line segment between centers
 * 3. Checking if the distance from the test point to the closest point is within the radius
 */
export function b2PointInCapsule(point, shape)
{
    const rr = shape.radius * shape.radius;
    const p1 = shape.center1;
    const p2 = shape.center2;

    const d = b2Sub(p2, p1);
    const dd = b2Dot(d, d);

    if (dd == 0.0)
    {
        // Capsule is really a circle
        return b2DistanceSquared(point, p1) <= rr;
    }

    // Get closest point on capsule segment
    // c = p1 + t * d
    // dot(point - c, d) = 0
    // dot(point - p1 - t * d, d) = 0
    // t = dot(point - p1, d) / dot(d, d)
    let t = b2Dot(b2Sub(point, p1), d) / dd;
    t = b2ClampFloat(t, 0.0, 1.0);
    const c = b2MulAdd(p1, t, d);

    // Is query point within radius around closest point?
    return b2DistanceSquared(point, c) <= rr;
}

/**
 * @function b2PointInPolygon
 * @description
 * Tests if a point lies inside a polygon shape by calculating the minimum distance
 * between the point and the polygon.
 * @param {b2Vec2} point - The point to test
 * @param {b2Polygon} shape - The polygon shape to test against
 * @returns {boolean} True if the point is inside or on the polygon (within shape.radius), false otherwise
 */
export function b2PointInPolygon(point, shape)
{
    const input = new b2DistanceInput();
    input.proxyA = b2MakeProxy(shape.vertices, shape.count, 0.0);
    input.proxyB = b2MakeProxy([ point ], 1, 0.0);
    input.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.useRadii = false;

    const cache = new b2DistanceCache();
    const output = b2ShapeDistance(cache, input, null, 0);

    return output.distance <= shape.radius;
}

const rayPoint = new b2Vec2(0, 0);
const rayNormal = new b2Vec2(0, 1);

/**
 * @function b2RayCastCircle
 * @summary Performs a ray cast against a circle shape.
 * @param {b2RayCastInput} input - The ray cast input parameters containing:
 * - origin: b2Vec2 starting point of the ray
 * - translation: b2Vec2 direction and length of the ray
 * - maxFraction: number maximum intersection distance as a fraction of ray length
 * @param {b2Circle} shape - The circle shape to test against, containing:
 * - center: b2Vec2 position of circle center
 * - radius: number radius of the circle
 * @returns {b2CastOutput} The ray cast results containing:
 * - hit: boolean whether the ray intersects the circle
 * - point: b2Vec2 point of intersection if hit is true
 * - normal: b2Vec2 surface normal at intersection point if hit is true
 * - fraction: number intersection distance as a fraction of ray length if hit is true
 * @description
 * Calculates the intersection point between a ray and a circle shape.
 * Returns early with no hit if the ray length is 0 or if the ray passes outside the circle radius.
 */
export function b2RayCastCircle(input, shape)
{
    console.assert(b2IsValidRay(input));

    const p = shape.center.clone();

    const output = new b2CastOutput(rayNormal, rayPoint);

    // Shift ray so circle center is the origin
    const s = b2Sub(input.origin, p);
    const res = b2GetLengthAndNormalize(input.translation);
    const length = res.length;

    if (length == 0.0)
    {
        // zero length ray
        return output;
    }
    const d = res.normal;

    // Find closest point on ray to origin

    // solve = dot(s + t * d, d) = 0
    const t = -b2Dot(s, d);

    // c is the closest point on the line to the origin
    const c = b2MulAdd(s, t, d);

    const cc = b2Dot(c, c);
    const r = shape.radius;
    const rr = r * r;

    if (cc > rr)
    {
        // closest point is outside the circle
        return output;
    }

    // Pythagoras
    const h = Math.sqrt(rr - cc);

    const fraction = t - h;

    if (fraction < 0.0 || input.maxFraction * length < fraction)
    {
        // outside the range of the ray segment
        return output;
    }

    const hitPoint = b2MulAdd(s, fraction, d);

    output.fraction = fraction / length;
    output.normal = b2Normalize(hitPoint);
    output.point = b2MulAdd(p, shape.radius, output.normal);
    output.hit = true;

    return output;
}

/**
 * @function b2RayCastCapsule
 * @description
 * Performs a ray cast against a capsule shape. A capsule is defined by two centers and a radius.
 * If the capsule length is near zero, it degrades to a circle ray cast.
 * @param {b2RayCastInput} input - Contains ray cast parameters including:
 * - origin: b2Vec2 starting point of the ray
 * - translation: b2Vec2 direction and length of the ray
 * - maxFraction: number maximum intersection distance as a fraction of ray length
 * @param {b2Capsule} shape - The capsule to test against, containing:
 * - center1: b2Vec2 first endpoint of capsule centerline
 * - center2: b2Vec2 second endpoint of capsule centerline
 * - radius: number radius of the capsule
 * @returns {b2CastOutput} Contains the ray cast results:
 * - fraction: number intersection distance as a fraction of ray length
 * - point: b2Vec2 point of intersection
 * - normal: b2Vec2 surface normal at intersection
 * - hit: boolean whether an intersection occurred
 */
export function b2RayCastCapsule(input, shape)
{
    console.assert(b2IsValidRay(input));

    const output = new b2CastOutput(rayNormal, rayPoint);

    const v1 = shape.center1;
    const v2 = shape.center2;

    const e = b2Sub(v2, v1);

    const res = b2GetLengthAndNormalize(e);
    const capsuleLength = res.length;
    const a = res.normal;

    if (capsuleLength < eps)
    {
        // Capsule is really a circle
        const circle = new b2Circle();
        circle.center = v1;
        circle.radius = shape.radius;

        return b2RayCastCircle(input, circle);
    }

    const p1 = input.origin;
    const d = input.translation;

    // Ray from capsule start to ray start
    const q = b2Sub(p1, v1);
    const qa = b2Dot(q, a);

    // Vector to ray start that is perpendicular to capsule axis
    const qp = b2MulAdd(q, -qa, a);

    const radius = shape.radius;

    // Does the ray start within the infinite length capsule?
    if (b2Dot(qp, qp) < radius * radius)
    {
        if (qa < 0.0)
        {
            // start point behind capsule segment
            const circle = new b2Circle();
            circle.center = v1;
            circle.radius = shape.radius;

            return b2RayCastCircle(input, circle);
        }

        if (qa > 1.0)
        {
            // start point ahead of capsule segment
            const circle = new b2Circle();
            circle.center = v2;
            circle.radius = shape.radius;

            return b2RayCastCircle(input, circle);
        }

        // ray starts inside capsule -> no hit
        return output;
    }

    // Perpendicular to capsule axis, pointing right
    let n = new b2Vec2(a.y, -a.x);

    const res0 = b2GetLengthAndNormalize(d);
    const rayLength = res0.length;
    const u = res0.normal;

    // Intersect ray with infinite length capsule
    // v1 + radius * n + s1 * a = p1 + s2 * u
    // v1 - radius * n + s1 * a = p1 + s2 * u

    // s1 * a - s2 * u = b
    // b = q - radius * ap
    // or
    // b = q + radius * ap

    // Cramer's rule [a -u]
    const den = -a.x * u.y + u.x * a.y;

    if (-eps < den && den < eps)
    {
        // Ray is parallel to capsule and outside infinite length capsule
        return output;
    }

    const b1 = b2MulSub(q, radius, n);
    const b2 = b2MulAdd(q, radius, n);

    const invDen = 1.0 / den;

    // Cramer's rule [a b1]
    const s21 = (a.x * b1.y - b1.x * a.y) * invDen;

    // Cramer's rule [a b2]
    const s22 = (a.x * b2.y - b2.x * a.y) * invDen;

    let s2, b;

    if (s21 < s22)
    {
        s2 = s21;
        b = b1;
    }
    else
    {
        s2 = s22;
        b = b2;
        n = b2Neg(n);
    }

    if (s2 < 0.0 || input.maxFraction * rayLength < s2)
    {
        return output;
    }

    // Cramer's rule [b -u]
    const s1 = (-b.x * u.y + u.x * b.y) * invDen;

    if (s1 < 0.0)
    {
        // ray passes behind capsule segment
        const circle = new b2Circle();
        circle.center = v1;
        circle.radius = shape.radius;

        return b2RayCastCircle(input, circle);
    }
    else if (capsuleLength < s1)
    {
        // ray passes ahead of capsule segment
        const circle = new b2Circle();
        circle.center = v2;
        circle.radius = shape.radius;

        return b2RayCastCircle(input, circle);
    }
    else
    {
        // ray hits capsule side
        output.fraction = s2 / rayLength;
        output.point = b2Add(b2Lerp(v1, v2, s1 / capsuleLength), b2MulSV(shape.radius, n));
        output.normal = n;
        output.hit = true;

        return output;
    }
}

/**
 * @function b2RayCastSegment
 * @description
 * Performs a ray cast against a line segment, determining if and where the ray intersects the segment.
 * For one-sided segments, intersections are only detected from one side based on a cross product test.
 * @param {b2RayCastInput} input - Contains origin point, translation vector, and max fraction for the ray
 * @param {b2Segment} shape - The line segment defined by two points (point1 and point2)
 * @param {boolean} oneSided - Whether to treat the segment as one-sided
 * @returns {b2CastOutput} Contains hit status, intersection point, normal, and fraction along the ray
 */
export function b2RayCastSegment(input, shape, oneSided)
{
    if (oneSided)
    {
        // Skip left-side collision
        const offset = b2Cross(b2Sub(input.origin, shape.point1), b2Sub(shape.point2, shape.point1));

        if (offset < 0.0)
        {
            const output = new b2CastOutput(rayNormal, rayPoint);

            return output;
        }
    }

    // Put the ray into the edge's frame of reference.
    const p1 = input.origin;
    const d = input.translation;

    const v1 = shape.point1;
    const v2 = shape.point2;
    const e = b2Sub(v2, v1);

    const output = new b2CastOutput(rayNormal, rayPoint);

    const res = b2GetLengthAndNormalize(e);
    const length = res.length;
    const eUnit = res.normal;

    if (length == 0.0)
    {
        return output;
    }

    // Normal points to the right, looking from v1 towards v2
    let normal = b2RightPerp(eUnit);

    // Intersect ray with infinite segment using normal
    // Similar to intersecting a ray with an infinite plane
    // p = p1 + t * d
    // dot(normal, p - v1) = 0
    // dot(normal, p1 - v1) + t * dot(normal, d) = 0
    const numerator = b2Dot(normal, b2Sub(v1, p1));
    const denominator = b2Dot(normal, d);

    if (denominator == 0.0)
    {
        // parallel
        return output;
    }

    const t = numerator / denominator;

    if (t < 0.0 || input.maxFraction < t)
    {
        // out of ray range
        return output;
    }

    // Intersection point on infinite segment
    const p = b2MulAdd(p1, t, d);

    // Compute position of p along segment
    // p = v1 + s * e
    // s = dot(p - v1, e) / dot(e, e)

    const s = b2Dot(b2Sub(p, v1), eUnit);

    if (s < 0.0 || length < s)
    {
        // out of segment range
        return output;
    }

    if (numerator > 0.0)
    {
        normal = b2Neg(normal);
    }

    output.fraction = t;
    output.point = b2MulAdd(p1, t, d);
    output.normal = normal;
    output.hit = true;

    return output;
}

/**
 * @function b2RayCastPolygon
 * @description
 * Performs a ray cast against a polygon shape, detecting intersection points and normals.
 * For non-zero radius polygons, converts the ray cast into a shape cast operation.
 * @param {b2RayCastInput} input - Contains origin point, translation vector, and max fraction
 * @param {b2Polygon} shape - The polygon to test against, containing vertices, normals, count and radius
 * @returns {b2CastOutput} Contains:
 * - hit: boolean indicating if intersection occurred
 * - point: intersection point (if hit is true)
 * - normal: surface normal at intersection (if hit is true)
 * - fraction: fraction of translation where intersection occurred (if hit is true)
 * @throws {Error} Throws assertion error if input ray is invalid
 */
export function b2RayCastPolygon(input, shape)
{
    console.assert(b2IsValidRay(input));

    if (shape.radius === 0.0)
    {
        // Put the ray into the polygon's frame of reference.
        const p1 = input.origin;
        const d = input.translation;

        let lower = 0.0,
            upper = input.maxFraction;

        let index = -1;

        const output = new b2CastOutput(rayNormal, rayPoint);

        for (let i = 0; i < shape.count; ++i)
        {
            // p = p1 + a * d
            // dot(normal, p - v) = 0
            // dot(normal, p1 - v) + a * dot(normal, d) = 0
            const numerator = b2Dot(shape.normals[i], b2Sub(shape.vertices[i], p1));
            const denominator = b2Dot(shape.normals[i], d);

            if (denominator === 0.0)
            {
                if (numerator < 0.0)
                {
                    return output;
                }
            }
            else
            {
                // Note = we want this predicate without division:
                // lower < numerator / denominator, where denominator < 0
                // Since denominator < 0, we have to flip the inequality:
                // lower < numerator / denominator <==> denominator * lower > numerator.
                if (denominator < 0.0 && numerator < lower * denominator)
                {
                    // Increase lower.
                    // The segment enters this half-space.
                    lower = numerator / denominator;
                    index = i;
                }
                else if (denominator > 0.0 && numerator < upper * denominator)
                {
                    // Decrease upper.
                    // The segment exits this half-space.
                    upper = numerator / denominator;
                }
            }

            if (upper < lower)
            {
                return output;
            }
        }

        console.assert(0.0 <= lower && lower <= input.maxFraction);

        if (index >= 0)
        {
            output.fraction = lower;
            output.normal = shape.normals[index];
            output.point = b2MulAdd(p1, lower, d);
            output.hit = true;
        }

        return output;
    }

    // TODO_ERIN this is not working for ray vs box (zero radii)
    const castInput = new b2ShapeCastPairInput();
    castInput.proxyA = b2MakeProxy(shape.vertices, shape.count, shape.radius);
    castInput.proxyB = b2MakeProxy([ input.origin ], 1, 0.0);
    castInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    castInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    castInput.translationB = input.translation;
    castInput.maxFraction = input.maxFraction;

    return b2ShapeCast(castInput);
}

/**
 * @function b2ShapeCastCircle
 * @description
 * Performs shape casting between a circle and a set of points with radius.
 * @param {b2ShapeCastInput} input - Contains points array, count, radius, translation and maxFraction
 * @param {b2Circle} shape - Circle shape with center point and radius
 * @returns {b2CastOutput} The shape cast result containing intersection details
 */
export function b2ShapeCastCircle(input, shape)
{
    const pairInput = new b2ShapeCastPairInput();
    pairInput.proxyA = b2MakeProxy([ shape.center.clone() ], 1, shape.radius);
    pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
    pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.translationB = input.translation;
    pairInput.maxFraction = input.maxFraction;

    const output = b2ShapeCast(pairInput);

    return output;
}

/**
 * @function b2ShapeCastCapsule
 * @description
 * Performs shape casting for a capsule shape against a set of points.
 * @param {b2ShapeCastInput} input - Contains the target points, count, radius,
 * translation, and maxFraction for the shape cast
 * @param {b2Capsule} shape - The capsule shape defined by two centers and a radius
 * @returns {b2CastOutput} The result of the shape cast operation
 */
export function b2ShapeCastCapsule(input, shape)
{
    const pairInput = new b2ShapeCastPairInput();
    pairInput.proxyA = b2MakeProxy([ shape.center1, shape.center2 ], 2, shape.radius);
    pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
    pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.translationB = input.translation;
    pairInput.maxFraction = input.maxFraction;

    const output = b2ShapeCast(pairInput);

    return output;
}

/**
 * @function b2ShapeCastSegment
 * @param {b2ShapeCastInput} input - Contains shape points, count, radius, translation, and maxFraction
 * @param {b2Segment} shape - A segment defined by two points (point1 and point2)
 * @returns {b2CastOutput} The result of the shape cast operation
 * @description
 * Performs a shape cast operation between a segment and another shape. The function creates
 * proxies for both shapes, sets up their initial transforms, and performs the cast operation
 * using the specified translation and maximum fraction.
 */
export function b2ShapeCastSegment(input, shape)
{
    const pairInput = new b2ShapeCastPairInput();
    pairInput.proxyA = b2MakeProxy([ shape.point1, shape.point2 ], 2, 0.0);
    pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
    pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.translationB = input.translation;
    pairInput.maxFraction = input.maxFraction;

    const output = b2ShapeCast(pairInput);

    return output;
}

/**
 * @function b2ShapeCastPolygon
 * @description
 * Performs shape casting between a polygon shape and a set of points, checking for collisions
 * along a translation path.
 * @param {b2ShapeCastInput} input - Contains the points, count, radius, translation, and maxFraction for the cast
 * @param {b2Polygon} shape - The polygon shape to test against, containing vertices, count, and radius
 * @returns {b2CastOutput} The result of the shape cast operation
 */
export function b2ShapeCastPolygon(input, shape)
{
    const pairInput = new b2ShapeCastPairInput();
    pairInput.proxyA = b2MakeProxy(shape.vertices, shape.count, shape.radius);
    pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
    pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    pairInput.translationB = input.translation;
    pairInput.maxFraction = input.maxFraction;

    const output = b2ShapeCast(pairInput);

    return output;
}
