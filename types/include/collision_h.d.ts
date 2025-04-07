export const B2_MAX_POLYGON_VERTICES: 8;
export const B2_DEFAULT_CATEGORY_BITS: 1;
export const B2_DEFAULT_MASK_BITS: 4294967295;
/**
 * @class b2RayCastInput
 * @summary Low level ray cast input data
 * @property {b2Vec2} origin - Start point of the ray cast
 * @property {b2Vec2} translation - Translation of the ray cast
 * @property {number} maxFraction - The maximum fraction of the translation to consider, typically 1
 */
export class b2RayCastInput {
    origin: any;
    translation: any;
    maxFraction: number;
}
/**
 * @class b2ShapeCastInput
 * @summary Low level shape cast input in generic form. This allows casting an arbitrary point cloud wrap with a radius. For example, a circle is a single point with a non-zero radius. A capsule is two points with a non-zero radius. A box is four points with a zero radius.
 * @property {b2Vec2[]} points - A point cloud to cast
 * @property {number} count - The number of points
 * @property {number} radius - The radius around the point cloud
 * @property {b2Vec2} translation - The translation of the shape cast
 * @property {number} maxFraction - The maximum fraction of the translation to consider, typically 1
 */
export class b2ShapeCastInput {
    points: any[];
    count: number;
    radius: number;
    translation: any;
    maxFraction: number;
}
/**
 * @class b2CastOutput
 * @summary Low level ray cast or shape-cast output data
 * @property {b2Vec2} normal - The surface normal at the hit point
 * @property {b2Vec2} point - The surface hit point
 * @property {number} fraction - The fraction of the input translation at collision
 * @property {number} iterations - The number of iterations used
 * @property {boolean} hit - Did the cast hit?
 */
export class b2CastOutput {
    constructor(normal?: any, point?: any);
    normal: any;
    point: any;
    fraction: number;
    iterations: number;
    hit: boolean;
}
/**
 * @class b2MassData
 * @summary This holds the mass data computed for a shape.
 * @property {number} mass - The mass of the shape, usually in kilograms.
 * @property {b2Vec2} center - The position of the shape's centroid relative to the shape's origin.
 * @property {number} rotationalInertia - The rotational inertia of the shape about the local origin.
 */
export class b2MassData {
    mass: number;
    center: any;
    rotationalInertia: number;
}
/**
 * @class b2Circle
 * @summary A solid circle
 * @property {b2Vec2} center - The local center
 * @property {number} radius - The radius
 */
export class b2Circle {
    constructor(center?: any, radius?: number);
    center: any;
    radius: number;
}
/**
 * @class b2Capsule
 * @summary A solid capsule can be viewed as two semicircles connected by a rectangle.
 * @property {b2Vec2} center1 - Local center of the first semicircle
 * @property {b2Vec2} center2 - Local center of the second semicircle
 * @property {number} radius - The radius of the semicircles
 */
export class b2Capsule {
    center1: any;
    center2: any;
    radius: number;
}
/**
 * @class b2Polygon
 * @summary A solid convex polygon. It is assumed that the interior of the polygon is to the left of each edge. Polygons have a maximum number of vertices equal to B2_MAX_POLYGON_VERTICES. In most cases you should not need many vertices for a convex polygon.
 * @warning DO NOT fill this out manually, instead use a helper function like b2MakePolygon or b2MakeBox.
 * @property {b2Vec2[]} vertices - The polygon vertices
 * @property {b2Vec2[]} normals - The outward normal vectors of the polygon sides
 * @property {b2Vec2} centroid - The centroid of the polygon
 * @property {number} radius - The external radius for rounded polygons
 * @property {number} count - The number of polygon vertices
 */
export class b2Polygon {
    constructor(vertices: any);
    vertices: any;
    normals: any;
    centroid: any;
    radius: number;
    count: number;
}
/**
 * @class b2Segment
 * @summary A line segment with two-sided collision
 * @property {b2Vec2} point1 - The first point
 * @property {b2Vec2} point2 - The second point
 */
export class b2Segment {
    constructor(point1?: any, point2?: any);
    point1: any;
    point2: any;
}
export class b2ChainSegment {
    ghost1: any;
    segment: any;
    ghost2: any;
    chainId: number;
}
/**
 * @class b2Hull
 * @summary A convex hull. Used to create convex polygons.
 * @warning Do not modify these values directly, instead use b2ComputeHull()
 * @property {b2Vec2[]} points - The final points of the hull
 * @property {number} count - The number of points
 */
export class b2Hull {
    points: any[];
    count: number;
}
/**
 * @class b2SegmentDistanceResult
 * @summary Result of computing the distance between two line segments
 * @property {b2Vec2} closest1 - The closest point on the first segment
 * @property {b2Vec2} closest2 - The closest point on the second segment
 * @property {number} fraction1 - The barycentric coordinate on the first segment
 * @property {number} fraction2 - The barycentric coordinate on the second segment
 * @property {number} distanceSquared - The squared distance between the closest points
 */
export class b2SegmentDistanceResult {
    closest1: any;
    closest2: any;
    fraction1: number;
    fraction2: number;
    distanceSquared: number;
}
/**
 * @class b2DistanceProxy
 * @summary A distance proxy used by the GJK algorithm. It encapsulates any shape.
 * @property {b2Vec2[]} points - The point cloud
 * @property {number} count - The number of points
 * @property {number} radius - The external radius of the point cloud
 */
export class b2DistanceProxy {
    constructor(points?: any[], count?: any, radius?: number);
    points: any[];
    count: any;
    radius: number;
    clone(): b2DistanceProxy;
}
/**
 * @class b2DistanceCache
 * @summary Used to warm start b2Distance. Set count to zero on first call or use zero initialization.
 * @property {number} count - The number of stored simplex points
 * @property {number[]} indexA - The cached simplex indices on shape A
 * @property {number[]} indexB - The cached simplex indices on shape B
 */
export class b2DistanceCache {
    count: number;
    indexA: number[];
    indexB: number[];
    clone(): b2DistanceCache;
}
/**
 * @class b2DistanceInput
 * @summary Input for b2ShapeDistance
 * @property {b2DistanceProxy} proxyA - The proxy for shape A
 * @property {b2DistanceProxy} proxyB - The proxy for shape B
 * @property {b2Transform} transformA - The world transform for shape A
 * @property {b2Transform} transformB - The world transform for shape B
 * @property {boolean} useRadii - Should the proxy radius be considered?
 */
export class b2DistanceInput {
    proxyA: b2DistanceProxy;
    proxyB: b2DistanceProxy;
    transformA: b2Transform;
    transformB: b2Transform;
    useRadii: boolean;
}
/**
 * @class b2DistanceOutput
 * @summary Output for b2ShapeDistance
 * @property {b2Vec2} pointA - Closest point on shapeA
 * @property {b2Vec2} pointB - Closest point on shapeB
 * @property {number} distance - The final distance, zero if overlapped
 * @property {number} iterations - Number of GJK iterations used
 * @property {number} simplexCount - The number of simplexes stored in the simplex array
 */
export class b2DistanceOutput {
    pointA: b2Vec2;
    pointB: b2Vec2;
    distance: number;
    iterations: number;
    simplexCount: number;
}
/**
 * @class b2SimplexVertex
 * @summary Simplex vertex for debugging the GJK algorithm
 * @property {b2Vec2} wA - Support point in proxyA
 * @property {b2Vec2} wB - Support point in proxyB
 * @property {b2Vec2} w - wB - wA
 * @property {number} a - Barycentric coordinate for closest point
 * @property {number} indexA - wA index
 * @property {number} indexB - wB index
 */
export class b2SimplexVertex {
    wA: any;
    wB: any;
    w: any;
    a: number;
    indexA: number;
    indexB: number;
    clone(): b2SimplexVertex;
}
/**
 * @class b2Simplex
 * @summary Simplex from the GJK algorithm
 * @property {b2SimplexVertex} v1 - Simplex vertex
 * @property {b2SimplexVertex} v2 - Simplex vertex
 * @property {b2SimplexVertex} v3 - Simplex vertex
 * @property {number} count - Number of valid vertices
 */
export class b2Simplex {
    v1: b2SimplexVertex;
    v2: b2SimplexVertex;
    v3: b2SimplexVertex;
    count: number;
}
/**
 * @class b2ShapeCastPairInput
 * @summary Input parameters for b2ShapeCast
 * @property {b2DistanceProxy} proxyA The proxy for shape A
 * @property {b2DistanceProxy} proxyB The proxy for shape B
 * @property {b2Transform} transformA The world transform for shape A
 * @property {b2Transform} transformB The world transform for shape B
 * @property {b2Vec2} translationB The translation of shape B
 * @property {number} maxFraction The fraction of the translation to consider, typically 1
 */
export class b2ShapeCastPairInput {
    proxyA: b2DistanceProxy;
    proxyB: b2DistanceProxy;
    transformA: b2Transform;
    transformB: b2Transform;
    translationB: b2Vec2;
    maxFraction: number;
}
/**
 * @class b2Sweep
 * @summary Describes the motion of a body/shape for TOI computation. Shapes are defined with respect to the body origin, which may not coincide with the center of mass. However, to support dynamics we must interpolate the center of mass position.
 * @property {b2Vec2} localCenter - Local center of mass position
 * @property {b2Vec2} c1 - Starting center of mass world position
 * @property {b2Vec2} c2 - Ending center of mass world position
 * @property {b2Rot} q1 - Starting world rotation
 * @property {b2Rot} q2 - Ending world rotation
 */
export class b2Sweep {
    constructor(c?: any, v1?: any, v2?: any, r1?: any, r2?: any);
    localCenter: any;
    c1: any;
    c2: any;
    q1: any;
    q2: any;
    clone(): b2Sweep;
}
/**
 * @class b2TOIInput
 * @summary Input parameters for b2TimeOfImpact
 * @property {b2DistanceProxy} proxyA - The proxy for shape A
 * @property {b2DistanceProxy} proxyB - The proxy for shape B
 * @property {b2Sweep} sweepA - The movement of shape A
 * @property {b2Sweep} sweepB - The movement of shape B
 * @property {number} tMax - Defines the sweep interval [0, tMax]
 */
export class b2TOIInput {
    constructor(proxyA?: any, proxyB?: any, sweepA?: any, sweepB?: any, tMax?: number);
    proxyA: any;
    proxyB: any;
    sweepA: any;
    sweepB: any;
    tMax: number;
    clone(): b2TOIInput;
}
export namespace b2TOIState {
    let b2_toiStateUnknown: number;
    let b2_toiStateFailed: number;
    let b2_toiStateOverlapped: number;
    let b2_toiStateHit: number;
    let b2_toiStateSeparated: number;
}
/**
 * @class b2TOIOutput
 * @summary Output parameters for b2TimeOfImpact
 * @property {b2TOIState} state - The type of result
 * @property {number} t - The time of the collision
 */
export class b2TOIOutput {
    state: number;
    t: number;
}
/**
 * @class b2ManifoldPoint
 * @summary A manifold point is a contact point belonging to a contact manifold. It holds details related to the geometry and dynamics of the contact points.
 * @property {b2Vec2} point - Location of the contact point in world space. Subject to precision loss at large coordinates. Should only be used for debugging.
 * @property {b2Vec2} anchorA - Location of the contact point relative to bodyA's origin in world space. When used internally to the Box2D solver, this is relative to the center of mass.
 * @property {b2Vec2} anchorB - Location of the contact point relative to bodyB's origin in world space. When used internally to the Box2D solver, this is relative to the center of mass.
 * @property {number} separation - The separation of the contact point, negative if penetrating
 * @property {number} normalImpulse - The impulse along the manifold normal vector
 * @property {number} tangentImpulse - The friction impulse
 * @property {number} maxNormalImpulse - The maximum normal impulse applied during sub-stepping
 * @property {number} normalVelocity - Relative normal velocity pre-solve. Used for hit events. If the normal impulse is zero then there was no hit. Negative means shapes are approaching.
 * @property {number} id - Uniquely identifies a contact point between two shapes
 * @property {boolean} persisted - Did this contact point exist the previous step?
 */
export class b2ManifoldPoint {
    pointX: number;
    pointY: number;
    anchorAX: number;
    anchorAY: number;
    anchorBX: number;
    anchorBY: number;
    separation: number;
    normalImpulse: number;
    tangentImpulse: number;
    maxNormalImpulse: number;
    normalVelocity: number;
    id: number;
    persisted: boolean;
    clone(): b2ManifoldPoint;
    clear(): this;
    copyTo(mp: any): void;
}
/**
 * @class b2Manifold
 * @summary A contact manifold describes the contact points between colliding shapes
 * @property {b2ManifoldPoint[]} points - The manifold points, up to two are possible in 2D
 * @property {b2Vec2} normal - The unit normal vector in world space, points from shape A to bodyB
 * @property {number} pointCount - The number of contacts points, will be 0, 1, or 2
 */
export class b2Manifold {
    constructor(p1?: b2ManifoldPoint, p2?: b2ManifoldPoint);
    points: b2ManifoldPoint[];
    normalX: number;
    normalY: number;
    pointCount: number;
    clone(): b2Manifold;
    clear(): this;
    copyTo(manifold: any): void;
}
/**
 * @class b2TreeNode
 * @summary A node in the dynamic tree. This is private data placed here for performance reasons.
 * @property {b2AABB} aabb - The node bounding box
 * @property {number} categoryBits - Category bits for collision filtering
 * @property {number} parent - The node parent index (allocated node)
 * @property {number} next - The node freelist next index (free node)
 * @property {number} child1 - Child 1 index (internal node)
 * @property {number} child2 - Child 2 index (internal node)
 * @property {number} userData - User data (leaf node)
 * @property {number} height - Node height
 * @property {number} flags - Node flags
 */
export class b2TreeNode {
    aabb: any;
    categoryBits: number;
    parent_next: number;
    child1: number;
    child2: number;
    userData: number;
    height: number;
    enlarged: boolean;
}
/**
 * These are performance results returned by dynamic tree queries.
 */
export type b2TreeStats = {
    /**
     * - Number of internal nodes visited during the query.
     */
    nodeVisits: number;
    /**
     * - Number of leaf nodes visited during the query.
     */
    leafVisits: number;
};
import { b2Transform } from './math_functions_h.js';
import { b2Vec2 } from './math_functions_h.js';
