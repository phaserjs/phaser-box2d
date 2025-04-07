/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Rot, b2Transform, b2Vec2 } from './math_functions_h.js';

import { B2_NULL_INDEX } from '../core_c.js';

// Constants
export const B2_MAX_POLYGON_VERTICES = 8;
export const B2_DEFAULT_CATEGORY_BITS = 0x00000001;
export const B2_DEFAULT_MASK_BITS = 0xFFFFFFFF;

// Classes

/**
 * @class b2RayCastInput
 * @summary Low level ray cast input data
 * @property {b2Vec2} origin - Start point of the ray cast
 * @property {b2Vec2} translation - Translation of the ray cast
 * @property {number} maxFraction - The maximum fraction of the translation to consider, typically 1
 */
export class b2RayCastInput
{
    constructor()
    {
        this.origin = null;   // new b2Vec2(0,0);
        this.translation = null;   // new b2Vec2(0,0);
        this.maxFraction = 0;
    }
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
export class b2ShapeCastInput
{
    constructor()
    {
        this.points = [];   // Array(B2_MAX_POLYGON_VERTICES).fill().map(() => new b2Vec2(0, 0));
        this.count = 0;
        this.radius = 0;
        this.translation = null;   // new b2Vec2(0,0);
        this.maxFraction = 0;
    }
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
export class b2CastOutput
{
    constructor(normal = null, point = null)
    {
        this.normal = normal;   // new b2Vec2(0,0);
        this.point = point;   // new b2Vec2(0,0);
        this.fraction = 0;
        this.iterations = 0;
        this.hit = false;
    }
}

/**
 * @class b2MassData
 * @summary This holds the mass data computed for a shape.
 * @property {number} mass - The mass of the shape, usually in kilograms.
 * @property {b2Vec2} center - The position of the shape's centroid relative to the shape's origin.
 * @property {number} rotationalInertia - The rotational inertia of the shape about the local origin.
 */
export class b2MassData
{
    constructor()
    {
        this.mass = 0;
        this.center = null;   // new b2Vec2(0,0);
        this.rotationalInertia = 0;
    }
}

/**
 * @class b2Circle
 * @summary A solid circle
 * @property {b2Vec2} center - The local center
 * @property {number} radius - The radius
 */
export class b2Circle
{
    constructor(center = null, radius = 0)
    {
        this.center = center;

        if (!this.center)
        {
            this.center = new b2Vec2(0,0);
        }

        this.radius = radius;
    }
}

/**
 * @class b2Capsule
 * @summary A solid capsule can be viewed as two semicircles connected by a rectangle.
 * @property {b2Vec2} center1 - Local center of the first semicircle
 * @property {b2Vec2} center2 - Local center of the second semicircle
 * @property {number} radius - The radius of the semicircles
 */
export class b2Capsule
{
    constructor()
    {
        this.center1 = null;
        this.center2 = null;
        this.radius = 0;
    }
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
export class b2Polygon
{
    constructor(vertices)
    {
        if (vertices > 0)
        {
            this.vertices = new Array(vertices).fill().map(() => new b2Vec2(0,0));
            this.normals = new Array(vertices).fill().map(() => new b2Vec2(0,0));
        }
        else
        {
            this.vertices = [];
            this.normals = [];
        }

        this.centroid = null;
        this.radius = 0;
        this.count = 0;
    }
}

/**
 * @class b2Segment
 * @summary A line segment with two-sided collision
 * @property {b2Vec2} point1 - The first point
 * @property {b2Vec2} point2 - The second point
 */
export class b2Segment
{
    constructor(point1 = null, point2 = null)
    {
        this.point1 = point1;
        this.point2 = point2;
    }
}

export class b2ChainSegment
{
    constructor()
    {
        this.ghost1 = null; // new b2Vec2(0,0);
        this.segment = null;    // new b2Segment();
        this.ghost2 = null; // new b2Vec2(0,0);
        this.chainId = 0;
    }
}

/**
 * @class b2Hull
 * @summary A convex hull. Used to create convex polygons.
 * @warning Do not modify these values directly, instead use b2ComputeHull()
 * @property {b2Vec2[]} points - The final points of the hull
 * @property {number} count - The number of points
 */
export class b2Hull
{
    constructor()
    {
        this.points = [];   // new Array(B2_MAX_POLYGON_VERTICES).fill().map(() => new b2Vec2(0,0));
        this.count = 0;
    }
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
export class b2SegmentDistanceResult
{
    constructor()
    {
        this.closest1 = null;   // new b2Vec2(0,0);
        this.closest2 = null;   // new b2Vec2(0,0);
        this.fraction1 = 0;
        this.fraction2 = 0;
        this.distanceSquared = 0;
    }
}

/**
 * @class b2DistanceProxy
 * @summary A distance proxy used by the GJK algorithm. It encapsulates any shape.
 * @property {b2Vec2[]} points - The point cloud
 * @property {number} count - The number of points
 * @property {number} radius - The external radius of the point cloud
 */
export class b2DistanceProxy
{
    constructor(points = [], count = null, radius = 0)
    {
        this.points = points;
        this.count = count;
        this.radius = radius;
    }

    clone()
    {
        const points = [];

        for (let i = 0, l = this.points.length; i < l; i++)
        {
            points.push(this.points[i]);
        }

        return new b2DistanceProxy(points, this.count, this.radius);
    }
}

/**
 * @class b2DistanceCache
 * @summary Used to warm start b2Distance. Set count to zero on first call or use zero initialization.
 * @property {number} count - The number of stored simplex points
 * @property {number[]} indexA - The cached simplex indices on shape A
 * @property {number[]} indexB - The cached simplex indices on shape B
 */
export class b2DistanceCache
{
    constructor()
    {
        this.count = 0;
        this.indexA = [ 0,0,0 ];
        this.indexB = [ 0,0,0 ];
        
    }
    clone()
    {
        const cache = new b2DistanceCache();
        cache.count = this.count;
        cache.indexA = [ ...this.indexA ];
        cache.indexB = [ ...this.indexB ];

        return cache;
    }
}

// export const b2_emptyDistanceCache = new b2DistanceCache();

/**
 * @class b2DistanceInput
 * @summary Input for b2ShapeDistance
 * @property {b2DistanceProxy} proxyA - The proxy for shape A
 * @property {b2DistanceProxy} proxyB - The proxy for shape B
 * @property {b2Transform} transformA - The world transform for shape A
 * @property {b2Transform} transformB - The world transform for shape B
 * @property {boolean} useRadii - Should the proxy radius be considered?
 */
export class b2DistanceInput
{
    constructor()
    {
        this.proxyA = new b2DistanceProxy();
        this.proxyB = new b2DistanceProxy();
        this.transformA = new b2Transform(new b2Vec2(0,0), new b2Rot(0,0));
        this.transformB = new b2Transform(new b2Vec2(0,0), new b2Rot(0,0));
        this.useRadii = false;
    }
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
export class b2DistanceOutput
{
    constructor()
    {
        this.pointA = new b2Vec2(0,0);
        this.pointB = new b2Vec2(0,0);
        this.distance = 0;
        this.iterations = 0;
        this.simplexCount = 0;
    }
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
export class b2SimplexVertex
{
    constructor()
    {
        this.wA = null;   // new b2Vec2(0,0);
        this.wB = null;   // new b2Vec2(0,0);
        this.w = null;   // new b2Vec2(0,0);
        this.a = 0;
        this.indexA = 0;
        this.indexB = 0;
    }

    clone()
    {
        const sv = new b2SimplexVertex();
        sv.wA = this.wA.clone();
        sv.wB = this.wB.clone();
        sv.w = this.w.clone();
        sv.a = this.a;
        sv.indexA = this.indexA;
        sv.indexB = this.indexB;

        return sv;
    }
}

/**
 * @class b2Simplex
 * @summary Simplex from the GJK algorithm
 * @property {b2SimplexVertex} v1 - Simplex vertex
 * @property {b2SimplexVertex} v2 - Simplex vertex
 * @property {b2SimplexVertex} v3 - Simplex vertex
 * @property {number} count - Number of valid vertices
 */
export class b2Simplex
{
    constructor()
    {
        this.v1 = new b2SimplexVertex();
        this.v2 = new b2SimplexVertex();
        this.v3 = new b2SimplexVertex();
        this.count = 0;
    }
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
export class b2ShapeCastPairInput
{
    constructor()
    {
        this.proxyA = new b2DistanceProxy();
        this.proxyB = new b2DistanceProxy();
        this.transformA = new b2Transform(new b2Vec2(0,0), new b2Rot(0,0));
        this.transformB = new b2Transform(new b2Vec2(0,0), new b2Rot(0,0));
        this.translationB = new b2Vec2(0,0);
        this.maxFraction = 0;
    }
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
export class b2Sweep
{
    constructor(c = null, v1 = null, v2 = null, r1 = null, r2 = null)
    {
        this.localCenter = c;
        this.c1 = v1;
        this.c2 = v2;
        this.q1 = r1;
        this.q2 = r2;
    }

    clone()
    {
        return new b2Sweep(this.localCenter.clone(), this.c1.clone(), this.c2.clone(), this.q1.clone(), this.q2.clone());
    }
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
export class b2TOIInput
{
    constructor(proxyA = null, proxyB = null, sweepA = null, sweepB = null, tMax = 0)
    {
        this.proxyA = proxyA; // new b2DistanceProxy();
        this.proxyB = proxyB; // new b2DistanceProxy();
        this.sweepA = sweepA; // new b2Sweep();
        this.sweepB = sweepB; // new b2Sweep();
        this.tMax = tMax;
    }

    clone()
    {
        return new b2TOIInput(this.proxyA.clone(), this.proxyB.clone(), this.sweepA.clone(), this.sweepB.clone(), this.tMax);
    }
}

export const b2TOIState = {
    b2_toiStateUnknown: 0,
    b2_toiStateFailed: 1,
    b2_toiStateOverlapped: 2,
    b2_toiStateHit: 3,
    b2_toiStateSeparated: 4
};

/**
 * @class b2TOIOutput
 * @summary Output parameters for b2TimeOfImpact
 * @property {b2TOIState} state - The type of result
 * @property {number} t - The time of the collision
 */
export class b2TOIOutput
{
    constructor()
    {
        this.state = b2TOIState.b2_toiStateUnknown;
        this.t = 0;
    }
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
export class b2ManifoldPoint
{
    constructor()
    {
        this.pointX = 0;
        this.pointY = 0;
        this.anchorAX = 0;
        this.anchorAY = 0;
        this.anchorBX = 0;
        this.anchorBY = 0;
        this.separation = 0;
        this.normalImpulse = 0;
        this.tangentImpulse = 0;
        this.maxNormalImpulse = 0;
        this.normalVelocity = 0;
        this.id = 0;
        this.persisted = false;
    }

    clone()
    {
        const clone = new b2ManifoldPoint();
        clone.pointX = this.pointX;
        clone.pointY = this.pointY;
        clone.anchorAX = this.anchorAX;
        clone.anchorAY = this.anchorAY;
        clone.anchorBX = this.anchorBX;
        clone.anchorBY = this.anchorBY;
        clone.separation = this.separation;
        clone.normalImpulse = this.normalImpulse;
        clone.tangentImpulse = this.tangentImpulse;
        clone.maxNormalImpulse = this.maxNormalImpulse;
        clone.normalVelocity = this.normalVelocity;
        clone.id = this.id;
        clone.persisted = this.persisted;

        return clone;
    }

    clear()
    {
        this.pointX = 0;
        this.pointY = 0;
        this.anchorAX = 0;
        this.anchorAY = 0;
        this.anchorBX = 0;
        this.anchorBY = 0;
        this.separation = 0;
        this.normalImpulse = 0;
        this.tangentImpulse = 0;
        this.maxNormalImpulse = 0;
        this.normalVelocity = 0;
        this.id = 0;
        this.persisted = false;

        return this;
    }

    copyTo(mp)
    {
        mp.pointX = this.pointX;
        mp.pointY = this.pointY;
        mp.anchorAX = this.anchorAX;
        mp.anchorAY = this.anchorAY;
        mp.anchorBX = this.anchorBX;
        mp.anchorBY = this.anchorBY;
        mp.separation = this.separation;
        mp.normalImpulse = this.normalImpulse;
        mp.tangentImpulse = this.tangentImpulse;
        mp.maxNormalImpulse = this.maxNormalImpulse;
        mp.normalVelocity = this.normalVelocity;
        mp.id = this.id;
        mp.persisted = this.persisted;
    }
}

/**
 * @class b2Manifold
 * @summary A contact manifold describes the contact points between colliding shapes
 * @property {b2ManifoldPoint[]} points - The manifold points, up to two are possible in 2D
 * @property {b2Vec2} normal - The unit normal vector in world space, points from shape A to bodyB
 * @property {number} pointCount - The number of contacts points, will be 0, 1, or 2
 */
export class b2Manifold
{
    constructor(p1 = new b2ManifoldPoint(), p2 = new b2ManifoldPoint())
    {
        this.points = [ p1, p2 ];
        this.normalX = this.normalY = 0;
        this.pointCount = 0;
    }

    clone()
    {
        const clone = new b2Manifold();

        this.copyTo(clone);

        return clone;
    }

    clear()
    {
        if (this.points[0])
        {
            this.points[0].clear();
        }

        if (this.points[1])
        {
            this.points[1].clear();
        }

        this.normalX = this.normalY = 0;
        this.pointCount = 0;

        return this;
    }

    copyTo(manifold)
    {
        this.points[0].copyTo(manifold.points[0]);
        this.points[1].copyTo(manifold.points[1]);
        manifold.normalX = this.normalX;
        manifold.normalY = this.normalY;
        manifold.pointCount = this.pointCount;
    }
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
export class b2TreeNode
{
    constructor()
    {
        this.aabb = null;
        this.categoryBits = 0;

        // NOTE: removed the C union of parent and next
        this.parent_next = B2_NULL_INDEX;
        this.child1 = B2_NULL_INDEX;
        this.child2 = B2_NULL_INDEX;
        this.userData = 0;
        this.height = -1;
        this.enlarged = false;
    }
}


/**
 * These are performance results returned by dynamic tree queries.
 * @typedef {Object} b2TreeStats
 * @property {number} nodeVisits - Number of internal nodes visited during the query.
 * @property {number} leafVisits - Number of leaf nodes visited during the query.
 */
