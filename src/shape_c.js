/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_NULL_INDEX, b2_aabbMargin, b2_linearSlop, b2_speculativeDistance } from './include/core_h.js';
import { B2_PROXY_TYPE, b2BroadPhase_CreateProxy, b2BroadPhase_DestroyProxy, b2BroadPhase_MoveProxy } from './include/broad_phase_h.js';
import {
    b2AABB,
    b2DistanceSquared,
    b2Dot,
    b2InvRotateVector,
    b2InvTransformPoint,
    b2IsValid,
    b2Length,
    b2LengthSquared,
    b2Lerp,
    b2Rot,
    b2RotateVector,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2Vec2
} from './include/math_functions_h.js';
import { b2AllocId, b2FreeId } from './include/id_pool_h.js';
import { b2BodyType, b2DefaultShapeDef, b2ShapeType } from './include/types_h.js';
import { b2CastOutput, b2ChainSegment, b2Circle, b2DistanceCache, b2DistanceInput, b2DistanceProxy, b2MassData, b2RayCastInput, b2Segment } from './include/collision_h.js';
import { b2ChainId, b2ShapeId, b2WorldId } from './include/id_h.js';
import { b2ChainShape, b2Shape, b2ShapeExtent } from './include/shape_h.js';
import {
    b2ComputeCapsuleAABB,
    b2ComputeCapsuleMass,
    b2ComputeCircleAABB,
    b2ComputeCircleMass,
    b2ComputePolygonAABB,
    b2ComputePolygonMass,
    b2ComputeSegmentAABB,
    b2PointInCapsule,
    b2PointInCircle,
    b2PointInPolygon,
    b2RayCastCapsule,
    b2RayCastCircle,
    b2RayCastPolygon,
    b2RayCastSegment,
    b2ShapeCastCapsule,
    b2ShapeCastCircle,
    b2ShapeCastPolygon,
    b2ShapeCastSegment,
} from './include/geometry_h.js';
import { b2ContactFlags, b2DestroyContact, b2GetContactSim } from './include/contact_h.js';
import { b2GetBody, b2GetBodyFullId, b2GetBodyTransform, b2GetBodyTransformQuick, b2MakeBodyId, b2UpdateBodyMassData } from './include/body_h.js';
import { b2GetWorld, b2GetWorldLocked, b2SetType, b2ValidateSolverSets } from './include/world_h.js';
import { b2MakeProxy, b2ShapeDistance } from './include/distance_h.js';

/**
 * @namespace Shape
 */

/**
 * @import {b2BodyId} from './include/id_h.js'
 * @import {b2ShapeDef, b2ChainDef, b2Filter} from './include/types_h.js'
 * @import {b2Capsule, b2Polygon, b2Manifold} from './include/collision_h.js'
 */

function b2GetShape(world, shapeId)
{
    const id = shapeId.index1 - 1;

    // b2CheckIdAndRevision(world.shapeArray, id, shapeId.revision);
    const shape = world.shapeArray[id];

    return shape;
}

export function b2GetOwnerTransform(world, shape)
{
    return b2GetBodyTransform(world, shape.bodyId);
}

function b2GetChainShape(world, chainId)
{
    const id = chainId.index1 - 1;

    // b2CheckIdAndRevision(world.chainArray, id, chainId.revision);
    const chain = world.chainArray[id];

    return chain;
}

function b2UpdateShapeAABBs(shape, transform, proxyType)
{
    const speculativeDistance = b2_speculativeDistance;
    const aabbMargin = b2_aabbMargin;

    const aabb = b2ComputeShapeAABB(shape, transform);
    aabb.lowerBoundX -= speculativeDistance;
    aabb.lowerBoundY -= speculativeDistance;
    aabb.upperBoundX += speculativeDistance;
    aabb.upperBoundY += speculativeDistance;
    shape.aabb = aabb;

    const margin = proxyType == b2BodyType.b2_staticBody ? speculativeDistance : aabbMargin;
    const fatAABB = new b2AABB(aabb.lowerBoundX - margin, aabb.lowerBoundY - margin,
        aabb.upperBoundX + margin, aabb.upperBoundY + margin);
    shape.fatAABB = fatAABB;
}

function b2CreateShapeInternal(world, body, transform, def, geometry, shapeType)
{
    //    B2_ASSERT(b2IsValid(def.density) && def.density >= 0.0);
    //    B2_ASSERT(b2IsValid(def.friction) && def.friction >= 0.0);
    //    B2_ASSERT(b2IsValid(def.restitution) && def.restitution >= 0.0);

    const shapeId = b2AllocId(world.shapeIdPool);

    if (shapeId == world.shapeArray.length)
    {
        world.shapeArray.push(new b2Shape());
    }
    
    // eLse:        B2_ASSERT(world.shapeArray[shapeId].id == B2_NULL_INDEX);

    // b2CheckIndex(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    switch (shapeType)
    {
        case b2ShapeType.b2_capsuleShape:
            shape.capsule = geometry;

            break;

        case b2ShapeType.b2_circleShape:
            shape.circle = geometry;

            break;

        case b2ShapeType.b2_polygonShape:
            shape.polygon = geometry;

            break;

        case b2ShapeType.b2_segmentShape:
            shape.segment = geometry;

            break;

        case b2ShapeType.b2_chainSegmentShape:
            shape.chainSegment = geometry;

            break;

        default:
            //            B2_ASSERT(false);
            break;
    }

    shape.id = shapeId;
    shape.bodyId = body.id;
    shape.type = shapeType;
    shape.density = def.density;
    shape.friction = def.friction;
    shape.restitution = def.restitution;
    shape.filter = def.filter;
    shape.userData = def.userData;
    shape.customColor = def.customColor;
    shape.isSensor = def.isSensor;
    shape.enlargedAABB = false;
    shape.enableSensorEvents = def.enableSensorEvents;
    shape.enableContactEvents = def.enableContactEvents;
    shape.enableHitEvents = def.enableHitEvents;
    shape.enablePreSolveEvents = def.enablePreSolveEvents;
    shape.isFast = false;
    shape.proxyKey = B2_NULL_INDEX;
    shape.localCentroid = b2GetShapeCentroid(shape);
    shape.aabb = new b2AABB();
    shape.fatAABB = new b2AABB();
    shape.revision += 1;

    if (body.setIndex != b2SetType.b2_disabledSet)
    {
        const proxyType = body.type;
        b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, def.forceContactCreation || def.isSensor);
    }

    if (body.headShapeId != B2_NULL_INDEX)
    {
        // b2CheckId(world.shapeArray, body.headShapeId);
        const headShape = world.shapeArray[body.headShapeId];
        headShape.prevShapeId = shapeId;
    }

    shape.prevShapeId = B2_NULL_INDEX;
    shape.nextShapeId = body.headShapeId;
    body.headShapeId = shapeId;
    body.shapeCount += 1;

    b2ValidateSolverSets(world);

    return shape;
}

export function b2CreateShape(bodyId, def, geometry, shapeType)
{
    // b2CheckDef(def);
    console.assert(b2IsValid(def.density) && def.density >= 0.0);
    console.assert(b2IsValid(def.friction) && def.friction >= 0.0);
    console.assert(b2IsValid(def.restitution) && def.restitution >= 0.0);

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return new b2ShapeId( 0, 0, 0 );
    }

    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    const shape = b2CreateShapeInternal(world, body, transform, def, geometry, shapeType);

    if (body.updateBodyMass === true)
    {
        b2UpdateBodyMassData(world, body);
    }

    b2ValidateSolverSets(world);

    const id = new b2ShapeId(shape.id + 1, bodyId.world0, shape.revision);

    return id;
}

/**
 * Creates a circle shape and attaches it to a body.
 * @function b2CreateCircleShape
 * @param {b2BodyId} bodyId - The identifier of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition containing properties like friction and density
 * @param {b2Circle} circle - The circle geometry definition
 * @returns {b2ShapeId} The identifier of the created circle shape
 */
export function b2CreateCircleShape(bodyId, def, circle)
{
    return b2CreateShape(bodyId, def, circle, b2ShapeType.b2_circleShape);
}

/**
 * @function b2CreateCapsuleShape
 * @summary Creates either a capsule shape or circle shape based on the distance between centers
 * @param {b2BodyId} bodyId - The body ID to attach the shape to
 * @param {b2ShapeDef} def - The shape definition parameters
 * @param {b2Capsule} capsule - The capsule geometry containing center1, center2 and radius
 * @returns {b2ShapeId} The ID of the created shape
 * @description
 * Creates a capsule shape if the distance between centers is greater than b2_linearSlop.
 * If centers are closer than b2_linearSlop, creates a circle shape instead with radius
 * equal to the capsule radius and center at the midpoint between capsule centers.
 */
export function b2CreateCapsuleShape(bodyId, def, capsule)
{
    const lengthSqr = b2DistanceSquared(capsule.center1, capsule.center2);

    if (lengthSqr <= b2_linearSlop * b2_linearSlop)
    {
        const circle = new b2Circle();
        circle.center = b2Lerp(capsule.center1, capsule.center2, 0.5);
        circle.radius = capsule.radius;

        return b2CreateShape(bodyId, def, circle, b2ShapeType.b2_circleShape);
    }

    return b2CreateShape(bodyId, def, capsule, b2ShapeType.b2_capsuleShape);
}

/**
 * Creates a polygon shape and attaches it to a body.
 * @function b2CreatePolygonShape
 * @param {b2BodyId} bodyId - The identifier of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition containing common shape properties
 * @param {b2Polygon} polygon - The polygon data including vertices and radius
 * @returns {b2ShapeId} The identifier of the created polygon shape
 * @throws {Error} Throws an assertion error if the polygon radius is invalid or negative
 */
export function b2CreatePolygonShape(bodyId, def, polygon)
{
    console.assert(b2IsValid(polygon.radius) && polygon.radius >= 0.0);

    return b2CreateShape(bodyId, def, polygon, b2ShapeType.b2_polygonShape);
}

/**
 * @summary Creates a segment shape attached to a body
 * @function b2CreateSegmentShape
 * @param {b2BodyId} bodyId - The ID of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition parameters
 * @param {b2Segment} segment - The segment geometry defined by point1 and point2
 * @returns {b2ShapeId} The ID of the created segment shape
 * @description
 * Creates a segment shape between two points and attaches it to the specified body.
 * The function validates that the segment length is greater than b2_linearSlop
 * before creating the shape.
 * @throws {Error} Throws an assertion error if the segment length squared is less
 * than or equal to b2_linearSlop squared
 */
export function b2CreateSegmentShape(bodyId, def, segment)
{
    const lengthSqr = b2DistanceSquared(segment.point1, segment.point2);

    if (lengthSqr <= b2_linearSlop * b2_linearSlop)
    {
        console.assert(false);

        return new b2ShapeId();
    }

    return b2CreateShape(bodyId, def, segment, b2ShapeType.b2_segmentShape);
}

function b2DestroyShapeInternal(world, shape, body, wakeBodies)
{
    const shapeId = shape.id;

    if (shape.prevShapeId !== B2_NULL_INDEX)
    {
        // b2CheckId(world.shapeArray, shape.prevShapeId);
        world.shapeArray[shape.prevShapeId].nextShapeId = shape.nextShapeId;
    }

    if (shape.nextShapeId !== B2_NULL_INDEX)
    {
        // b2CheckId(world.shapeArray, shape.nextShapeId);
        world.shapeArray[shape.nextShapeId].prevShapeId = shape.prevShapeId;
    }

    if (shapeId === body.headShapeId)
    {
        body.headShapeId = shape.nextShapeId;
    }

    body.shapeCount -= 1;

    b2DestroyShapeProxy(shape, world.broadPhase);

    let contactKey = body.headContactKey;

    while (contactKey !== B2_NULL_INDEX)
    {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;

        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];
        contactKey = contact.edges[edgeIndex].nextKey;

        if (contact.shapeIdA === shapeId || contact.shapeIdB === shapeId)
        {
            b2DestroyContact(world, contact, wakeBodies);
        }
    }

    b2FreeId(world.shapeIdPool, shapeId);
    shape.id = B2_NULL_INDEX;

    b2ValidateSolverSets(world);
}

/**
 * @function b2DestroyShape
 * @summary Destroys a shape in the physics world and updates the parent body's mass if needed.
 * @param {b2ShapeId} shapeId - The identifier of the shape to destroy.
 * @description
 * Removes a shape from the physics world. If the parent body has automatic mass calculation enabled,
 * the body's mass properties are recalculated after the shape is destroyed.
 * The function performs the following operations:
 * 1. Retrieves the world and shape from the provided shapeId
 * 2. Destroys the shape internally
 * 3. Updates the parent body's mass data if automatic mass calculation is enabled
 */
export function b2DestroyShape(shapeId)
{
    const world = b2GetWorldLocked(shapeId.world0);

    const id = shapeId.index1 - 1;

    // b2CheckIdAndRevision(world.shapeArray, id, shapeId.revision);

    const shape = world.shapeArray[id];

    const wakeBodies = true;

    const body = b2GetBody(world, shape.bodyId);
    b2DestroyShapeInternal(world, shape, body, wakeBodies);

    if (body.updateBodyMass === true)
    {
        b2UpdateBodyMassData(world, body);
    }
}

/**
 * @function b2CreateChain
 * @description Creates a chain shape composed of connected line segments attached to a body.
 * The chain can be either a closed loop or an open chain.
 * @param {b2BodyId} bodyId - The ID of the body to attach the chain to
 * @param {b2ChainDef} def - The chain definition containing:
 * - {number} count - Number of vertices (must be >= 4)
 * - {b2Vec2[]} points - Array of vertex points
 * - {boolean} isLoop - Whether the chain forms a closed loop
 * - {number} friction - Friction coefficient (must be >= 0)
 * - {number} restitution - Restitution coefficient (must be >= 0)
 * - {b2Filter} filter - Collision filter data
 * - {*} userData - User data pointer
 * @returns {b2ChainId} The ID of the created chain shape
 * @throws {Error} Throws assertion error if friction or restitution are invalid/negative,
 * or if count is less than 4
 */
export function b2CreateChain(bodyId, def)
{
    // b2CheckDef(def);
    console.assert(b2IsValid(def.friction) && def.friction >= 0.0);
    console.assert(b2IsValid(def.restitution) && def.restitution >= 0.0);
    console.assert(def.count >= 4);

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return new b2ChainId();
    }

    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    const chainId = b2AllocId(world.chainIdPool);

    if (chainId === world.chainArray.length)
    {
        world.chainArray.push(new b2ChainShape());
    }

    // b2CheckIndex(world.chainArray, chainId);
    const chainShape = world.chainArray[chainId];

    chainShape.id = chainId;
    chainShape.bodyId = body.id;
    chainShape.nextChainId = body.headChainId;
    chainShape.revision += 1;
    body.headChainId = chainId;

    const shapeDef = b2DefaultShapeDef();
    shapeDef.userData = def.userData;
    shapeDef.restitution = def.restitution;
    shapeDef.friction = def.friction;
    shapeDef.filter = def.filter;
    shapeDef.enableContactEvents = false;
    shapeDef.enableHitEvents = false;
    shapeDef.enableSensorEvents = false;

    const n = def.count;
    const points = def.points;
    let chainSegment;

    if (def.isLoop)
    {
        chainShape.count = n;
        chainShape.shapeIndices = new Array(n);

        let prevIndex = n - 1;

        for (let i = 0; i < n - 2; ++i)
        {
            chainSegment = new b2ChainSegment();
            chainSegment.ghost1 = points[prevIndex].clone();
            chainSegment.segment = new b2Segment();
            chainSegment.segment.point1 = points[i].clone();
            chainSegment.segment.point2 = points[i + 1].clone();
            chainSegment.ghost2 = points[i + 2].clone();
            chainSegment.chainId = chainId;
            prevIndex = i;

            const shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
            chainShape.shapeIndices[i] = shape.id;
        }

        chainSegment = new b2ChainSegment();
        chainSegment.ghost1 = points[n - 3].clone();
        chainSegment.segment = new b2Segment();
        chainSegment.segment.point1 = points[n - 2].clone();
        chainSegment.segment.point2 = points[n - 1].clone();
        chainSegment.ghost2 = points[0].clone();
        chainSegment.chainId = chainId;
        let shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
        chainShape.shapeIndices[n - 2] = shape.id;

        chainSegment = new b2ChainSegment();
        chainSegment.ghost1 = points[n - 2].clone();
        chainSegment.segment = new b2Segment();
        chainSegment.segment.point1 = points[n - 1].clone();
        chainSegment.segment.point2 = points[0].clone();
        chainSegment.ghost2 = points[1].clone();
        chainSegment.chainId = chainId;
        shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
        chainShape.shapeIndices[n - 1] = shape.id;
    }
    else
    {
        chainShape.count = n - 3;
        chainShape.shapeIndices = new Array(n);

        for (let i = 0; i < n - 3; ++i)
        {
            chainSegment = new b2ChainSegment();
            chainSegment.ghost1 = points[i].clone();
            chainSegment.segment = new b2Segment();
            chainSegment.segment.point1 = points[i + 1].clone();
            chainSegment.segment.point2 = points[i + 2].clone();
            chainSegment.ghost2 = points[i + 3].clone();
            chainSegment.chainId = chainId;

            const shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
            chainShape.shapeIndices[i] = shape.id;
        }
    }

    const id = new b2ChainId(chainId + 1, world.worldId, chainShape.revision);

    return id;
}

/**
 * @function b2DestroyChain
 * @description
 * Destroys a chain of shapes attached to a body in a Box2D world. The function removes all shapes
 * associated with the chain and frees the chain ID from the world's chain ID pool.
 * @param {b2ChainId} chainId - The identifier for the chain to be destroyed, containing world and index information
 * @returns {void}
 * @throws {Error} Throws an assertion error if the chain is not found in the body's chain list
 */
export function b2DestroyChain(chainId)
{
    const world = b2GetWorldLocked(chainId.world0);

    const id = chainId.index1 - 1;

    // b2CheckIdAndRevision(world.chainArray, id, chainId.revision);

    const chain = world.chainArray[id];
    const wakeBodies = true;

    const body = b2GetBody(world, chain.bodyId);

    // Remove the chain from the body's singly linked list.
    let chainIdPtr = body.headChainId;
    let found = false;

    while (chainIdPtr !== null)
    {
        if (chainIdPtr === chain.id)
        {
            // chainIdPtr = chain.nextChainId;       // PJB - it's in the C but removed to prevent lint "no-useless-assignment"
            found = true;

            break;
        }

        chainIdPtr = world.chainArray[chainIdPtr].nextChainId;
    }

    console.assert(found === true);

    if (found === false)
    {
        return;
    }

    const count = chain.count;

    for (let i = 0; i < count; ++i)
    {
        const shapeId = chain.shapeIndices[i];

        // b2CheckId(world.shapeArray, shapeId);
        const shape = world.shapeArray[shapeId];
        b2DestroyShapeInternal(world, shape, body, wakeBodies);
    }

    chain.shapeIndices = null;

    // Return chain to free list.
    b2FreeId(world.chainIdPool, id);
    chain.id = null;

    b2ValidateSolverSets(world);
}

export function b2ComputeShapeAABB(shape, xf)
{
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return b2ComputeCapsuleAABB(shape.capsule, xf);

        case b2ShapeType.b2_circleShape:
            return b2ComputeCircleAABB(shape.circle, xf);

        case b2ShapeType.b2_polygonShape:
            return b2ComputePolygonAABB(shape.polygon, xf);

        case b2ShapeType.b2_segmentShape:
            return b2ComputeSegmentAABB(shape.segment, xf);

        case b2ShapeType.b2_chainSegmentShape:
            return b2ComputeSegmentAABB(shape.chainSegment.segment, xf);

        default:
            console.assert(false);

            return new b2AABB(xf.p.x, xf.p.y, xf.p.x, xf.p.y);
    }
}

export function b2GetShapeCentroid(shape)
{
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return b2Lerp(shape.capsule.center1, shape.capsule.center2, 0.5);

        case b2ShapeType.b2_circleShape:
            return shape.circle.center.clone();

        case b2ShapeType.b2_polygonShape:
            return shape.polygon.centroid.clone();

        case b2ShapeType.b2_segmentShape:
            return b2Lerp(shape.segment.point1, shape.segment.point2, 0.5);

        case b2ShapeType.b2_chainSegmentShape:
            return b2Lerp(shape.chainSegment.segment.point1, shape.chainSegment.segment.point2, 0.5);

        default:
            return new b2Vec2(0, 0);
    }
}

export function b2GetShapePerimeter(shape)
{
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return 2.0 * b2Length(b2Sub(shape.capsule.center1, shape.capsule.center2)) +
                   2.0 * Math.PI * shape.capsule.radius;

        case b2ShapeType.b2_circleShape:
            return 2.0 * Math.PI * shape.circle.radius;

        case b2ShapeType.b2_polygonShape:
        {
            const points = shape.polygon.vertices;
            const count = shape.polygon.count;
            let perimeter = 2.0 * Math.PI * shape.polygon.radius;
            console.assert(count > 0);
            let prev = points[count - 1];

            for (let i = 0; i < count; ++i)
            {
                const next = points[i];
                perimeter += b2Length(b2Sub(next, prev));
                prev = next;
            }

            return perimeter;
        }

        case b2ShapeType.b2_segmentShape:
            return 2.0 * b2Length(b2Sub(shape.segment.point1, shape.segment.point2));

        case b2ShapeType.b2_chainSegmentShape:
            return 2.0 * b2Length(b2Sub(shape.chainSegment.segment.point1, shape.chainSegment.segment.point2));

        default:
            return 0.0;
    }
}

export function b2ComputeShapeMass(shape)
{
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return b2ComputeCapsuleMass(shape.capsule, shape.density);

        case b2ShapeType.b2_circleShape:
            return b2ComputeCircleMass(shape.circle, shape.density);

        case b2ShapeType.b2_polygonShape:
            return b2ComputePolygonMass(shape.polygon, shape.density);

        default:
            return new b2MassData();
    }
}

export function b2ComputeShapeExtent(shape, localCenter)
{
    const extent = new b2ShapeExtent();

    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            {
                const radius = shape.capsule.radius;
                extent.minExtent = radius;
                const c1 = b2Sub(shape.capsule.center1, localCenter);
                const c2 = b2Sub(shape.capsule.center2, localCenter);
                extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2))) + radius;
            }

            break;

        case b2ShapeType.b2_circleShape:
            {
                const radius = shape.circle.radius;
                extent.minExtent = radius;
                extent.maxExtent = b2Length(b2Sub(shape.circle.center, localCenter)) + radius;
            }

            break;

        case b2ShapeType.b2_polygonShape:
            {
                const poly = shape.polygon;
                let minExtent = Number.MAX_VALUE;
                let maxExtentSqr = 0.0;
                const count = poly.count;

                for (let i = 0; i < count; ++i)
                {
                    const v = poly.vertices[i];
                    const planeOffset = b2Dot(poly.normals[i], b2Sub(v, poly.centroid));
                    minExtent = Math.min(minExtent, planeOffset);

                    const distanceSqr = b2LengthSquared(b2Sub(v, localCenter));
                    maxExtentSqr = Math.max(maxExtentSqr, distanceSqr);
                }

                extent.minExtent = minExtent + poly.radius;
                extent.maxExtent = Math.sqrt(maxExtentSqr) + poly.radius;
            }

            break;

        case b2ShapeType.b2_segmentShape:
            {
                extent.minExtent = 0.0;
                const c1 = b2Sub(shape.segment.point1, localCenter);
                const c2 = b2Sub(shape.segment.point2, localCenter);
                extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2)));
            }

            break;

        case b2ShapeType.b2_chainSegmentShape:
            {
                extent.minExtent = 0.0;
                const c1 = b2Sub(shape.chainSegment.segment.point1, localCenter);
                const c2 = b2Sub(shape.chainSegment.segment.point2, localCenter);
                extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2)));
            }

            break;

        default:
            break;
    }

    return extent;
}

const rayPoint = new b2Vec2(0, 0);
const rayNormal = new b2Vec2(0, 1);

export function b2RayCastShape(input, shape, transform)
{
    const localInput = input;
    localInput.origin = b2InvTransformPoint(transform, input.origin);
    localInput.translation = b2InvRotateVector(transform.q, input.translation);

    let output = new b2CastOutput();
    output.hit = false;
    output.fraction = 0.0;
    output.normal = new b2Vec2(0, 0);
    output.point = new b2Vec2(0, 0);

    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            output = b2RayCastCapsule(localInput, shape.capsule);

            break;

        case b2ShapeType.b2_circleShape:
            output = b2RayCastCircle(localInput, shape.circle);

            break;

        case b2ShapeType.b2_polygonShape:
            output = b2RayCastPolygon(localInput, shape.polygon);

            break;

        case b2ShapeType.b2_segmentShape:
            output = b2RayCastSegment(localInput, shape.segment, false);

            break;

        case b2ShapeType.b2_chainSegmentShape:
            output = b2RayCastSegment(localInput, shape.chainSegment.segment, true);

            break;

        default:
            return output;
    }

    output.point = b2TransformPoint(transform, output.point);
    output.normal = b2RotateVector(transform.q, output.normal);

    return output;
}

export function b2ShapeCastShape(input, shape, transform)
{
    const localInput = input;

    for (let i = 0; i < localInput.count; ++i)
    {
        localInput.points[i] = b2InvTransformPoint(transform, input.points[i]);
    }

    localInput.translation = b2InvRotateVector(transform.q, input.translation);

    let output = new b2CastOutput();
    output.hit = false;
    output.fraction = 0.0;
    output.normal = new b2Vec2(0, 0);
    output.point = new b2Vec2(0, 0);

    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            output = b2ShapeCastCapsule(localInput, shape.capsule);

            break;

        case b2ShapeType.b2_circleShape:
            output = b2ShapeCastCircle(localInput, shape.circle);

            break;

        case b2ShapeType.b2_polygonShape:
            output = b2ShapeCastPolygon(localInput, shape.polygon);

            break;

        case b2ShapeType.b2_segmentShape:
            output = b2ShapeCastSegment(localInput, shape.segment);

            break;

        case b2ShapeType.b2_chainSegmentShape:
            output = b2ShapeCastSegment(localInput, shape.chainSegment.segment);

            break;

        default:
            return output;
    }

    output.point = b2TransformPoint(transform, output.point);
    output.normal = b2RotateVector(transform.q, output.normal);

    return output;
}

export function b2CreateShapeProxy(shape, bp, type, transform, forcePairCreation)
{
    console.assert(shape.proxyKey == B2_NULL_INDEX);

    b2UpdateShapeAABBs(shape, transform, type);

    // Create proxies in the broad-phase.
    shape.proxyKey = b2BroadPhase_CreateProxy(bp, type, shape.fatAABB, shape.filter.categoryBits, shape.id, forcePairCreation);
    console.assert(B2_PROXY_TYPE(shape.proxyKey) < b2BodyType.b2_bodyTypeCount);
}

export function b2DestroyShapeProxy(shape, bp)
{
    if (shape.proxyKey != B2_NULL_INDEX)
    {
        b2BroadPhase_DestroyProxy(bp, shape.proxyKey);
        shape.proxyKey = B2_NULL_INDEX;
    }
}

export function b2MakeShapeDistanceProxy(shape)
{
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return b2MakeProxy([ shape.capsule.center1.clone(), shape.capsule.center2.clone() ], 2, shape.capsule.radius);

        case b2ShapeType.b2_circleShape:
            return b2MakeProxy([ shape.circle.center.clone() ], 1, shape.circle.radius);

        case b2ShapeType.b2_polygonShape:
            return b2MakeProxy(shape.polygon.vertices, shape.polygon.count, shape.polygon.radius);

        case b2ShapeType.b2_segmentShape:
            return b2MakeProxy([ shape.segment.point1, shape.segment.point2 ], 2, 0.0);

        case b2ShapeType.b2_chainSegmentShape:
            return b2MakeProxy([ shape.chainSegment.segment.point1.clone(), shape.chainSegment.segment.point2.clone() ], 2, 0.0);

        default:
            console.assert(false);

            return new b2DistanceProxy();
    }
}

/**
 * @function b2Shape_GetBody
 * @summary Gets the body ID associated with a given shape ID.
 * @param {b2ShapeId} shapeId - The ID of the shape to query.
 * @returns {b2BodyId} The ID of the body that owns the shape.
 * @description
 * Retrieves the body ID for a given shape by first accessing the world object,
 * then getting the shape from the world, and finally creating a body ID
 * from the shape's stored body reference.
 */
export function b2Shape_GetBody(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return b2MakeBodyId(world, shape.bodyId);
}

export function b2Shape_GetWorld(shapeId)
{
    const world = b2GetWorld(shapeId.world0);

    return new b2WorldId(shapeId.world0 + 1, world.revision);
}

/**
 * @summary Sets the user data associated with a shape.
 * @function b2Shape_SetUserData
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {*} userData - The user data to associate with the shape.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a shape identified by shapeId. The shape must exist
 * in the world referenced by the shapeId. The function retrieves the shape from the world
 * and updates its userData property.
 */
export function b2Shape_SetUserData(shapeId, userData)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    shape.userData = userData;
}

/**
 * @summary Gets the user data associated with a shape.
 * @function b2Shape_GetUserData
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {void} The user data associated with the shape.
 * @description
 * This function retrieves the user data that was previously attached to a shape
 * by looking up the shape in the world using the provided shape ID.
 */
export function b2Shape_GetUserData(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.userData;
}

/**
 * Checks if a shape is marked as a sensor.
 * @function b2Shape_IsSensor
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if the shape is a sensor, false otherwise.
 * @description
 * Retrieves a shape from the physics world using its ID and returns
 * whether it is configured as a sensor. Sensor shapes detect collisions
 * but do not generate physical responses.
 */
export function b2Shape_IsSensor(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.isSensor;
}

/**
 * Tests if a point lies within a shape.
 * @function b2Shape_TestPoint
 * @param {b2ShapeId} shapeId - The identifier for the shape to test against
 * @param {b2Vec2} point - The world space point to test
 * @returns {boolean} True if the point is inside the shape, false otherwise
 * @description
 * Transforms the test point into the shape's local space and performs
 * point-in-shape testing based on the shape type (capsule, circle, or polygon).
 * Returns false for unrecognized shape types.
 */
export function b2Shape_TestPoint(shapeId, point)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    const transform = b2GetOwnerTransform(world, shape);
    const localPoint = b2InvTransformPoint(transform, point);

    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            return b2PointInCapsule(localPoint, shape.capsule);

        case b2ShapeType.b2_circleShape:
            return b2PointInCircle(localPoint, shape.circle);

        case b2ShapeType.b2_polygonShape:
            return b2PointInPolygon(localPoint, shape.polygon);

        default:
            return false;
    }
}

/**
 * @function b2Shape_RayCast
 * @description
 * Performs a ray cast against a shape in world space, transforming the input/output
 * between local and world coordinates.
 * @param {b2ShapeId} shapeId - The identifier for the shape to test
 * @param {b2Vec2} origin - The starting point of the ray in world coordinates
 * @param {b2Vec2} translation - The direction and length of the ray in world coordinates
 * @returns {b2CastOutput} The ray cast results containing:
 * - hit: boolean indicating if the ray intersects the shape
 * - point: intersection point in world coordinates (if hit is true)
 * - normal: surface normal at intersection in world coordinates (if hit is true)
 * - fraction: fraction of translation where intersection occurs (if hit is true)
 * @throws {Error} Throws assertion error if shape type is invalid
 */
export function b2Shape_RayCast(shapeId, origin, translation)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    const transform = b2GetOwnerTransform(world, shape);

    // input in local coordinates
    const input = new b2RayCastInput();
    input.maxFraction = 1.0;
    input.origin = b2InvTransformPoint(transform, origin);
    input.translation = b2InvRotateVector(transform.q, translation);

    let output = new b2CastOutput(rayNormal, rayPoint);

    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            output = b2RayCastCapsule(input, shape.capsule);

            break;

        case b2ShapeType.b2_circleShape:
            output = b2RayCastCircle(input, shape.circle);

            break;

        case b2ShapeType.b2_segmentShape:
            output = b2RayCastSegment(input, shape.segment, false);

            break;

        case b2ShapeType.b2_polygonShape:
            output = b2RayCastPolygon(input, shape.polygon);

            break;

        case b2ShapeType.b2_chainSegmentShape:
            output = b2RayCastSegment(input, shape.chainSegment.segment, true);

            break;

        default:
            console.assert(false);

            return output;
    }

    if (output.hit)
    {
        // convert to world coordinates
        output.normal = b2RotateVector(transform.q, output.normal);
        output.point = b2TransformPoint(transform, output.point);
    }

    return output;
}

/**
 * @function b2Shape_SetDensity
 * @summary Sets the density of a shape and optionally updates the parent body's mass.
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {number} density - The new density value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets a new density value for the specified shape. If the new density matches
 * the current density, no changes are made. The function performs validation
 * to ensure the density is a valid non-negative number.
 * @throws {Error} Throws an assertion error if the density is invalid or negative.
 */
export function b2Shape_SetDensity(shapeId, density)
{
    console.assert(b2IsValid(density) && density >= 0.0);

    const world = b2GetWorldLocked(shapeId.world0);

    if (world == null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);

    if (density == shape.density)
    {
        // early return to avoid expensive function
        return;
    }

    shape.density = density;
}

/**
 * @summary Gets the density value of a shape.
 * @function b2Shape_GetDensity
 * @param {b2ShapeId} shapeId - The identifier for the shape within a Box2D world.
 * @returns {number} The density value of the specified shape.
 * @description
 * Retrieves the density property of a shape by first accessing the world object
 * using the world identifier stored in the shapeId, then accessing the specific
 * shape within that world.
 */
export function b2Shape_GetDensity(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.density;
}

/**
 * Sets the friction coefficient for a shape.
 * @function b2Shape_SetFriction
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify
 * @param {number} friction - The friction coefficient value (must be >= 0)
 * @returns {void}
 * @throws {Error} Throws an assertion error if friction is invalid or negative
 * @throws {Error} Throws an assertion error if the world is locked
 * @description
 * Sets a new friction value for the specified shape. The operation will not proceed
 * if the physics world is locked. The friction parameter must be a valid number
 * greater than or equal to zero.
 */
export function b2Shape_SetFriction(shapeId, friction)
{
    console.assert(b2IsValid(friction) && friction >= 0.0);

    const world = b2GetWorld(shapeId.world0);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.friction = friction;
}

/**
 * Gets the friction coefficient of a shape.
 * @function b2Shape_GetFriction
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world.
 * @returns {number} The friction coefficient of the shape.
 * @description
 * Retrieves the friction value from a shape object in the Box2D physics world
 * using the provided shape identifier.
 */
export function b2Shape_GetFriction(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.friction;
}

/**
 * Sets the restitution (bounciness) value for a shape.
 * @function b2Shape_SetRestitution
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify.
 * @param {number} restitution - The restitution value to set. Must be non-negative.
 * @returns {void}
 * @throws {Error} Throws an assertion error if restitution is invalid or negative,
 * or if the world is locked.
 */
export function b2Shape_SetRestitution(shapeId, restitution)
{
    console.assert(b2IsValid(restitution) && restitution >= 0.0);

    const world = b2GetWorld(shapeId.world0);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.restitution = restitution;
}

/**
 * Gets the restitution coefficient of a shape.
 * @function b2Shape_GetRestitution
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world.
 * @returns {number} The restitution coefficient of the shape.
 * @description
 * Retrieves the restitution (bounciness) value associated with the specified shape
 * from the physics world.
 */
export function b2Shape_GetRestitution(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.restitution;
}

/**
 * Gets the filter data for a shape.
 * @function b2Shape_GetFilter
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {b2Filter} The collision filter data associated with the shape.
 * @description
 * Retrieves the collision filtering data from a shape by first accessing the world
 * object using the world identifier stored in the shapeId, then accessing the
 * shape within that world using the shapeId.
 */
export function b2Shape_GetFilter(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.filter;
}

// Static function, not exported
function b2ResetProxy(world, shape, wakeBodies, destroyProxy)
{
    const body = b2GetBody(world, shape.bodyId);

    const shapeId = shape.id;

    // destroy all contacts associated with this shape
    let contactKey = body.headContactKey;

    while (contactKey !== B2_NULL_INDEX)
    {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;

        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];
        contactKey = contact.edges[edgeIndex].nextKey;

        if (contact.shapeIdA === shapeId || contact.shapeIdB === shapeId)
        {
            b2DestroyContact(world, contact, wakeBodies);
        }
    }

    const transform = b2GetBodyTransformQuick(world, body);

    if (shape.proxyKey !== B2_NULL_INDEX)
    {
        const proxyType = B2_PROXY_TYPE(shape.proxyKey);
        b2UpdateShapeAABBs(shape, transform, proxyType);

        if (destroyProxy)
        {
            b2BroadPhase_DestroyProxy(world.broadPhase, shape.proxyKey);

            const forcePairCreation = true;
            shape.proxyKey = b2BroadPhase_CreateProxy(world.broadPhase, proxyType, shape.fatAABB, shape.filter.categoryBits,
                shapeId, forcePairCreation);
        }
        else
        {
            b2BroadPhase_MoveProxy(world.broadPhase, shape.proxyKey, shape.fatAABB);
        }
    }
    else
    {
        const proxyType = body.type;
        b2UpdateShapeAABBs(shape, transform, proxyType);
    }

    b2ValidateSolverSets(world);
}

/**
 * Sets the collision filter for a shape.
 * @function b2Shape_SetFilter
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify.
 * @param {b2Filter} filter - The new collision filter settings to apply.
 * @returns {void}
 * @description
 * Updates the collision filter properties of a shape. If the new filter settings
 * match the existing ones, no changes are made. When the categoryBits change,
 * the shape's broad-phase proxy is destroyed and recreated. The function also
 * wakes connected bodies when the filter changes.
 */
export function b2Shape_SetFilter(shapeId, filter)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);

    if (filter.maskBits === shape.filter.maskBits && filter.categoryBits === shape.filter.categoryBits &&
        filter.groupIndex === shape.filter.groupIndex)
    {
        return;
    }

    // If the category bits change, I need to destroy the proxy because it affects the tree sorting.
    const destroyProxy = filter.categoryBits === shape.filter.categoryBits;

    shape.filter = filter;

    // need to wake bodies because a filter change may destroy contacts
    const wakeBodies = true;
    b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}

/**
 * @function b2Shape_EnableSensorEvents
 * @summary Enables or disables sensor events for a specific shape.
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {boolean} flag - True to enable sensor events, false to disable them.
 * @returns {void}
 * @description
 * Sets the enableSensorEvents property of a shape in the physics world. The shape
 * must exist in a valid world context for the operation to succeed.
 */
export function b2Shape_EnableSensorEvents(shapeId, flag)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.enableSensorEvents = flag;
}

/**
 * Checks if sensor events are enabled for a given shape.
 * @function b2Shape_AreSensorEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if sensor events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and returns
 * the state of its sensor events flag.
 */
export function b2Shape_AreSensorEventsEnabled(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.enableSensorEvents;
}

/**
 * @summary Enables or disables contact events for a shape.
 * @function b2Shape_EnableContactEvents
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @param {boolean} flag - True to enable contact events, false to disable.
 * @returns {void}
 * @description
 * Sets whether a shape should generate contact events during collision detection.
 * The shape must belong to a valid world, otherwise the function returns without effect.
 */
export function b2Shape_EnableContactEvents(shapeId, flag)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.enableContactEvents = flag;
}

/**
 * Checks if contact events are enabled for a given shape.
 * @function b2Shape_AreContactEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if contact events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * the enableContactEvents property of that shape.
 */
export function b2Shape_AreContactEventsEnabled(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.enableContactEvents;
}

/**
 * @function b2Shape_EnablePreSolveEvents
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world
 * @param {boolean} flag - Boolean value to enable or disable pre-solve events for the shape
 * @returns {void}
 * @description
 * Enables or disables pre-solve events for a specific shape in the physics simulation.
 * The function first validates the world reference and returns if invalid.
 * If valid, it updates the shape's pre-solve events setting according to the flag parameter.
 */
export function b2Shape_EnablePreSolveEvents(shapeId, flag)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.enablePreSolveEvents = flag;
}

/**
 * @summary Checks if pre-solve events are enabled for a given shape.
 * @function b2Shape_ArePreSolveEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if pre-solve events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * the enablePreSolveEvents property of that shape.
 */
export function b2Shape_ArePreSolveEventsEnabled(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.enablePreSolveEvents;
}

/**
 * @summary Enables or disables hit event notifications for a shape.
 * @function b2Shape_EnableHitEvents
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {boolean} flag - True to enable hit events, false to disable.
 * @returns {void}
 * @description
 * Sets whether a shape should generate hit events during collision detection.
 * The shape must belong to a valid world, otherwise the function returns without effect.
 * @throws {Error} If the world associated with the shapeId is locked.
 */
export function b2Shape_EnableHitEvents(shapeId, flag)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.enableHitEvents = flag;
}

/**
 * Checks if hit events are enabled for a given shape.
 * @function b2Shape_AreHitEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if hit events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * if hit events are enabled for that shape by accessing the enableHitEvents property.
 */
export function b2Shape_AreHitEventsEnabled(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.enableHitEvents;
}

/**
 * Gets the type of a shape from the physics world using its shape ID.
 * @function b2Shape_GetType
 * @param {b2ShapeId} shapeId - The ID of the shape to query
 * @returns {b2ShapeType} The type of the specified shape
 * @description
 * Retrieves a shape from the physics world using the provided shape ID
 * and returns its type classification.
 */
export function b2Shape_GetType(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    return shape.type;
}

/**
 * @function b2Shape_GetCircle
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference
 * @returns {b2Circle} The circle shape object
 * @description
 * Retrieves a circle shape from the physics world using the provided shape identifier.
 * @throws {Error} Throws an assertion error if the shape type is not b2_circleShape
 */
export function b2Shape_GetCircle(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    console.assert(shape.type === b2ShapeType.b2_circleShape);

    return shape.circle;
}

/**
 * @function b2Shape_GetSegment
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference
 * @returns {b2Segment} The segment data from the specified shape
 * @description
 * Retrieves the segment data from a shape in the physics world. The shape must be of type b2_segmentShape.
 * @throws {Error} Throws an assertion error if the shape type is not b2_segmentShape
 */
export function b2Shape_GetSegment(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    console.assert(shape.type === b2ShapeType.b2_segmentShape);

    return shape.segment;
}

/**
 * Gets the chain segment data from a shape identified by its ID.
 * @function b2Shape_GetChainSegment
 * @param {Object} shapeId - An object containing the shape identifier and world reference.
 * @param {number} shapeId.world0 - The world identifier.
 * @returns {Object} The chain segment data associated with the shape.
 * @throws {Error} Throws an assertion error if the shape type is not b2_chainSegmentShape.
 */
export function b2Shape_GetChainSegment(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    console.assert(shape.type === b2ShapeType.b2_chainSegmentShape);

    return shape.chainSegment;
}

/**
 * @function b2Shape_GetCapsule
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference information
 * @returns {b2Capsule} The capsule shape data associated with the given shape ID
 * @description
 * Retrieves the capsule shape data from a shape in the physics world using the provided shape ID.
 * @throws {Error} Throws an assertion error if the shape type is not b2_capsuleShape
 */
export function b2Shape_GetCapsule(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    console.assert(shape.type === b2ShapeType.b2_capsuleShape);

    return shape.capsule;
}

/**
 * Gets a polygon shape from a shape ID.
 * @function b2Shape_GetPolygon
 * @param {b2ShapeId} shapeId - The ID of the shape to retrieve.
 * @returns {b2Polygon} The polygon shape associated with the given shape ID.
 * @throws {Error} Throws an assertion error if the shape type is not b2_polygonShape.
 */
export function b2Shape_GetPolygon(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);
    console.assert(shape.type === b2ShapeType.b2_polygonShape);

    return shape.polygon;
}

/**
 * @function b2Shape_SetCircle
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Circle} circle - The circle shape configuration to set
 * @returns {void}
 * @description
 * Sets a shape's type to circle and updates its properties. The function updates
 * the shape's proxy in the broad-phase collision system and can wake connected bodies.
 * If the world is locked or invalid, the function returns without making changes.
 */
export function b2Shape_SetCircle(shapeId, circle)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.circle = circle;
    shape.type = b2ShapeType.b2_circleShape;

    // need to wake bodies so they can react to the shape change
    const wakeBodies = true;
    const destroyProxy = true;
    b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}

/**
 * @function b2Shape_SetCapsule
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Capsule} capsule - The capsule shape configuration to set
 * @returns {void}
 * @description
 * Sets a shape's type to capsule and updates its configuration. The function
 * resets the shape's proxy in the broad-phase collision system, optionally
 * waking connected bodies and destroying the existing proxy.
 * @throws {Error} If the world reference is invalid (null)
 */
export function b2Shape_SetCapsule(shapeId, capsule)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.capsule = capsule;
    shape.type = b2ShapeType.b2_capsuleShape;

    // need to wake bodies so they can react to the shape change
    const wakeBodies = true;
    const destroyProxy = true;
    b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}

/**
 * @function b2Shape_SetSegment
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Segment} segment - The segment data to assign to the shape
 * @returns {void}
 * @description
 * Sets a shape's type to segment and updates its segment data. After updating,
 * it resets the shape's collision proxy in the physics world. The function requires
 * a valid world lock to execute successfully.
 */
export function b2Shape_SetSegment(shapeId, segment)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.segment = segment;
    shape.type = b2ShapeType.b2_segmentShape;

    // need to wake bodies so they can react to the shape change
    const wakeBodies = true;
    const destroyProxy = true;
    b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}

/**
 * @function b2Shape_SetPolygon
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Polygon} polygon - The polygon data to assign to the shape
 * @returns {void}
 * @description
 * Sets a shape's type to polygon and assigns polygon data to it. The function
 * updates the shape's proxy in the broad-phase collision system and can wake
 * connected bodies.
 * @throws {Error} If the world associated with the shapeId is not found
 */
export function b2Shape_SetPolygon(shapeId, polygon)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return;
    }

    const shape = b2GetShape(world, shapeId);
    shape.polygon = polygon;
    shape.type = b2ShapeType.b2_polygonShape;

    // need to wake bodies so they can react to the shape change
    const wakeBodies = true;
    const destroyProxy = true;
    b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}

/**
 * @function b2Shape_GetParentChain
 * @param {b2ShapeId} shapeId - The identifier of the shape to check for parent chain
 * @returns {b2ChainId} A b2ChainId object. Returns an empty b2ChainId (default values) if the shape
 * is not a chain segment shape or has no parent chain
 * @description
 * Retrieves the parent chain identifier for a given shape if it is a chain segment shape
 * and has an associated chain. The function checks if the shape is of type b2_chainSegmentShape
 * and has a valid chain reference before returning the chain identifier.
 */
export function b2Shape_GetParentChain(shapeId)
{
    const world = b2GetWorld(shapeId.world0);
    const shape = b2GetShape(world, shapeId);

    if (shape.type === b2ShapeType.b2_chainSegmentShape)
    {
        const chainId = shape.chainSegment.chainId;

        if (chainId !== B2_NULL_INDEX)
        {
            // b2CheckId(world.chainArray, chainId);
            const chain = world.chainArray[chainId];

            return new b2ChainId(chainId + 1, shapeId.world0, chain.revision);
        }
    }

    return new b2ChainId();
}

/**
 * Sets the friction value for all shapes in a chain.
 * @function b2Chain_SetFriction
 * @param {b2ChainId} chainId - The identifier for the chain whose friction will be modified
 * @param {number} friction - The friction value to set for all shapes in the chain
 * @returns {void}
 * @description
 * Updates the friction property of each shape within the specified chain. The function
 * retrieves the chain shape from the world, then iterates through all shapes in the
 * chain and sets their friction to the specified value.
 */
export function b2Chain_SetFriction(chainId, friction)
{
    const world = b2GetWorldLocked(chainId.world0);

    if (world === null)
    {
        return;
    }

    const chainShape = b2GetChainShape(world, chainId);

    const count = chainShape.count;

    for (let i = 0; i < count; ++i)
    {
        const shapeId = chainShape.shapeIndices[i];

        // b2CheckId(world.shapeArray, shapeId);
        const shape = world.shapeArray[shapeId];
        shape.friction = friction;
    }
}

/**
 * @function b2Chain_SetRestitution
 * @summary Sets the restitution value for all shapes in a chain.
 * @param {b2ChainId} chainId - The identifier for the chain whose restitution will be set
 * @param {number} restitution - The restitution value to apply to all shapes in the chain
 * @returns {void}
 * @description
 * Sets the restitution coefficient for all shapes that make up the specified chain.
 * If the world is not found using the provided chainId, the function returns without making changes.
 */
export function b2Chain_SetRestitution(chainId, restitution)
{
    const world = b2GetWorldLocked(chainId.world0);

    if (world === null)
    {
        return;
    }

    const chainShape = b2GetChainShape(world, chainId);

    const count = chainShape.count;

    for (let i = 0; i < count; ++i)
    {
        const shapeId = chainShape.shapeIndices[i];

        // b2CheckId(world.shapeArray, shapeId);
        const shape = world.shapeArray[shapeId];
        shape.restitution = restitution;
    }
}

/**
 * Gets the contact capacity for a given shape.
 * @function b2Shape_GetContactCapacity
 * @param {b2ShapeId} shapeId - The identifier for the shape to check
 * @returns {number} The number of contacts for the shape's body. Returns 0 if the world is invalid,
 * or if the shape is a sensor.
 * @description
 * Retrieves the number of contacts associated with the body that owns the specified shape.
 * If the shape is a sensor or the world reference is invalid, the function returns 0.
 */
export function b2Shape_GetContactCapacity(shapeId)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return 0;
    }

    const shape = b2GetShape(world, shapeId);

    if (shape.isSensor)
    {
        return 0;
    }

    const body = b2GetBody(world, shape.bodyId);

    // Conservative and fast
    return body.contactCount;
}

/**
 * @function b2Shape_GetContactData
 * @param {b2ShapeId} shapeId - The identifier of the shape to get contact data for
 * @param {Array<{shapeIdA: b2ShapeId, shapeIdB: b2ShapeId, manifold: b2Manifold}>} contactData - Array to store the contact data
 * @param {number} capacity - Maximum number of contacts to retrieve
 * @returns {number} The number of contacts found and stored in contactData
 * @description
 * Retrieves contact data for a specified shape. For each valid contact involving the shape,
 * stores the shape IDs of both bodies in contact and their contact manifold.
 * Only stores contacts where the touching flag is set and ignores sensor shapes.
 * @throws {Error} If the world is locked or invalid
 */
export function b2Shape_GetContactData(shapeId, contactData, capacity)
{
    const world = b2GetWorldLocked(shapeId.world0);

    if (world === null)
    {
        return 0;
    }

    const shape = b2GetShape(world, shapeId);

    if (shape.isSensor)
    {
        return 0;
    }

    const body = b2GetBody(world, shape.bodyId);
    let contactKey = body.headContactKey;
    let index = 0;

    while (contactKey !== B2_NULL_INDEX && index < capacity)
    {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;

        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];

        // Does contact involve this shape and is it touching?
        if ((contact.shapeIdA === shapeId.index1 - 1 || contact.shapeIdB === shapeId.index1 - 1) &&
            (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0)
        {
            const shapeA = world.shapeArray[contact.shapeIdA];
            const shapeB = world.shapeArray[contact.shapeIdB];

            contactData[index].shapeIdA = new b2ShapeId(shapeA.id + 1, shapeId.world0, shapeA.revision);
            contactData[index].shapeIdB = new b2ShapeId(shapeB.id + 1, shapeId.world0, shapeB.revision);

            const contactSim = b2GetContactSim(world, contact);
            contactData[index].manifold = contactSim.manifold;
            index += 1;
        }

        contactKey = contact.edges[edgeIndex].nextKey;
    }

    console.assert(index <= capacity);

    return index;
}

/**
 * @function b2Shape_GetAABB
 * @summary Gets the Axis-Aligned Bounding Box (AABB) for a shape.
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {b2AABB} The AABB of the shape. Returns an empty AABB if the world is null.
 * @description
 * Retrieves the Axis-Aligned Bounding Box (AABB) associated with a shape in the physics world.
 * If the world reference is invalid, returns a default AABB with zero dimensions.
 */
export function b2Shape_GetAABB(shapeId)
{
    const world = b2GetWorld(shapeId.world0);

    if (world === null)
    {
        return new b2AABB();
    }

    const shape = b2GetShape(world, shapeId);

    return shape.aabb;
}

/**
 * @function b2Shape_GetClosestPoint
 * @summary Gets the closest point on a shape to a target point
 * @param {b2ShapeId} shapeId - ID of the shape to query
 * @param {b2Vec2} target - The target point to find the closest point to
 * @returns {b2Vec2} The closest point on the shape to the target point. Returns (0,0) if the world is invalid.
 * @description
 * Calculates the closest point on a shape to a given target point, taking into account
 * the shape's position and rotation in world space. Uses the distance calculation
 * algorithm with shape proxies and transforms.
 */
export function b2Shape_GetClosestPoint(shapeId, target)
{
    const world = b2GetWorld(shapeId.world0);

    if (world === null)
    {
        return new b2Vec2(0, 0);
    }

    const shape = b2GetShape(world, shapeId);
    const body = b2GetBody(world, shape.bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    const input = new b2DistanceInput();
    input.proxyA = b2MakeShapeDistanceProxy(shape);
    input.proxyB = b2MakeProxy([ target ], 1, 0.0);
    input.transformA = transform;
    input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.useRadii = true;

    const cache = new b2DistanceCache();
    const output = b2ShapeDistance(cache, input, null, 0);

    return output.pointA;
}
