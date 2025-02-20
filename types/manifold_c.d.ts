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
export function b2CollideCircles(circleA: b2Circle, xfA: b2Transform, circleB: b2Circle, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollideCapsuleAndCircle(capsuleA: b2Capsule, xfA: b2Transform, circleB: b2Circle, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollidePolygonAndCircle(polygonA: b2Polygon, xfA: b2Transform, circleB: b2Circle, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollideCapsules(capsuleA: b2Capsule, xfA: b2Transform, capsuleB: b2Capsule, xfB: b2Transform, manifold: b2Manifold): void;
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
export function b2CollideSegmentAndCapsule(segmentA: b2Segment, xfA: b2Transform, capsuleB: b2Capsule, xfB: b2Transform, manifold: b2Manifold): void;
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
export function b2CollidePolygonAndCapsule(polygonA: b2Polygon, xfA: b2Transform, capsuleB: b2Capsule, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollidePolygons(polygonA: b2Polygon, xfA: b2Transform, polygonB: b2Polygon, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollideSegmentAndCircle(segmentA: b2Segment, xfA: b2Transform, circleB: b2Circle, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollideSegmentAndPolygon(segmentA: b2Segment, xfA: b2Transform, polygonB: b2Polygon, xfB: b2Transform, manifold: b2Manifold): b2Manifold;
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
export function b2CollideChainSegmentAndCircle(chainSegmentA: any, xfA: any, circleB: any, xfB: any, manifold: any): any;
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
export function b2CollideChainSegmentAndCapsule(segmentA: b2ChainSegment, xfA: b2Transform, capsuleB: b2Capsule, xfB: b2Transform, cache: b2DistanceCache, manifold: b2Manifold): b2Manifold;
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
export function b2CollideChainSegmentAndPolygon(chainSegmentA: b2ChainSegment, xfA: b2Transform, polygonB: b2Polygon, xfB: b2Transform, cache: b2DistanceCache, manifold: b2Manifold): b2Manifold;
import type { b2Circle } from './include/collision_h.js';
import { b2Transform } from './include/math_functions_h.js';
import type { b2Manifold } from './include/collision_h.js';
import { b2Capsule } from './include/collision_h.js';
import { b2Polygon } from './include/collision_h.js';
import type { b2Segment } from './include/collision_h.js';
import type { b2ChainSegment } from './include/collision_h.js';
import type { b2DistanceCache } from './include/collision_h.js';
