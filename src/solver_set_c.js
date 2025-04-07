/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_NULL_INDEX, b2_graphColorCount } from './include/core_h.js';
import {
    b2AddBodySim,
    b2AddBodyState,
    b2AddContact,
    b2AddIsland,
    b2AddJoint,
    b2BodySimArray,
    b2BodyStateArray,
    b2ContactArray,
    b2CreateBodySimArray,
    b2CreateContactArray,
    b2CreateJointArray,
    b2IslandArray,
    b2JointArray,
    b2RemoveBodySim,
    b2RemoveBodyState,
    b2RemoveContact,
    b2RemoveIsland,
    b2RemoveJoint,
} from './include/block_array_h.js';
import { b2AddContactToGraph, b2AddJointToGraph, b2RemoveJointFromGraph, b2_overflowIndex } from './include/constraint_graph_h.js';
import { b2AllocId, b2FreeId } from './include/id_pool_h.js';
import { b2ContactFlags, b2ContactSimFlags } from './include/contact_h.js';
import { b2SetType, b2ValidateSolverSets } from './include/world_h.js';

import { b2BodyState } from './include/body_h.js';
import { b2ClearBit } from './include/bitset_h.js';

/**
 * @namespace SolverSet
 */

/**
 * @import {b2World} from './include/world_h.js'
 */

// This holds solver set data. The following sets are used:
// - static set for all static bodies (no contacts or joints)
// - active set for all active bodies with body states (no contacts or joints)
// - disabled set for disabled bodies and their joints
// - all further sets are sleeping island sets along with their contacts and joints
// The purpose of solver sets is to achieve high memory locality.
// https://www.youtube.com/watch?v=nZNd5FjSquk
export class b2SolverSet
{
    constructor()
    {
        // Body array. Empty for unused set.
        this.sims = new b2BodySimArray();

        // Body state only exists for active set
        this.states = new b2BodyStateArray();

        // This holds sleeping/disabled joints. Empty for static/active set.
        this.joints = new b2JointArray();

        // This holds all contacts for sleeping sets.
        // This holds non-touching contacts for the awake set.
        this.contacts = new b2ContactArray();

        // The awake set has an array of islands. Sleeping sets normally have a single islands. However, joints
        // created between sleeping sets causes the sets to merge, leaving them with multiple islands. These sleeping
        // islands will be naturally merged with the set is woken.
        // The static and disabled sets have no islands.
        // Islands live in the solver sets to limit the number of islands that need to be considered for sleeping.
        this.islands = new b2IslandArray();

        // Aligns with b2World::solverSetIdPool. Used to create a stable id for body/contact/joint/islands.
        this.setIndex = 0;
        
    }
}

export function b2DestroySolverSet(world, setIndex)
{
    console.assert(setIndex >= 0);
    let set = world.solverSetArray[setIndex];
    set.sims = null;
    set.states = null;
    set.contacts = null;
    set.joints = null;
    set.islands = null;
    b2FreeId(world.solverSetIdPool, setIndex);
    set = new b2SolverSet();
    set.setIndex = B2_NULL_INDEX;
    world.solverSetArray[setIndex] = set;
}

/**
 * @param {b2World} world
 * @param {number} setIndex
 */
export function b2WakeSolverSet(world, setIndex)
{
    console.assert(setIndex >= b2SetType.b2_firstSleepingSet);

    // b2CheckIndex(world.solverSetArray, setIndex);
    const set = world.solverSetArray[setIndex];
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];

    const bodies = world.bodyArray;
    const contacts = world.contactArray;

    const bodyCount = set.sims.count;

    for (let i = 0; i < bodyCount; ++i)
    {
        const simSrc = set.sims.data[i];

        const body = bodies[simSrc.bodyId];
        console.assert(body.setIndex === setIndex);
        body.setIndex = b2SetType.b2_awakeSet;
        body.localIndex = awakeSet.sims.count;

        body.sleepTime = 0.0;

        const simDst = b2AddBodySim(awakeSet.sims);
        Object.assign(simDst, simSrc);

        const state = b2AddBodyState(awakeSet.states);
        Object.assign(state, new b2BodyState());

        // move non-touching contacts from disabled set to awake set
        let contactKey = body.headContactKey;

        while (contactKey !== B2_NULL_INDEX)
        {
            const edgeIndex = contactKey & 1;
            const contactId = contactKey >> 1;

            // b2CheckIndex(contacts, contactId);
            const contact = contacts[contactId];

            contactKey = contact.edges[edgeIndex].nextKey;

            if (contact.setIndex !== b2SetType.b2_disabledSet)
            {
                console.assert(contact.setIndex === b2SetType.b2_awakeSet || contact.setIndex === setIndex);

                continue;
            }

            const localIndex = contact.localIndex;
            console.assert(0 <= localIndex && localIndex < disabledSet.contacts.count);
            const contactSim = disabledSet.contacts.data[localIndex];

            console.assert((contact.flags & b2ContactFlags.b2_contactTouchingFlag) === 0 && contactSim.manifold.pointCount === 0);

            contact.setIndex = b2SetType.b2_awakeSet;
            contact.localIndex = awakeSet.contacts.count;
            const awakeContactSim = b2AddContact(awakeSet.contacts);
            awakeContactSim.set(contactSim);

            const movedLocalIndex = b2RemoveContact(disabledSet.contacts, localIndex);

            if (movedLocalIndex !== B2_NULL_INDEX)
            {
                const movedContact = disabledSet.contacts.data[localIndex];
                const movedId = movedContact.contactId;

                // b2CheckIndex(contacts, movedId);
                console.assert(contacts[movedId].localIndex === movedLocalIndex);
                contacts[movedId].localIndex = localIndex;
            }
        }
    }

    const contactCount = set.contacts.count;

    for (let i = 0; i < contactCount; ++i)
    {
        const contactSim = set.contacts.data[i];
        const contact = contacts[contactSim.contactId];
        console.assert(!!(contact.flags & b2ContactFlags.b2_contactTouchingFlag));
        console.assert(!!(contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag));
        console.assert(contactSim.manifold.pointCount > 0);
        console.assert(contact.setIndex === setIndex);
        b2AddContactToGraph(world, contactSim, contact);
        contact.setIndex = b2SetType.b2_awakeSet;
    }

    const joints = world.jointArray;
    const jointCount = set.joints.count;

    for (let i = 0; i < jointCount; ++i)
    {
        const jointSim = set.joints.data[i];
        const joint = joints[jointSim.jointId];
        console.assert(joint.setIndex === setIndex);
        b2AddJointToGraph(world, jointSim, joint);
        joint.setIndex = b2SetType.b2_awakeSet;
    }

    const islands = world.islandArray;
    const islandCount = set.islands.count;

    for (let i = 0; i < islandCount; ++i)
    {
        const islandSrc = set.islands.data[i];

        // b2CheckIndex(islands, islandSrc.islandId);
        const island = islands[islandSrc.islandId];
        island.setIndex = b2SetType.b2_awakeSet;
        island.localIndex = awakeSet.islands.count;
        const islandDst = b2AddIsland(awakeSet.islands);
        Object.assign(islandDst, islandSrc);
    }

    b2DestroySolverSet(world, setIndex);

    b2ValidateSolverSets(world);
}

export function b2TrySleepIsland(world, islandId)
{
    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];
    console.assert(island.setIndex === b2SetType.b2_awakeSet, `b2TrySleepIsland island.setIndex is not awakeSet: ${island.setIndex}`);

    if (island.constraintRemoveCount > 0)
    {
        return;
    }

    const moveEvents = world.bodyMoveEventArray;

    const sleepSetId = b2AllocId(world.solverSetIdPool);

    if (sleepSetId === world.solverSetArray.length)
    {
        const set = new b2SolverSet();
        set.setIndex = B2_NULL_INDEX;
        world.solverSetArray.push(set);
    }

    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    console.assert(0 <= island.localIndex && island.localIndex < awakeSet.islands.count);

    const sleepSet = world.solverSetArray[sleepSetId];
    sleepSet.setIndex = sleepSetId;
    sleepSet.sims = b2CreateBodySimArray(island.bodyCount);
    sleepSet.contacts = b2CreateContactArray(island.contactCount);
    sleepSet.joints = b2CreateJointArray(island.jointCount);

    const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
    const bodies = world.bodyArray;
    const contacts = world.contactArray;
    let bodyId = island.headBody;

    // ("headBody " + island.headBody + " tailBody " + island.tailBody + " bodyCount " + island.bodyCount);
    while (bodyId !== B2_NULL_INDEX)
    {
        // b2CheckIndex(bodies, bodyId);
        const body = bodies[bodyId];
        console.assert(body.setIndex === b2SetType.b2_awakeSet);
        console.assert(body.islandId === islandId);

        if (body.bodyMoveIndex !== B2_NULL_INDEX)
        {
            // b2CheckIndex(moveEvents, body.bodyMoveIndex);
            console.assert(moveEvents[body.bodyMoveIndex].bodyId.index1 - 1 === bodyId);
            console.assert(moveEvents[body.bodyMoveIndex].bodyId.revision === body.revision);
            moveEvents[body.bodyMoveIndex].fellAsleep = true;
            body.bodyMoveIndex = B2_NULL_INDEX;
        }

        const awakeBodyIndex = body.localIndex;
        console.assert(0 <= awakeBodyIndex && awakeBodyIndex < awakeSet.sims.count);

        const awakeSim = awakeSet.sims.data[awakeBodyIndex];

        const sleepBodyIndex = sleepSet.sims.count;
        const sleepBodySim = b2AddBodySim(sleepSet.sims);
        awakeSim.copyTo(sleepBodySim);

        // Object.assign(sleepBodySim, awakeSim);

        // console.warn("b " + (world.solverSetArray[2].sims.data[0].transform != null));

        const movedIndex = b2RemoveBodySim(awakeSet.sims, awakeBodyIndex);

        // console.warn("movedIndex " + movedIndex);

        // console.warn("b2 " + (world.solverSetArray[2].sims.data[0].transform != null));
        console.assert(world.solverSetArray[2].sims.data[0].transform != null, "1 transform is null");

        if (movedIndex !== B2_NULL_INDEX)
        {
            const movedSim = awakeSet.sims.data[awakeBodyIndex];
            const movedId = movedSim.bodyId;

            // b2CheckIndex(bodies, movedId);
            const movedBody = bodies[movedId];
            console.assert(movedBody.localIndex === movedIndex);
            movedBody.localIndex = awakeBodyIndex;
        }

        b2RemoveBodyState(awakeSet.states, awakeBodyIndex);

        body.setIndex = sleepSetId;
        body.localIndex = sleepBodyIndex;

        let contactKey = body.headContactKey;

        while (contactKey !== B2_NULL_INDEX)
        {
            const contactId = contactKey >> 1;
            const edgeIndex = contactKey & 1;

            // b2CheckIndex(contacts, contactId);
            const contact = contacts[contactId];

            console.assert(contact.setIndex === b2SetType.b2_awakeSet || contact.setIndex === b2SetType.b2_disabledSet);
            contactKey = contact.edges[edgeIndex].nextKey;

            if (contact.setIndex === b2SetType.b2_disabledSet)
            {
                continue;
            }

            if (contact.colorIndex !== B2_NULL_INDEX)
            {
                console.assert((contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0);

                continue;
            }

            const otherEdgeIndex = edgeIndex ^ 1;
            const otherBodyId = contact.edges[otherEdgeIndex].bodyId;

            // b2CheckIndex(bodies, otherBodyId);
            const otherBody = bodies[otherBodyId];

            if (otherBody.setIndex === b2SetType.b2_awakeSet)
            {
                continue;
            }

            const localIndex = contact.localIndex;
            console.assert(0 <= localIndex && localIndex < awakeSet.contacts.count);
            const contactSim = awakeSet.contacts.data[localIndex];

            console.assert(contactSim.manifold.pointCount === 0);
            console.assert((contact.flags & b2ContactFlags.b2_contactTouchingFlag) === 0 || (contact.flags & b2ContactFlags.b2_contactSensorFlag) !== 0);

            contact.setIndex = b2SetType.b2_disabledSet;
            contact.localIndex = disabledSet.contacts.count;
            const disabledContactSim = b2AddContact(disabledSet.contacts);
            disabledContactSim.set(contactSim);

            const movedContactIndex = b2RemoveContact(awakeSet.contacts, localIndex);

            if (movedContactIndex !== B2_NULL_INDEX)
            {
                const movedContactSim = awakeSet.contacts.data[localIndex];
                const movedId = movedContactSim.contactId;

                // b2CheckIndex(contacts, movedId);
                console.assert(contacts[movedId].localIndex === movedContactIndex);
                contacts[movedId].localIndex = localIndex;
            }
        }

        bodyId = body.islandNext;
    }

    let contactId = island.headContact;

    while (contactId !== B2_NULL_INDEX)
    {
        // b2CheckIndex(contacts, contactId);
        const contact = contacts[contactId];
        console.assert(contact.setIndex === b2SetType.b2_awakeSet);
        console.assert(contact.islandId === islandId);
        const colorIndex = contact.colorIndex;
        console.assert(0 <= colorIndex && colorIndex < b2_graphColorCount);

        const color = world.constraintGraph.colors[colorIndex];

        if (colorIndex !== b2_overflowIndex)
        {
            b2ClearBit(color.bodySet, contact.edges[0].bodyId);
            b2ClearBit(color.bodySet, contact.edges[1].bodyId);
        }

        const awakeContactIndex = contact.localIndex;
        console.assert(0 <= awakeContactIndex && awakeContactIndex < color.contacts.count);
        const awakeContactSim = color.contacts.data[awakeContactIndex];

        const sleepContactIndex = sleepSet.contacts.count;
        const sleepContactSim = b2AddContact(sleepSet.contacts);
        sleepContactSim.set(awakeContactSim);

        const movedIndex = b2RemoveContact(color.contacts, awakeContactIndex);

        if (movedIndex !== B2_NULL_INDEX)
        {
            const movedContactSim = color.contacts.data[awakeContactIndex];
            const movedId = movedContactSim.contactId;

            // b2CheckIndex(contacts, movedId);
            const movedContact = contacts[movedId];
            console.assert(movedContact.localIndex === movedIndex);
            movedContact.localIndex = awakeContactIndex;
        }

        contact.setIndex = sleepSetId;
        contact.colorIndex = B2_NULL_INDEX;
        contact.localIndex = sleepContactIndex;

        contactId = contact.islandNext;
    }

    const joints = world.jointArray;
    let jointId = island.headJoint;

    while (jointId !== B2_NULL_INDEX)
    {
        // b2CheckIndex(joints, jointId);
        const joint = joints[jointId];
        console.assert(joint.setIndex === b2SetType.b2_awakeSet);
        console.assert(joint.islandId === islandId);
        const colorIndex = joint.colorIndex;
        const localIndex = joint.localIndex;

        console.assert(0 <= colorIndex && colorIndex < b2_graphColorCount);

        const color = world.constraintGraph.colors[colorIndex];

        console.assert(0 <= localIndex && localIndex < color.joints.count);
        const awakeJointSim = color.joints.data[localIndex];

        if (colorIndex !== b2_overflowIndex)
        {
            b2ClearBit(color.bodySet, joint.edges[0].bodyId);
            b2ClearBit(color.bodySet, joint.edges[1].bodyId);
        }

        const sleepJointIndex = sleepSet.joints.count;
        const sleepJointSim = b2AddJoint(sleepSet.joints);
        awakeJointSim.copyTo(sleepJointSim);

        const movedIndex = b2RemoveJoint(color.joints, localIndex);

        if (movedIndex !== B2_NULL_INDEX)
        {
            const movedJointSim = color.joints.data[localIndex];
            const movedId = movedJointSim.jointId;

            // b2CheckIndex(joints, movedId);
            const movedJoint = joints[movedId];
            console.assert(movedJoint.localIndex === movedIndex);
            movedJoint.localIndex = localIndex;
        }

        joint.setIndex = sleepSetId;
        joint.colorIndex = B2_NULL_INDEX;
        joint.localIndex = sleepJointIndex;

        jointId = joint.islandNext;
    }

    console.assert(island.setIndex === b2SetType.b2_awakeSet);

    const islandIndex = island.localIndex;
    const sleepIsland = b2AddIsland(sleepSet.islands);
    sleepIsland.islandId = islandId;

    const movedIslandIndex = b2RemoveIsland(awakeSet.islands, islandIndex);

    if (movedIslandIndex !== B2_NULL_INDEX)
    {
        const movedIslandSim = awakeSet.islands.data[islandIndex];
        const movedIslandId = movedIslandSim.islandId;

        // b2CheckIndex(world.islandArray, movedIslandId);
        const movedIsland = world.islandArray[movedIslandId];
        console.assert(movedIsland.localIndex === movedIslandIndex);
        movedIsland.localIndex = islandIndex;
    }

    island.setIndex = sleepSetId;
    island.localIndex = 0;

    b2ValidateSolverSets(world);
}

export function b2MergeSolverSets(world, setId1, setId2)
{
    console.assert(setId1 >= b2SetType.b2_firstSleepingSet);
    console.assert(setId2 >= b2SetType.b2_firstSleepingSet);

    // b2CheckIndex(world.solverSetArray, setId1);
    // b2CheckIndex(world.solverSetArray, setId2);
    let set1 = world.solverSetArray[setId1];
    let set2 = world.solverSetArray[setId2];

    if (set1.sims.count < set2.sims.count)
    {
        [ set1, set2 ] = [ set2, set1 ];
        [ setId1, setId2 ] = [ setId2, setId1 ];
    }

    const bodies = world.bodyArray;
    const bodyCount = set2.sims.count;

    for (let i = 0; i < bodyCount; ++i)
    {
        const simSrc = set2.sims.data[i];

        const body = bodies[simSrc.bodyId];
        console.assert(body.setIndex === setId2);
        body.setIndex = setId1;
        body.localIndex = set1.sims.count;

        const simDst = b2AddBodySim(set1.sims);
        Object.assign(simDst, simSrc);
    }

    const contacts = world.contactArray;
    const contactCount = set2.contacts.count;

    for (let i = 0; i < contactCount; ++i)
    {
        const contactSrc = set2.contacts.data[i];

        const contact = contacts[contactSrc.contactId];
        console.assert(contact.setIndex === setId2);
        contact.setIndex = setId1;
        contact.localIndex = set1.contacts.count;

        const contactDst = b2AddContact(set1.contacts);
        contactDst.set(contactSrc);
    }

    const joints = world.jointArray;
    const jointCount = set2.joints.count;

    for (let i = 0; i < jointCount; ++i)
    {
        const jointSrc = set2.joints.data[i];

        const joint = joints[jointSrc.jointId];
        console.assert(joint.setIndex === setId2);
        joint.setIndex = setId1;
        joint.localIndex = set1.joints.count;

        const jointDst = b2AddJoint(set1.joints);
        Object.assign(jointDst, jointSrc);
    }

    const islands = world.islandArray;
    const islandCount = set2.islands.count;

    for (let i = 0; i < islandCount; ++i)
    {
        const islandSrc = set2.islands.data[i];
        const islandId = islandSrc.islandId;

        // b2CheckIndex(islands, islandId);
        const island = islands[islandId];
        island.setIndex = setId1;
        island.localIndex = set1.islands.count;

        const islandDst = b2AddIsland(set1.islands);
        Object.assign(islandDst, islandSrc);
    }

    b2DestroySolverSet(world, setId2);

    b2ValidateSolverSets(world);
}

export function b2TransferBody(world, targetSet, sourceSet, body)
{
    console.assert(targetSet !== sourceSet);

    const sourceIndex = body.localIndex;
    console.assert(0 <= sourceIndex && sourceIndex <= sourceSet.sims.count);
    const sourceSim = sourceSet.sims.data[sourceIndex];

    const targetIndex = targetSet.sims.count;
    const targetSim = b2AddBodySim(targetSet.sims);
    Object.assign(targetSim, sourceSim);

    const movedIndex = b2RemoveBodySim(sourceSet.sims, sourceIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        const movedSim = sourceSet.sims.data[sourceIndex];
        const movedId = movedSim.bodyId;
        const movedBody = world.bodyArray[movedId];
        console.assert(movedBody.localIndex === movedIndex);
        movedBody.localIndex = sourceIndex;
    }

    if (sourceSet.setIndex === b2SetType.b2_awakeSet)
    {
        b2RemoveBodyState(sourceSet.states, sourceIndex);
    }
    else if (targetSet.setIndex === b2SetType.b2_awakeSet)
    {
        const state = b2AddBodyState(targetSet.states);
        Object.assign(state, new b2BodyState());
    }

    body.setIndex = targetSet.setIndex;
    body.localIndex = targetIndex;
}

export function b2TransferJoint(world, targetSet, sourceSet, joint)
{
    console.assert(targetSet !== sourceSet);

    const localIndex = joint.localIndex;
    const colorIndex = joint.colorIndex;

    let sourceSim;

    if (sourceSet.setIndex === b2SetType.b2_awakeSet)
    {
        console.assert(0 <= colorIndex && colorIndex < b2_graphColorCount);
        const color = world.constraintGraph.colors[colorIndex];

        console.assert(0 <= localIndex && localIndex < color.joints.count);
        sourceSim = color.joints.data[localIndex];
    }
    else
    {
        console.assert(colorIndex === B2_NULL_INDEX);
        console.assert(0 <= localIndex && localIndex < sourceSet.joints.count);
        sourceSim = sourceSet.joints.data[localIndex];
    }

    if (targetSet.setIndex === b2SetType.b2_awakeSet)
    {
        b2AddJointToGraph(world, sourceSim, joint);
        joint.setIndex = b2SetType.b2_awakeSet;
    }
    else
    {
        joint.setIndex = targetSet.setIndex;
        joint.localIndex = targetSet.joints.count;
        joint.colorIndex = B2_NULL_INDEX;

        const targetSim = b2AddJoint(targetSet.joints);
        Object.assign(targetSim, sourceSim);
    }

    if (sourceSet.setIndex === b2SetType.b2_awakeSet)
    {
        b2RemoveJointFromGraph(world, joint.edges[0].bodyId, joint.edges[1].bodyId, colorIndex, localIndex);
    }
    else
    {
        const movedIndex = b2RemoveJoint(sourceSet.joints, localIndex);

        if (movedIndex !== B2_NULL_INDEX)
        {
            const movedJointSim = sourceSet.joints.data[localIndex];
            const movedId = movedJointSim.jointId;

            // b2CheckIndex(world.jointArray, movedId);
            const movedJoint = world.jointArray[movedId];
            movedJoint.localIndex = localIndex;
        }
    }
}
