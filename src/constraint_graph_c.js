/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_NULL_INDEX, b2_graphColorCount } from './include/core_h.js';
import { b2AddContact, b2AddJoint, b2ContactArray, b2JointArray, b2RemoveContact, b2RemoveJoint } from './include/block_array_h.js';
import { b2BitSet, b2ClearBit, b2CreateBitSet, b2DestroyBitSet, b2SetBitCountAndClear } from './include/bitset_h.js';
import { b2CheckIndex, b2SetType } from './include/world_h.js';
import { b2ContactFlags, b2ContactSimFlags } from './include/contact_h.js';

/**
 * @namespace ConstraintGraph
 */

// JS conversion is not using threads, everything should go into the overflow set for single thread processing
export const b2_overflowIndex = b2_graphColorCount - 1;

export class b2GraphColor
{
    constructor()
    {
        this.bodySet = new b2BitSet();
        this.contacts = new b2ContactArray();
        this.joints = new b2JointArray();
        this.overflowConstraints = null;
    }
}

export class b2ConstraintGraph
{
    constructor()
    {
        this.colors = [];

        for (let i = 0; i < b2_graphColorCount; i++)
        { this.colors.push(new b2GraphColor()); }
    }
}

export function b2CreateGraph(graph, bodyCapacity)
{
    console.assert( b2_graphColorCount >= 2, "must have at least two constraint graph colors" );
    console.assert( b2_overflowIndex == b2_graphColorCount - 1, "bad over flow index");

    graph = new b2ConstraintGraph();

    bodyCapacity = Math.max(bodyCapacity, 8);

    for (let i = 0; i < b2_overflowIndex; i++)
    {
        const color = graph.colors[i];
        color.bodySet = b2CreateBitSet(bodyCapacity);
        color.bodySet = b2SetBitCountAndClear(color.bodySet, bodyCapacity);
    }

    return graph;
}

export function b2DestroyGraph(graph)
{
    for (let i = 0; i < b2_graphColorCount; i++)
    {
        const color = graph.colors[i];

        // console.assert( i != b2_overflowIndex || color.bodySet.bits == null );
        b2DestroyBitSet(color.bodySet); color.bodySet = null;
        color.contacts = null;
        color.joints = null;
    }
}

export function b2AddContactToGraph(world, contactSim, contact)
{
    if (contactSim.manifold.pointCount <= 0)
    {
        throw new Error("Assert failed: contactSim.manifold.pointCount > 0");
    }

    if (!(contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag))
    {
        throw new Error("Assert failed: contactSim.simFlags & b2_simTouchingFlag");
    }

    if (!(contact.flags & b2ContactFlags.b2_contactTouchingFlag))
    {
        throw new Error("Assert failed: contact.flags & b2_contactTouchingFlag");
    }

    const graph = world.constraintGraph;
    const colorIndex = b2_overflowIndex;

    const bodyIdA = contact.edges[0].bodyId;
    const bodyIdB = contact.edges[1].bodyId;
    b2CheckIndex(world.bodyArray, bodyIdA);
    b2CheckIndex(world.bodyArray, bodyIdB);

    const bodyA = world.bodyArray[bodyIdA];
    const bodyB = world.bodyArray[bodyIdB];
    const staticA = bodyA.setIndex == b2SetType.b2_staticSet;
    const staticB = bodyB.setIndex == b2SetType.b2_staticSet;

    if (staticA && staticB)
    {
        throw new Error("Assert failed: staticA == false || staticB == false");
    }

    const color = graph.colors[colorIndex];
    contact.colorIndex = colorIndex;
    contact.localIndex = color.contacts.count;

    const newContact = b2AddContact(color.contacts);    // add a b2ContactSim to the color.contacts array and return it
    newContact.set(contactSim);

    if (staticA)
    {
        newContact.bodySimIndexA = B2_NULL_INDEX;
        newContact.invMassA = 0.0;
        newContact.invIA = 0.0;
    }
    else
    {
        if (bodyA.setIndex !== b2SetType.b2_awakeSet)
        {
            throw new Error("Assert failed: bodyA.setIndex == b2SetType.b2_awakeSet");
        }
        const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];

        const localIndex = bodyA.localIndex;

        if (!(0 <= localIndex && localIndex < awakeSet.sims.count))
        {
            throw new Error("Assert failed: 0 <= localIndex && localIndex < awakeSet.sims.count");
        }
        newContact.bodySimIndexA = localIndex;

        const bodySimA = awakeSet.sims.data[localIndex];
        newContact.invMassA = bodySimA.invMass;
        newContact.invIA = bodySimA.invInertia;
    }

    if (staticB)
    {
        newContact.bodySimIndexB = B2_NULL_INDEX;
        newContact.invMassB = 0.0;
        newContact.invIB = 0.0;
    }
    else
    {
        if (bodyB.setIndex !== b2SetType.b2_awakeSet)
        {
            throw new Error("Assert failed: bodyB.setIndex == b2SetType.b2_awakeSet");
        }
        const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];

        const localIndex = bodyB.localIndex;

        if (!(0 <= localIndex && localIndex < awakeSet.sims.count))
        {
            throw new Error("Assert failed: 0 <= localIndex && localIndex < awakeSet.sims.count");
        }
        newContact.bodySimIndexB = localIndex;

        const bodySimB = awakeSet.sims.data[localIndex];
        newContact.invMassB = bodySimB.invMass;
        newContact.invIB = bodySimB.invInertia;
    }
}

export function b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex)
{
    const graph = world.constraintGraph;

    if (colorIndex !== b2_overflowIndex)
    {
        throw new Error("Assert failed: colorIndex == b2_overflowIndex");
    }
    const color = graph.colors[colorIndex];

    if ( colorIndex != b2_overflowIndex )
    {
        // might clear a bit for a static body, but this has no effect
        b2ClearBit( color.bodySet, bodyIdA );
        b2ClearBit( color.bodySet, bodyIdB );
    }

    const movedIndex = b2RemoveContact(color.contacts, localIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        // Fix index on swapped contact
        const movedContactSim = color.contacts.data[localIndex];

        // Fix moved contact
        const movedId = movedContactSim.contactId;
        const movedContact = world.contactArray[movedId];

        if (movedContact.setIndex !== b2SetType.b2_awakeSet)
        {
            throw new Error("Assert failed: movedContact.setIndex == b2SetType.b2_awakeSet");
        }

        if (movedContact.colorIndex !== colorIndex)
        {
            throw new Error("Assert failed: movedContact.colorIndex == colorIndex");
        }

        if (movedContact.localIndex !== movedIndex)
        {
            throw new Error("Assert failed: movedContact.localIndex == movedIndex");
        }
        movedContact.localIndex = localIndex;
    }
}

function b2AssignJointColor(graph, bodyIdA, bodyIdB, staticA, staticB)
{
    console.assert( staticA == false || staticB == false );

    return b2_overflowIndex;
}

export function b2CreateJointInGraph(world, joint)
{
    const graph = world.constraintGraph;

    const bodyIdA = joint.edges[0].bodyId;
    const bodyIdB = joint.edges[1].bodyId;

    // array_h.b2CheckIndex(world.bodyArray, bodyIdA);
    // array_h.b2CheckIndex(world.bodyArray, bodyIdB);

    const bodyA = world.bodyArray[bodyIdA];
    const bodyB = world.bodyArray[bodyIdB];
    const staticA = bodyA.setIndex === b2SetType.b2_staticSet;
    const staticB = bodyB.setIndex === b2SetType.b2_staticSet;

    if (staticA && staticB)
    {
        throw new Error("Assert failed: staticA == false || staticB == false");
    }

    const colorIndex = b2AssignJointColor( graph, bodyIdA, bodyIdB, staticA, staticB );

    const jointSim = b2AddJoint(graph.colors[colorIndex].joints);
    joint.colorIndex = colorIndex;
    joint.localIndex = graph.colors[colorIndex].joints.count - 1;

    return jointSim;
}

export function b2AddJointToGraph(world, jointSim, joint)
{
    const jointDst = b2CreateJointInGraph(world, joint);
    Object.assign(jointDst, jointSim);
}

export function b2RemoveJointFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex)
{
    const graph = world.constraintGraph;

    console.assert(0 <= colorIndex && colorIndex < b2_graphColorCount);
    const color = graph.colors[colorIndex];

    if (colorIndex != b2_overflowIndex)
    {
        b2ClearBit(color.bodySet, bodyIdA);
        b2ClearBit(color.bodySet, bodyIdB);
    }

    // remove joint localIndex
    const movedIndex = b2RemoveJoint(color.joints, localIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        // Fix moved joint
        const movedJointSim = color.joints.data[localIndex];
        const movedId = movedJointSim.jointId;

        // array_h.b2CheckIndex(world.jointArray, movedId);
        if (movedId != world.jointArray[movedId].jointId)
        {
            throw new Error("Assert failed: movedId != jointId");
        }

        const movedJoint = world.jointArray[movedId];

        if (movedJoint.setIndex !== b2SetType.b2_awakeSet)
        {
            throw new Error("Assert failed: movedJoint.setIndex == b2SetType.b2_awakeSet");
        }

        if (movedJoint.colorIndex !== colorIndex)
        {
            throw new Error("Assert failed: movedJoint.colorIndex == colorIndex");
        }

        if (movedJoint.localIndex !== movedIndex)
        {
            throw new Error("Assert failed: movedJoint.localIndex == movedIndex");
        }

        movedJoint.localIndex = localIndex;
    }
}
