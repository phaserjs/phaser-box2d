/**
 * @namespace Geometry
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
export function b2IsValidRay(input: b2RayCastInput): boolean;
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
export function b2MakePolygon(hull: b2Hull, radius: number, forceCheck?: boolean): b2Polygon;
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
export function b2MakeOffsetPolygon(hull: b2Hull, radius: number, transform: b2Transform, forceCheck?: boolean): b2Polygon;
/**
 * Creates a square polygon with equal width and height.
 * @function b2MakeSquare
 * @param {number} h - The half-width and half-height of the square.
 * @returns {b2Polygon} A polygon object representing a square centered at the origin.
 * @description
 * Creates a square polygon by calling b2MakeBox with equal dimensions.
 * The square is centered at the origin with sides of length 2h.
 */
export function b2MakeSquare(h: number): b2Polygon;
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
export function b2MakeBox(hx: number, hy: number): b2Polygon;
/**
 * Creates a rounded box shape by generating a box with specified dimensions and corner radius.
 * @function b2MakeRoundedBox
 * @param {number} hx - Half-width of the box along the x-axis
 * @param {number} hy - Half-height of the box along the y-axis
 * @param {number} radius - Radius of the rounded corners
 * @returns {b2Polygon} A polygon shape representing a rounded box
 */
export function b2MakeRoundedBox(hx: number, hy: number, radius: number): b2Polygon;
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
export function b2MakeOffsetBox(hx: number, hy: number, center: b2Vec2, rotation: b2Rot): b2Polygon;
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
export function b2TransformPolygon(transform: b2Transform, polygon: b2Polygon): b2Polygon;
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
export function b2ComputeCircleMass(shape: b2Circle, density: number): b2MassData;
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
export function b2ComputeCapsuleMass(shape: b2Capsule, density: number): b2MassData;
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
export function b2ComputePolygonMass(shape: b2Polygon, density: number): b2MassData;
/**
 * @function b2ComputeCircleAABB
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a circle shape after applying a transform.
 * @param {b2Circle} shape - The circle shape containing center point and radius.
 * @param {b2Transform} xf2 - The transform to be applied, consisting of a position (p) and rotation (q).
 * @returns {b2AABB} An AABB object defined by minimum and maximum points that bound the transformed circle.
 * @description
 * Calculates the AABB by transforming the circle's center point using the provided transform
 * and extending the bounds by the circle's radius in each direction.
 */
export function b2ComputeCircleAABB(shape: b2Circle, xf: any): b2AABB;
/**
 * @function b2ComputeCapsuleAABB
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a capsule shape.
 * @param {b2Capsule} shape - A capsule shape defined by two centers and a radius.
 * @param {b2Transform} xf2 - A transform containing position and rotation to be applied to the capsule.
 * @returns {b2AABB} An AABB that encompasses the transformed capsule shape.
 * @description
 * Calculates the minimum and maximum bounds of a capsule after applying a transform.
 * The AABB is computed by transforming the capsule's center points and extending
 * the bounds by the capsule's radius in all directions.
 */
export function b2ComputeCapsuleAABB(shape: b2Capsule, xf: any): b2AABB;
/**
 * @function b2ComputePolygonAABB
 * @description
 * Computes the Axis-Aligned Bounding Box (AABB) for a polygon shape after applying a transform.
 * The AABB includes the polygon's radius in its calculations.
 * @param {b2Polygon} shape - The polygon shape containing vertices and radius
 * @param {b2Transform} xf2 - The transform to apply, consisting of position (p) and rotation (q)
 * @returns {b2AABB} An AABB object with lower and upper bounds that encompass the transformed polygon
 */
export function b2ComputePolygonAABB(shape: b2Polygon, xf: any): b2AABB;
/**
 * @summary Computes an Axis-Aligned Bounding Box (AABB) for a line segment.
 * @function b2ComputeSegmentAABB
 * @param {b2Segment} shape - A line segment defined by two points (point1 and point2)
 * @param {b2Transform} xf2 - A transform containing position and rotation to be applied to the segment
 * @returns {b2AABB} An AABB that contains the transformed line segment
 * @description
 * Transforms the segment's endpoints using the provided transform, then creates an AABB
 * that encompasses the transformed segment by finding the minimum and maximum coordinates
 * of the transformed endpoints.
 */
export function b2ComputeSegmentAABB(shape: b2Segment, xf: any): b2AABB;
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
export function b2PointInCircle(point: b2Vec2, shape: b2Circle): boolean;
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
export function b2PointInCapsule(point: b2Vec2, shape: b2Capsule): boolean;
/**
 * @function b2PointInPolygon
 * @description
 * Tests if a point lies inside a polygon shape by calculating the minimum distance
 * between the point and the polygon.
 * @param {b2Vec2} point - The point to test
 * @param {b2Polygon} shape - The polygon shape to test against
 * @returns {boolean} True if the point is inside or on the polygon (within shape.radius), false otherwise
 */
export function b2PointInPolygon(point: b2Vec2, shape: b2Polygon): boolean;
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
export function b2RayCastCircle(input: b2RayCastInput, shape: b2Circle): b2CastOutput;
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
export function b2RayCastCapsule(input: b2RayCastInput, shape: b2Capsule): b2CastOutput;
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
export function b2RayCastSegment(input: b2RayCastInput, shape: b2Segment, oneSided: boolean): b2CastOutput;
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
export function b2RayCastPolygon(input: b2RayCastInput, shape: b2Polygon): b2CastOutput;
/**
 * @function b2ShapeCastCircle
 * @description
 * Performs shape casting between a circle and a set of points with radius.
 * @param {b2ShapeCastInput} input - Contains points array, count, radius, translation and maxFraction
 * @param {b2Circle} shape - Circle shape with center point and radius
 * @returns {b2CastOutput} The shape cast result containing intersection details
 */
export function b2ShapeCastCircle(input: b2ShapeCastInput, shape: b2Circle): b2CastOutput;
/**
 * @function b2ShapeCastCapsule
 * @description
 * Performs shape casting for a capsule shape against a set of points.
 * @param {b2ShapeCastInput} input - Contains the target points, count, radius,
 * translation, and maxFraction for the shape cast
 * @param {b2Capsule} shape - The capsule shape defined by two centers and a radius
 * @returns {b2CastOutput} The result of the shape cast operation
 */
export function b2ShapeCastCapsule(input: b2ShapeCastInput, shape: b2Capsule): b2CastOutput;
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
export function b2ShapeCastSegment(input: b2ShapeCastInput, shape: b2Segment): b2CastOutput;
/**
 * @function b2ShapeCastPolygon
 * @description
 * Performs shape casting between a polygon shape and a set of points, checking for collisions
 * along a translation path.
 * @param {b2ShapeCastInput} input - Contains the points, count, radius, translation, and maxFraction for the cast
 * @param {b2Polygon} shape - The polygon shape to test against, containing vertices, count, and radius
 * @returns {b2CastOutput} The result of the shape cast operation
 */
export function b2ShapeCastPolygon(input: b2ShapeCastInput, shape: b2Polygon): b2CastOutput;
import { b2Polygon } from './include/collision_h.js';
import { b2Transform } from './include/math_functions_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
import { b2Rot } from './include/math_functions_h.js';
import { b2Circle } from './include/collision_h.js';
import { b2MassData } from './include/collision_h.js';
import { b2Capsule } from './include/collision_h.js';
import { b2AABB } from './include/math_functions_h.js';
import { b2CastOutput } from './include/collision_h.js';
