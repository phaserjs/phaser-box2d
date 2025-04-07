/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_HUGE, B2_NULL_INDEX, b2_aabbMargin, b2_graphColorCount, b2_speculativeDistance } from './include/core_h.js';
import { b2AABB, b2AABB_Contains, b2AABB_Union, b2Add, b2Cross, b2CrossSV, b2Dot, b2InvRotateVector, b2InvTransformPoint, b2IsValid, b2LengthSquared, b2MulAdd, b2MulSV, b2Rot, b2Rot_IsValid, b2RotateVector, b2Sub, b2Transform, b2TransformPoint, b2Vec2, b2Vec2_IsValid } from './include/math_functions_h.js';
import { b2AddBodySim, b2AddBodyState, b2RemoveBodySim, b2RemoveBodyState } from './include/block_array_h.js';
import { b2AllocId, b2FreeId } from './include/id_pool_h.js';
import { b2BodyId, b2JointId, b2ShapeId } from './include/id_h.js';
import { b2ComputeShapeAABB, b2ComputeShapeExtent, b2ComputeShapeMass, b2CreateShapeProxy, b2DestroyShapeProxy } from './include/shape_h.js';
import { b2ContactFlags, b2DestroyContact, b2GetContactSim } from './include/contact_h.js';
import { b2CreateIsland, b2DestroyIsland, b2LinkJoint, b2MergeAwakeIslands, b2SplitIsland, b2UnlinkJoint, b2ValidateIsland } from './include/island_h.js';
import { b2DestroyJointInternal, b2GetJoint } from './include/joint_h.js';
import { b2DestroySolverSet, b2SolverSet, b2TransferBody, b2TransferJoint, b2TrySleepIsland, b2WakeSolverSet } from './include/solver_set_h.js';
import { b2GetWorld, b2GetWorldLocked } from './include/world_h.js';
import { b2GetWorldFromId, b2SetType, b2ValidateConnectivity, b2ValidateSolverSets } from './include/world_h.js';

import { b2Body } from './include/body_h.js';
import { b2BodyType } from './include/types_h.js';
import { b2Body_IsValid } from './include/world_h.js';
import { b2BroadPhase_MoveProxy } from './include/broad_phase_h.js';
import { b2MassData } from './include/collision_h.js';

/**
 * @namespace Body
 */

/**
 * @import {b2WorldId} from './include/id_h.js'
 * @import {b2BodyDef, b2ContactData} from './include/types_h.js'
 */

export function b2MakeSweep(bodySim, out)
{
    out.c1.x = bodySim.center0X;
    out.c1.y = bodySim.center0Y;
    out.c2.copy(bodySim.center);
    out.q1.copy(bodySim.rotation0);
    out.q2.copy(bodySim.transform.q);
    out.localCenter.copy(bodySim.localCenter);

    return out;
}

export function b2GetBody(world, bodyId)
{
    return world.bodyArray[bodyId];
}

export function b2GetBodyFullId(world, bodyId)
{
    console.assert(b2Body_IsValid(bodyId), `invalid bodyId ${JSON.stringify(bodyId)}\n${new Error().stack}`);

    return b2GetBody(world, bodyId.index1 - 1);
}

export function b2GetBodyTransformQuick(world, body)
{
    console.assert(0 <= body.setIndex && body.setIndex < world.solverSetArray.length);
    const set = world.solverSetArray[body.setIndex];
    console.assert(0 <= body.localIndex && body.localIndex <= set.sims.count);
    const bodySim = set.sims.data[body.localIndex];
    console.assert(bodySim.transform != null);
    console.assert(bodySim.transform.p != null);
    console.assert(!Number.isNaN(bodySim.transform.p.x));
    console.assert(!Number.isNaN(bodySim.transform.q.c));

    return bodySim.transform;
}

export function b2GetBodyTransform(world, bodyId)
{
    // b2CheckIndex(world.bodyArray, bodyId);
    const body = world.bodyArray[bodyId];

    return b2GetBodyTransformQuick(world, body);
}

export function b2MakeBodyId(world, bodyId)
{
    // b2CheckIndex(world.bodyArray, bodyId);
    const body = world.bodyArray[bodyId];

    return new b2BodyId(bodyId + 1, world.worldId, body.revision);
}

export function b2GetBodySim(world, body)
{
    // b2CheckIndex(world.solverSetArray, body.setIndex);
    console.assert(body.setIndex >= 0);
    const set = world.solverSetArray[body.setIndex];
    console.assert(0 <= body.localIndex && body.localIndex < set.sims.count);

    return set.sims.data[body.localIndex];
}

export function b2GetBodyState(world, body)
{
    // b2CheckIndex(world.solverSetArray, body.setIndex);
    console.assert(body.setIndex >= 0);

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const set = world.solverSetArray[b2SetType.b2_awakeSet];

        // console.assert(0 <= body.localIndex && body.localIndex < set.states.count);
        return set.states.data[body.localIndex];
    }

    return null;
}

export function b2CreateIslandForBody(world, setIndex, body)
{
    console.assert(body.islandId === B2_NULL_INDEX);
    console.assert(body.islandPrev === B2_NULL_INDEX);
    console.assert(body.islandNext === B2_NULL_INDEX);
    console.assert(setIndex !== b2SetType.b2_disabledSet);

    const island = b2CreateIsland(world, setIndex);

    body.islandId = island.islandId;
    island.headBody = body.id;
    island.tailBody = body.id;
    island.bodyCount = 1;
}

export function b2RemoveBodyFromIsland(world, body)
{
    if (body.islandId === B2_NULL_INDEX)
    {
        // console.assert(body.islandPrev === B2_NULL_INDEX);
        // console.assert(body.islandNext === B2_NULL_INDEX);
        return;
    }

    const islandId = body.islandId;

    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];

    // Fix the island's linked list of sims
    if (body.islandPrev !== B2_NULL_INDEX)
    {
        const prevBody = b2GetBody(world, body.islandPrev);
        prevBody.islandNext = body.islandNext;
    }

    if (body.islandNext !== B2_NULL_INDEX)
    {
        const nextBody = b2GetBody(world, body.islandNext);
        nextBody.islandPrev = body.islandPrev;
    }

    console.assert(island.bodyCount > 0);
    island.bodyCount -= 1;
    let islandDestroyed = false;

    if (island.headBody === body.id)
    {
        island.headBody = body.islandNext;

        if (island.headBody === B2_NULL_INDEX)
        {
            // Destroy empty island
            console.assert(island.tailBody === body.id);
            console.assert(island.bodyCount === 0);
            console.assert(island.contactCount === 0);
            console.assert(island.jointCount === 0);

            // Free the island
            b2DestroyIsland(world, island.islandId);
            islandDestroyed = true;
        }
    }
    else if (island.tailBody === body.id)
    {
        island.tailBody = body.islandPrev;
    }

    if (islandDestroyed === false)
    {
        b2ValidateIsland(world, islandId);
    }

    body.islandId = B2_NULL_INDEX;
    body.islandPrev = B2_NULL_INDEX;
    body.islandNext = B2_NULL_INDEX;
}

export function b2DestroyBodyContacts(world, body, wakeBodies)
{
    // Destroy the attached contacts
    let edgeKey = body.headContactKey;

    while (edgeKey !== B2_NULL_INDEX)
    {
        const contactId = edgeKey >> 1;
        const edgeIndex = edgeKey & 1;

        const contact = world.contactArray[contactId];
        edgeKey = contact.edges[edgeIndex].nextKey;
        b2DestroyContact(world, contact, wakeBodies);
    }

    b2ValidateSolverSets(world);
}

/**
 * @function b2CreateBody
 * @param {b2WorldId} worldId - The ID of the world to create the body in
 * @param {b2BodyDef} def - The body definition containing initialization parameters
 * @returns {b2BodyId} The ID of the newly created body
 * @description
 * Creates a new physics body in the specified world based on the provided body definition.
 * The body is added to the appropriate solver set based on its type and state.
 * The function initializes the body's physical properties including position, rotation,
 * velocities, damping values and other simulation parameters.
 * @throws {Error} Throws assertion errors if:
 * - Position vector is invalid
 * - Rotation value is invalid
 * - Linear velocity vector is invalid
 * - Angular velocity is invalid
 * - Linear damping is invalid or negative
 * - Angular damping is invalid or negative
 * - Sleep threshold is invalid or negative
 * - Gravity scale is invalid
 */
export function b2CreateBody(worldId, def)
{
    // b2CheckDef(def);
    console.assert(b2Vec2_IsValid(def.position));
    console.assert(b2Rot_IsValid(def.rotation));
    console.assert(b2Vec2_IsValid(def.linearVelocity));
    console.assert(b2IsValid(def.angularVelocity));
    console.assert(b2IsValid(def.linearDamping) && def.linearDamping >= 0.0);
    console.assert(b2IsValid(def.angularDamping) && def.angularDamping >= 0.0);
    console.assert(b2IsValid(def.sleepThreshold) && def.sleepThreshold >= 0.0);
    console.assert(b2IsValid(def.gravityScale));

    const world = b2GetWorldFromId(worldId);

    if (world.locked)
    {
        console.warn("Cannot create body while world is locked (are you adding a body during PreSolve callback?)");

        return new b2BodyId(0, 0, 0);
    }

    const isAwake = (def.isAwake || def.enableSleep === false) && def.isEnabled;

    // determine the solver set
    let setId;

    if (def.isEnabled === false)
    {
        // any body type can be disabled
        setId = b2SetType.b2_disabledSet;
    }
    else if (def.type === b2BodyType.b2_staticBody)
    {
        setId = b2SetType.b2_staticSet;
    }
    else if (isAwake === true)
    {
        setId = b2SetType.b2_awakeSet;
    }
    else
    {
        // new set for a sleeping body in its own island
        setId = b2AllocId(world.solverSetIdPool);
        console.warn("new set for a sleeping body " + setId);

        if (setId === world.solverSetArray.length)
        {
            const set = new b2SolverSet();
            set.setIndex = setId;
            world.solverSetArray.push(set);
        }
        else
        {
            console.assert(world.solverSetArray[setId].setIndex === B2_NULL_INDEX);
        }

        world.solverSetArray[setId].setIndex = setId;
    }

    // console.assert(0 <= setId && setId < world.solverSetArray.length);

    const bodyId = b2AllocId(world.bodyIdPool);

    const set = world.solverSetArray[setId];
    const bodySim = b2AddBodySim(set.sims);

    Object.assign(bodySim, {
        transform: new b2Transform(def.position, def.rotation),
        center: def.position.clone(),
        rotation0: def.rotation,
        center0X: def.position.x,
        center0Y: def.position.y,
        localCenter: new b2Vec2(),
        force: new b2Vec2(),
        torque: 0.0,
        mass: 0.0,
        invMass: 0.0,
        inertia: 0.0,
        invInertia: 0.0,
        minExtent: B2_HUGE,
        maxExtent: 0.0,
        linearDamping: def.linearDamping,
        angularDamping: def.angularDamping,
        gravityScale: def.gravityScale,
        bodyId: bodyId,
        isBullet: def.isBullet,
        allowFastRotation: def.allowFastRotation,
        enlargeAABB: false,
        isFast: false,
        isSpeedCapped: false
    });
    console.assert(bodySim.transform);

    if (setId === b2SetType.b2_awakeSet)
    {
        const bodyState = b2AddBodyState(set.states);
        console.assert((bodyState & 0x1F) === 0);

        Object.assign(bodyState, {
            linearVelocity: def.linearVelocity,
            angularVelocity: def.angularVelocity,
            deltaRotation: new b2Rot()
        });
    }

    // PJB NOTE: this 'bodyId' is the index in the world.bodyArray (so really, bodyIndex??)
    while (bodyId >= world.bodyArray.length)
    {
        world.bodyArray.push(new b2Body());
    }

    console.assert(world.bodyArray[bodyId].id === B2_NULL_INDEX, "bodyId " + bodyId + " id " + world.bodyArray[bodyId].id);

    // b2CheckIndex(world.bodyArray, bodyId);
    const body = world.bodyArray[bodyId];
    Object.assign(body, {
        userData: def.userData,
        setIndex: setId,
        localIndex: set.sims.count - 1,
        revision: body.revision + 1,
        headShapeId: B2_NULL_INDEX,
        shapeCount: 0,
        headChainId: B2_NULL_INDEX,
        headContactKey: B2_NULL_INDEX,
        contactCount: 0,
        headJointKey: B2_NULL_INDEX,        // PJB NOTE: combination of joint id (>> 1) and edge index (& 0x01)
        jointCount: 0,
        islandId: B2_NULL_INDEX,
        islandPrev: B2_NULL_INDEX,
        islandNext: B2_NULL_INDEX,
        bodyMoveIndex: B2_NULL_INDEX,
        id: bodyId,                         // PJB NOTE: body.id is bodyId (is index in worldBodyArray)
        sleepThreshold: def.sleepThreshold,
        sleepTime: 0.0,
        type: def.type,
        enableSleep: def.enableSleep,
        fixedRotation: def.fixedRotation,
        isSpeedCapped: false,
        isMarked: false,
        updateBodyMass: def.updateBodyMass
    });

    // dynamic and kinematic bodies that are enabled need an island
    if (setId >= b2SetType.b2_awakeSet)
    {
        b2CreateIslandForBody(world, setId, body);
    }

    b2ValidateSolverSets(world);
    
    return new b2BodyId(bodyId + 1, world.worldId, body.revision);
}

export function b2IsBodyAwake(world, body)
{
    return body.setIndex === b2SetType.b2_awakeSet;
}

export function b2WakeBody(world, body)
{
    if (body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeSolverSet(world, body.setIndex);

        return true;
    }

    return false;
}

/**
 * @function b2DestroyBody
 * @description
 * Destroys a body and all associated joints, contacts, shapes, and chains in the physics world.
 * The function cleans up all resources and removes the body from the simulation system.
 * @param {b2BodyId} bodyId - The identifier of the body to destroy
 * @returns {void}
 * @throws {Error} Throws assertion errors if body indices are invalid during removal
 * @note This function performs the following cleanup operations:
 * - Destroys all joints connected to the body
 * - Removes all contacts associated with the body
 * - Destroys all shapes attached to the body
 * - Removes all chains connected to the body
 * - Removes the body from the island structure
 * - Cleans up solver sets and simulation data
 */
export function b2DestroyBody(bodyId)
{
    // ("b2DestroyBody " + JSON.stringify(bodyId));
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);

    // Wake bodies attached to this body, even if this body is static.
    const wakeBodies = true;

    // Destroy the attached joints
    let edgeKey = body.headJointKey;

    while (edgeKey !== B2_NULL_INDEX)
    {
        const jointId = edgeKey >> 1;
        const edgeIndex = edgeKey & 1;

        const joint = world.jointArray[jointId];
        edgeKey = joint.edges[edgeIndex].nextKey;

        // Careful because this modifies the list being traversed
        b2DestroyJointInternal(world, joint, wakeBodies);
    }

    // Destroy all contacts attached to this body.
    b2DestroyBodyContacts(world, body, wakeBodies);

    // Destroy the attached shapes and their broad-phase proxies.
    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];

        b2DestroyShapeProxy(shape, world.broadPhase);

        // Return shape to free list.
        b2FreeId(world.shapeIdPool, shapeId);
        shape.id = B2_NULL_INDEX;

        shapeId = shape.nextShapeId;
    }

    // Destroy the attached chains. The associated shapes have already been destroyed above.
    let chainId = body.headChainId;

    while (chainId !== B2_NULL_INDEX)
    {
        const chain = world.chainArray[chainId];
        chain.shapeIndices = null;

        // Return chain to free list.
        b2FreeId(world.chainIdPool, chainId);
        chain.id = B2_NULL_INDEX;

        chainId = chain.nextChainId;
    }

    b2RemoveBodyFromIsland(world, body);

    // Remove body sim from solver set that owns it
    // (swap the last item in the list into its position, overwriting and removing its data)
    console.assert(body.setIndex != B2_NULL_INDEX);
    const set = world.solverSetArray[body.setIndex];
    const movedIndex = b2RemoveBodySim(set.sims, body.localIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        // Fix moved body index

        // get the body data from the set using the 
        const movedSim = set.sims.data[body.localIndex];

        const movedId = movedSim.bodyId;
        const movedBody = world.bodyArray[movedId];
        console.assert(movedBody.localIndex === movedIndex);
        movedBody.localIndex = body.localIndex;
    }

    // Remove body state from awake set
    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const result = b2RemoveBodyState(set.states, body.localIndex);

        // B2_MAYBE_UNUSED(result);
        console.assert(result === movedIndex);
    }
    else if ( set.setIndex >= b2SetType.b2_firstSleepingSet && set.sims.count == 0 )
    {
        // Remove solver set if it's now an orphan.
        b2DestroySolverSet( world, set.setIndex );
    }

    // Free body and id (preserve body revision)
    b2FreeId(world.bodyIdPool, body.id);

    body.setIndex = B2_NULL_INDEX;
    body.localIndex = B2_NULL_INDEX;
    body.id = B2_NULL_INDEX;

    b2ValidateSolverSets(world);
}

/**
 * Gets the contact capacity of a body.
 * @function b2Body_GetContactCapacity
 * @param {b2BodyId} bodyId - The identifier for the body to query
 * @returns {number} The number of contacts associated with the body. Returns 0 if the world is invalid.
 * @description
 * Retrieves the current number of contacts associated with the specified body.
 * The function first validates the world reference before accessing the body's contact count.
 */
export function b2Body_GetContactCapacity(bodyId)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return 0;
    }

    const body = b2GetBodyFullId(world, bodyId);

    // Conservative and fast
    return body.contactCount;
}

/**
 * @function b2Body_GetContactData
 * @param {b2BodyId} bodyId - The ID of the body to get contact data from
 * @param {Array<b2ContactData>} contactData - Array to store the contact data
 * @param {number} capacity - Maximum number of contacts to retrieve
 * @returns {number} The number of contacts stored in contactData
 * @description
 * Retrieves contact data for a specified body. For each active contact, stores the shape IDs
 * of both bodies involved and the contact manifold. Only stores contacts that have the
 * touching flag set.
 * @throws {Error} If the world is locked or invalid
 */
export function b2Body_GetContactData(bodyId, contactData, capacity)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return 0;
    }

    const body = b2GetBodyFullId(world, bodyId);

    let contactKey = body.headContactKey;
    let index = 0;

    while (contactKey !== B2_NULL_INDEX && index < capacity)
    {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;

        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];

        // Is contact touching?
        if (contact.flags & b2ContactFlags.b2_contactTouchingFlag)
        {
            const shapeA = world.shapeArray[contact.shapeIdA];
            const shapeB = world.shapeArray[contact.shapeIdB];

            contactData[index].shapeIdA = new b2ShapeId(shapeA.id + 1, bodyId.world0, shapeA.revision);
            contactData[index].shapeIdB = new b2ShapeId(shapeB.id + 1, bodyId.world0, shapeB.revision);

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
 * @function b2Body_ComputeAABB
 * @summary Computes the Axis-Aligned Bounding Box (AABB) for a body and all its shapes.
 * @param {b2BodyId} bodyId - The identifier for the body whose AABB is to be computed.
 * @returns {b2AABB} An AABB that encompasses the body and all its shapes. Returns an empty AABB if the world is not found.
 * @description
 * For bodies with no shapes, returns an AABB containing only the body's position.
 * For bodies with shapes, computes the union of AABBs of all shapes attached to the body.
 */
export function b2Body_ComputeAABB(bodyId)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return new b2AABB();
    }

    const body = b2GetBodyFullId(world, bodyId);

    if (body.headShapeId === B2_NULL_INDEX)
    {
        const transform = b2GetBodyTransform(world, body.id);
        const aabb = new b2AABB(transform.p.x, transform.p.y, transform.p.x, transform.p.y);

        return aabb;
    }

    let shape = world.shapeArray[body.headShapeId];
    let aabb = shape.aabb;

    while (shape.nextShapeId !== B2_NULL_INDEX)
    {
        shape = world.shapeArray[shape.nextShapeId];
        aabb = b2AABB_Union(aabb, shape.aabb);
    }

    return aabb;
}

export function b2UpdateBodyMassData(world, body)
{
    const bodySim = b2GetBodySim(world, body);

    // Compute mass data from shapes. Each shape has its own density.
    bodySim.mass = 0.0;
    bodySim.invMass = 0.0;
    bodySim.inertia = 0.0;
    bodySim.invInertia = 0.0;

    // bodySim.localCenter = new b2Vec2(); assigned in the function
    bodySim.minExtent = B2_HUGE;
    bodySim.maxExtent = 0.0;

    // Static and kinematic sims have zero mass.
    if (body.type !== b2BodyType.b2_dynamicBody)
    {
        bodySim.center = bodySim.transform.p.clone();

        // Need extents for kinematic bodies for sleeping to work correctly.
        if (body.type === b2BodyType.b2_kinematicBody)
        {
            let shapeId = body.headShapeId;

            while (shapeId !== B2_NULL_INDEX)
            {
                const s = world.shapeArray[shapeId];
                shapeId = s.nextShapeId;

                const extent = b2ComputeShapeExtent(s, new b2Vec2());
                bodySim.minExtent = Math.min(bodySim.minExtent, extent.minExtent);
                bodySim.maxExtent = Math.max(bodySim.maxExtent, extent.maxExtent);
            }
        }

        return;
    }

    // Accumulate mass over all shapes.
    let localCenter = new b2Vec2();
    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const s = world.shapeArray[shapeId];
        shapeId = s.nextShapeId;

        if (s.density === 0.0)
        {
            continue;
        }

        const massData = b2ComputeShapeMass(s);
        bodySim.mass += massData.mass;
        localCenter = b2MulAdd(localCenter, massData.mass, massData.center);
        bodySim.inertia += massData.rotationalInertia;
    }

    // Compute center of mass.
    console.assert(bodySim.mass > 0.0, "A body has zero mass, check both density and size!");

    if (bodySim.mass > 0.0)
    {
        bodySim.invMass = 1.0 / bodySim.mass;
        localCenter = b2MulSV(bodySim.invMass, localCenter);
    }

    if (bodySim.inertia > 0.0 && body.fixedRotation === false)
    {
        // Center the inertia about the center of mass.
        bodySim.inertia -= bodySim.mass * b2Dot(localCenter, localCenter);
        console.assert(bodySim.inertia > 0.0);
        bodySim.invInertia = 1.0 / bodySim.inertia;
    }
    else
    {
        bodySim.inertia = 0.0;
        bodySim.invInertia = 0.0;
    }

    // Move center of mass.
    const oldCenter = bodySim.center.clone();
    bodySim.localCenter = localCenter;
    bodySim.center = b2TransformPoint(bodySim.transform, bodySim.localCenter);

    // Update center of mass velocity
    const state = b2GetBodyState(world, body);

    if (state !== null)
    {
        const deltaLinear = b2CrossSV(state.angularVelocity, b2Sub(bodySim.center, oldCenter));
        state.linearVelocity = b2Add(state.linearVelocity, deltaLinear);
    }

    // Compute body extents relative to center of mass
    shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const s = world.shapeArray[shapeId];
        shapeId = s.nextShapeId;

        const extent = b2ComputeShapeExtent(s, localCenter);
        bodySim.minExtent = Math.min(bodySim.minExtent, extent.minExtent);
        bodySim.maxExtent = Math.max(bodySim.maxExtent, extent.maxExtent);
    }
}

/**
 * @function b2Body_GetPosition
 * @summary Gets the current position of a body in the physics world.
 * @param {b2BodyId} bodyId - The identifier for the body whose position is being queried.
 * @returns {b2Vec2} The position vector of the body in world coordinates.
 * @description
 * Retrieves the current position component of a body's transform from the physics world.
 * The position is returned as a b2Vec2 representing the body's location in world space.
 */
export function b2Body_GetPosition(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return transform.p;
}

/**
 * Gets the rotation component of a body's transform.
 * @function b2Body_GetRotation
 * @param {b2BodyId} bodyId - The identifier for the body whose rotation is being queried.
 * @returns {b2Rot} A rotation object containing the cosine and sine of the body's angle.
 * @description
 * Retrieves the rotation component (q) from the body's transform. The returned b2Rot
 * object represents the body's angular orientation in 2D space.
 */
export function b2Body_GetRotation(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return transform.q;
}

/**
 * @summary Gets the transform of a body in the physics world.
 * @function b2Body_GetTransform
 * @param {Object} bodyId - The identifier object for the body, containing world reference.
 * @param {number} bodyId.world0 - The world identifier.
 * @returns {Object} The body's transform containing:
 * - position {b2Vec2} The position vector (x, y)
 * - rotation {b2Rot} The rotation values (c, s)
 * @description
 * Retrieves the current transform (position and rotation) of a physics body
 * from the specified Box2D world using the body's identifier.
 */
export function b2Body_GetTransform(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return b2GetBodyTransformQuick(world, body);
}

/**
 * Converts a point from world coordinates to local body coordinates.
 * @function b2Body_GetLocalPoint
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} worldPoint - A point in world coordinates
 * @returns {b2Vec2} The point expressed in the body's local coordinates
 * @description
 * Takes a point given in world coordinates and converts it to the body's local
 * coordinate system by applying the inverse of the body's transform.
 */
export function b2Body_GetLocalPoint(bodyId, worldPoint)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return b2InvTransformPoint(transform, worldPoint);
}

/**
 * @function b2Body_GetWorldPoint
 * @summary Converts a point from local body coordinates to world coordinates.
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @param {b2Vec2} localPoint - A point in the body's local coordinates.
 * @returns {b2Vec2} The point transformed to world coordinates.
 * @description
 * Takes a point given in body-local coordinates and converts it to world coordinates
 * using the body's current transform (position and rotation).
 */
export function b2Body_GetWorldPoint(bodyId, localPoint)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return b2TransformPoint(transform, localPoint);
}

/**
 * @function b2Body_GetLocalVector
 * @summary Converts a vector from world space to a body's local space
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} worldVector - A vector in world coordinates
 * @returns {b2Vec2} The vector transformed into the body's local coordinates
 * @description
 * Takes a vector defined in world coordinates and transforms it to be relative
 * to the body's local coordinate system by applying the inverse of the body's rotation.
 */
export function b2Body_GetLocalVector(bodyId, worldVector)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return b2InvRotateVector(transform.q, worldVector);
}

/**
 * @function b2Body_GetWorldVector
 * @summary Converts a vector from local body coordinates to world coordinates.
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} localVector - A vector in local body coordinates
 * @returns {b2Vec2} The vector transformed into world coordinates
 * @description
 * Transforms a vector from the body's local coordinate system to the world
 * coordinate system. This operation only performs rotation (not translation)
 * using the body's current rotation matrix.
 */
export function b2Body_GetWorldVector(bodyId, localVector)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    return b2RotateVector(transform.q, localVector);
}

/**
 * @function b2Body_SetTransform
 * @description
 * Sets the position and rotation of a body, updating its transform and associated shape AABBs.
 * The function updates the body's center, handles broad-phase movement, and adjusts collision bounds.
 * @param {b2BodyId} bodyId - The identifier of the body to transform
 * @param {b2Vec2} position - The new position vector for the body
 * @param {b2Rot} [rotation] - The new rotation for the body. If undefined, keeps current rotation
 * @returns {void}
 * @throws {Error} Throws assertion error if:
 * - The position vector is invalid
 * - The body ID is invalid
 * - The world is locked
 * - The rotation (if provided) is invalid
 */
export function b2Body_SetTransform(bodyId, position, rotation)
{
    console.assert(b2Vec2_IsValid(position));
    console.assert(b2Body_IsValid(bodyId));
    const world = b2GetWorld(bodyId.world0);
    console.assert(world.locked === false);

    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    console.assert(b2Rot_IsValid(rotation) || b2Rot_IsValid(bodySim.transform.q));

    bodySim.transform.p = position;

    if (rotation !== undefined)
    {
        bodySim.transform.q = rotation;
    }
    bodySim.center = b2TransformPoint(bodySim.transform, bodySim.localCenter);

    bodySim.rotation0 = bodySim.transform.q;
    bodySim.center0X = bodySim.center.x;
    bodySim.center0Y = bodySim.center.y;

    const broadPhase = world.broadPhase;

    const transform = bodySim.transform;
    const margin = b2_aabbMargin;
    const speculativeDistance = b2_speculativeDistance;

    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];
        const aabb = b2ComputeShapeAABB(shape, transform);
        aabb.lowerBoundX -= speculativeDistance;
        aabb.lowerBoundY -= speculativeDistance;
        aabb.upperBoundX += speculativeDistance;
        aabb.upperBoundY += speculativeDistance;
        shape.aabb = aabb;

        if (b2AABB_Contains(shape.fatAABB, aabb) === false)
        {
            const fatAABB = new b2AABB(aabb.lowerBoundX - margin, aabb.lowerBoundY - margin,
                aabb.upperBoundX + margin, aabb.upperBoundY + margin);
            shape.fatAABB = fatAABB;

            // The body could be disabled
            if (shape.proxyKey !== B2_NULL_INDEX)
            {
                b2BroadPhase_MoveProxy(broadPhase, shape.proxyKey, fatAABB);
            }
        }

        shapeId = shape.nextShapeId;
    }
}

/**
 * Gets a clone of the linear velocity of a body.
 * @function b2Body_GetLinearVelocity
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {b2Vec2} The linear velocity vector of the body. Returns a zero vector (0,0) if the body state is null.
 * @description
 * Retrieves the current linear velocity of a body from its state in the physics world.
 * If the body state cannot be found, returns a zero vector.
 * Linear velocity is often used for calculations (damping, direction, etc) and must be cloned to avoid unwanted effects in the Physics engine.
 */
export function b2Body_GetLinearVelocity(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const state = b2GetBodyState(world, body);

    if (state !== null)
    {
        return state.linearVelocity.clone();
    }

    return new b2Vec2();
}

/**
 * Gets the angular velocity of a body.
 * @function b2Body_GetAngularVelocity
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The angular velocity in radians per second. Returns 0 if the body state cannot be retrieved.
 * @description
 * Retrieves the current angular velocity of a body from its state in the physics world.
 * Angular velocity represents how fast the body is rotating.
 */
export function b2Body_GetAngularVelocity(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const state = b2GetBodyState(world, body);

    if (state !== null)
    {
        return state.angularVelocity;
    }

    return 0.0;
}

/**
 * Sets the linear velocity of a body.
 * @function b2Body_SetLinearVelocity
 * @param {b2BodyId} bodyId - The identifier of the body to modify.
 * @param {b2Vec2} linearVelocity - The new linear velocity vector to set.
 * @returns {void}
 * @description
 * Sets the linear velocity of a body. If the body is static, the function returns without
 * making changes. If the new velocity has a non-zero magnitude, the body will be awakened.
 * The function will return early if the body state cannot be retrieved.
 */
export function b2Body_SetLinearVelocity(bodyId, linearVelocity)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (body.type == b2BodyType.b2_staticBody)
    {
        return;
    }

    if (b2LengthSquared(linearVelocity) > 0.0)
    {
        b2WakeBody(world, body);
    }

    const state = b2GetBodyState(world, body);

    if (state === null)
    {
        return;
    }

    state.linearVelocity = linearVelocity;
}

/**
 * Sets the angular velocity of a body.
 * @function b2Body_SetAngularVelocity
 * @param {b2BodyId} bodyId - The identifier of the body to modify
 * @param {number} angularVelocity - The new angular velocity in radians per second
 * @returns {void}
 * @description
 * Sets the angular velocity of a body. If the body is static or has fixed rotation,
 * the function returns without making changes. The body is woken up if a non-zero
 * angular velocity is set.
 */
export function b2Body_SetAngularVelocity(bodyId, angularVelocity)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (body.type == b2BodyType.b2_staticBody || body.fixedRotation)
    {
        return;
    }
    
    if (angularVelocity !== 0.0)
    {
        b2WakeBody(world, body);
    }

    const state = b2GetBodyState(world, body);

    if (state === null)
    {
        return;
    }

    state.angularVelocity = angularVelocity;
}

/**
 * @function b2Body_ApplyForce
 * @description
 * Applies a force at a world point to a body. If the force is not applied at the
 * center of mass, it will generate a torque and affect angular motion.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the force to
 * @param {b2Vec2} force - The world force vector
 * @param {b2Vec2} point - The world position of the point of application
 * @param {boolean} wake - Whether to wake the body if it is sleeping
 * @returns {void}
 * @note The force is accumulated and applied during the next time step. The body
 * must be awake for the force to be applied.
 */
export function b2Body_ApplyForce(bodyId, force, point, wake)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const bodySim = b2GetBodySim(world, body);
        bodySim.force = b2Add(bodySim.force, force);
        bodySim.torque += b2Cross(b2Sub(point, bodySim.center), force);
    }
}

/**
 * @function b2Body_ApplyForceToCenter
 * @description
 * Applies a force to the center of mass of a body. If the body is sleeping, it can optionally be woken up.
 * The force is only applied if the body is in the awake set.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the force to
 * @param {b2Vec2} force - The world force vector to apply to the body's center
 * @param {boolean} wake - Whether to wake the body if it is sleeping
 * @returns {void}
 */
export function b2Body_ApplyForceToCenter(bodyId, force, wake)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const bodySim = b2GetBodySim(world, body);
        bodySim.force = b2Add(bodySim.force, force);
    }
}

/**
 * @function b2Body_ApplyTorque
 * @summary Applies a torque to a body.
 * @param {b2BodyId} bodyId - The identifier of the body to apply torque to
 * @param {number} torque - The amount of torque to apply
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @description
 * Adds the specified torque to the body's total torque. If the wake parameter
 * is true and the body is sleeping, it will be awakened. The torque is only
 * applied if the body is in the awake set.
 */
export function b2Body_ApplyTorque(bodyId, torque, wake)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const bodySim = b2GetBodySim(world, body);
        bodySim.torque += torque;
    }
}

/**
 * @function b2Body_ApplyLinearImpulse
 * @description
 * Applies a linear impulse to a body at a specified world point, affecting both its linear
 * and angular velocities.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {b2Vec2} impulse - The world impulse vector to apply
 * @param {b2Vec2} point - The world position where the impulse is applied
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @throws {Error} Throws an assertion error if the body's local index is invalid
 */
export function b2Body_ApplyLinearImpulse(bodyId, impulse, point, wake)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const localIndex = body.localIndex;
        const set = world.solverSetArray[b2SetType.b2_awakeSet];
        console.assert(0 <= localIndex && localIndex < set.states.count);
        const state = set.states.data[localIndex];
        const bodySim = set.sims.data[localIndex];
        state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
        state.angularVelocity += bodySim.invInertia * b2Cross(b2Sub(point, bodySim.center), impulse);
    }
}

/**
 * @function b2Body_ApplyLinearImpulseToCenter
 * @description
 * Applies a linear impulse to the center of mass of a body. If the body is sleeping,
 * it can optionally be woken up.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {b2Vec2} impulse - The linear impulse vector to be applied
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @note The impulse is applied immediately, changing the body's linear velocity based
 * on its mass and the magnitude/direction of the impulse.
 */
export function b2Body_ApplyLinearImpulseToCenter(bodyId, impulse, wake)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const localIndex = body.localIndex;
        const set = world.solverSetArray[b2SetType.b2_awakeSet];
        console.assert(0 <= localIndex && localIndex < set.states.count);
        const state = set.states.data[localIndex];
        const bodySim = set.sims.data[localIndex];
        state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
    }
}

/**
 * @function b2Body_ApplyAngularImpulse
 * @description
 * Applies an angular impulse to a body, affecting its angular velocity. The impulse is
 * scaled by the body's inverse inertia.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {number} impulse - The angular impulse to apply
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @throws {Error} Throws an assertion error if the body ID is invalid or if the body
 * revision doesn't match
 */
export function b2Body_ApplyAngularImpulse(bodyId, impulse, wake)
{
    console.assert(b2Body_IsValid(bodyId));
    const world = b2GetWorld(bodyId.world0);

    const id = bodyId.index1 - 1;

    // b2CheckIndex(world.bodyArray, id);
    const body = world.bodyArray[id];
    console.assert(body.revision === bodyId.revision);

    if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        // this will not invalidate body pointer
        b2WakeBody(world, body);
    }

    if (body.setIndex === b2SetType.b2_awakeSet)
    {
        const localIndex = body.localIndex;
        const set = world.solverSetArray[b2SetType.b2_awakeSet];
        console.assert(0 <= localIndex && localIndex < set.states.count);
        const state = set.states.data[localIndex];
        const sim = set.sims.data[localIndex];
        state.angularVelocity += sim.invInertia * impulse;
    }
}

/**
 * Gets the type of a body in the physics world.
 * @function b2Body_GetType
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {b2BodyType} The type of the specified body.
 * @description
 * Retrieves the body type (static, kinematic, or dynamic) for a given body ID
 * by looking up the body in the physics world using the provided identifier.
 */
export function b2Body_GetType(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.type;
}

// Changing the body type is quite complex mainly due to joints.
// Considerations:
// - body and joints must be moved to the correct set
// - islands must be updated
// - graph coloring must be correct
// - any body connected to a joint may be disabled
// - joints between static bodies must go into the static set
/**
 * @function b2Body_SetType
 * @summary Changes the type of a body in the physics simulation.
 * @param {b2BodyId} bodyId - The ID of the body to modify
 * @param {b2BodyType} type - The new body type to set (static, kinematic, or dynamic)
 * @returns {void}
 * @description
 * Updates a body's type and handles all necessary simulation changes including:
 * - Destroying existing contacts
 * - Waking the body and connected bodies
 * - Unlinking and relinking joints
 * - Transferring the body between solver sets
 * - Updating broad-phase proxies
 * - Recalculating mass data
 * If the body is disabled or the type is unchanged, minimal processing occurs.
 * Special handling exists for transitions to/from static body type.
 */
export function b2Body_SetType(bodyId, type)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    const originalType = body.type;

    if (originalType === type)
    {
        return;
    }

    if (body.setIndex === b2SetType.b2_disabledSet)
    {
        // Disabled bodies don't change solver sets or islands when they change type.
        body.type = type;

        // Body type affects the mass
        b2UpdateBodyMassData(world, body);

        return;
    }

    // Destroy all contacts but don't wake bodies.
    const wakeBodies = false;
    b2DestroyBodyContacts(world, body, wakeBodies);

    // Wake this body because we assume below that it is awake or static.
    b2WakeBody(world, body);

    // Unlink all joints and wake attached bodies.
    {
        let jointKey = body.headJointKey;

        while (jointKey !== B2_NULL_INDEX)
        {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;

            const joint = world.jointArray[jointId];

            if (joint.islandId !== B2_NULL_INDEX)
            {
                b2UnlinkJoint(world, joint);
            }

            // A body going from static to dynamic or kinematic goes to the awake set
            // and other attached bodies must be awake as well. For consistency, this is
            // done for all cases.
            const bodyA = world.bodyArray[joint.edges[0].bodyId];
            const bodyB = world.bodyArray[joint.edges[1].bodyId];
            b2WakeBody(world, bodyA);
            b2WakeBody(world, bodyB);

            jointKey = joint.edges[edgeIndex].nextKey;
        }
    }

    body.type = type;

    if (originalType === b2BodyType.staticBody)
    {
        // Body is going from static to dynamic or kinematic. It only makes sense to move it to the awake set.
        console.assert(body.setIndex === b2SetType.b2_staticSet);

        const staticSet = world.solverSetArray[b2SetType.b2_staticSet];
        const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];

        // Transfer body to awake set
        b2TransferBody(world, awakeSet, staticSet, body);

        // Create island for body
        b2CreateIslandForBody(world, b2SetType.b2_awakeSet, body);

        // Transfer static joints to awake set
        let jointKey = body.headJointKey;

        while (jointKey !== B2_NULL_INDEX)
        {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;

            const joint = world.jointArray[jointId];

            // Transfer the joint if it is in the static set
            if (joint.setIndex === b2SetType.b2_staticSet)
            {
                b2TransferJoint(world, awakeSet, staticSet, joint);
            }
            else if (joint.setIndex === b2SetType.b2_awakeSet)
            {
                // In this case the joint must be re-inserted into the constraint graph to ensure the correct
                // graph color.

                // First transfer to the static set.
                b2TransferJoint(world, staticSet, awakeSet, joint);

                // Now transfer it back to the awake set and into the graph coloring.
                b2TransferJoint(world, awakeSet, staticSet, joint);
            }
            else
            {
                // Otherwise the joint must be disabled.
                console.assert(joint.setIndex === b2SetType.b2_disabledSet);
            }

            jointKey = joint.edges[edgeIndex].nextKey;
        }

        // Recreate shape proxies in movable tree.
        const transform = b2GetBodyTransformQuick(world, body);
        let shapeId = body.headShapeId;

        while (shapeId !== B2_NULL_INDEX)
        {
            const shape = world.shapeArray[shapeId];
            shapeId = shape.nextShapeId;
            b2DestroyShapeProxy(shape, world.broadPhase);
            const forcePairCreation = true;
            const proxyType = type;
            b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
        }
    }

    // @ts-ignore
    else if (type === b2BodyType.b2_staticBody)
    {
        // The body is going from dynamic/kinematic to static. It should be awake.
        console.assert(body.setIndex === b2SetType.b2_awakeSet);

        const staticSet = world.solverSetArray[b2SetType.b2_staticSet];
        const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];

        // Transfer body to static set
        b2TransferBody(world, staticSet, awakeSet, body);

        // Remove body from island.
        b2RemoveBodyFromIsland(world, body);

        // Maybe transfer joints to static set.
        let jointKey = body.headJointKey;

        while (jointKey !== B2_NULL_INDEX)
        {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;

            const joint = world.jointArray[jointId];
            jointKey = joint.edges[edgeIndex].nextKey;

            const otherEdgeIndex = edgeIndex ^ 1;
            const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];

            // Skip disabled joint
            if (joint.setIndex === b2SetType.b2_disabledSet)
            {
                // Joint is disable, should be connected to a disabled body
                console.assert(otherBody.setIndex === b2SetType.b2_disabledSet);

                continue;
            }

            // Since the body was not static, the joint must be awake.
            console.assert(joint.setIndex === b2SetType.b2_awakeSet);

            // Only transfer joint to static set if both bodies are static.
            if (otherBody.setIndex === b2SetType.b2_staticSet)
            {
                b2TransferJoint(world, staticSet, awakeSet, joint);
            }
            else
            {
                // The other body must be awake.
                console.assert(otherBody.setIndex === b2SetType.b2_awakeSet);

                // The joint must live in a graph color.
                console.assert(0 <= joint.colorIndex && joint.colorIndex < b2_graphColorCount);

                // In this case the joint must be re-inserted into the constraint graph to ensure the correct
                // graph color.

                // First transfer to the static set.
                b2TransferJoint(world, staticSet, awakeSet, joint);

                // Now transfer it back to the awake set and into the graph coloring.
                b2TransferJoint(world, awakeSet, staticSet, joint);
            }
        }

        // Recreate shape proxies in static tree.
        const transform = b2GetBodyTransformQuick(world, body);
        let shapeId = body.headShapeId;

        while (shapeId !== B2_NULL_INDEX)
        {
            const shape = world.shapeArray[shapeId];
            shapeId = shape.nextShapeId;
            b2DestroyShapeProxy(shape, world.broadPhase);
            const forcePairCreation = true;
            b2CreateShapeProxy(shape, world.broadPhase, b2BodyType.b2_staticBody, transform, forcePairCreation);
        }
    }
    else
    {
        console.assert(originalType === b2BodyType.b2_dynamicBody || originalType === b2BodyType.b2_kinematicBody);

        // @ts-ignore
        console.assert(type === b2BodyType.b2_dynamicBody || type === b2BodyType.b2_kinematicBody);

        // Recreate shape proxies in static tree.
        const transform = b2GetBodyTransformQuick(world, body);
        let shapeId = body.headShapeId;

        while (shapeId !== B2_NULL_INDEX)
        {
            const shape = world.shapeArray[shapeId];
            shapeId = shape.nextShapeId;
            b2DestroyShapeProxy(shape, world.broadPhase);
            const proxyType = type;
            const forcePairCreation = true;
            b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
        }
    }

    // Relink all joints
    {
        let jointKey = body.headJointKey;

        while (jointKey !== B2_NULL_INDEX)
        {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;

            const joint = world.jointArray[jointId];
            jointKey = joint.edges[edgeIndex].nextKey;

            const otherEdgeIndex = edgeIndex ^ 1;
            const otherBodyId = joint.edges[otherEdgeIndex].bodyId;

            // b2CheckIndex(world.bodyArray, otherBodyId);
            const otherBody = world.bodyArray[otherBodyId];

            if (otherBody.setIndex === b2SetType.b2_disabledSet)
            {
                continue;
            }

            if (body.type === b2BodyType.b2_staticBody && otherBody.type === b2BodyType.b2_staticBody)
            {
                continue;
            }

            b2LinkJoint(world, joint, false);
        }

        b2MergeAwakeIslands(world);
    }

    // Body type affects the mass
    b2UpdateBodyMassData(world, body);

    b2ValidateSolverSets(world);
}

/**
 * @summary Sets the user data associated with a body.
 * @function b2Body_SetUserData
 * @param {b2BodyId} bodyId - The identifier of the body to modify.
 * @param {*} userData - The user data to associate with the body.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a physics body. The user data can be
 * retrieved later and can be of any type. The body is located using its
 * world identifier and the user data is stored directly on the body object.
 */
export function b2Body_SetUserData(bodyId, userData)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    body.userData = userData;
}

/**
 * @summary Gets the user data associated with a body.
 * @function b2Body_GetUserData
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {object} The user data associated with the body.
 * @description
 * Retrieves the custom user data that was previously attached to the specified body.
 * The function first gets the world from the body ID, then retrieves the full body
 * object, and finally returns its user data.
 */
export function b2Body_GetUserData(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.userData;
}

/**
 * Gets the mass of a body.
 * @function b2Body_GetMass
 * @param {b2BodyId} bodyId - The identifier for the body whose mass is to be retrieved.
 * @returns {number} The mass of the body in kilograms.
 * @description
 * Retrieves the mass value from a body's simulation data by accessing the world
 * and body objects using the provided body identifier.
 */
export function b2Body_GetMass(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.mass;
}

/**
 * Get the rotational inertia of the body, typically in kg*m^2
 * @function b2Body_GetRotationalInertia
 * @param {b2BodyId} bodyId - The ID of the body to get the inertia tensor from.
 * @returns {number} The inertia tensor value of the body.
 * @description
 * Retrieves the rotational inertia value from a body's simulation data using the body's ID.
 * The inertia tensor represents the body's resistance to rotational acceleration.
 */
export function b2Body_GetRotationalInertia(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.inertia;
}

/**
 * Gets the local center of mass for a body.
 * @function b2Body_GetLocalCenterOfMass
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {b2Vec2} The local center of mass position vector.
 * @description
 * Returns a copy of the body's local center of mass position vector.
 * The local center is expressed in the body's local coordinate system.
 */
export function b2Body_GetLocalCenterOfMass(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.localCenter.clone();
}

/**
 * Gets the world position of a body's center of mass.
 * @function b2Body_GetWorldCenterOfMass
 * @param {b2BodyId} bodyId - The identifier for the body whose center of mass position is being queried.
 * @returns {b2Vec2} A vector representing the world position of the body's center of mass.
 * @description
 * Returns a copy of the body's center of mass position in world coordinates.
 * The returned vector is a clone of the internal state, preventing external
 * modification of the body's actual center position.
 */
export function b2Body_GetWorldCenterOfMass(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.center.clone();
}

/**
 * @function b2Body_SetMassData
 * @description
 * Sets the mass properties of a body including mass, rotational inertia, and center of mass.
 * The function updates both the primary mass properties and derived values like inverse mass.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {b2MassData} massData - An object containing:
 * - mass: The mass of the body (must be >= 0)
 * - rotationalInertia: The rotational inertia (must be >= 0)
 * - center: A b2Vec2 representing the local center of mass
 * @returns {void}
 * @throws {Error} Throws assertion error if mass or rotationalInertia are invalid or negative,
 * or if the center vector is invalid
 */
export function b2Body_SetMassData(bodyId, massData)
{
    console.assert(b2IsValid(massData.mass) && massData.mass >= 0.0);
    console.assert(b2IsValid(massData.rotationalInertia) && massData.rotationalInertia >= 0.0);
    console.assert(b2Vec2_IsValid(massData.center));

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    bodySim.mass = massData.mass;
    bodySim.inertia = massData.rotationalInertia;
    bodySim.localCenter = massData.center;

    const center = b2TransformPoint(bodySim.transform, massData.center);
    bodySim.center = center;
    bodySim.center0X = center.x;
    bodySim.center0Y = center.y;

    bodySim.invMass = bodySim.mass > 0.0 ? 1.0 / bodySim.mass : 0.0;
    bodySim.invInertia = bodySim.inertia > 0.0 ? 1.0 / bodySim.inertia : 0.0;
}

/**
 * @function b2Body_GetMassData
 * @param {b2BodyId} bodyId - The identifier for the body whose mass data is being retrieved
 * @returns {b2MassData} An object containing mass properties:
 * - mass: The total mass of the body
 * - center: A b2Vec2 representing the local center of mass
 * - rotationalInertia: The rotational inertia about the local center of mass
 * @description
 * Retrieves the mass properties of a body, including its total mass,
 * center of mass position, and rotational inertia.
 */
export function b2Body_GetMassData(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);
    const massData = new b2MassData();
    massData.mass = bodySim.mass;
    massData.center = bodySim.localCenter;
    massData.rotationalInertia = bodySim.inertia;

    return massData;
}

/**
 * @function b2Body_ApplyMassFromShapes
 * @summary Updates a body's mass properties based on its attached shapes.
 * @param {b2BodyId} bodyId - The identifier for the body whose mass properties need to be updated.
 * @returns {void}
 * @description
 * This function retrieves the body from the world using its ID and updates its mass data
 * properties (mass, center of mass, and rotational inertia) based on the shapes attached to it.
 * If the world cannot be accessed, the function returns without performing any operations.
 */
export function b2Body_ApplyMassFromShapes(bodyId)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    b2UpdateBodyMassData(world, body);
}

/**
 * Sets the linear damping value for a body.
 * @function b2Body_SetLinearDamping
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} linearDamping - The new linear damping value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets the linear damping coefficient for a body, which reduces its linear velocity over time.
 * Linear damping is used to simulate air resistance or fluid friction.
 * @throws {Error} Throws an assertion error if linearDamping is invalid or negative.
 */
export function b2Body_SetLinearDamping(bodyId, linearDamping)
{
    console.assert(b2IsValid(linearDamping) && linearDamping >= 0.0);

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);
    bodySim.linearDamping = linearDamping;
}

/**
 * Gets the linear damping coefficient of a body.
 * @function b2Body_GetLinearDamping
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The linear damping coefficient of the body.
 * @description
 * Returns the linear damping coefficient that reduces the body's linear velocity.
 * Linear damping is used to reduce the linear velocity of the body in the absence
 * of forces. The damping parameter can be used to simulate fluid/air resistance.
 */
export function b2Body_GetLinearDamping(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.linearDamping;
}

/**
 * @summary Sets the angular damping value for a body.
 * @function b2Body_SetAngularDamping
 * @param {b2BodyId} bodyId - The identifier for the target body.
 * @param {number} angularDamping - The new angular damping value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets the angular damping coefficient for a body, which reduces its angular velocity over time.
 * Angular damping is a value between 0 and infinity that reduces the body's angular velocity.
 * @throws {Error} Throws an assertion error if angularDamping is invalid or negative.
 */
export function b2Body_SetAngularDamping(bodyId, angularDamping)
{
    console.assert(b2IsValid(angularDamping) && angularDamping >= 0.0);

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);
    bodySim.angularDamping = angularDamping;
}

/**
 * Gets the angular damping coefficient of a body.
 * @function b2Body_GetAngularDamping
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The angular damping coefficient of the body.
 * @description
 * Returns the angular damping coefficient that reduces the body's angular velocity
 * over time. Angular damping is specified in the range [0,1].
 */
export function b2Body_GetAngularDamping(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.angularDamping;
}

/**
 * @function b2Body_SetGravityScale
 * @summary Sets the gravity scale factor for a body.
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} gravityScale - The scaling factor to apply to gravity for this body.
 * @returns {void}
 * @throws {Error} Throws an assertion error if bodyId is invalid or if gravityScale is not a valid number.
 * @description
 * Sets a scale factor that modifies the effect of gravity on a specific body.
 * A value of 1.0 indicates normal gravity, 0.0 indicates no gravity, and negative
 * values reverse the effect of gravity on the body.
 */
export function b2Body_SetGravityScale(bodyId, gravityScale)
{
    console.assert(b2Body_IsValid(bodyId));
    console.assert(b2IsValid(gravityScale));

    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);
    bodySim.gravityScale = gravityScale;
}

/**
 * Gets the gravity scale of a body.
 * @function b2Body_GetGravityScale
 * @param {b2BodyId} bodyId - The identifier of the body to query.
 * @returns {number} The gravity scale factor of the body.
 * @throws {Error} Throws an assertion error if the bodyId is invalid.
 */
export function b2Body_GetGravityScale(bodyId)
{
    console.assert(b2Body_IsValid(bodyId));
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.gravityScale;
}

/**
 * @summary Checks if a body is in the awake set.
 * @function b2Body_IsAwake
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is in the awake set, false otherwise.
 * @description
 * Determines if a body is currently in the awake set by checking its set index
 * against the b2_awakeSet type. Bodies in the awake set are actively participating
 * in the simulation.
 */
export function b2Body_IsAwake(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.setIndex === b2SetType.b2_awakeSet;
}

/**
 * @summary Sets the awake state of a physics body
 * @function b2Body_SetAwake
 * @param {b2BodyId} bodyId - The ID of the body to modify
 * @param {boolean} awake - True to wake the body, false to put it to sleep
 * @returns {void}
 * @description
 * Controls whether a physics body is awake (active) or asleep (inactive).
 * When setting a body to sleep, it will split islands if there are pending constraint removals.
 * When waking a body, it will be moved from the sleeping set to the awake set.
 */
export function b2Body_SetAwake(bodyId, awake)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);

    if (awake && body.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeBody(world, body);
    }
    else if (awake === false && body.setIndex === b2SetType.b2_awakeSet)
    {
        // b2CheckIndex(world.islandArray, body.islandId);
        const island = world.islandArray[body.islandId];

        if (island.constraintRemoveCount > 0)
        {
            b2SplitIsland(world, body.islandId);
        }

        b2TrySleepIsland(world, body.islandId);
    }
}

/**
 * @summary Checks if a body is enabled in the physics simulation.
 * @function b2Body_IsEnabled
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is enabled, false if disabled.
 * @description
 * Determines if a physics body is enabled by checking if it belongs to the
 * disabled set. A disabled body does not participate in collision detection
 * or dynamics simulation.
 */
export function b2Body_IsEnabled(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.setIndex !== b2SetType.b2_disabledSet;
}

/**
 * @summary Checks if sleep is enabled for a body.
 * @function b2Body_IsSleepEnabled
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if sleep is enabled for the body, false otherwise.
 * @description
 * Returns whether the specified body has sleep enabled. When sleep is enabled,
 * the body can automatically enter a sleep state when it becomes inactive.
 */
export function b2Body_IsSleepEnabled(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.enableSleep;
}

/**
 * Sets the sleep threshold velocity for a body.
 * @function b2Body_SetSleepThreshold
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} sleepThreshold - The velocity threshold below which the body can sleep.
 * @returns {void}
 * @description
 * Sets the minimum velocity threshold that determines when a body can transition to a sleeping state.
 * When a body's velocity falls below this threshold, it becomes eligible for sleeping.
 */
export function b2Body_SetSleepThreshold(bodyId, sleepThreshold)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    body.sleepThreshold = sleepThreshold;
}

/**
 * Gets the sleep threshold value for a body.
 * @function b2Body_GetSleepThreshold
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The sleep threshold value for the body.
 * @description
 * Returns the minimum speed threshold below which a body can be put to sleep
 * to optimize simulation performance.
 */
export function b2Body_GetSleepThreshold(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.sleepThreshold;
}

/**
 * @function b2Body_EnableSleep
 * @description
 * Enables or disables sleep capability for a specific body. When sleep is disabled,
 * the body will be woken if it was sleeping.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {boolean} enableSleep - True to enable sleep capability, false to disable it
 * @returns {void}
 * @throws {Error} If the world associated with the bodyId is not found
 */
export function b2Body_EnableSleep(bodyId, enableSleep)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);
    body.enableSleep = enableSleep;

    if (enableSleep === false)
    {
        b2WakeBody(world, body);
    }
}

// Disabling a body requires a lot of detailed bookkeeping, but it is a valuable feature.
// The most challenging aspect that joints may connect to bodies that are not disabled.
/**
 * @function b2Body_Disable
 * @param {b2BodyId} bodyId - The identifier of the body to disable
 * @returns {void}
 * @description
 * Disables a body in the physics simulation by removing it from its current solver set
 * and moving it to the disabled set. The function removes all contacts associated with
 * the body, removes it from any island it belongs to, destroys shape proxies in the
 * broad phase, and transfers associated joints to the disabled set.
 * @throws {Error} Throws if the world is locked or invalid
 */
export function b2Body_Disable(bodyId)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);

    if (body.setIndex === b2SetType.b2_disabledSet)
    {
        return;
    }

    // Destroy contacts and wake bodies touching this body. This avoid floating bodies.
    // This is necessary even for static bodies.
    const wakeBodies = true;
    b2DestroyBodyContacts(world, body, wakeBodies);

    // Disabled bodies are not in an island.
    b2RemoveBodyFromIsland(world, body);

    // Remove shapes from broad-phase
    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];
        shapeId = shape.nextShapeId;
        b2DestroyShapeProxy(shape, world.broadPhase);
    }

    // Transfer simulation data to disabled set
    // b2CheckIndex(world.solverSetArray, body.setIndex);
    const set = world.solverSetArray[body.setIndex];
    const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];

    // Transfer body sim
    b2TransferBody(world, disabledSet, set, body);

    // Unlink joints and transfer
    let jointKey = body.headJointKey;

    while (jointKey !== B2_NULL_INDEX)
    {
        const jointId = jointKey >> 1;
        const edgeIndex = jointKey & 1;

        const joint = world.jointArray[jointId];
        jointKey = joint.edges[edgeIndex].nextKey;

        // joint may already be disabled by other body
        if (joint.setIndex === b2SetType.b2_disabledSet)
        {
            continue;
        }

        console.assert(joint.setIndex === set.setIndex || set.setIndex === b2SetType.b2_staticSet);

        // Remove joint from island
        if (joint.islandId !== B2_NULL_INDEX)
        {
            b2UnlinkJoint(world, joint);
        }

        // Transfer joint to disabled set
        // b2CheckIndex(world.solverSetArray, joint.setIndex);
        const jointSet = world.solverSetArray[joint.setIndex];
        b2TransferJoint(world, disabledSet, jointSet, joint);
    }

    b2ValidateConnectivity(world);
    b2ValidateSolverSets(world);
}

/**
 * @function b2Body_Enable
 * @description
 * Enables a previously disabled body in the physics world. When enabled, the body's
 * shapes are added to the broad-phase collision system, and its joints are
 * reconnected to the simulation. The body is moved from the disabled set to either
 * the static set or awake set based on its type.
 * @param {b2BodyId} bodyId - The identifier of the body to enable
 * @returns {void}
 * @throws {Error} Throws an assertion error if joint connectivity validation fails
 */
export function b2Body_Enable(bodyId)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }

    const body = b2GetBodyFullId(world, bodyId);

    if (body.setIndex !== b2SetType.b2_disabledSet)
    {
        return;
    }

    const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
    const setId = body.type === b2BodyType.b2_staticBody ? b2SetType.b2_staticSet : b2SetType.b2_awakeSet;
    const targetSet = world.solverSetArray[setId];

    b2TransferBody(world, targetSet, disabledSet, body);

    const transform = b2GetBodyTransformQuick(world, body);

    // Add shapes to broad-phase
    const proxyType = body.type;
    const forcePairCreation = true;
    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];
        shapeId = shape.nextShapeId;

        b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
    }

    if (setId !== b2SetType.b2_staticSet)
    {
        b2CreateIslandForBody(world, setId, body);
    }

    // Transfer joints. If the other body is disabled, don't transfer.
    // If the other body is sleeping, wake it.
    const mergeIslands = false;
    let jointKey = body.headJointKey;

    while (jointKey !== B2_NULL_INDEX)
    {
        const jointId = jointKey >> 1;
        const edgeIndex = jointKey & 1;

        const joint = world.jointArray[jointId];
        console.assert(joint.setIndex === b2SetType.b2_disabledSet);
        console.assert(joint.islandId === B2_NULL_INDEX);

        jointKey = joint.edges[edgeIndex].nextKey;

        const bodyA = world.bodyArray[joint.edges[0].bodyId];
        const bodyB = world.bodyArray[joint.edges[1].bodyId];

        if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet)
        {
            // one body is still disabled
            continue;
        }

        // Transfer joint first
        let jointSetId;

        if (bodyA.setIndex === b2SetType.b2_staticSet && bodyB.setIndex === b2SetType.b2_staticSet)
        {
            jointSetId = b2SetType.b2_staticSet;
        }
        else if (bodyA.setIndex === b2SetType.b2_staticSet)
        {
            jointSetId = bodyB.setIndex;
        }
        else
        {
            jointSetId = bodyA.setIndex;
        }

        // b2CheckIndex(world.solverSetArray, jointSetId);
        const jointSet = world.solverSetArray[jointSetId];
        b2TransferJoint(world, jointSet, disabledSet, joint);

        // Now that the joint is in the correct set, I can link the joint in the island.
        if (jointSetId !== b2SetType.b2_staticSet)
        {
            b2LinkJoint(world, joint, mergeIslands);
        }
    }

    // Now merge islands
    b2MergeAwakeIslands(world);

    b2ValidateSolverSets(world);
}

/**
 * @function b2Body_SetFixedRotation
 * @summary Sets whether a body should have fixed rotation.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {boolean} flag - True to fix the rotation, false to allow rotation
 * @returns {void}
 * @description
 * Sets the fixed rotation state of a body. When enabled, the body will not rotate
 * and any existing angular velocity is cleared. The body's mass data is updated
 * to reflect the change in rotational constraints.
 */
export function b2Body_SetFixedRotation(bodyId, flag)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }
    const body = b2GetBodyFullId(world, bodyId);

    if (body.fixedRotation !== flag)
    {
        body.fixedRotation = flag;
        const state = b2GetBodyState(world, body);

        if (state !== null)
        {
            state.angularVelocity = 0.0;
        }
        b2UpdateBodyMassData(world, body);
    }
}

/**
 * @function b2Body_IsFixedRotation
 * @param {b2BodyId} bodyId - The identifier for the body to check
 * @returns {boolean} True if the body has fixed rotation enabled, false otherwise
 * @description
 * Checks whether a body has fixed rotation enabled. When fixed rotation is enabled,
 * the body will not rotate in response to torques or collisions.
 */
export function b2Body_IsFixedRotation(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.fixedRotation;
}

/**
 * @function b2Body_SetBullet
 * @summary Sets the bullet flag on a physics body.
 * @param {b2BodyId} bodyId - The identifier for the physics body.
 * @param {boolean} flag - True to enable bullet mode, false to disable it.
 * @returns {void}
 * @description
 * Sets whether a body should be treated as a bullet for continuous collision detection.
 * Bullet bodies are designed for fast moving objects that require more precise
 * collision detection.
 */
export function b2Body_SetBullet(bodyId, flag)
{
    const world = b2GetWorldLocked(bodyId.world0);

    if (world === null)
    {
        return;
    }
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);
    bodySim.isBullet = flag;
}

/**
 * @function b2Body_IsBullet
 * @summary Checks if a body has bullet status.
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is a bullet, false otherwise.
 * @description
 * Retrieves the bullet status of a body from the physics simulation.
 * Bullet bodies undergo continuous collision detection for improved
 * accuracy with fast-moving objects.
 */
export function b2Body_IsBullet(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    const bodySim = b2GetBodySim(world, body);

    return bodySim.isBullet;
}

/**
 * @function b2Body_EnableHitEvents
 * @description
 * Enables or disables hit event detection for all shapes attached to a body.
 * @param {b2BodyId} bodyId - The identifier of the body to modify
 * @param {boolean} enableHitEvents - Whether to enable or disable hit events
 * @returns {void}
 */
export function b2Body_EnableHitEvents(bodyId, enableHitEvents)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    let shapeId = body.headShapeId;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];
        shape.enableHitEvents = enableHitEvents;
        shapeId = shape.nextShapeId;
    }
}

/**
 * @summary Gets the number of shapes attached to a body.
 * @function b2Body_GetShapeCount
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {number} The number of shapes attached to the body.
 * @description
 * Returns the total count of shapes currently attached to the specified body
 * in the physics world.
 */
export function b2Body_GetShapeCount(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.shapeCount;
}

/**
 * @function b2Body_GetShapes
 * @summary Gets all shapes attached to a body and returns the count.
 * @param {b2BodyId} bodyId - The identifier of the body to get shapes from.
 * @param {b2ShapeId[]} shapeArray - An array to store the retrieved shape IDs.
 * @returns {number} The number of shapes found on the body.
 * @description
 * Retrieves all shapes attached to the specified body by traversing the linked list
 * of shapes starting from the body's headShapeId. Each shape ID is stored in the
 * provided shapeArray and the total count is returned.
 * If shapeArray is already large enough we can avoid the overhead of growing the array.
 */
export function b2Body_GetShapes(bodyId, shapeArray)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    let shapeId = body.headShapeId;
    let shapeCount = 0;

    while (shapeId !== B2_NULL_INDEX)
    {
        const shape = world.shapeArray[shapeId];
        const id = new b2ShapeId(shape.id + 1, bodyId.world0, shape.revision);
        shapeArray[shapeCount] = id;
        shapeCount += 1;
        shapeId = shape.nextShapeId;
    }

    return shapeCount;
}

/**
 * @summary Gets the number of joints connected to a body.
 * @function b2Body_GetJointCount
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {number} The number of joints connected to the body.
 * @description
 * Returns the total count of joints that are connected to the specified body.
 */
export function b2Body_GetJointCount(bodyId)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);

    return body.jointCount;
}

/**
 * @function b2Body_GetJoints
 * @summary Gets all joints connected to a body.
 * @param {b2BodyId} bodyId - The ID of the body to get joints for
 * @param {b2JointId[]} jointArray - Array to store the joint IDs
 * @param {number} capacity - Maximum number of joints to retrieve
 * @returns {number} The number of joints found and stored in jointArray
 * @description
 * Retrieves the IDs of all joints connected to the specified body, up to the given capacity.
 * The joint IDs are stored in the provided jointArray. The function traverses the body's
 * joint list and copies each joint's ID information including the index, world ID and revision.
 */
export function b2Body_GetJoints(bodyId, jointArray, capacity)
{
    const world = b2GetWorld(bodyId.world0);
    const body = b2GetBodyFullId(world, bodyId);
    let jointKey = body.headJointKey;
    let jointCount = 0;

    while (jointKey !== B2_NULL_INDEX && jointCount < capacity)
    {
        const jointId = jointKey >> 1;
        const edgeIndex = jointKey & 1;
        const joint = b2GetJoint(world, jointId);
        const id = new b2JointId();
        id.index1 = jointId + 1;
        id.world0 = bodyId.world0;
        id.revision = joint.revision;
        jointArray[jointCount] = id;
        jointCount += 1;
        jointKey = joint.edges[edgeIndex].nextKey;
    }

    return jointCount;
}

export function b2ShouldBodiesCollide(world, bodyA, bodyB)
{
    if (bodyA.type !== b2BodyType.b2_dynamicBody && bodyB.type !== b2BodyType.b2_dynamicBody)
    {
        return false;
    }
    let jointKey;
    let otherBodyId;

    if (bodyA.jointCount < bodyB.jointCount)
    {
        jointKey = bodyA.headJointKey;
        otherBodyId = bodyB.id;
    }
    else
    {
        jointKey = bodyB.headJointKey;
        otherBodyId = bodyA.id;
    }

    while (jointKey !== B2_NULL_INDEX)
    {
        const jointId = jointKey >> 1;
        const edgeIndex = jointKey & 1;
        const otherEdgeIndex = edgeIndex ^ 1;
        const joint = b2GetJoint(world, jointId);

        if (joint.collideConnected === false && joint.edges[otherEdgeIndex].bodyId === otherBodyId)
        {
            return false;
        }
        jointKey = joint.edges[edgeIndex].nextKey;
    }

    return true;
}

// PJB: recursively deep set obj 'number' properties to zero, similar to the C <struct name> = { 0 };
export function resetProperties(obj)
{
    const resetProperty = (item) =>
    {
        if (typeof item === 'object' && item !== null)
        {
            Object.keys(item).forEach(key =>
            {
                switch (typeof item[key])
                {
                    case 'number':
                        item[key] = 0;

                        break;

                    case 'boolean':
                        item[key] = false;

                        break;

                    case 'string':
                        item[key] = '';

                        break;

                    case 'object':
                        if (Array.isArray(item[key]))
                        {
                            // item[key] = [];  PJB: don't do this here, it's handled before the call in the rare instances it's needed
                        }
                        else if (item[key] !== null)
                        {
                            resetProperty(item[key]);
                        }
                        else
                        {
                            item[key] = null;
                        }

                        break;

                    // For functions, symbols, etc., we leave them as is
                }
            });
        }
    };

    resetProperty(obj);
}
