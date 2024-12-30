/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_NULL_INDEX, b2_graphColorCount } from './include/core_h.js';
import { B2_SHAPE_PAIR_KEY, b2AddKey, b2RemoveKey } from './include/table_h.js';
import { b2AddContact, b2RemoveContact } from './include/block_array_h.js';
import { b2AllocId, b2FreeId } from './include/id_pool_h.js';
import {
    b2CollideCapsuleAndCircle,
    b2CollideCapsules,
    b2CollideChainSegmentAndCapsule,
    b2CollideChainSegmentAndCircle,
    b2CollideChainSegmentAndPolygon,
    b2CollideCircles,
    b2CollidePolygonAndCapsule,
    b2CollidePolygonAndCircle,
    b2CollidePolygons,
    b2CollideSegmentAndCapsule,
    b2CollideSegmentAndCircle,
    b2CollideSegmentAndPolygon
} from './include/manifold_h.js';
import { b2ContactEndTouchEvent, b2SensorEndTouchEvent, b2ShapeType } from './include/types_h.js';
import { b2DistanceCache, b2DistanceInput, b2Manifold } from './include/collision_h.js';
import { b2GetBody, b2WakeBody } from './include/body_h.js';

import { b2ContactSimFlags } from './include/contact_h.js';
import { b2MakeShapeDistanceProxy } from './include/shape_h.js';
import { b2RemoveContactFromGraph } from './include/constraint_graph_h.js';
import { b2SetType } from './include/world_h.js';
import { b2ShapeDistance } from './include/distance_h.js';
import { b2ShapeId } from './include/id_h.js';
import { b2UnlinkContact } from './include/island_h.js';
import { eps } from './include/math_functions_h.js';

/**
 * @namespace Contact
 */

export const b2ContactFlags = {
    b2_contactTouchingFlag: 0x00000001,
    b2_contactHitEventFlag: 0x00000002,
    b2_contactSensorFlag: 0x0000004,
    b2_contactSensorTouchingFlag: 0x00000008,
    b2_contactEnableSensorEvents: 0x00000010,
    b2_contactEnableContactEvents: 0x00000020,
};

export class b2ContactEdge
{
    constructor()
    {
        this.bodyId = 0;
        this.prevKey = 0;
        this.nextKey = 0;
    }
}

export class b2Contact
{
    constructor()
    {
        this.setIndex = 0;
        this.colorIndex = 0;
        this.localIndex = 0;
        this.edges = [ new b2ContactEdge(), new b2ContactEdge() ];
        this.shapeIdA = 0;
        this.shapeIdB = 0;
        this.islandPrev = 0;
        this.islandNext = 0;
        this.islandId = B2_NULL_INDEX;
        this.contactId = B2_NULL_INDEX;
        this.flags = 0;
        this.isMarked = false;
    }
}

export class b2ContactSim
{
    constructor(manifold = new b2Manifold())
    {
        // GlobalDebug.b2ContactSimCount++;
        this.contactId = 0;
        this._bodyIdA = B2_NULL_INDEX;           // debug only
        this._bodyIdB = B2_NULL_INDEX;           // debug only
        this.bodySimIndexA = 0;
        this.bodySimIndexB = 0;
        this.shapeIdA = 0;
        this.shapeIdB = 0;
        this.invMassA = 0;
        this.invIA = 0;
        this.invMassB = 0;
        this.invIB = 0;
        this.manifold = manifold;
        this.friction = 0;
        this.restitution = 0;
        this.tangentSpeed = 0;
        this.simFlags = 0;
        this.cache = new b2DistanceCache();
    }

    set(src)
    {
        this.contactId = src.contactId;
        this._bodyIdA = src._bodyIdA;
        this._bodyIdB = src._bodyIdB;
        this.bodySimIndexA = src.bodySimIndexA;
        this.bodySimIndexB = src.bodySimIndexB;
        this.shapeIdA = src.shapeIdA;
        this.shapeIdB = src.shapeIdB;
        this.invMassA = src.invMassA;
        this.invIA = src.invIA;
        this.invMassB = src.invMassB;
        this.invIB = src.invIB;
        src.manifold.copyTo(this.manifold);
        this.friction = src.friction;
        this.restitution = src.restitution;
        this.tangentSpeed = src.tangentSpeed;
        this.simFlags = src.simFlags;
        this.cache = src.cache.clone();
    }
}

// Friction mixing law. The idea is to allow either shape to drive the friction to zero.
// For example, anything slides on ice.
function b2MixFriction(friction1, friction2)
{
    return Math.sqrt(friction1 * friction2);
}

// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
// For example, a superball bounces on anything.
function b2MixRestitution(restitution1, restitution2)
{
    return Math.max(restitution1, restitution2);
}

// todo make relative for all
// typedef b2Manifold b2ManifoldFcn(const b2Shape* shapeA, const b2Shape* shapeB, b2Transform xfB, b2DistanceCache* cache);
// function b2ManifoldFcn(shapeA, xfA, shapeB, xfB, cache) {
// }
// this is a callback declaration, not required in JS

class b2ContactRegister
{
    constructor(fcn = null, primary = false)
    {
        this.fcn = fcn;
        this.primary = primary;
    }
}

const s_registers = Array(b2ShapeType.b2_shapeTypeCount).fill().map(() =>
    Array(b2ShapeType.b2_shapeTypeCount).fill().map(() => new b2ContactRegister())
);

let s_initialized = false;

export function b2CircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideCircles(shapeA.circle, xfA, shapeB.circle, xfB, manifold);
}

export function b2CapsuleAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideCapsuleAndCircle(shapeA.capsule, xfA, shapeB.circle, xfB, manifold);
}

export function b2CapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideCapsules(shapeA.capsule, xfA, shapeB.capsule, xfB, manifold);
}

export function b2PolygonAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollidePolygonAndCircle(shapeA.polygon, xfA, shapeB.circle, xfB, manifold);
}

export function b2PolygonAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollidePolygonAndCapsule(shapeA.polygon, xfA, shapeB.capsule, xfB, manifold);
}

export function b2PolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollidePolygons(shapeA.polygon, xfA, shapeB.polygon, xfB, manifold);
}

export function b2SegmentAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideSegmentAndCircle(shapeA.segment, xfA, shapeB.circle, xfB, manifold);
}

export function b2SegmentAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideSegmentAndCapsule(shapeA.segment, xfA, shapeB.capsule, xfB, manifold);
}

export function b2SegmentAndPolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideSegmentAndPolygon(shapeA.segment, xfA, shapeB.polygon, xfB, manifold);
}

export function b2ChainSegmentAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideChainSegmentAndCircle(shapeA.chainSegment, xfA, shapeB.circle, xfB, manifold);
}

export function b2ChainSegmentAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideChainSegmentAndCapsule(shapeA.chainSegment, xfA, shapeB.capsule, xfB, cache, manifold);
}

export function b2ChainSegmentAndPolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold)
{
    return b2CollideChainSegmentAndPolygon(shapeA.chainSegment, xfA, shapeB.polygon, xfB, cache, manifold);
}

export function b2AddType(fcn, type1, type2)
{
    console.assert(0 <= type1 && type1 < b2ShapeType.b2_shapeTypeCount);
    console.assert(0 <= type2 && type2 < b2ShapeType.b2_shapeTypeCount);
    s_registers[type1][type2].fcn = fcn;
    s_registers[type1][type2].primary = true;

    if ( type1 != type2 )
    {
        s_registers[type2][type1].fcn = fcn;
        s_registers[type2][type1].primary = false;
    }
}

// add callbacks for each manifold type
export function b2InitializeContactRegisters()
{
    if (s_initialized === false)
    {
        b2AddType(b2CircleManifold, b2ShapeType.b2_circleShape, b2ShapeType.b2_circleShape);
        b2AddType(b2CapsuleAndCircleManifold, b2ShapeType.b2_capsuleShape, b2ShapeType.b2_circleShape);
        b2AddType(b2CapsuleManifold, b2ShapeType.b2_capsuleShape, b2ShapeType.b2_capsuleShape);
        b2AddType(b2PolygonAndCircleManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_circleShape);
        b2AddType(b2PolygonAndCapsuleManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_capsuleShape);
        b2AddType(b2PolygonManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_polygonShape);
        b2AddType(b2SegmentAndCircleManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_circleShape);
        b2AddType(b2SegmentAndCapsuleManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_capsuleShape);
        b2AddType(b2SegmentAndPolygonManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_polygonShape);
        b2AddType(b2ChainSegmentAndCircleManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_circleShape);
        b2AddType(b2ChainSegmentAndCapsuleManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_capsuleShape);
        b2AddType(b2ChainSegmentAndPolygonManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_polygonShape);
        s_initialized = true;
    }
}

export function b2CreateContact(world, shapeA, shapeB)
{
    const type1 = shapeA.type;
    const type2 = shapeB.type;

    if (s_registers[type1][type2].fcn === null)
    {
        // For example, no segment vs segment collision
        return;
    }

    if (s_registers[type1][type2].primary === false)
    {
        // flip order
        b2CreateContact(world, shapeB, shapeA);

        return;
    }

    const bodyA = b2GetBody(world, shapeA.bodyId);
    const bodyB = b2GetBody(world, shapeB.bodyId);

    let setIndex;

    if (bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet)
    {
        setIndex = b2SetType.b2_awakeSet;
    }
    else
    {
        // sleeping and non-touching contacts live in the disabled set
        // later if this set is found to be touching then the sleeping
        // islands will be linked and the contact moved to the merged island
        setIndex = b2SetType.b2_disabledSet;
    }

    const set = world.solverSetArray[setIndex];

    // Create contact key and contact
    const contactId = b2AllocId(world.contactIdPool);

    // grow array until contactId will fit in it
    while (world.contactArray.length <= contactId)
    {
        world.contactArray.push(new b2Contact());
    }

    const shapeIdA = shapeA.id;
    const shapeIdB = shapeB.id;

    const contact = world.contactArray[contactId];
    contact.contactId = contactId;
    contact.setIndex = setIndex;
    contact.colorIndex = B2_NULL_INDEX;
    contact.localIndex = set.contacts.count;
    contact.islandId = B2_NULL_INDEX;
    contact.islandPrev = B2_NULL_INDEX;
    contact.islandNext = B2_NULL_INDEX;
    contact.shapeIdA = shapeIdA;
    contact.shapeIdB = shapeIdB;
    contact.isMarked = false;
    contact.flags = 0;

    if (shapeA.isSensor || shapeB.isSensor)
    {
        contact.flags |= b2ContactFlags.b2_contactSensorFlag;
    }

    if (shapeA.enableSensorEvents || shapeB.enableSensorEvents)
    {
        contact.flags |= b2ContactFlags.b2_contactEnableSensorEvents;
    }

    if (shapeA.enableContactEvents || shapeB.enableContactEvents)
    {
        contact.flags |= b2ContactFlags.b2_contactEnableContactEvents;
    }

    // Connect to body A
    {
        contact.edges[0].bodyId = shapeA.bodyId;
        contact.edges[0].prevKey = B2_NULL_INDEX;
        contact.edges[0].nextKey = bodyA.headContactKey;

        const keyA = (contactId << 1) | 0;
        const headContactKey = bodyA.headContactKey;

        if (headContactKey !== B2_NULL_INDEX)
        {
            const headContact = world.contactArray[headContactKey >> 1];
            headContact.edges[headContactKey & 1].prevKey = keyA;
        }
        bodyA.headContactKey = keyA;
        bodyA.contactCount += 1;
    }

    // Connect to body B
    {
        contact.edges[1].bodyId = shapeB.bodyId;
        contact.edges[1].prevKey = B2_NULL_INDEX;
        contact.edges[1].nextKey = bodyB.headContactKey;

        const keyB = (contactId << 1) | 1;
        const headContactKey = bodyB.headContactKey;

        if (bodyB.headContactKey !== B2_NULL_INDEX)
        {
            const headContact = world.contactArray[headContactKey >> 1];
            headContact.edges[headContactKey & 1].prevKey = keyB;
        }
        bodyB.headContactKey = keyB;
        bodyB.contactCount += 1;
    }

    // Add to pair set for fast lookup
    const pairKey = B2_SHAPE_PAIR_KEY(shapeIdA, shapeIdB);
    b2AddKey(world.broadPhase.pairSet, pairKey);

    // Contacts are created as non-touching. Later if they are found to be touching
    // they will link islands and be moved into the constraint graph.
    const contactSim = b2AddContact(set.contacts);
    contactSim.contactId = contactId;

    // #if B2_VALIDATE
    contactSim._bodyIdA = shapeA.bodyId;     // debug only
    contactSim._bodyIdB = shapeB.bodyId;     // debug only
    console.assert(contactSim._bodyIdA !== contactSim._bodyIdB);

    // #endif

    contactSim.bodySimIndexA = B2_NULL_INDEX;
    contactSim.bodySimIndexB = B2_NULL_INDEX;
    contactSim.invMassA = 0.0;
    contactSim.invIA = 0.0;
    contactSim.invMassB = 0.0;
    contactSim.invIB = 0.0;
    contactSim.shapeIdA = shapeIdA;
    contactSim.shapeIdB = shapeIdB;

    // contactSim.cache = new b2DistanceCache();
    // contactSim.manifold = new b2Manifold();
    contactSim.friction = b2MixFriction(shapeA.friction, shapeB.friction);
    contactSim.restitution = b2MixRestitution(shapeA.restitution, shapeB.restitution);
    contactSim.tangentSpeed = 0.0;
    contactSim.simFlags = 0;

    if (shapeA.enablePreSolveEvents || shapeB.enablePreSolveEvents)
    {
        contactSim.simFlags |= b2ContactSimFlags.b2_simEnablePreSolveEvents;
    }
}

export function b2DestroyContact(world, contact, wakeBodies)
{
    // Remove pair from set
    const pairKey = B2_SHAPE_PAIR_KEY(contact.shapeIdA, contact.shapeIdB);
    b2RemoveKey(world.broadPhase.pairSet, pairKey);

    const edgeA = contact.edges[0];
    const edgeB = contact.edges[1];

    const bodyIdA = edgeA.bodyId;
    const bodyIdB = edgeB.bodyId;
    const bodyA = b2GetBody(world, bodyIdA);
    const bodyB = b2GetBody(world, bodyIdB);

    const flags = contact.flags;

    if ((flags & (b2ContactFlags.b2_contactTouchingFlag | b2ContactFlags.b2_contactSensorTouchingFlag)) != 0 && (flags & (b2ContactFlags.b2_contactEnableContactEvents | b2ContactFlags.b2_contactEnableSensorEvents)) != 0)
    {
        const worldId = world.worldId;
        const shapeA = world.shapeArray[contact.shapeIdA];
        const shapeB = world.shapeArray[contact.shapeIdB];
        const shapeIdA = new b2ShapeId(shapeA.id + 1, worldId, shapeA.revision);
        const shapeIdB = new b2ShapeId(shapeB.id + 1, worldId, shapeB.revision);

        // Was touching?
        if ((flags & b2ContactFlags.b2_contactTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableContactEvents) != 0)
        {
            console.assert( ( flags & b2ContactFlags.b2_contactSensorFlag ) == 0 );
            const event = new b2ContactEndTouchEvent(shapeIdA, shapeIdB);
            world.contactEndArray.push(event);
        }

        if ((flags & b2ContactFlags.b2_contactSensorTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0)
        {
            console.assert( ( flags & b2ContactFlags.b2_contactSensorFlag ) != 0 );
            console.assert( shapeA.isSensor == true || shapeB.isSensor == true );
            console.assert( shapeA.isSensor != shapeB.isSensor );

            const event = new b2SensorEndTouchEvent();

            if (shapeA.isSensor)
            {
                event.sensorShapeId = shapeIdA;
                event.visitorShapeId = shapeIdB;
            }
            else
            {
                event.sensorShapeId = shapeIdB;
                event.visitorShapeId = shapeIdA;
            }

            world.sensorEndEventArray.push(event);
        }
    }

    // Remove from body A
    if (edgeA.prevKey !== B2_NULL_INDEX)
    {
        const prevContact = world.contactArray[edgeA.prevKey >> 1];
        const prevEdge = prevContact.edges[edgeA.prevKey & 1];
        prevEdge.nextKey = edgeA.nextKey;
    }

    if (edgeA.nextKey !== B2_NULL_INDEX)
    {
        const nextContact = world.contactArray[edgeA.nextKey >> 1];
        const nextEdge = nextContact.edges[edgeA.nextKey & 1];
        nextEdge.prevKey = edgeA.prevKey;
    }

    const contactId = contact.contactId;

    const edgeKeyA = (contactId << 1) | 0;

    if (bodyA.headContactKey === edgeKeyA)
    {
        bodyA.headContactKey = edgeA.nextKey;
    }

    bodyA.contactCount -= 1;

    // Remove from body B
    if (edgeB.prevKey !== B2_NULL_INDEX)
    {
        const prevContact = world.contactArray[edgeB.prevKey >> 1];
        const prevEdge = prevContact.edges[edgeB.prevKey & 1];
        prevEdge.nextKey = edgeB.nextKey;
    }

    if (edgeB.nextKey !== B2_NULL_INDEX)
    {
        const nextContact = world.contactArray[edgeB.nextKey >> 1];
        const nextEdge = nextContact.edges[edgeB.nextKey & 1];
        nextEdge.prevKey = edgeB.prevKey;
    }

    const edgeKeyB = (contactId << 1) | 1;

    if (bodyB.headContactKey === edgeKeyB)
    {
        bodyB.headContactKey = edgeB.nextKey;
    }

    bodyB.contactCount -= 1;

    // Remove contact from the array that owns it
    if (contact.islandId !== B2_NULL_INDEX)
    {
        b2UnlinkContact(world, contact);
    }

    if (contact.colorIndex !== B2_NULL_INDEX)
    {
        // contact is an active constraint
        console.assert(contact.setIndex == b2SetType.b2_awakeSet);
        b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, contact.colorIndex, contact.localIndex);
    }
    else
    {
        // contact is non-touching or is sleeping or is a sensor
        console.assert(contact.setIndex != b2SetType.b2_awakeSet ||
            (contact.flags & b2ContactFlags.b2_contactTouchingFlag) == 0 ||
            (contact.flags & b2ContactFlags.b2_contactSensorFlag) != 0);
        const set = world.solverSetArray[contact.setIndex];
        const movedIndex = b2RemoveContact(set.contacts, contact.localIndex);

        if (movedIndex !== B2_NULL_INDEX)
        {
            const movedContact = set.contacts.data[contact.localIndex];
            world.contactArray[movedContact.contactId].localIndex = contact.localIndex;
        }
    }

    contact.contactId = B2_NULL_INDEX;
    contact.setIndex = B2_NULL_INDEX;
    contact.colorIndex = B2_NULL_INDEX;
    contact.localIndex = B2_NULL_INDEX;

    b2FreeId(world.contactIdPool, contactId);

    if (wakeBodies)
    {
        b2WakeBody(world, bodyA);
        b2WakeBody(world, bodyB);
    }
}

export function b2GetContactSim(world, contact)
{
    if (contact.setIndex === b2SetType.b2_awakeSet && contact.colorIndex !== B2_NULL_INDEX)
    {
        // contact lives in constraint graph
        console.assert(0 <= contact.colorIndex && contact.colorIndex < b2_graphColorCount);
        const color = world.constraintGraph.colors[contact.colorIndex];
        console.assert(0 <= contact.localIndex && contact.localIndex < color.contacts.count);

        const sim = color.contacts.data[contact.localIndex];

        // console.assert(sim._bodyIdA !== B2_NULL_INDEX); //, (new Error().stack));
        // console.assert(sim._bodyIdB !== B2_NULL_INDEX); //, (new Error().stack));
        return sim;
    }

    // contact lives in the solver set contacts list
    const set = world.solverSetArray[contact.setIndex];
    console.assert(0 <= contact.localIndex && contact.localIndex <= set.contacts.count);

    return set.contacts.data[contact.localIndex];
}

export function b2ShouldShapesCollide(filterA, filterB)
{
    if (filterA.groupIndex === filterB.groupIndex && filterA.groupIndex !== 0)
    {
        return filterA.groupIndex > 0;
    }

    const collide = (filterA.maskBits & filterB.categoryBits) !== 0 && (filterA.categoryBits & filterB.maskBits) !== 0;

    return collide;
}

function b2TestShapeOverlap(shapeA, xfA, shapeB, xfB, cache)
{
    const input = new b2DistanceInput();
    input.proxyA = b2MakeShapeDistanceProxy(shapeA);
    input.proxyB = b2MakeShapeDistanceProxy(shapeB);
    input.transformA = xfA;
    input.transformB = xfB;
    input.useRadii = true;

    const output = b2ShapeDistance(cache, input, null, 0);

    return output.distance < 10.0 * eps;
}

const oldManifold = new b2Manifold();

export function b2UpdateContact(world, contactSim, shapeA, transformA, centerOffsetA, shapeB, transformB, centerOffsetB)
{
    let touching;

    // Is this contact a sensor?
    if (shapeA.isSensor || shapeB.isSensor)
    {
        // Sensors don't generate manifolds or hit events
        touching = b2TestShapeOverlap(shapeA, transformA, shapeB, transformB, contactSim.cache);
    }
    else
    {
        // Copy the existing manifold for matching just below...
        contactSim.manifold.copyTo(oldManifold);

        // Compute new manifold
        const fcn = s_registers[shapeA.type][shapeB.type].fcn;

        // Re-use the existing manifold
        fcn(shapeA, transformA, shapeB, transformB, contactSim.cache, contactSim.manifold);

        const pointCount = contactSim.manifold.pointCount;
        touching = pointCount > 0;

        if ( touching && world.preSolveFcn && ( contactSim.simFlags & b2ContactSimFlags.b2_simEnablePreSolveEvents ) != 0 )
        {
            const shapeIdA = new b2ShapeId(shapeA.id + 1, world.worldId, shapeA.revision);
            const shapeIdB = new b2ShapeId(shapeB.id + 1, world.worldId, shapeB.revision);

            // this call assumes thread safety
            touching = world.preSolveFcn( shapeIdA, shapeIdB, contactSim.manifold, world.preSolveContext );

            if ( touching == false )
            {
                // disable contact
                contactSim.manifold.pointCount = 0;
            }
        }

        if (touching && (shapeA.enableHitEvents || shapeB.enableHitEvents))
        {
            contactSim.simFlags |= b2ContactSimFlags.b2_simEnableHitEvent;
        }
        else
        {
            contactSim.simFlags &= ~b2ContactSimFlags.b2_simEnableHitEvent;
        }

        // Match old contact ids to new contact ids and copy the
        // stored impulses to warm start the solver.
        for (let i = 0; i < pointCount; ++i)
        {
            const mp2 = contactSim.manifold.points[i];

            // shift anchors to be center of mass relative
            // mp2.anchorA = b2Sub(mp2.anchorA, centerOffsetA);
            mp2.anchorAX -= centerOffsetA.x;
            mp2.anchorAY -= centerOffsetA.y;

            // mp2.anchorB = b2Sub(mp2.anchorB, centerOffsetB);
            mp2.anchorBX -= centerOffsetB.x;
            mp2.anchorBY -= centerOffsetB.y;

            mp2.normalImpulse = 0.0;
            mp2.tangentImpulse = 0.0;
            mp2.maxNormalImpulse = 0.0;
            mp2.normalVelocity = 0.0;
            mp2.persisted = false;

            const id2 = mp2.id;

            for (let j = 0, l = oldManifold.pointCount; j < l; ++j)
            {
                const mp1 = oldManifold.points[j];

                if (mp1.id === id2)
                {
                    mp2.normalImpulse = mp1.normalImpulse;
                    mp2.tangentImpulse = mp1.tangentImpulse;
                    mp2.persisted = true;

                    break;
                }
            }
        }
    }

    if (touching)
    {
        contactSim.simFlags |= b2ContactSimFlags.b2_simTouchingFlag;
    }
    else
    {
        contactSim.simFlags &= ~b2ContactSimFlags.b2_simTouchingFlag;
    }

    return touching;
}

export function b2ComputeManifold(shapeA, transformA, shapeB, transformB, manifold)
{
    const fcn = s_registers[shapeA.type][shapeB.type].fcn;
    const cache = new b2DistanceCache();

    return fcn( shapeA, transformA, shapeB, transformB, cache, manifold );
}
