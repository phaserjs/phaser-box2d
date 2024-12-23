/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2AddIsland, b2RemoveIsland } from './include/block_array_h.js';
import { b2AllocId, b2FreeId, b2GetIdCount } from './include/id_pool_h.js';
import { b2CheckIndex, b2SetType, b2ValidateConnectivity } from './include/world_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2ContactFlags } from './include/contact_h.js';
import { b2GetBody } from './include/body_h.js';
import { b2GetJoint } from './include/joint_h.js';
import { b2Validation } from './include/types_h.js';
import { b2WakeSolverSet } from './include/solver_set_h.js';

/**
 * @namespace Island
 */

// Persistent island for awake bodies, joints, and contacts
// https://en.wikipedia.org/wiki/Component_(graph_theory)
// https://en.wikipedia.org/wiki/Dynamic_connectivity
// map from int to solver set and index
export class b2Island
{
    setIndex = 0;
    localIndex = 0;
    islandId = 0;
    headBody = 0;
    tailBody = 0;
    bodyCount = 0;
    headContact = 0;
    tailContact = 0;
    contactCount = 0;
    headJoint = 0;
    tailJoint = 0;
    jointCount = 0;
    parentIsland = 0;
    constraintRemoveCount = 0;
}

export class b2IslandSim
{
    islandId = 0;
}

export function b2CreateIsland(world, setIndex)
{
    console.assert(setIndex === b2SetType.b2_awakeSet || setIndex >= b2SetType.b2_firstSleepingSet);

    const islandId = b2AllocId(world.islandIdPool);

    if (islandId === world.islandArray.length)
    {
        const emptyIsland = new b2Island();
        emptyIsland.setIndex = B2_NULL_INDEX;   // { setIndex: B2_NULL_INDEX };
        world.islandArray.push(emptyIsland);
    }
    else
    {
        console.assert(world.islandArray[islandId].setIndex === B2_NULL_INDEX);
    }

    // b2CheckIndex(world.solverSetArray, setIndex);
    const set = world.solverSetArray[setIndex];

    const island = world.islandArray[islandId];
    island.setIndex = setIndex;
    island.localIndex = set.islands.count;
    island.islandId = islandId;
    island.headBody = B2_NULL_INDEX;
    island.tailBody = B2_NULL_INDEX;
    island.bodyCount = 0;
    island.headContact = B2_NULL_INDEX;
    island.tailContact = B2_NULL_INDEX;
    island.contactCount = 0;
    island.headJoint = B2_NULL_INDEX;
    island.tailJoint = B2_NULL_INDEX;
    island.jointCount = 0;
    island.parentIsland = B2_NULL_INDEX;
    island.constraintRemoveCount = 0;

    const islandSim = b2AddIsland(set.islands);
    islandSim.islandId = islandId;

    return island;
}

export function b2DestroyIsland(world, islandId)
{
    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];

    // b2CheckIndex(world.solverSetArray, island.setIndex);
    const set = world.solverSetArray[island.setIndex];
    const movedIndex = b2RemoveIsland(set.islands, island.localIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        const movedElement = set.islands.data[island.localIndex];
        const movedId = movedElement.islandId;
        const movedIsland = world.islandArray[movedId];
        console.assert(movedIsland.localIndex === movedIndex);
        movedIsland.localIndex = island.localIndex;
    }

    island.islandId = B2_NULL_INDEX;
    island.setIndex = B2_NULL_INDEX;
    island.localIndex = B2_NULL_INDEX;
    b2FreeId(world.islandIdPool, islandId);
}

export function b2GetIsland(world, islandId)
{
    // b2CheckIndex(world.islandArray, islandId);
    return world.islandArray[islandId];
}

function b2AddContactToIsland(world, islandId, contact)
{
    console.assert(contact.islandId === B2_NULL_INDEX);
    console.assert(contact.islandPrev === B2_NULL_INDEX);
    console.assert(contact.islandNext === B2_NULL_INDEX);

    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];

    if (island.headContact !== B2_NULL_INDEX)
    {
        contact.islandNext = island.headContact;

        // b2CheckIndex(world.contactArray, island.headContact);
        const headContact = world.contactArray[island.headContact];
        headContact.islandPrev = contact.contactId;
    }

    island.headContact = contact.contactId;

    if (island.tailContact === B2_NULL_INDEX)
    {
        island.tailContact = island.headContact;
    }

    island.contactCount += 1;
    contact.islandId = islandId;

    b2ValidateIsland(world, islandId);
}

export function b2LinkContact(world, contact)
{
    console.assert((contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0 && (contact.flags & b2ContactFlags.b2_contactSensorFlag) === 0);

    const bodyIdA = contact.edges[0].bodyId;
    const bodyIdB = contact.edges[1].bodyId;

    const bodyA = b2GetBody(world, bodyIdA);
    const bodyB = b2GetBody(world, bodyIdB);

    console.assert(bodyA.setIndex !== b2SetType.b2_disabledSet && bodyB.setIndex !== b2SetType.b2_disabledSet);
    console.assert(bodyA.setIndex !== b2SetType.b2_staticSet || bodyB.setIndex !== b2SetType.b2_staticSet);

    if (bodyA.setIndex === b2SetType.b2_awakeSet && bodyB.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeSolverSet(world, bodyB.setIndex);
    }

    if (bodyB.setIndex === b2SetType.b2_awakeSet && bodyA.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeSolverSet(world, bodyA.setIndex);
    }

    let islandIdA = bodyA.islandId;
    let islandIdB = bodyB.islandId;

    console.assert(bodyA.setIndex !== b2SetType.b2_staticSet || islandIdA === B2_NULL_INDEX);
    console.assert(bodyB.setIndex !== b2SetType.b2_staticSet || islandIdB === B2_NULL_INDEX);
    console.assert(islandIdA !== B2_NULL_INDEX || islandIdB !== B2_NULL_INDEX);

    if (islandIdA === islandIdB)
    {
        b2AddContactToIsland(world, islandIdA, contact);

        return;
    }

    let islandA = null;

    if (islandIdA !== B2_NULL_INDEX)
    {
        islandA = b2GetIsland(world, islandIdA);
        let parentId = islandA.parentIsland;

        while (parentId !== B2_NULL_INDEX)
        {
            const parent = b2GetIsland(world, parentId);

            if (parent.parentIsland !== B2_NULL_INDEX)
            {
                islandA.parentIsland = parent.parentIsland;
            }

            islandA = parent;
            islandIdA = parentId;
            parentId = islandA.parentIsland;
        }
    }

    let islandB = null;

    if (islandIdB !== B2_NULL_INDEX)
    {
        islandB = b2GetIsland(world, islandIdB);
        let parentId = islandB.parentIsland;

        while (islandB.parentIsland !== B2_NULL_INDEX)
        {
            const parent = b2GetIsland(world, parentId);

            if (parent.parentIsland !== B2_NULL_INDEX)
            {
                islandB.parentIsland = parent.parentIsland;
            }

            islandB = parent;
            islandIdB = parentId;
            parentId = islandB.parentIsland;
        }
    }

    console.assert(islandA !== null || islandB !== null);

    if (islandA !== islandB && islandA !== null && islandB !== null)
    {
        console.assert(islandA !== islandB);
        console.assert(islandB.parentIsland === B2_NULL_INDEX);
        islandB.parentIsland = islandIdA;
    }

    if (islandA !== null)
    {
        b2AddContactToIsland(world, islandIdA, contact);
    }
    else
    {
        b2AddContactToIsland(world, islandIdB, contact);
    }
}

export function b2UnlinkContact(world, contact)
{
    console.assert((contact.flags & b2ContactFlags.b2_contactSensorFlag) === 0);
    console.assert(contact.islandId !== B2_NULL_INDEX);

    const islandId = contact.islandId;

    // b2CheckIndex(world.islandArray, islandId);
    const island = b2GetIsland(world, islandId);

    if (contact.islandPrev !== B2_NULL_INDEX)
    {
        // b2CheckIndex(world.contactArray, contact.islandPrev);
        const prevContact = world.contactArray[contact.islandPrev];
        console.assert(prevContact.islandNext === contact.contactId);
        prevContact.islandNext = contact.islandNext;
    }

    if (contact.islandNext !== B2_NULL_INDEX)
    {
        // b2CheckIndex(world.contactArray, contact.islandNext);
        const nextContact = world.contactArray[contact.islandNext];
        console.assert(nextContact.islandPrev === contact.contactId);
        nextContact.islandPrev = contact.islandPrev;
    }

    if (island.headContact === contact.contactId)
    {
        island.headContact = contact.islandNext;
    }

    if (island.tailContact === contact.contactId)
    {
        island.tailContact = contact.islandPrev;
    }

    console.assert(island.contactCount > 0);
    island.contactCount -= 1;
    island.constraintRemoveCount += 1;

    contact.islandId = B2_NULL_INDEX;
    contact.islandPrev = B2_NULL_INDEX;
    contact.islandNext = B2_NULL_INDEX;

    b2ValidateIsland(world, islandId);
}

function b2AddJointToIsland(world, islandId, joint)
{
    console.assert(joint.islandId === B2_NULL_INDEX);
    console.assert(joint.islandPrev === B2_NULL_INDEX);
    console.assert(joint.islandNext === B2_NULL_INDEX);

    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];

    if (island.headJoint !== B2_NULL_INDEX)
    {
        joint.islandNext = island.headJoint;
        const headJoint = b2GetJoint(world, island.headJoint);
        headJoint.islandPrev = joint.jointId;
    }

    island.headJoint = joint.jointId;

    if (island.tailJoint === B2_NULL_INDEX)
    {
        island.tailJoint = island.headJoint;
    }

    island.jointCount += 1;
    joint.islandId = islandId;

    b2ValidateIsland(world, islandId);
}

export function b2LinkJoint(world, joint)
{
    const bodyA = b2GetBody(world, joint.edges[0].bodyId);
    const bodyB = b2GetBody(world, joint.edges[1].bodyId);

    if (bodyA.setIndex === b2SetType.b2_awakeSet && bodyB.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeSolverSet(world, bodyB.setIndex);
    }
    else if (bodyB.setIndex === b2SetType.b2_awakeSet && bodyA.setIndex >= b2SetType.b2_firstSleepingSet)
    {
        b2WakeSolverSet(world, bodyA.setIndex);
    }

    let islandIdA = bodyA.islandId;
    let islandIdB = bodyB.islandId;

    console.assert(islandIdA !== B2_NULL_INDEX || islandIdB !== B2_NULL_INDEX);

    if (islandIdA === islandIdB)
    {
        b2AddJointToIsland(world, islandIdA, joint);

        return;
    }

    let islandA = null;

    if (islandIdA !== B2_NULL_INDEX)
    {
        islandA = b2GetIsland(world, islandIdA);

        while (islandA.parentIsland !== B2_NULL_INDEX)
        {
            const parent = b2GetIsland(world, islandA.parentIsland);

            if (parent.parentIsland !== B2_NULL_INDEX)
            {
                islandA.parentIsland = parent.parentIsland;
            }

            islandIdA = islandA.parentIsland;
            islandA = parent;
        }
    }

    let islandB = null;

    if (islandIdB !== B2_NULL_INDEX)
    {
        islandB = b2GetIsland(world, islandIdB);

        while (islandB.parentIsland !== B2_NULL_INDEX)
        {
            const parent = b2GetIsland(world, islandB.parentIsland);

            if (parent.parentIsland !== B2_NULL_INDEX)
            {
                islandB.parentIsland = parent.parentIsland;
            }

            islandIdB = islandB.parentIsland;
            islandB = parent;
        }
    }

    console.assert(islandA !== null || islandB !== null);

    if (islandA !== islandB && islandA !== null && islandB !== null)
    {
        console.assert(islandA !== islandB);
        console.assert(islandB.parentIsland === B2_NULL_INDEX);
        islandB.parentIsland = islandIdA;
    }

    if (islandA !== null)
    {
        b2AddJointToIsland(world, islandIdA, joint);
    }
    else
    {
        b2AddJointToIsland(world, islandIdB, joint);
    }
}

export function b2UnlinkJoint(world, joint)
{
    console.assert(joint.islandId !== B2_NULL_INDEX);

    const islandId = joint.islandId;

    // b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];

    if (joint.islandPrev !== B2_NULL_INDEX)
    {
        const prevJoint = b2GetJoint(world, joint.islandPrev);
        console.assert(prevJoint.islandNext === joint.jointId);
        prevJoint.islandNext = joint.islandNext;
    }

    if (joint.islandNext !== B2_NULL_INDEX)
    {
        const nextJoint = b2GetJoint(world, joint.islandNext);
        console.assert(nextJoint.islandPrev === joint.jointId);
        nextJoint.islandPrev = joint.islandPrev;
    }

    if (island.headJoint === joint.jointId)
    {
        island.headJoint = joint.islandNext;
    }

    if (island.tailJoint === joint.jointId)
    {
        island.tailJoint = joint.islandPrev;
    }

    console.assert(island.jointCount > 0);
    island.jointCount -= 1;
    island.constraintRemoveCount += 1;

    joint.islandId = B2_NULL_INDEX;
    joint.islandPrev = B2_NULL_INDEX;
    joint.islandNext = B2_NULL_INDEX;

    b2ValidateIsland(world, islandId);
}

function b2MergeIsland(world, island)
{
    console.assert(island.parentIsland !== B2_NULL_INDEX);

    const rootId = island.parentIsland;

    // b2CheckIndex(world.islandArray, rootId);
    const rootIsland = world.islandArray[rootId];
    console.assert(rootIsland.parentIsland === B2_NULL_INDEX);

    let bodyId = island.headBody;

    while (bodyId !== B2_NULL_INDEX)
    {
        const body = b2GetBody(world, bodyId);
        body.islandId = rootId;
        bodyId = body.islandNext;
    }

    let contactId = island.headContact;

    while (contactId !== B2_NULL_INDEX)
    {
        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];
        contact.islandId = rootId;
        contactId = contact.islandNext;
    }

    let jointId = island.headJoint;

    while (jointId !== B2_NULL_INDEX)
    {
        const joint = b2GetJoint(world, jointId);
        joint.islandId = rootId;
        jointId = joint.islandNext;
    }

    console.assert(rootIsland.tailBody !== B2_NULL_INDEX);
    const tailBody = b2GetBody(world, rootIsland.tailBody);
    console.assert(tailBody.islandNext === B2_NULL_INDEX);
    tailBody.islandNext = island.headBody;

    console.assert(island.headBody !== B2_NULL_INDEX);
    const headBody = b2GetBody(world, island.headBody);
    console.assert(headBody.islandPrev === B2_NULL_INDEX);
    headBody.islandPrev = rootIsland.tailBody;

    rootIsland.tailBody = island.tailBody;
    rootIsland.bodyCount += island.bodyCount;

    if (rootIsland.headContact === B2_NULL_INDEX)
    {
        console.assert(rootIsland.tailContact === B2_NULL_INDEX && rootIsland.contactCount === 0);
        rootIsland.headContact = island.headContact;
        rootIsland.tailContact = island.tailContact;
        rootIsland.contactCount = island.contactCount;
    }
    else if (island.headContact !== B2_NULL_INDEX)
    {
        console.assert(island.tailContact !== B2_NULL_INDEX && island.contactCount > 0);
        console.assert(rootIsland.tailContact !== B2_NULL_INDEX && rootIsland.contactCount > 0);

        // b2CheckIndex(world.contactArray, rootIsland.tailContact);
        const tailContact = world.contactArray[rootIsland.tailContact];
        console.assert(tailContact.islandNext === B2_NULL_INDEX);
        tailContact.islandNext = island.headContact;

        // b2CheckIndex(world.contactArray, island.headContact);
        const headContact = world.contactArray[island.headContact];
        console.assert(headContact.islandPrev === B2_NULL_INDEX);
        headContact.islandPrev = rootIsland.tailContact;

        rootIsland.tailContact = island.tailContact;
        rootIsland.contactCount += island.contactCount;
    }

    if (rootIsland.headJoint === B2_NULL_INDEX)
    {
        console.assert(rootIsland.tailJoint === B2_NULL_INDEX && rootIsland.jointCount === 0);
        rootIsland.headJoint = island.headJoint;
        rootIsland.tailJoint = island.tailJoint;
        rootIsland.jointCount = island.jointCount;
    }
    else if (island.headJoint !== B2_NULL_INDEX)
    {
        console.assert(island.tailJoint !== B2_NULL_INDEX && island.jointCount > 0);
        console.assert(rootIsland.tailJoint !== B2_NULL_INDEX && rootIsland.jointCount > 0);

        const tailJoint = b2GetJoint(world, rootIsland.tailJoint);
        console.assert(tailJoint.islandNext === B2_NULL_INDEX);
        tailJoint.islandNext = island.headJoint;

        const headJoint = b2GetJoint(world, island.headJoint);
        console.assert(headJoint.islandPrev === B2_NULL_INDEX);
        headJoint.islandPrev = rootIsland.tailJoint;

        rootIsland.tailJoint = island.tailJoint;
        rootIsland.jointCount += island.jointCount;
    }

    rootIsland.constraintRemoveCount += island.constraintRemoveCount;

    b2ValidateIsland(world, rootId);
}

export function b2MergeAwakeIslands(world)
{
    // b2TracyCZoneNC("merge_islands", "Merge Islands", b2HexColor.b2_colorMediumTurquoise, true);

    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    const islandSims = awakeSet.islands.data;
    const awakeIslandCount = awakeSet.islands.count;
    const islands = world.islandArray;

    for (let i = 0; i < awakeIslandCount; ++i)
    {
        const islandId = islandSims[i].islandId;

        // b2CheckIndex(islands, islandId);
        const island = islands[islandId];

        let rootId = islandId;
        let rootIsland = island;

        while (rootIsland.parentIsland !== B2_NULL_INDEX)
        {
            // b2CheckIndex(islands, rootIsland.parentIsland);
            const parent = islands[rootIsland.parentIsland];

            if (parent.parentIsland !== B2_NULL_INDEX)
            {
                rootIsland.parentIsland = parent.parentIsland;
            }

            rootId = rootIsland.parentIsland;
            rootIsland = parent;
        }

        if (rootIsland !== island)
        {
            island.parentIsland = rootId;
        }
    }

    for (let i = awakeIslandCount - 1; i >= 0; --i)
    {
        const islandId = islandSims[i].islandId;

        // b2CheckIndex(islands, islandId);
        const island = islands[islandId];

        if (island.parentIsland === B2_NULL_INDEX)
        {
            continue;
        }

        b2MergeIsland(world, island);

        b2DestroyIsland(world, islandId);
    }

    b2ValidateConnectivity(world);

    // b2TracyCZoneEnd("merge_islands");
}

export function b2SplitIsland(world, baseId)
{
    // b2CheckIndex(world.islandArray, baseId);
    const baseIsland = world.islandArray[baseId];
    const setIndex = baseIsland.setIndex;

    if (setIndex !== b2SetType.b2_awakeSet)
    {
        // can only split awake island
        return;
    }

    if (baseIsland.constraintRemoveCount === 0)
    {
        // this island doesn't need to be split
        return;
    }

    b2ValidateIsland(world, baseId);

    const bodyCount = baseIsland.bodyCount;

    const bodies = world.bodyArray;
    const contacts = world.contactArray;

    const stack = [];
    const bodyIds = [];

    // Build array containing all body indices from base island. These
    // serve as seed bodies for the depth first search (DFS).
    let nextBody = baseIsland.headBody;

    while (nextBody !== B2_NULL_INDEX)
    {
        bodyIds.push(nextBody);
        const body = bodies[nextBody];

        // Clear visitation mark
        body.isMarked = false;

        nextBody = body.islandNext;
    }
    console.assert(bodyIds.length === bodyCount);

    // Clear contact island flags. Only need to consider contacts
    // already in the base island.
    let nextContactId = baseIsland.headContact;

    while (nextContactId !== B2_NULL_INDEX)
    {
        const contact = contacts[nextContactId];
        contact.isMarked = false;
        nextContactId = contact.islandNext;
    }

    // Clear joint island flags.
    let nextJoint = baseIsland.headJoint;

    while (nextJoint !== B2_NULL_INDEX)
    {
        const joint = b2GetJoint(world, nextJoint);
        joint.isMarked = false;
        nextJoint = joint.islandNext;
    }

    // Done with the base split island.
    b2DestroyIsland(world, baseId);

    // Each island is found as a depth first search starting from a seed body
    for (let i = 0; i < bodyCount; ++i)
    {
        const seedIndex = bodyIds[i];
        const seed = bodies[seedIndex];
        console.assert(seed.setIndex === setIndex);

        if (seed.isMarked === true)
        {
            continue;
        }

        stack.push(seedIndex);
        seed.isMarked = true;

        const island = b2CreateIsland(world, setIndex);

        const islandId = island.islandId;

        while (stack.length > 0)
        {
            const bodyId = stack.pop();
            const body = bodies[bodyId];
            console.assert(body.setIndex === b2SetType.b2_awakeSet);
            console.assert(body.isMarked === true);

            body.islandId = islandId;

            if (island.tailBody !== B2_NULL_INDEX)
            {
                bodies[island.tailBody].islandNext = bodyId;
            }
            body.islandPrev = island.tailBody;
            body.islandNext = B2_NULL_INDEX;
            island.tailBody = bodyId;

            if (island.headBody === B2_NULL_INDEX)
            {
                island.headBody = bodyId;
            }

            island.bodyCount += 1;

            let contactKey = body.headContactKey;

            while (contactKey !== B2_NULL_INDEX)
            {
                const contactId = contactKey >> 1;
                const edgeIndex = contactKey & 1;

                // b2CheckIndex(world.contactArray, contactId);
                const contact = world.contactArray[contactId];
                console.assert(contact.contactId === contactId);

                contactKey = contact.edges[edgeIndex].nextKey;

                if (contact.isMarked)
                {
                    continue;
                }

                if (contact.flags & b2ContactFlags.b2_contactSensorFlag)
                {
                    continue;
                }

                if ((contact.flags & b2ContactFlags.b2_contactTouchingFlag) === 0)
                {
                    continue;
                }

                contact.isMarked = true;

                const otherEdgeIndex = edgeIndex ^ 1;
                const otherBodyId = contact.edges[otherEdgeIndex].bodyId;
                const otherBody = bodies[otherBodyId];

                if (otherBody.isMarked === false && otherBody.setIndex !== b2SetType.b2_staticSet)
                {
                    console.assert(stack.length < bodyCount);
                    stack.push(otherBodyId);
                    otherBody.isMarked = true;
                }

                contact.islandId = islandId;

                if (island.tailContact !== B2_NULL_INDEX)
                {
                    // b2CheckIndex(world.contactArray, island.tailContact);
                    const tailContact = world.contactArray[island.tailContact];
                    tailContact.islandNext = contactId;
                }
                contact.islandPrev = island.tailContact;
                contact.islandNext = B2_NULL_INDEX;
                island.tailContact = contactId;

                if (island.headContact === B2_NULL_INDEX)
                {
                    island.headContact = contactId;
                }

                island.contactCount += 1;
            }

            let jointKey = body.headJointKey;

            while (jointKey !== B2_NULL_INDEX)
            {
                const jointId = jointKey >> 1;
                const edgeIndex = jointKey & 1;

                const joint = b2GetJoint(world, jointId);
                console.assert(joint.jointId === jointId);

                jointKey = joint.edges[edgeIndex].nextKey;

                if (joint.isMarked)
                {
                    continue;
                }

                joint.isMarked = true;

                const otherEdgeIndex = edgeIndex ^ 1;
                const otherBodyId = joint.edges[otherEdgeIndex].bodyId;
                const otherBody = bodies[otherBodyId];

                if (otherBody.setIndex === b2SetType.b2_disabledSet)
                {
                    continue;
                }

                if (otherBody.isMarked === false && otherBody.setIndex === b2SetType.b2_awakeSet)
                {
                    stack.push(otherBodyId);
                    otherBody.isMarked = true;
                }

                joint.islandId = islandId;

                if (island.tailJoint !== B2_NULL_INDEX)
                {
                    const tailJoint = b2GetJoint(world, island.tailJoint);
                    tailJoint.islandNext = jointId;
                }
                joint.islandPrev = island.tailJoint;
                joint.islandNext = B2_NULL_INDEX;
                island.tailJoint = jointId;

                if (island.headJoint === B2_NULL_INDEX)
                {
                    island.headJoint = jointId;
                }

                island.jointCount += 1;
            }
        }

        b2ValidateIsland(world, islandId);
    }

    // b2FreeStackItem(alloc, bodyIds);
    // b2FreeStackItem(alloc, stack);
}

export function b2ValidateIsland(world, islandId)
{
    if (!b2Validation) { return; }
    
    b2CheckIndex(world.islandArray, islandId);
    const island = world.islandArray[islandId];
    console.assert(island.islandId == islandId);
    console.assert(island.setIndex != B2_NULL_INDEX);
    console.assert(island.headBody != B2_NULL_INDEX);

    {
        const bodies = world.bodyArray;
        console.assert(island.tailBody != B2_NULL_INDEX);
        console.assert(island.bodyCount > 0);

        if (island.bodyCount > 1)
        {
            console.assert(island.tailBody != island.headBody);
        }
        console.assert(island.bodyCount <= b2GetIdCount(world.bodyIdPool));

        let count = 0;
        let bodyId = island.headBody;

        while (bodyId != B2_NULL_INDEX)
        {
            b2CheckIndex(bodies, bodyId);
            const body = bodies[bodyId];
            console.assert(body.islandId == islandId);
            console.assert(body.setIndex == island.setIndex);
            count += 1;

            if (count == island.bodyCount)
            {
                console.assert(bodyId == island.tailBody);
            }

            bodyId = body.islandNext;
        }
        console.assert(count == island.bodyCount);
    }

    if (island.headContact != B2_NULL_INDEX)
    {
        console.assert(island.tailContact != B2_NULL_INDEX);
        console.assert(island.contactCount > 0);

        if (island.contactCount > 1)
        {
            console.assert(island.tailContact != island.headContact);
        }
        console.assert(island.contactCount <= b2GetIdCount(world.contactIdPool));

        let count = 0;
        let contactId = island.headContact;

        while (contactId != B2_NULL_INDEX)
        {
            b2CheckIndex(world.contactArray, contactId);
            const contact = world.contactArray[contactId];
            console.assert(contact.setIndex == island.setIndex);
            console.assert(contact.islandId == islandId);
            count += 1;

            if (count == island.contactCount)
            {
                console.assert(contactId == island.tailContact);
            }

            contactId = contact.islandNext;
        }
        console.assert(count == island.contactCount);
    }
    else
    {
        console.assert(island.tailContact == B2_NULL_INDEX);
        console.assert(island.contactCount == 0);
    }

    if (island.headJoint != B2_NULL_INDEX)
    {
        console.assert(island.tailJoint != B2_NULL_INDEX);
        console.assert(island.jointCount > 0);

        if (island.jointCount > 1)
        {
            console.assert(island.tailJoint != island.headJoint);
        }
        console.assert(island.jointCount <= b2GetIdCount(world.jointIdPool));

        let count = 0;
        let jointId = island.headJoint;

        while (jointId != B2_NULL_INDEX)
        {
            b2CheckIndex(world.jointArray, jointId);
            const joint = world.jointArray[jointId];
            console.assert(joint.setIndex == island.setIndex);
            count += 1;

            if (count == island.jointCount)
            {
                console.assert(jointId == island.tailJoint);
            }

            jointId = joint.islandNext;
        }
        console.assert(count == island.jointCount);
    }
    else
    {
        console.assert(island.tailJoint == B2_NULL_INDEX);
        console.assert(island.jointCount == 0);
    }
}
