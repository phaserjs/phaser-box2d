/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_DEFAULT_MASK_BITS, b2DistanceInput, b2RayCastInput, b2ShapeCastInput } from './include/collision_h.js';
import { B2_NULL_INDEX, b2_graphColorCount, b2_linearSlop } from './include/core_h.js';
import { B2_PROXY_TYPE, b2BroadPhase, b2BroadPhase_RebuildTrees, b2CreateBroadPhase, b2DestroyBroadPhase, b2UpdateBroadPhasePairs } from './include/broad_phase_h.js';
import {
    GlobalDebug,
    b2AABB,
    b2AABB_IsValid,
    b2ClampFloat,
    b2Cross,
    b2IsValid,
    b2ManifoldPointWhere,
    b2MulAdd,
    b2MulSV,
    b2Normalize,
    b2RightPerp,
    b2Rot,
    b2Rot2Where,
    b2Rot_IsValid,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2TransformPointOut,
    b2TransformPointOutXf,
    b2Vec2,
    b2Vec2Where,
    b2Vec2_IsValid
} from './include/math_functions_h.js';
import { b2AddContact, b2RemoveContact } from './include/block_array_h.js';
import { b2AddContactToGraph, b2RemoveContactFromGraph } from './include/constraint_graph_h.js';
import { b2AllocId, b2CreateIdPool, b2DestroyIdPool, b2GetIdCapacity, b2GetIdCount } from './include/id_pool_h.js';
import { b2BitSet, b2CreateBitSet, b2DestroyBitSet, b2InPlaceUnion, b2SetBit, b2SetBitCountAndClear } from './include/bitset_h.js';
import {
    b2BodyEvents,
    b2BodyType,
    b2ContactBeginTouchEvent,
    b2ContactEndTouchEvent,
    b2ContactEvents,
    b2RayResult,
    b2SensorBeginTouchEvent,
    b2SensorEndTouchEvent,
    b2SensorEvents,
    b2ShapeType,
    b2Validation
} from './include/types_h.js';
import { b2BodyId, b2ShapeId, b2WorldId } from './include/id_h.js';
import { b2ComputeCapsuleAABB, b2ComputeCircleAABB, b2ComputePolygonAABB } from './include/geometry_h.js';
import { b2ConstraintGraph, b2CreateGraph, b2DestroyGraph, b2_overflowIndex } from './include/constraint_graph_h.js';
import { b2Contact, b2ContactFlags, b2ContactSimFlags, b2DestroyContact, b2GetContactSim, b2InitializeContactRegisters, b2UpdateContact } from './include/contact_h.js';
import { b2CreateStackAllocator, b2DestroyStackAllocator, b2GetStackAllocation, b2StackAllocator } from './include/stack_allocator_h.js';
import { b2DestroySolverSet, b2SolverSet, b2WakeSolverSet } from './include/solver_set_h.js';
import { b2DrawJoint, b2GetJointSim } from './include/joint_h.js';
import { b2DynamicTree_Query, b2DynamicTree_RayCast, b2DynamicTree_ShapeCast } from './include/dynamic_tree_h.js';
import { b2GetBody, b2GetBodySim, b2GetBodyTransformQuick, b2WakeBody } from './include/body_h.js';
import { b2GetShapeCentroid, b2GetShapePerimeter, b2MakeShapeDistanceProxy, b2RayCastShape, b2ShapeCastShape } from './include/shape_h.js';
import { b2LinkContact, b2UnlinkContact } from './include/island_h.js';
import { b2MakeProxy, b2ShapeDistance } from './include/distance_h.js';
import { b2MakeSoft, b2Solve, b2StepContext } from './include/solver_h.js';

import { b2AABB_Overlaps } from './include/aabb_h.js';
import { b2CTZ64 } from './include/ctz_h.js';
import { b2DistanceCache } from './include/collision_h.js';
import { b2HexColor } from './include/types_h.js';

/**
 * @namespace World
 */

/**
 * @import {b2WorldDef, b2DebugDraw, b2QueryFilter} from './include/types_h.js'
 * @import {b2ChainId, b2JointId} from './include/id_h.js'
 * @import {b2PreSolveFcn, b2CastResultFcn, b2OverlapResultFcn, b2CustomFilterFcn} from './include/types_h.js'
 * @import {b2TreeStats, b2Circle, b2Capsule, b2Polygon} from './include/collision_h.js'
 */

export const B2_MAX_WORLDS = 32;

export const b2SetType =
{
    b2_staticSet: 0,
    b2_disabledSet: 1,
    b2_awakeSet: 2,
    b2_firstSleepingSet: 3,
};

export class b2World
{
    stackAllocator = new b2StackAllocator();
    broadPhase = new b2BroadPhase();
    constraintGraph = new b2ConstraintGraph();

    // bodyIdPool = new b2IdPool();
    bodyArray = [];

    // solverSetIdPool = new b2IdPool();

    /** @type {b2SolverSet[]} */
    solverSetArray = [];

    // jointIdPool = new b2IdPool();
    jointArray = [];

    // contactIdPool = new b2IdPool();

    /** @type {b2Contact[]} */
    contactArray = [];

    // islandIdPool = new b2IdPool();
    islandArray = [];

    // shapeIdPool = new b2IdPool();
    // chainIdPool = new b2IdPool();
    shapeArray = [];
    chainArray = [];
    taskContextArray = [];
    bodyMoveEventArray = [];
    sensorBeginEventArray = [];
    sensorEndEventArray = [];
    contactBeginArray = [];
    contactEndArray = [];
    contactHitArray = [];
    debugBodySet = new b2BitSet();
    debugJointSet = new b2BitSet();
    debugContactSet = new b2BitSet();
    stepIndex = 0;
    splitIslandId = 0;
    gravity = new b2Vec2(0, 0);
    hitEventThreshold = 0;
    restitutionThreshold = 0;
    maxLinearVelocity = 0;
    contactPushoutVelocity = 0;
    contactHertz = 0;
    contactDampingRatio = 0;
    jointHertz = 0;
    jointDampingRatio = 0;
    revision = 0;

    // profile = new b2Profile();
    preSolveFcn = null;
    preSolveContext = null;
    customFilterFcn = null;
    customFilterContext = null;
    workerCount = 0;
    userTaskContext = null;
    userTreeTask = null;
    inv_h = 0;
    worldId = new b2WorldId();
    enableSleep = true;
    locked = false;
    enableWarmStarting = false;
    enableContinuous = false;
    inUse = false;
}

class WorldOverlapContext
{
    constructor()
    {
        this.world = null;
        this.fcn = null;
        this.filter = null;
        this.proxy = null;
        this.transform = null;
        this.userContext = null;
    }
}

class WorldRayCastContext
{
    constructor()
    {
        this.world = null;
        this.fcn = null;
        this.filter = null;
        this.fraction = 0.0;
        this.userContext = null;
    }
}

// Per thread task storage
// TODO: the JS conversion has reduced this to single threaded, code mostly left intact temporarily while we get things working.
export class b2TaskContext
{
    constructor()
    {
        // These bits align with the b2ConstraintGraph::contactBlocks and signal a change in contact status
        this.contactStateBitSet = new b2BitSet();

        // Used to track bodies with shapes that have enlarged AABBs. This avoids having a bit array
        // that is very large when there are many static shapes.
        this.enlargedSimBitSet = new b2BitSet();

        // Used to put islands to sleep
        this.awakeIslandBitSet = new b2BitSet();

        // Per worker split island candidate
        this.splitSleepTime = 0;
        this.splitIslandId = B2_NULL_INDEX;
    }
}

export function b2GetWorldFromId(id)
{
    console.assert(1 <= id.index1 && id.index1 <= B2_MAX_WORLDS);
    const world = b2_worlds[id.index1 - 1];
    console.assert(id.index1 === world.worldId + 1);
    console.assert(id.revision === world.revision);

    return world;
}

export function b2GetWorld(index)
{
    console.assert(0 <= index && index < B2_MAX_WORLDS);
    const world = b2_worlds[index];
    console.assert(world.worldId === index);

    return world;
}

export function b2GetWorldLocked(index)
{
    console.assert(0 <= index && index < B2_MAX_WORLDS);
    const world = b2_worlds[index];
    console.assert(world.worldId === index);

    if (world.locked)
    {
        console.assert(false);

        return null;
    }

    return world;
}

/** @global */
let b2_worlds = null;

/**
 * @function b2CreateWorldArray
 * @description
 * Initializes a global array of Box2D world instances if it hasn't been created yet.
 * Creates B2_MAX_WORLDS number of world instances and marks them as not in use.
 * If the array already exists, the function returns without doing anything.
 * @returns {void}
 * @see b2World
 */
export function b2CreateWorldArray()
{
    // don't create a new one if it already exists
    if (b2_worlds != null)
    {
        return;
    }

    b2_worlds = [];

    for (let i = 0; i < B2_MAX_WORLDS; i++)
    {
        b2_worlds[i] = new b2World();
        b2_worlds[i].inUse = false;
    }
}

/**
 * @function b2CreateWorld
 * @param {b2WorldDef} def - World definition object containing initialization parameters including:
 * gravity, hitEventThreshold, restitutionThreshold, maximumLinearVelocity,
 * contactPushoutVelocity, contactHertz, contactDampingRatio, jointHertz,
 * jointDampingRatio, enableSleep, enableContinuous
 * @returns {b2WorldId} A world identifier object containing:
 * - index: number (worldId + 1)
 * - revision: number (world revision number)
 * @description
 * Creates and initializes a new Box2D physics world with the specified parameters.
 * The function allocates memory for physics entities (bodies, joints, contacts),
 * initializes contact registers, creates necessary pools and arrays, and sets up
 * the world properties according to the provided definition.
 * @throws {Error} Returns a null world ID (0,0) if no world slots are available
 */
export function b2CreateWorld(def /* b2WorldDef */)
{
    // _Static_assert is not applicable in JS, so we'll skip it

    let worldId = B2_NULL_INDEX;

    for (let i = 0; i < b2_worlds.length; ++i)
    {
        if (b2_worlds[i].inUse === false)
        {
            worldId = i;

            break;
        }
    }

    if (worldId === B2_NULL_INDEX)
    {
        return new b2WorldId(0, 0);
    }

    b2InitializeContactRegisters();

    const world = b2_worlds[worldId];
    const revision = world.revision;

    world.worldId = worldId;
    world.revision = revision;
    world.inUse = true;

    world.stackAllocator = b2CreateStackAllocator();
    b2CreateBroadPhase(world.broadPhase);
    world.constraintGraph = b2CreateGraph(world.constraintGraph, 16);

    // pools
    world.bodyIdPool = b2CreateIdPool("body");
    world.bodyArray = [];
    world.solverSetArray = [];

    // add empty static, active, and disabled body sets
    world.solverSetIdPool = b2CreateIdPool("solverSet");
    let set;

    // static set
    set = new b2SolverSet();
    set.setIndex = b2AllocId(world.solverSetIdPool);
    world.solverSetArray.push(set);
    console.assert(world.solverSetArray[b2SetType.b2_staticSet].setIndex === b2SetType.b2_staticSet);

    // disabled set
    set = new b2SolverSet();
    set.setIndex = b2AllocId(world.solverSetIdPool);
    world.solverSetArray.push(set);
    console.assert(world.solverSetArray[b2SetType.b2_disabledSet].setIndex === b2SetType.b2_disabledSet);

    // awake set
    set = new b2SolverSet();
    set.setIndex = b2AllocId(world.solverSetIdPool);
    world.solverSetArray.push(set);
    console.assert(world.solverSetArray[b2SetType.b2_awakeSet].setIndex === b2SetType.b2_awakeSet);

    world.shapeIdPool = b2CreateIdPool("shapeId");
    world.shapeArray = [];

    world.chainIdPool = b2CreateIdPool("chainId");
    world.chainArray = [];

    world.contactIdPool = b2CreateIdPool("contactId");
    world.contactArray = [];

    // PJB: allocate some space at the start to reduce the spike in b2CreateContact later
    for (let i = 0; i < 4096; i++)
    {
        world.contactArray.push(new b2Contact());
    }

    world.jointIdPool = b2CreateIdPool("jointId");
    world.jointArray = [];

    world.islandIdPool = b2CreateIdPool("islandId");
    world.islandArray = [];

    world.bodyMoveEventArray = [];
    world.sensorBeginEventArray = [];
    world.sensorEndEventArray = [];
    world.contactBeginArray = [];
    world.contactEndArray = [];
    world.contactHitArray = [];

    world.stepIndex = 0;
    world.splitIslandId = B2_NULL_INDEX;
    world.gravity = def.gravity;
    world.hitEventThreshold = def.hitEventThreshold;
    world.restitutionThreshold = def.restitutionThreshold;
    world.maxLinearVelocity = def.maximumLinearVelocity;
    world.contactPushoutVelocity = def.contactPushoutVelocity;
    world.contactHertz = def.contactHertz;
    world.contactDampingRatio = def.contactDampingRatio;
    world.jointHertz = def.jointHertz;
    world.jointDampingRatio = def.jointDampingRatio;
    world.enableSleep = def.enableSleep;
    world.locked = false;
    world.enableWarmStarting = true;
    world.enableContinuous = def.enableContinuous;
    world.userTreeTask = null;

    world.workerCount = 1;
    world.userTaskContext = null;

    world.taskContextArray = [];

    for (let i = 0; i < world.workerCount; ++i)
    {
        const context = new b2TaskContext();
        context.contactStateBitSet = b2CreateBitSet(1024);
        context.enlargedSimBitSet = b2CreateBitSet(256),
        context.awakeIslandBitSet = b2CreateBitSet(256);
        world.taskContextArray[i] = context;
    }

    world.debugBodySet = b2CreateBitSet(256);
    world.debugJointSet = b2CreateBitSet(256);
    world.debugContactSet = b2CreateBitSet(256);

    // add one to worldId so that 0 represents a null b2WorldId
    return new b2WorldId(worldId + 1, world.revision);
}

/**
 * @function b2DestroyWorld
 * @description
 * Destroys a Box2D world instance and all its associated resources, including debug sets,
 * task contexts, event arrays, chains, bodies, shapes, contacts, joints, islands,
 * solver sets, constraint graph, broad phase, ID pools, and stack allocator.
 * Creates a new empty world instance with an incremented revision number.
 * @param {b2WorldId} worldId - The ID of the world to destroy
 * @returns {void}
 * @throws {Error} Throws an assertion error if a null chain has non-null shape indices
 */
export function b2DestroyWorld(worldId)
{
    let world = b2GetWorldFromId(worldId);

    b2DestroyBitSet(world.debugBodySet);
    b2DestroyBitSet(world.debugJointSet);
    b2DestroyBitSet(world.debugContactSet);

    for (let i = 0; i < world.workerCount; ++i)
    {
        b2DestroyBitSet(world.taskContextArray[i].contactStateBitSet);
        b2DestroyBitSet(world.taskContextArray[i].enlargedSimBitSet);
        b2DestroyBitSet(world.taskContextArray[i].awakeIslandBitSet);
    }

    world.taskContextArray = null;

    world.bodyMoveEventArray = null;
    world.sensorBeginEventArray = null;
    world.sensorEndEventArray = null;
    world.contactBeginArray = null;
    world.contactEndArray = null;
    world.contactHitArray = null;

    const chainCapacity = world.chainArray.length;

    for (let i = 0; i < chainCapacity; ++i)
    {
        const chain = world.chainArray[i];

        if (chain.id !== B2_NULL_INDEX)
        {
            chain.shapeIndices = null;
        }
        else
        {
            console.assert(chain.shapeIndices === null);
        }
    }

    world.bodyArray = null;
    world.shapeArray = null;
    world.chainArray = null;
    world.contactArray = null;
    world.jointArray = null;
    world.islandArray = null;

    const setCapacity = world.solverSetArray.length;

    for (let i = 0; i < setCapacity; ++i)
    {
        const set = world.solverSetArray[i];

        if (set.setIndex !== B2_NULL_INDEX)
        {
            b2DestroySolverSet(world, i);
        }
    }

    // b2DestroyArray(world.solverSetArray);
    world.solverSetArray = null;

    b2DestroyGraph(world.constraintGraph);
    b2DestroyBroadPhase(world.broadPhase);

    b2DestroyIdPool(world.bodyIdPool);
    b2DestroyIdPool(world.shapeIdPool);
    b2DestroyIdPool(world.chainIdPool);
    b2DestroyIdPool(world.contactIdPool);
    b2DestroyIdPool(world.jointIdPool);
    b2DestroyIdPool(world.islandIdPool);
    b2DestroyIdPool(world.solverSetIdPool);

    b2DestroyStackAllocator(world.stackAllocator);

    // Wipe world but preserve revision
    const revision = world.revision;
    world = new b2World();
    world.worldId = B2_NULL_INDEX;
    world.revision = revision + 1;
}

const centerOffsetA = new b2Vec2();
const centerOffsetB = new b2Vec2();

function b2CollideTask(startIndex, endIndex, threadIndex, context)
{
    // b2TracyCZoneNC(collide_task, "Collide Task", b2HexColor.b2_colorDodgerBlue, true);

    const stepContext = context;
    const world = stepContext.world;
    console.assert(threadIndex < world.workerCount);
    const taskContext = world.taskContextArray[threadIndex];
    const contactSims = stepContext.contacts;
    const shapes = world.shapeArray;
    const bodies = world.bodyArray;

    console.assert(startIndex < endIndex);

    for (let i = startIndex; i < endIndex; ++i)
    {
        const contactSim = contactSims[i];

        const contactId = contactSim.contactId;

        const shapeA = shapes[contactSim.shapeIdA];
        const shapeB = shapes[contactSim.shapeIdB];

        // Do proxies still overlap?  (Without this check, polygon collision increases from 1200 to 6400 both max... not as much as I expected for 1000 object tumbler)
        const overlap = b2AABB_Overlaps(shapeA.fatAABB, shapeB.fatAABB);

        if (!overlap)
        {
            contactSim.simFlags |= b2ContactSimFlags.b2_simDisjoint;
            contactSim.simFlags &= ~b2ContactSimFlags.b2_simTouchingFlag;
            b2SetBit(taskContext.contactStateBitSet, contactId);
        }
        else
        {
            const wasTouching = (contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag) !== 0;

            // Update contact respecting shape/body order (A,B)
            const bodyA = bodies[shapeA.bodyId];
            const bodyB = bodies[shapeB.bodyId];
            const bodySimA = b2GetBodySim(world, bodyA);
            const bodySimB = b2GetBodySim(world, bodyB);

            // avoid cache misses in b2PrepareContactsTask
            contactSim.bodySimIndexA = bodyA.setIndex === b2SetType.b2_awakeSet ? bodyA.localIndex : B2_NULL_INDEX;
            contactSim.invMassA = bodySimA.invMass;
            contactSim.invIA = bodySimA.invInertia;

            contactSim.bodySimIndexB = bodyB.setIndex === b2SetType.b2_awakeSet ? bodyB.localIndex : B2_NULL_INDEX;
            contactSim.invMassB = bodySimB.invMass;
            contactSim.invIB = bodySimB.invInertia;

            const transformA = bodySimA.transform;
            const transformB = bodySimB.transform;

            // let centerOffsetA = b2RotateVector(transformA.q, bodySimA.localCenter);
            centerOffsetA.x = transformA.q.c * bodySimA.localCenter.x - transformA.q.s * bodySimA.localCenter.y;
            centerOffsetA.y = transformA.q.s * bodySimA.localCenter.x + transformA.q.c * bodySimA.localCenter.y;

            // let centerOffsetB = b2RotateVector(transformB.q, bodySimB.localCenter);
            centerOffsetB.x = transformB.q.c * bodySimB.localCenter.x - transformB.q.s * bodySimB.localCenter.y;
            centerOffsetB.y = transformB.q.s * bodySimB.localCenter.x + transformB.q.c * bodySimB.localCenter.y;

            // This updates solid contacts and sensors
            const touching = b2UpdateContact(world, contactSim, shapeA, transformA, centerOffsetA, shapeB, transformB, centerOffsetB);

            // State changes that affect island connectivity. Also contact and sensor events.
            if (touching && !wasTouching)
            {
                contactSim.simFlags |= b2ContactSimFlags.b2_simStartedTouching;
                b2SetBit(taskContext.contactStateBitSet, contactId);
            }
            else if (!touching && wasTouching)
            {
                contactSim.simFlags |= b2ContactSimFlags.b2_simStoppedTouching;
                b2SetBit(taskContext.contactStateBitSet, contactId);
            }
        }
    }

    // b2TracyCZoneEnd(collide_task);
}

export function b2AddNonTouchingContact(world, contact, contactSim)
{
    console.assert(contact.setIndex === b2SetType.b2_awakeSet);
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    contact.colorIndex = B2_NULL_INDEX;
    contact.localIndex = set.contacts.count;
    const newContactSim = b2AddContact(set.contacts);
    newContactSim.set(contactSim);
}

export function b2RemoveNonTouchingContact(world, setIndex, localIndex)
{
    // (world.solverSetArray, setIndex);
    const set = world.solverSetArray[setIndex];
    const movedIndex = b2RemoveContact(set.contacts, localIndex);

    if (movedIndex !== B2_NULL_INDEX)
    {
        const movedContactSim = set.contacts.data[localIndex];

        // b2CheckIndex(world.contactArray, movedContactSim.contactId);
        const movedContact = world.contactArray[movedContactSim.contactId];
        console.assert(movedContact.setIndex === setIndex);
        console.assert(movedContact.localIndex === movedIndex);
        console.assert(movedContact.colorIndex === B2_NULL_INDEX);
        movedContact.localIndex = localIndex;
    }
}

// Narrow-phase collision
export function b2Collide(context)
{
    const world = context.world;

    console.assert(world.workerCount > 0);

    // b2TracyCZoneNC(collide, "Collide", b2HexColor.b2_colorDarkOrchid, true);

    // Rebuild the collision tree for dynamic and kinematic bodies to keep their query performance good
    b2BroadPhase_RebuildTrees(world.broadPhase);

    // gather contacts into a single array
    let contactCount = 0;
    const graphColors = world.constraintGraph.colors;

    for (let i = 0; i < b2_graphColorCount; ++i)
    {
        contactCount += graphColors[i].contacts.count;
    }

    const nonTouchingCount = world.solverSetArray[b2SetType.b2_awakeSet].contacts.count;
    contactCount += nonTouchingCount;

    if (contactCount == 0)
    {
        // b2TracyCZoneEnd(collide);
        return;
    }

    const contactSims = [];

    let contactIndex = 0;

    for (let i = 0; i < b2_graphColorCount; ++i)
    {
        const color = graphColors[i];
        const count = color.contacts.count;
        const base = color.contacts.data;

        for (let j = 0; j < count; ++j)
        {
            console.assert(base[j]._bodyIdA !== B2_NULL_INDEX, `${j} ${i} ${color} ${contactIndex}`);
            console.assert(base[j]._bodyIdB !== B2_NULL_INDEX, `${j} ${i} ${color} ${contactIndex}`);
            contactSims.push(base[j]);
            contactIndex += 1;
        }
    }

    {
        const base = world.solverSetArray[b2SetType.b2_awakeSet].contacts.data;

        for (let i = 0; i < nonTouchingCount; ++i)
        {
            console.assert(base[i]._bodyIdA !== B2_NULL_INDEX, `${i} ${contactIndex}`);
            console.assert(base[i]._bodyIdB !== B2_NULL_INDEX, `${i} ${contactIndex}`);
            contactSims.push(base[i]);
            console.assert(contactSims[contactIndex]._bodyIdA !== B2_NULL_INDEX, `${i} ${contactIndex}`);
            console.assert(contactSims[contactIndex]._bodyIdB !== B2_NULL_INDEX, `${i} ${contactIndex}`);
            contactIndex += 1;
        }
    }

    console.assert(contactIndex == contactCount);

    // b2StepContext (created per b2World_Step)
    context.contacts = contactSims;

    // Contact bit set on ids because contact pointers are unstable as they move between touching and not touching.
    const contactIdCapacity = b2GetIdCapacity(world.contactIdPool);

    for (let i = 0; i < world.workerCount; ++i)
    {
        world.taskContextArray[i].contactStateBitSet = b2SetBitCountAndClear(world.taskContextArray[i].contactStateBitSet, contactIdCapacity);
    }

    // PJB: 19/11/2024 this 'task' type function is definitely needed for collisions
    b2CollideTask(0, contactCount, 0, context);

    // b2FreeStackItem(world.stackAllocator, contactSims);
    context.contacts = null;

    // Serially update contact state

    // Bitwise OR all contact bits
    const bitSet = world.taskContextArray[0].contactStateBitSet;

    for (let i = 1; i < world.workerCount; ++i)
    {
        b2InPlaceUnion(bitSet, world.taskContextArray[i].contactStateBitSet);
    }

    const contacts = world.contactArray;
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];

    const shapes = world.shapeArray;
    const worldId = world.worldId;

    // Process contact state changes. Iterate over set bits
    for (let k = 0; k < bitSet.blockCount; ++k)
    {
        let bits = bitSet.bits[k];

        while (bits != 0n)
        {
            const ctz = b2CTZ64(bits);
            const contactId = 64 * k + ctz;

            const contact = contacts[contactId];
            console.assert(contact.setIndex == b2SetType.b2_awakeSet);

            const colorIndex = contact.colorIndex;
            const localIndex = contact.localIndex;

            let contactSim;

            if (colorIndex != B2_NULL_INDEX)
            {
                // contact lives in constraint graph
                console.assert(0 <= colorIndex && colorIndex < b2_graphColorCount);
                const color = graphColors[colorIndex];
                console.assert(0 <= localIndex && localIndex < color.contacts.count);
                contactSim = color.contacts.data[localIndex];
            }
            else
            {
                console.assert(0 <= localIndex && localIndex < awakeSet.contacts.count);
                contactSim = awakeSet.contacts.data[localIndex];
            }

            const shapeA = shapes[contact.shapeIdA];
            const shapeB = shapes[contact.shapeIdB];
            const shapeIdA = new b2ShapeId(shapeA.id + 1, worldId, shapeA.revision);
            const shapeIdB = new b2ShapeId(shapeB.id + 1, worldId, shapeB.revision);
            const flags = contact.flags;
            const simFlags = contactSim.simFlags;

            if (simFlags & b2ContactSimFlags.b2_simDisjoint)
            {
                // Was touching?
                if ((flags & b2ContactFlags.b2_contactTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableContactEvents) != 0)
                {
                    const event = new b2ContactEndTouchEvent();
                    event.shapeIdA = shapeIdA;
                    event.shapeIdB = shapeIdB;
                    world.contactEndArray.push(event);
                }

                // Bounding boxes no longer overlap
                contact.flags &= ~b2ContactFlags.b2_contactTouchingFlag;
                b2DestroyContact(world, contact, false);

                // contact = null;
                // contactSim = null;
            }
            else if (simFlags & b2ContactSimFlags.b2_simStartedTouching)
            {
                console.assert(contact.islandId == B2_NULL_INDEX);

                if ((flags & b2ContactFlags.b2_contactSensorFlag) != 0)
                {
                    // Contact is a sensor
                    if ((flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0)
                    {
                        if (shapeA.isSensor)
                        {
                            const event = new b2SensorBeginTouchEvent();
                            event.sensorShapeId = shapeIdA;
                            event.visitorShapeId = shapeIdB;
                            world.sensorBeginEventArray.push(event);
                        }

                        if (shapeB.isSensor)
                        {
                            const event = new b2SensorBeginTouchEvent();
                            event.sensorShapeId = shapeIdB;
                            event.visitorShapeId = shapeIdA;
                            world.sensorBeginEventArray.push(event);
                        }
                    }

                    contactSim.simFlags &= ~b2ContactSimFlags.b2_simStartedTouching;
                    contact.flags |= b2ContactFlags.b2_contactSensorTouchingFlag;
                }
                else
                {
                    // Contact is solid
                    if (flags & b2ContactFlags.b2_contactEnableContactEvents)
                    {
                        const event = new b2ContactBeginTouchEvent();
                        event.shapeIdA = shapeIdA;
                        event.shapeIdB = shapeIdB;
                        event.manifold = contactSim.manifold;
                        world.contactBeginArray.push(event);
                    }

                    console.assert(contactSim.manifold.pointCount > 0);
                    console.assert(contact.setIndex == b2SetType.b2_awakeSet);

                    // Link first because this wakes colliding bodies and ensures the body sims
                    // are in the correct place.
                    contact.flags |= b2ContactFlags.b2_contactTouchingFlag;
                    b2LinkContact(world, contact);

                    // Make sure these didn't change
                    console.assert(contact.colorIndex == B2_NULL_INDEX);
                    console.assert(contact.localIndex == localIndex);

                    // Contact sim pointer may have become orphaned due to awake set growth,
                    // so I just need to refresh it.
                    console.assert(0 <= localIndex && localIndex < awakeSet.contacts.count);
                    contactSim = awakeSet.contacts.data[localIndex];

                    contactSim.simFlags &= ~b2ContactSimFlags.b2_simStartedTouching;

                    b2AddContactToGraph(world, contactSim, contact);
                    b2RemoveNonTouchingContact(world, b2SetType.b2_awakeSet, localIndex);

                    // contactSim = null;
                }
            }
            else if (simFlags & b2ContactSimFlags.b2_simStoppedTouching)
            {
                contactSim.simFlags &= ~b2ContactSimFlags.b2_simStoppedTouching;

                if ((flags & b2ContactFlags.b2_contactSensorFlag) != 0)
                {
                    // Contact is a sensor
                    contact.flags &= ~b2ContactFlags.b2_contactSensorTouchingFlag;

                    if ((flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0)
                    {
                        if (shapeA.isSensor)
                        {
                            const event = new b2SensorEndTouchEvent();
                            event.sensorShapeId = shapeIdA;
                            event.visitorShapeId = shapeIdB;
                            world.sensorEndEventArray.push(event);
                        }

                        if (shapeB.isSensor)
                        {
                            const event = new b2SensorEndTouchEvent();
                            event.sensorShapeId = shapeIdB;
                            event.visitorShapeId = shapeIdA;
                            world.sensorEndEventArray.push(event);
                        }
                    }
                }
                else
                {
                    // Contact is solid
                    contact.flags &= ~b2ContactFlags.b2_contactTouchingFlag;

                    if (contact.flags & b2ContactFlags.b2_contactEnableContactEvents)
                    {
                        const event = new b2ContactEndTouchEvent();
                        event.shapeIdA = shapeIdA;
                        event.shapeIdB = shapeIdB;
                        world.contactEndArray.push(event);
                    }

                    console.assert(contactSim.manifold.pointCount == 0);

                    b2UnlinkContact(world, contact);
                    const bodyIdA = contact.edges[0].bodyId;
                    const bodyIdB = contact.edges[1].bodyId;

                    b2AddNonTouchingContact(world, contact, contactSim);
                    b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex);

                    // contact = null;
                    // contactSim = null;
                }
            }

            // Clear the smallest set bit
            bits = bits & (bits - 1n);
        }
    }

    b2ValidateSolverSets(world);
    b2ValidateContacts(world);

    // b2TracyCZoneEnd(contact_state);
    // b2TracyCZoneEnd(collide);
}

GlobalDebug.b2Vec2Count = 0;
b2Vec2Where.calls = {};
GlobalDebug.b2Rot2Count = 0;
b2Rot2Where.calls = {};
GlobalDebug.b2ManifoldCount = 0;
GlobalDebug.b2ManifoldPointCount = 0;
b2ManifoldPointWhere.calls = {};
GlobalDebug.b2PolyCollideCount = 0;
GlobalDebug.b2ContactSimCount = 0;
GlobalDebug.b2TOIInputCount = 0;
GlobalDebug.b2ShapeCastPairInputCount = 0;
GlobalDebug.b2SweepCount = 0;

/**
 * @function b2World_Step
 * @summary Advances the physics simulation by a specified time step.
 * @param {b2WorldId} worldId - The identifier of the physics world to step
 * @param {number} timeStep - The time increment to advance the simulation (in seconds)
 * @param {number} subStepCount - The number of sub-steps to use for the iteration
 * @returns {void}
 * @description
 * Performs one step of physics simulation by updating broad phase pairs,
 * handling collisions, and solving the physics constraints. The function
 * manages contact events, sensor events, and body movement events during
 * the simulation step. It also handles warm starting and enforces velocity
 * limits based on world settings.
 * @throws {Error} Throws an assertion error if the world's stack allocator
 * is not empty after the step completes.
 * @note The function will not execute if the world is locked or if timeStep is 0.
 */
export function b2World_Step(worldId, timeStep, subStepCount)
{
    GlobalDebug.b2FrameCount++;

    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    // Prepare to capture events
    // Ensure user does not access stale data if there is an early return
    world.bodyMoveEventArray = [];
    world.sensorBeginEventArray = [];
    world.sensorEndEventArray = [];
    world.contactBeginArray = [];
    world.contactEndArray = [];
    world.contactHitArray = [];

    if (timeStep === 0.0)
    {
        // todo would be useful to still process collision while paused
        return;
    }

    world.locked = true;
    b2UpdateBroadPhasePairs(world);
    
    const context = new b2StepContext();
    context.world = world;
    context.dt = timeStep;
    context.subStepCount = Math.max(1, subStepCount);

    if (timeStep > 0.0)
    {
        context.inv_dt = 1.0 / timeStep;
        context.h = timeStep / context.subStepCount;
        context.inv_h = context.subStepCount * context.inv_dt;
    }
    else
    {
        context.inv_dt = 0.0;
        context.h = 0.0;
        context.inv_h = 0.0;
    }

    world.inv_h = context.inv_h;

    // Hertz values get reduced for large time steps
    const contactHertz = Math.min(world.contactHertz, 0.25 * context.inv_h);
    const jointHertz = Math.min(world.jointHertz, 0.125 * context.inv_h);

    context.contactSoftness = b2MakeSoft(contactHertz, world.contactDampingRatio, context.h);
    context.staticSoftness = b2MakeSoft(2.0 * contactHertz, world.contactDampingRatio, context.h);
    context.jointSoftness = b2MakeSoft(jointHertz, world.jointDampingRatio, context.h);

    context.restitutionThreshold = world.restitutionThreshold;
    context.maxLinearVelocity = world.maxLinearVelocity;
    context.enableWarmStarting = world.enableWarmStarting;

    // Update contacts
    b2Collide(context);

    // Integrate velocities, solve velocity constraints, and integrate positions.
    if (context.dt > 0.0)
    {
        b2Solve(world, context);
    }

    world.locked = false;

    console.assert(b2GetStackAllocation(world.stackAllocator) == 0, `world.stackAllocator entries not empty ${b2GetStackAllocation(world.stackAllocator)}`);
}

const p1 = new b2Vec2();
const p2 = new b2Vec2();
const q = new b2Rot();
const txf = new b2Transform(p1, q);

export function b2DrawShape(draw, shape, transform, color)
{
    const xf = transform.clone();
    
    switch (shape.type)
    {
        case b2ShapeType.b2_capsuleShape:
            {
                const capsule = shape.capsule;
                b2TransformPointOut(xf, capsule.center1, p1);
                b2TransformPointOut(xf, capsule.center2, p2);

                if (shape.image)
                {
                    draw.DrawImageCapsule(p1, p2, capsule.radius, shape, draw.context);
                }
                else if (!shape.imageNoDebug)
                {
                    draw.DrawSolidCapsule(p1, p2, capsule.radius, color, draw.context);
                }
            }

            break;

        case b2ShapeType.b2_circleShape:
            {
                const circle = shape.circle;
                b2TransformPointOutXf(xf, circle.center, txf);

                if (shape.image)
                {
                    draw.DrawImageCircle(txf, circle.radius, shape, draw.context);
                }
                else if (!shape.imageNoDebug)
                {
                    draw.DrawSolidCircle(txf, circle.radius, color, draw.context);
                }
            }

            break;

        case b2ShapeType.b2_polygonShape:
            {
                const poly = shape.polygon;

                if (shape.image)
                {
                    draw.DrawImagePolygon(xf, shape, draw.context);
                }
                else if (!shape.imageNoDebug)
                {
                    draw.DrawSolidPolygon(xf, poly.vertices, poly.count, poly.radius, color, draw.context);
                }
            }

            break;

        case b2ShapeType.b2_segmentShape:
            {
                const segment = shape.segment;
                b2TransformPointOut(xf, segment.point1, p1);
                b2TransformPointOut(xf, segment.point2, p2);

                if (!shape.imageNoDebug)
                {
                    draw.DrawSegment(p1, p2, color, draw.context);
                }
            }

            break;

        case b2ShapeType.b2_chainSegmentShape:
            {
                const segment = shape.chainSegment.segment;
                b2TransformPointOut(xf, segment.point1, p1);
                b2TransformPointOut(xf, segment.point2, p2);

                if (!shape.imageNoDebug)
                {
                    draw.DrawSegment(p1, p2, color, draw.context);
                }

                // draw.DrawPoint(p2, 4.0, color, draw.context);
                // draw.DrawSegment(p1, b2Lerp(p1, p2, 0.1), b2HexColor.b2_colorPaleGreen, draw.context);
            }

            break;
            
        default:
            break;
    }
}

// DrawContext is converted to a class in JavaScript
class DrawContext
{
    constructor(world, draw)
    {
        this.world = world;
        this.draw = draw;
        
    }
}

function DrawQueryCallback(proxyId, shapeId, context)
{
    // B2_MAYBE_UNUSED(proxyId);

    const drawContext = context;
    const world = drawContext.world;
    const draw = drawContext.draw;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    b2SetBit(world.debugBodySet, shape.bodyId);

    if (draw.drawShapes)
    {
        // b2CheckId(world.bodyArray, shape.bodyId);
        const body = world.bodyArray[shape.bodyId];
        const bodySim = b2GetBodySim(world, body);

        let color;

        if (body.setIndex >= b2SetType.b2_firstSleepingSet)
        {
            color = b2HexColor.b2_colorGray;
        }
        else if (shape.customColor !== 0)
        {
            color = shape.customColor;
        }
        else if (body.type === b2BodyType.b2_dynamicBody && bodySim.mass === 0.0)
        {
            // Bad body
            color = b2HexColor.b2_colorRed;
        }
        else if (body.setIndex === b2SetType.b2_disabledSet)
        {
            color = b2HexColor.b2_colorSlateGray;
        }
        else if (shape.isSensor)
        {
            color = b2HexColor.b2_colorWheat;
        }
        else if (bodySim.isBullet && body.setIndex === b2SetType.b2_awakeSet)
        {
            color = b2HexColor.b2_colorTurquoise;
        }
        else if (body.isSpeedCapped)
        {
            color = b2HexColor.b2_colorYellow;
        }
        else if (bodySim.isFast)
        {
            color = b2HexColor.b2_colorSalmon;
        }
        else if (body.type === b2BodyType.b2_staticBody)
        {
            color = b2HexColor.b2_colorPaleGreen;
        }
        else if (body.type === b2BodyType.b2_kinematicBody)
        {
            color = b2HexColor.b2_colorRoyalBlue;
        }
        else if (body.setIndex === b2SetType.b2_awakeSet)
        {
            color = b2HexColor.b2_colorPink;
        }
        else
        {
            color = b2HexColor.b2_colorGray;
        }

        b2DrawShape(draw, shape, bodySim.transform, color);
    }

    if (draw.drawAABBs)
    {
        const aabb = shape.fatAABB;

        const vs = [
            new b2Vec2(aabb.lowerBoundX, aabb.lowerBoundY),
            new b2Vec2(aabb.upperBoundX, aabb.lowerBoundY),
            new b2Vec2(aabb.upperBoundX, aabb.upperBoundY),
            new b2Vec2(aabb.lowerBoundX, aabb.upperBoundY)
        ];

        draw.DrawPolygon(vs, 4, b2HexColor.b2_colorGold, draw.context);
    }

    return true;
}

function b2DrawWithBounds(world, draw)
{
    console.assert(b2AABB_IsValid(draw.drawingBounds));

    const k_impulseScale = 1.0;
    const k_axisScale = 0.3;
    const speculativeColor = b2HexColor.b2_colorGray3;
    const addColor = b2HexColor.b2_colorGreen;
    const persistColor = b2HexColor.b2_colorBlue;
    const normalColor = b2HexColor.b2_colorGray9;
    const impulseColor = b2HexColor.b2_colorMagenta;
    const frictionColor = b2HexColor.b2_colorYellow;

    const graphColors = [ b2HexColor.b2_colorRed, b2HexColor.b2_colorOrange, b2HexColor.b2_colorYellow, b2HexColor.b2_colorGreen,
        b2HexColor.b2_colorCyan, b2HexColor.b2_colorBlue, b2HexColor.b2_colorViolet, b2HexColor.b2_colorPink,
        b2HexColor.b2_colorChocolate, b2HexColor.b2_colorGoldenrod, b2HexColor.b2_colorCoral, b2HexColor.b2_colorBlack ];

    const bodyCapacity = b2GetIdCapacity(world.bodyIdPool);
    world.debugBodySet = b2SetBitCountAndClear(world.debugBodySet, bodyCapacity);

    const jointCapacity = b2GetIdCapacity(world.jointIdPool);
    world.debugJointSet = b2SetBitCountAndClear(world.debugJointSet, jointCapacity);

    const contactCapacity = b2GetIdCapacity(world.contactIdPool);
    world.debugContactSet = b2SetBitCountAndClear(world.debugContactSet, contactCapacity);

    const drawContext = new DrawContext(world, draw);

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Query(world.broadPhase.trees[i], draw.drawingBounds, B2_DEFAULT_MASK_BITS, DrawQueryCallback,
            drawContext);
    }

    const wordCount = world.debugBodySet.blockCount;
    const bits = world.debugBodySet.bits;

    for (let k = 0; k < wordCount; ++k)
    {
        let word = bits[k];

        while (word !== 0)
        {
            const ctz = b2CTZ64(word);
            const bodyId = 64 * k + ctz;

            // b2CheckId(world.bodyArray, bodyId);
            const body = world.bodyArray[bodyId];

            if (draw.drawMass && body.type === b2BodyType.b2_dynamicBody)
            {
                const offset = new b2Vec2(0.1, 0.1);
                const bodySim = b2GetBodySim(world, body);

                const transform = new b2Transform(bodySim.center, bodySim.transform.q);
                draw.DrawTransform(transform, draw.context);

                const p = b2TransformPoint(transform, offset);

                const buffer = `  ${bodySim.mass.toFixed(2)}`;
                draw.DrawString(p, buffer, draw.context);
            }

            if (draw.drawJoints)
            {
                let jointKey = body.headJointKey;

                while (jointKey !== B2_NULL_INDEX)
                {
                    const jointId = jointKey >> 1;
                    const edgeIndex = jointKey & 1;
                    const joint = world.jointArray[jointId];

                    // avoid double draw
                    if (b2GetBit(world.debugJointSet, jointId) === false)
                    {
                        b2DrawJoint(draw, world, joint);
                        b2SetBit(world.debugJointSet, jointId);
                    }

                    jointKey = joint.edges[edgeIndex].nextKey;
                }
            }

            const linearSlop = b2_linearSlop;

            if (draw.drawContacts && body.type === b2BodyType.b2_dynamicBody && body.setIndex === b2SetType.b2_awakeSet)
            {
                let contactKey = body.headContactKey;

                while (contactKey !== B2_NULL_INDEX)
                {
                    const contactId = contactKey >> 1;
                    const edgeIndex = contactKey & 1;
                    const contact = world.contactArray[contactId];
                    contactKey = contact.edges[edgeIndex].nextKey;

                    if (contact.setIndex !== b2SetType.b2_awakeSet || contact.colorIndex === B2_NULL_INDEX)
                    {
                        continue;
                    }

                    // avoid double draw
                    if (b2GetBit(world.debugContactSet, contactId) === false)
                    {
                        console.assert(0 <= contact.colorIndex && contact.colorIndex < b2_graphColorCount);

                        const gc = world.constraintGraph.colors[contact.colorIndex];
                        console.assert(0 <= contact.localIndex && contact.localIndex < gc.contacts.count);

                        const contactSim = gc.contacts.data[contact.localIndex];
                        const pointCount = contactSim.manifold.pointCount;
                        const normal = new b2Vec2(contactSim.manifold.normalX, contactSim.manifold.normalY);

                        for (let j = 0; j < pointCount; ++j)
                        {
                            const point = contactSim.manifold.points[j];

                            if (draw.drawGraphColors)
                            {
                                // graph color
                                const pointSize = contact.colorIndex === b2_overflowIndex ? 7.5 : 5.0;
                                draw.DrawPoint(point.pointX, point.pointY, pointSize, graphColors[contact.colorIndex], draw.context);
                            }
                            else if (point.separation > linearSlop)
                            {
                                // Speculative
                                draw.DrawPoint(point.pointX, point.pointY, 5.0, speculativeColor, draw.context);
                            }
                            else if (point.persisted === false)
                            {
                                // Add
                                draw.DrawPoint(point.pointX, point.pointY, 10.0, addColor, draw.context);
                            }
                            else if (point.persisted === true)
                            {
                                // Persist
                                draw.DrawPoint(point.pointX, point.pointY, 5.0, persistColor, draw.context);
                            }

                            if (draw.drawContactNormals)
                            {
                                const p1 = new b2Vec2(point.pointX, point.pointY);
                                const p2 = b2MulAdd(p1, k_axisScale, normal);
                                draw.DrawSegment(p1, p2, normalColor, draw.context);
                            }
                            else if (draw.drawContactImpulses)
                            {
                                const p1 = new b2Vec2(point.pointX, point.pointY);
                                const p2 = b2MulAdd(p1, k_impulseScale * point.normalImpulse, normal);
                                draw.DrawSegment(p1, p2, impulseColor, draw.context);
                                const buffer = `${(1000.0 * point.normalImpulse).toFixed(1)}`;
                                draw.DrawString(p1, buffer, draw.context);
                            }

                            if (draw.drawFrictionImpulses)
                            {
                                const tangent = b2RightPerp(normal);
                                const p1 = new b2Vec2(point.pointX, point.pointY);
                                const p2 = b2MulAdd(p1, k_impulseScale * point.tangentImpulse, tangent);
                                draw.DrawSegment(p1, p2, frictionColor, draw.context);
                                const buffer = `${(1000.0 * point.tangentImpulse).toFixed(1)}`;
                                draw.DrawString(p1, buffer, draw.context);
                            }
                        }

                        b2SetBit(world.debugContactSet, contactId);
                    }

                    contactKey = contact.edges[edgeIndex].nextKey;
                }
            }

            // Clear the smallest set bit
            word = word & (word - 1);
        }
    }
}

/**
 * @function b2World_Draw
 * @description
 * Renders debug visualization of a Box2D world, including shapes, joints, AABBs,
 * mass centers, and contact points based on the debug draw flags.
 * @param {b2WorldId} worldId - ID of the Box2D world to render
 * @param {b2DebugDraw} draw - Debug drawing context with rendering flags and methods
 * @returns {void}
 * @throws {Error} Throws assertion error if world is locked or body transform is null
 * @note
 * Drawing is controlled by flags in the draw parameter:
 * - drawShapes: Renders physics bodies/shapes with color coding
 * - drawJoints: Renders all active joints
 * - drawAABBs: Renders axis-aligned bounding boxes
 * - drawMass: Renders center of mass and mass values
 * - drawContacts: Renders contact points and impulses
 * - useDrawingBounds: Uses bounded drawing region
 */
export function b2World_Draw(worldId, draw)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked === false);

    if (world.locked)
    {
        return;
    }

    if (draw.useDrawingBounds)
    {
        b2DrawWithBounds(world, draw);

        return;
    }

    if (draw.drawShapes)
    {
        const setCount = world.solverSetArray.length;

        for (let setIndex = 0; setIndex < setCount; ++setIndex)
        {
            const set = world.solverSetArray[setIndex];
            const bodyCount = set.sims.count;

            for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex)
            {
                const bodySim = set.sims.data[bodyIndex];
                console.assert(bodySim.transform != null, "transform is null for body " + bodySim.bodyId + " " + setIndex + " " + bodyIndex);

                // b2CheckIndex(world.bodyArray, bodySim.bodyId);
                const body = world.bodyArray[bodySim.bodyId];

                // 0 = static, 1 = disabled, 2 = awake, 3 = sleeping
                console.assert(body.setIndex === setIndex, `body.setIndex is wrong: ${body.setIndex} != ${setIndex}`);

                const xf = bodySim.transform;
                let shapeId = body.headShapeId;

                while (shapeId !== B2_NULL_INDEX)
                {
                    const shape = world.shapeArray[shapeId];
                    let color;

                    if (body.setIndex >= b2SetType.b2_firstSleepingSet)
                    {
                        color = b2HexColor.b2_colorGray;
                    }
                    else if (shape.customColor !== 0)
                    {
                        color = shape.customColor;
                    }
                    else if (body.type === b2BodyType.b2_dynamicBody && bodySim.mass === 0.0)
                    {
                        // Bad body
                        color = b2HexColor.b2_colorRed;
                    }
                    else if (body.setIndex === b2SetType.b2_disabledSet)
                    {
                        color = b2HexColor.b2_colorSlateGray;
                    }
                    else if (shape.isSensor)
                    {
                        color = b2HexColor.b2_colorWheat;
                    }
                    else if (bodySim.isBullet && body.setIndex === b2SetType.b2_awakeSet)
                    {
                        color = b2HexColor.b2_colorTurquoise;
                    }
                    else if (body.isSpeedCapped)
                    {
                        color = b2HexColor.b2_colorYellow;
                    }
                    else if (bodySim.isFast)
                    {
                        color = b2HexColor.b2_colorSalmon;
                    }
                    else if (body.type === b2BodyType.b2_staticBody)
                    {
                        color = b2HexColor.b2_colorPaleGreen;
                    }
                    else if (body.type === b2BodyType.b2_kinematicBody)
                    {
                        color = b2HexColor.b2_colorRoyalBlue;
                    }
                    else if (body.setIndex === b2SetType.b2_awakeSet)
                    {
                        color = b2HexColor.b2_colorPink;
                    }
                    else
                    {
                        color = b2HexColor.b2_colorGray;
                    }

                    b2DrawShape(draw, shape, xf, color);
                    shapeId = shape.nextShapeId;
                }
            }
        }
    }

    if (draw.drawJoints)
    {
        const count = world.jointArray.length;

        for (let i = 0; i < count; ++i)
        {
            const joint = world.jointArray[i];

            if (joint.setIndex === B2_NULL_INDEX)
            {
                continue;
            }

            b2DrawJoint(draw, world, joint);
        }
    }

    if (draw.drawAABBs)
    {
        const color = b2HexColor.b2_colorGray;
        const setIndex = b2SetType.b2_awakeSet;

        {
            const set = world.solverSetArray[setIndex];
            const bodyCount = set.sims.count;

            for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex)
            {
                const bodySim = set.sims.data[bodyIndex];
                const xf = b2Transform.identity();

                // const buffer = `${bodySim.bodyId}`;
                // draw.DrawString(bodySim.center, buffer, draw.context);

                // b2CheckIndex(world.bodyArray, bodySim.bodyId);
                const body = world.bodyArray[bodySim.bodyId];
                console.assert(body.setIndex === setIndex);

                let shapeId = body.headShapeId;

                while (shapeId !== B2_NULL_INDEX)
                {
                    const shape = world.shapeArray[shapeId];
                    const aabb = shape.fatAABB;
                    const vs = [
                        new b2Vec2(aabb.lowerBoundX, aabb.lowerBoundY),
                        new b2Vec2(aabb.upperBoundX, aabb.lowerBoundY),
                        new b2Vec2(aabb.upperBoundX, aabb.upperBoundY),
                        new b2Vec2(aabb.lowerBoundX, aabb.upperBoundY)
                    ];

                    draw.DrawPolygon(xf, vs, 4, color, draw.context);

                    shapeId = shape.nextShapeId;
                }
            }
        }
    }

    if (draw.drawMass)
    {
        const offset = new b2Vec2(0.1, 0.1);
        const setCount = world.solverSetArray.length;

        for (let setIndex = 0; setIndex < setCount; ++setIndex)
        {
            const set = world.solverSetArray[setIndex];
            const bodyCount = set.sims.count;

            for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex)
            {
                const bodySim = set.sims.data[bodyIndex];

                const transform = new b2Transform(bodySim.center, bodySim.transform.q);
                draw.DrawTransform(transform, draw.context);

                const p = b2TransformPoint(transform, offset);

                const buffer = `  ${bodySim.mass.toFixed(2)}`;
                draw.DrawString(p, buffer, draw.context);
            }
        }
    }

    if (draw.drawContacts)
    {
        const k_impulseScale = 1.0;
        const k_axisScale = 0.3;
        const linearSlop = b2_linearSlop;

        const speculativeColor = b2HexColor.b2_colorGray3;
        const addColor = b2HexColor.b2_colorGreen;
        const persistColor = b2HexColor.b2_colorBlue;
        const normalColor = b2HexColor.b2_colorGray9;
        const impulseColor = b2HexColor.b2_colorMagenta;
        const frictionColor = b2HexColor.b2_colorYellow;

        const colors = [ b2HexColor.b2_colorRed, b2HexColor.b2_colorOrange, b2HexColor.b2_colorYellow, b2HexColor.b2_colorGreen,
            b2HexColor.b2_colorCyan, b2HexColor.b2_colorBlue, b2HexColor.b2_colorViolet, b2HexColor.b2_colorPink,
            b2HexColor.b2_colorChocolate, b2HexColor.b2_colorGoldenrod, b2HexColor.b2_colorCoral, b2HexColor.b2_colorBlack ];

        for (let colorIndex = 0; colorIndex < b2_graphColorCount; ++colorIndex)
        {
            const graphColor = world.constraintGraph.colors[colorIndex];

            const contactCount = graphColor.contacts.count;

            for (let contactIndex = 0; contactIndex < contactCount; ++contactIndex)
            {
                const contact = graphColor.contacts.data[contactIndex];
                const pointCount = contact.manifold.pointCount;
                const normal = new b2Vec2(contact.manifold.normalX, contact.manifold.normalY);

                for (let j = 0; j < pointCount; ++j)
                {
                    const point = contact.manifold.points[j];

                    if (draw.drawGraphColors && 0 <= colorIndex && colorIndex <= b2_graphColorCount)
                    {
                        // graph color
                        const pointSize = colorIndex === b2_overflowIndex ? 7.5 : 5.0;
                        draw.DrawPoint(point.pointX, point.pointY, pointSize, colors[colorIndex], draw.context);

                        // draw.DrawString(point.position, `${point.color}`);
                    }
                    else if (point.separation > linearSlop)
                    {
                        // Speculative
                        draw.DrawPoint(point.pointX, point.pointY, 5.0, speculativeColor, draw.context);
                    }
                    else if (point.persisted === false)
                    {
                        // Add
                        draw.DrawPoint(point.pointX, point.pointY, 10.0, addColor, draw.context);
                    }
                    else if (point.persisted === true)
                    {
                        // Persist
                        draw.DrawPoint(point.pointX, point.pointY, 5.0, persistColor, draw.context);
                    }

                    if (draw.drawContactNormals)
                    {
                        const p1 = new b2Vec2(point.pointX, point.pointY);
                        const p2 = b2MulAdd(p1, k_axisScale, normal);
                        draw.DrawSegment(p1, p2, normalColor, draw.context);
                    }
                    else if (draw.drawContactImpulses)
                    {
                        const p1 = new b2Vec2(point.pointX, point.pointY);
                        const p2 = b2MulAdd(p1, k_impulseScale * point.normalImpulse, normal);
                        draw.DrawSegment(p1, p2, impulseColor, draw.context);
                        const buffer = `${(1000.0 * point.normalImpulse).toFixed(2)}`;
                        draw.DrawString(p1, buffer, draw.context);
                    }

                    if (draw.drawFrictionImpulses)
                    {
                        const tangent = b2RightPerp(normal);
                        const p1 = new b2Vec2(point.pointX, point.pointY);
                        const p2 = b2MulAdd(p1, k_impulseScale * point.tangentImpulse, tangent);
                        draw.DrawSegment(p1, p2, frictionColor, draw.context);
                        const buffer = `${point.normalImpulse.toFixed(2)}`;
                        draw.DrawString(p1, buffer, draw.context);
                    }
                }
            }
        }
    }
}

/**
 * @function b2World_GetBodyEvents
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @returns {b2BodyEvents} An object containing an array of body move events and their count
 * @description
 * Retrieves the body movement events from a Box2D world. Returns an empty events object
 * if the world is locked. The function copies the world's body move event array and count
 * into a new b2BodyEvents object.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_GetBodyEvents(worldId)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2BodyEvents();
    }

    const count = world.bodyMoveEventArray.length;
    const events = new b2BodyEvents();
    events.moveEvents = world.bodyMoveEventArray;
    events.moveCount = count;

    return events;
}

/**
 * @function b2World_GetSensorEvents
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @returns {b2SensorEvents} An object containing arrays of sensor begin and end events
 * @description
 * Retrieves the sensor events from a Box2D world. The function returns both begin and end
 * sensor events that occurred during the simulation step. If the world is locked, it returns
 * an empty events object.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_GetSensorEvents(worldId)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2SensorEvents();
    }

    const beginCount = world.sensorBeginEventArray.length;
    const endCount = world.sensorEndEventArray.length;

    const events = new b2SensorEvents();
    events.beginEvents = world.sensorBeginEventArray;
    events.endEvents = world.sensorEndEventArray;
    events.beginCount = beginCount;
    events.endCount = endCount;

    return events;
}

/**
 * @function b2World_GetContactEvents
 * @summary Retrieves the contact events from a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @returns {b2ContactEvents} An object containing arrays of begin, end, and hit contact events,
 * along with their respective counts.
 * @throws {Error} Throws an assertion error if the world is locked.
 * @description
 * Returns a b2ContactEvents object containing three arrays: contactBeginArray,
 * contactEndArray, and contactHitArray, representing different types of contact
 * events that occurred in the physics simulation. The object also includes
 * count values for each type of event.
 */
export function b2World_GetContactEvents(worldId)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2ContactEvents();
    }

    const beginCount = world.contactBeginArray.length;
    const endCount = world.contactEndArray.length;
    const hitCount = world.contactHitArray.length;

    const events = new b2ContactEvents();
    events.beginEvents = world.contactBeginArray;
    events.endEvents = world.contactEndArray;
    events.hitEvents = world.contactHitArray;
    events.beginCount = beginCount;
    events.endCount = endCount;
    events.hitCount = hitCount;

    return events;
}

/**
 * Validates a Box2D world identifier.
 * @function b2World_IsValid
 * @param {b2WorldId} id - The world identifier to validate, containing index1 and revision properties
 * @returns {boolean} True if the world ID is valid and matches the stored world revision, false otherwise
 * @description
 * Checks if a world ID is valid by verifying:
 * 1. The ID is not undefined
 * 2. The index is within valid bounds (1 to B2_MAX_WORLDS)
 * 3. The world exists at the specified index
 * 4. The revision number matches the world's current revision
 */
export function b2World_IsValid(id)
{
    if (id === undefined)
    {
        return false;
    }
    
    if (id.index1 < 1 || B2_MAX_WORLDS < id.index1)
    {
        return false;
    }

    const world = b2_worlds[id.index1 - 1];

    if (world.worldId !== id.index1 - 1)
    {
        // world is not allocated
        return false;
    }

    return id.revision === world.revision;
}

/**
 * @function b2Body_IsValid
 * @summary Validates a body ID to ensure it references a valid body in the physics world.
 * @param {b2BodyId} id - The body ID to validate
 * @returns {boolean} True if the ID is valid and references an existing body, false otherwise
 * @description
 * Performs validation checks on a body ID including:
 * - Verifies the ID is defined and is a b2BodyId instance
 * - Checks the world index is within valid bounds
 * - Confirms the world exists and matches the ID
 * - Validates the body index exists in the world
 * - Ensures the body is active and the revision number matches
 */
export function b2Body_IsValid(id)
{
    if (id === undefined)
    {
        return false;
    }
    
    if (!(id instanceof b2BodyId))
    {
        console.error(`Invalid ID:\n${new Error().stack}`);

        return false;
    }

    if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0)
    {
        // invalid world
        return false;
    }

    const world = b2_worlds[id.world0];

    if (world.worldId !== id.world0)
    {
        // world is free
        return false;
    }

    if (id.index1 < 1 || world.bodyArray.length < id.index1)
    {
        // invalid index
        return false;
    }

    const body = world.bodyArray[id.index1 - 1];

    if (body.setIndex === B2_NULL_INDEX)
    {
        // this was freed
        return false;
    }

    console.assert(body.localIndex != B2_NULL_INDEX);

    if (body.revision !== id.revision)
    {
        // this id is orphaned
        return false;
    }

    return true;
}

/**
 * Validates a shape ID to ensure it references a valid shape in a valid world.
 * @function b2Shape_IsValid
 * @param {b2ShapeId} id - The shape ID to validate, containing world0, index1, and revision properties
 * @returns {boolean} True if the shape ID is valid and references an existing shape, false otherwise
 * @description
 * Checks if a shape ID is valid by verifying:
 * - The ID exists and is not undefined
 * - The world index is within bounds
 * - The referenced world exists and matches the world ID
 * - The shape index is within bounds of the world's shape array
 * - The shape exists and is not marked as null
 * - The shape revision matches the ID's revision
 */
export function b2Shape_IsValid(id)
{
    if (id === undefined)
    {
        return false;
    }
    
    if (B2_MAX_WORLDS <= id.world0)
    {
        return false;
    }

    const world = b2_worlds[id.world0];

    if (world.worldId !== id.world0)
    {
        // world is free
        return false;
    }

    const shapeId = id.index1 - 1;

    if (shapeId < 0 || world.shapeArray.length <= shapeId)
    {
        return false;
    }

    const shape = world.shapeArray[shapeId];

    if (shape.id === B2_NULL_INDEX)
    {
        // shape is free
        return false;
    }

    console.assert(shape.id == shapeId);

    return id.revision === shape.revision;
}

/**
 * Validates a b2ChainId to ensure it references a valid chain in the Box2D world system.
 * @function b2Chain_IsValid
 * @param {b2ChainId} id - The chain identifier containing world0 (world index),
 * index1 (chain index), and revision properties
 * @returns {boolean} Returns true if the chain ID is valid and matches the current revision,
 * false otherwise
 * @description
 * Checks if a chain ID is valid by verifying:
 * - The ID exists
 * - The world index is within valid bounds
 * - The world exists and matches the ID
 * - The chain index is within valid bounds
 * - The chain exists and is not null
 * - The revision number matches
 */
export function b2Chain_IsValid(id)
{
    if (id === undefined)
    {
        return false;
    }
    
    if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0)
    {
        return false;
    }

    const world = b2_worlds[id.world0];

    if (world.worldId !== id.world0)
    {
        // world is free
        return false;
    }

    const chainId = id.index1 - 1;

    if (chainId < 0 || world.chainArray.length <= chainId)
    {
        return false;
    }

    const chain = world.chainArray[chainId];

    if (chain.id === B2_NULL_INDEX)
    {
        // chain is free
        return false;
    }

    console.assert(chain.id == chainId);

    return id.revision === chain.revision;
}

/**
 * Validates a joint ID to ensure it references a valid joint in the Box2D world.
 * @function b2Joint_IsValid
 * @param {b2JointId} id - The joint ID to validate, containing world0 (world index),
 * index1 (joint index), and revision properties
 * @returns {boolean} True if the joint ID is valid and references an existing joint,
 * false otherwise
 * @description
 * Checks if a joint ID is valid by verifying:
 * - The world index is within bounds
 * - The referenced world exists and matches the ID
 * - The joint index is within bounds
 * - The joint exists and is not null
 * - The revision number matches the joint's revision
 */
export function b2Joint_IsValid(id)
{
    if (id === undefined)
    {
        return false;
    }
    
    if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0)
    {
        return false;
    }

    const world = b2_worlds[id.world0];

    if (world.worldId !== id.world0)
    {
        // world is free
        return false;
    }

    const jointId = id.index1 - 1;

    if (jointId < 0 || world.jointArray.length <= jointId)
    {
        return false;
    }

    const joint = world.jointArray[jointId];

    if (joint.jointId === B2_NULL_INDEX)
    {
        // joint is free
        return false;
    }

    console.assert(joint.jointId == jointId);

    return id.revision === joint.revision;
}

/**
 * @function b2World_EnableSleeping
 * @summary Controls the sleep state management of bodies in a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @param {boolean} flag - When true, enables sleep management. When false, wakes all sleeping bodies.
 * @returns {void}
 * @description
 * Enables or disables the sleep management system for the specified Box2D world.
 * When sleep is disabled, all sleeping bodies are awakened. The function has no effect
 * if the world is locked or if the requested sleep state matches the current state.
 * @throws {Error} Throws an assertion error if the world is locked.
 */
export function b2World_EnableSleeping(worldId, flag)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    if (flag === world.enableSleep)
    {
        return;
    }

    world.enableSleep = flag;

    if (flag === false)
    {
        const setCount = world.solverSetArray.length;

        for (let i = b2SetType.b2_firstSleepingSet; i < setCount; ++i)
        {
            const set = world.solverSetArray[i];

            if (set.sims.length > 0)
            {
                b2WakeSolverSet(world, i);
            }
        }
    }
}

/**
 * @function b2World_EnableWarmStarting
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {boolean} flag - Boolean value to enable or disable warm starting
 * @returns {void}
 * @description
 * Enables or disables warm starting for the specified Box2D world. Warm starting
 * cannot be modified while the world is locked. If the world is locked when this
 * function is called, the function will return without making any changes.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_EnableWarmStarting(worldId, flag)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    world.enableWarmStarting = flag;
}

/**
 * @function b2World_EnableContinuous
 * @summary Enables or disables continuous collision detection for a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @param {boolean} flag - True to enable continuous collision detection, false to disable it.
 * @returns {void}
 * @description
 * Sets the continuous collision detection state for the specified Box2D world.
 * The function will not execute if the world is currently locked.
 * @throws {Error} Throws an assertion error if the world is locked when this function is called.
 */
export function b2World_EnableContinuous(worldId, flag)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    world.enableContinuous = flag;
}

/**
 * @function b2World_SetRestitutionThreshold
 * @summary Sets the restitution threshold for a Box2D world.
 * @param {b2WorldId} worldId - The identifier for the Box2D world.
 * @param {number} value - The restitution threshold value to set.
 * @returns {void}
 * @description
 * Sets the restitution threshold for collision response in the specified Box2D world.
 * The value is clamped between 0 and Number.MAX_VALUE. The function will not execute
 * if the world is locked.
 * @throws {Error} Throws an assertion error if attempting to modify a locked world.
 */
export function b2World_SetRestitutionThreshold(worldId, value)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    world.restitutionThreshold = Math.max(0, Math.min(value, Number.MAX_VALUE));
}

/**
 * @function b2World_SetHitEventThreshold
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {number} value - The new hit event threshold value to set
 * @returns {void}
 * @description
 * Sets the hit event threshold for a Box2D world. The value is clamped between 0 and Number.MAX_VALUE.
 * The function will not execute if the world is locked.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_SetHitEventThreshold(worldId, value)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    world.hitEventThreshold = Math.max(0, Math.min(value, Number.MAX_VALUE));
}

/**
 * Sets the contact tuning parameters for a Box2D world.
 * @function b2World_SetContactTuning
 * @param {b2WorldId} worldId - The identifier for the Box2D world.
 * @param {number} hertz - The frequency for contact constraint solving.
 * @param {number} dampingRatio - The damping ratio for contact constraint solving.
 * @param {number} pushOut - The velocity used for contact separation.
 * @returns {void}
 * @description
 * Sets three contact-related parameters for physics simulation: the constraint frequency (hertz),
 * damping ratio, and push-out velocity. All input parameters are clamped between 0 and MAX_VALUE.
 * The function will not execute if the world is locked.
 * @throws {Error} Throws an assertion error if attempting to modify a locked world.
 */
export function b2World_SetContactTuning(worldId, hertz, dampingRatio, pushOut)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    world.contactHertz = b2ClampFloat(hertz, 0.0, Number.MAX_VALUE);
    world.contactDampingRatio = b2ClampFloat(dampingRatio, 0.0, Number.MAX_VALUE);
    world.contactPushoutVelocity = b2ClampFloat(pushOut, 0.0, Number.MAX_VALUE);
}

export function b2World_SetJointTuning(worldId, hertz, dampingRatio)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }
    world.jointHertz = b2ClampFloat(hertz, 0.0, Number.MAX_VALUE);
    world.jointDampingRatio = b2ClampFloat(dampingRatio, 0.0, Number.MAX_VALUE);
}

/**
 * @summary Dumps memory statistics for a Box2D world (Not supported in Phaser Box2D JS)
 * @function b2World_DumpMemoryStats
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @returns {void}
 * @description
 * This function is a stub that displays a warning message indicating that memory statistics
 * dumping is not supported in the Phaser Box2D JavaScript implementation.
 */
export function b2World_DumpMemoryStats(worldId)
{
    // This function writes to a file, which is not directly applicable in JS.
    // You might want to modify this to return a string or object with the memory stats instead.
    console.error("Memory stats not implemented");
}

function TreeQueryCallback(proxyId, shapeId, context)
{
    const worldContext = context;
    const world = worldContext.world;

    // B2_MAYBE_UNUSED(proxyId);
    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    const shapeFilter = shape.filter;
    const queryFilter = worldContext.filter;

    if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0)
    {
        return true;
    }

    const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
    const result = worldContext.fcn(id, worldContext.userContext);

    return result;
}

class WorldQueryContext
{
    constructor(world = null, fcn = null, filter = null, userContext = null)
    {
        this.world = world;
        this.fcn = fcn;
        this.filter = filter;
        this.userContext = userContext;
        
    }
}

/**
 * @function b2World_OverlapAABB
 * @summary Queries an AABB region in the physics world for overlapping fixtures
 * @param {b2WorldId} worldId - The ID of the physics world to query
 * @param {b2AABB} aabb - The axis-aligned bounding box defining the query region
 * @param {b2QueryFilter} filter - Filter settings to control which fixtures are included
 * @param {b2OverlapResultFcn} fcn - Callback function that receives each overlapping fixture
 * @param {*} context - User context data passed to the callback function
 * @description
 * Performs a broadphase query using the world's dynamic tree to find all fixtures
 * that overlap with the given AABB. For each overlapping fixture that passes the
 * filter, the callback function is invoked.
 * @throws {Error} Throws an assertion error if the world is locked or if the AABB is invalid
 */
export function b2World_OverlapAABB(worldId, aabb, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2AABB_IsValid(aabb));

    const worldContext = new WorldQueryContext(world, fcn, filter, context);

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeQueryCallback, worldContext);
    }
    
}

function TreeOverlapCallback(proxyId, shapeId, context)
{
    // B2_MAYBE_UNUSED(proxyId);

    const worldContext = context;
    const world = worldContext.world;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    const shapeFilter = shape.filter;
    const queryFilter = worldContext.filter;

    if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0)
    {
        return true;
    }

    const body = b2GetBody(world, shape.bodyId);
    const transform = b2GetBodyTransformQuick(world, body);

    const input = new b2DistanceInput();
    input.proxyA = worldContext.proxy;
    input.proxyB = b2MakeShapeDistanceProxy(shape);
    input.transformA = worldContext.transform;
    input.transformB = transform;
    input.useRadii = true;

    const cache = new b2DistanceCache();
    const output = b2ShapeDistance(cache, input, null, 0);

    if (output.distance > 0.0)
    {
        return true;
    }

    const id = new b2ShapeId(shape.id + 1, world.worldId, shape.revision);
    const result = worldContext.fcn(id, worldContext.userContext);

    return result;
}

/**
 * @function b2World_OverlapCircle
 * @summary Tests for overlaps between a circle shape and all shapes in the world.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Circle} circle - The circle shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation transform of the circle
 * @param {b2QueryFilter} filter - Filtering options for the overlap test
 * @param {function} fcn - Callback function that handles overlap results
 * @param {*} context - User context data passed to the callback function
 * @description
 * Performs broad-phase AABB queries to find potential overlaps between the given circle
 * and all shapes in the world that match the filter criteria. For each potential overlap,
 * the callback function is invoked with the overlap details.
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * contains invalid values.
 */
export function b2World_OverlapCircle(worldId, circle, transform, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(transform.p));
    console.assert(b2Rot_IsValid(transform.q));

    const aabb = b2ComputeCircleAABB(circle, transform);
    const worldContext = new WorldOverlapContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.proxy = b2MakeProxy(circle.center, 1, circle.radius);
    worldContext.transform = transform;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
    }
}

/**
 * @function b2World_OverlapCapsule
 * @summary Performs overlap queries for a capsule shape against all shapes in the world.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Capsule} capsule - The capsule shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation of the capsule
 * @param {b2QueryFilter} filter - Filtering options for the query
 * @param {b2OverlapResultFcn} fcn - Callback function that handles overlap results
 * @param {*} context - User context data passed to the callback function
 * @description
 * Tests a capsule shape against all shapes in the world that pass the filter criteria.
 * For each potential overlap, calls the provided callback function.
 * Uses a broad phase tree structure to efficiently find potential overlaps.
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * contains invalid position/rotation values.
 */
export function b2World_OverlapCapsule(worldId, capsule, transform, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(transform.p));
    console.assert(b2Rot_IsValid(transform.q));

    const aabb = b2ComputeCapsuleAABB(capsule, transform);
    const worldContext = new WorldOverlapContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.proxy = b2MakeProxy(capsule.center, 2, capsule.radius);
    worldContext.transform = transform;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
    }
}

/**
 * @function b2World_OverlapPolygon
 * @description
 * Performs overlap queries for a polygon shape against all shapes in the physics world
 * that match the provided filter criteria.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Polygon} polygon - The polygon shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation of the polygon
 * @param {b2QueryFilter} filter - Filtering criteria for the overlap test
 * @param {b2OverlapResultFcn} fcn - Callback function to handle overlap results
 * @param {void} context - User data passed to the callback function
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * components are invalid
 */
export function b2World_OverlapPolygon(worldId, polygon, transform, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(transform.p));
    console.assert(b2Rot_IsValid(transform.q));

    const aabb = b2ComputePolygonAABB(polygon, transform);
    const worldContext = new WorldOverlapContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.proxy = b2MakeProxy(polygon.vertices, polygon.count, polygon.radius),
    worldContext.transform = transform;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
    }
}

function RayCastCallback(input, proxyId, shapeId, context)
{
    // B2_MAYBE_UNUSED(proxyId);

    const worldContext = context;
    const world = worldContext.world;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];
    const shapeFilter = shape.filter;
    const queryFilter = worldContext.filter;

    if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0)
    {
        return input.maxFraction;
    }

    const body = b2GetBody(world, shape.bodyId);
    const transform = b2GetBodyTransformQuick(world, body);
    const output = b2RayCastShape(input, shape, transform);

    if (output.hit)
    {
        const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
        const fraction = worldContext.fcn(id, output.point, output.normal, output.fraction, worldContext.userContext);

        // The user may return -1 to skip this shape
        if (fraction >= 0.0 && fraction <= 1.0)
        {
            worldContext.fraction = fraction;
        }

        return fraction;
    }

    return input.maxFraction;
}

/**
 * @function b2World_CastRay
 * @description
 * Performs a ray cast operation in the physics world to detect intersections between
 * a ray and physics bodies.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Vec2} origin - The starting point of the ray
 * @param {b2Vec2} translation - The direction and length of the ray
 * @param {b2QueryFilter} filter - Filtering options for the ray cast
 * @param {b2CastResultFcn} fcn - Callback function to handle ray cast results
 * @param {void} context - User context data passed to the callback
 * @returns {b2TreeStats}
 * @throws {Error} Throws assertion error if world is locked
 * @throws {Error} Throws assertion error if origin or translation vectors are invalid
 */
export function b2World_CastRay(worldId, origin, translation, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(origin));
    console.assert(b2Vec2_IsValid(translation));

    const input = new b2RayCastInput();
    input.origin = origin;
    input.translation = translation;
    input.maxFraction = 1.0;

    const worldContext = new WorldRayCastContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.fraction = 1.0;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_RayCast(world.broadPhase.trees[i], input, filter.maskBits, RayCastCallback, worldContext);

        if (worldContext.fraction === 0.0)
        {
            return;
        }

        input.maxFraction = worldContext.fraction;
    }
}

// This callback finds the closest hit. This is the most common callback used in games.
function b2RayCastClosestFcn(shapeId, point, normal, fraction, context)
{
    const rayResult = context;
    rayResult.shapeId = shapeId;
    rayResult.point = point;
    rayResult.normal = normal;
    rayResult.fraction = fraction;
    rayResult.hit = true;

    return fraction;
}

/**
 * Performs a ray cast operation to find the closest intersection in the physics world.
 * @function b2World_CastRayClosest
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Vec2} origin - The starting point of the ray
 * @param {b2Vec2} translation - The direction and length of the ray
 * @param {b2QueryFilter} filter - Filter settings for the ray cast
 * @returns {b2RayResult} Information about the closest intersection found
 * @description
 * Casts a ray through the physics world and returns information about the closest
 * intersection. The ray is defined by an origin point and a translation vector.
 * The operation checks all body types in the broad phase using a dynamic tree
 * structure.
 * @throws {Error} Throws an assertion error if the world is locked or if the
 * origin/translation vectors are invalid
 */
export function b2World_CastRayClosest(worldId, origin, translation, filter)
{
    const result = new b2RayResult();

    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return result;
    }

    console.assert(b2Vec2_IsValid(origin));
    console.assert(b2Vec2_IsValid(translation));

    const input = new b2RayCastInput();
    input.origin = origin;
    input.translation = translation;
    input.maxFraction = 1.0;
    const worldContext = new WorldRayCastContext();
    worldContext.world = world;
    worldContext.fcn = b2RayCastClosestFcn;
    worldContext.fraction = 1.0;
    worldContext.userContext = result;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_RayCast(world.broadPhase.trees[i], input, filter.maskBits, RayCastCallback, worldContext);

        if (worldContext.fraction == 0.0)
        {
            return result;
        }

        input.maxFraction = worldContext.fraction;
    }

    return result;
}

function ShapeCastCallback(input, proxyId, shapeId, context)
{
    const worldContext = context;
    const world = worldContext.world;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];
    const shapeFilter = shape.filter;
    const queryFilter = worldContext.filter;

    if ((shapeFilter.categoryBits & queryFilter.maskBits) == 0 || (shapeFilter.maskBits & queryFilter.categoryBits) == 0)
    {
        return input.maxFraction;
    }

    const body = b2GetBody(world, shape.bodyId);
    const transform = b2GetBodyTransformQuick(world, body);
    const output = b2ShapeCastShape(input, shape, transform);

    if (output.hit)
    {
        const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
        const fraction = worldContext.fcn(id, output.point, output.normal, output.fraction, worldContext.userContext);
        worldContext.fraction = fraction;

        return fraction;
    }

    return input.maxFraction;
}

/**
 * @function b2World_CastCircle
 * @summary Performs a shape cast of a circle through the physics world.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Circle} circle - The circle shape to cast
 * @param {b2Transform} originTransform - The initial transform of the circle
 * @param {b2Vec2} translation - The displacement vector for the cast
 * @param {b2QueryFilter} filter - Filtering options for the cast
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {void} context - User data passed to the callback function
 * @description
 * Casts a circle shape through the physics world from its initial position
 * along a translation vector, detecting collisions with other shapes. The cast
 * is performed against all body types in the broad phase, stopping if a collision
 * occurs at fraction 0.
 * @throws {Error} Throws an assertion error if the world is locked or if the
 * transform position, rotation, or translation vectors are invalid.
 */
export function b2World_CastCircle(worldId, circle, originTransform, translation, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(originTransform.p));
    console.assert(b2Rot_IsValid(originTransform.q));
    console.assert(b2Vec2_IsValid(translation));

    const input = new b2ShapeCastInput();
    input.points = [ b2TransformPoint(originTransform, circle.center) ];
    input.count = 1;
    input.radius = circle.radius;
    input.translation = translation;
    input.maxFraction = 1.0;

    const worldContext = new WorldRayCastContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.fraction = 1.0;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);

        if (worldContext.fraction == 0.0)
        {
            return;
        }

        input.maxFraction = worldContext.fraction;
    }
}

/**
 * @function b2World_CastCapsule
 * @description
 * Performs a shape cast of a capsule through the physics world, detecting collisions
 * along the specified translation path.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Capsule} capsule - The capsule shape to cast
 * @param {b2Transform} originTransform - The initial transform of the capsule, containing position (p) and rotation (q)
 * @param {b2Vec2} translation - The translation vector defining the cast path
 * @param {b2QueryFilter} filter - Filter settings for the cast operation
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {void} context - User context data passed to the callback function
 * @throws {Error} Throws assertion error if world is locked or if transform/translation vectors are invalid
 */
export function b2World_CastCapsule(worldId, capsule, originTransform, translation, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(originTransform.p));
    console.assert(b2Rot_IsValid(originTransform.q));
    console.assert(b2Vec2_IsValid(translation));

    const input = new b2ShapeCastInput();
    input.points = [ b2TransformPoint(originTransform, capsule.center1), b2TransformPoint(originTransform, capsule.center2) ];
    input.count = 2;
    input.radius = capsule.radius;
    input.translation = translation;
    input.maxFraction = 1.0;

    const worldContext = new WorldRayCastContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.fraction = 1.0;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);

        if (worldContext.fraction == 0.0)
        {
            return;
        }

        input.maxFraction = worldContext.fraction;
    }
}

/**
 * @function b2World_CastPolygon
 * @description
 * Performs a shape cast of a polygon through the physics world, detecting collisions along the way.
 * @param {b2WorldId} worldId - ID of the physics world
 * @param {b2Polygon} polygon - The polygon shape to cast
 * @param {b2Transform} originTransform - Initial transform of the polygon, containing position and rotation
 * @param {b2Vec2} translation - The displacement vector to cast the polygon along
 * @param {b2QueryFilter} filter - Filter to determine which fixtures to check against
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {*} context - User context data passed to the callback function
 * @throws {Error} Throws assertion error if world is locked or if transform/translation vectors are invalid
 */
export function b2World_CastPolygon(worldId, polygon, originTransform, translation, filter, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked == false);

    if (world.locked)
    {
        return;
    }

    console.assert(b2Vec2_IsValid(originTransform.p));
    console.assert(b2Rot_IsValid(originTransform.q));
    console.assert(b2Vec2_IsValid(translation));

    const input = new b2ShapeCastInput();
    input.points = polygon.vertices.map(vertex => b2TransformPoint(originTransform, vertex));
    input.count = polygon.count;
    input.radius = polygon.radius;
    input.translation = translation;
    input.maxFraction = 1.0;

    const worldContext = new WorldRayCastContext();
    worldContext.world = world;
    worldContext.fcn = fcn;
    worldContext.filter = filter;
    worldContext.fraction = 1.0;
    worldContext.userContext = context;

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);

        if (worldContext.fraction == 0.0)
        {
            return;
        }

        input.maxFraction = worldContext.fraction;
    }
}

/**
 * @function b2World_SetPreSolveCallback
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {b2PreSolveFcn} fcn - The pre-solve callback function to be executed
 * @param {void} context - User data pointer passed to the callback function
 * @returns {void}
 * @description
 * Sets a callback function that is invoked before the physics solver runs.
 * The callback receives the provided context pointer when executed.
 */
export function b2World_SetPreSolveCallback(worldId, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    world.preSolveFcn = fcn;
    world.preSolveContext = context;
}

/**
 * @summary Sets a custom filter callback for a Box2D world.
 * @function b2World_SetCustomFilterCallback
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @param {b2CustomFilterFcn} fcn - The custom filter callback function.
 * @param {void} context - A pointer to user-defined context data.
 * @returns {void}
 * @description
 * Sets a custom filter callback function for a Box2D world instance. The callback
 * can be used to implement custom collision filtering logic. The context parameter
 * allows passing additional data to the callback function.
 */
export function b2World_SetCustomFilterCallback(worldId, fcn, context)
{
    const world = b2GetWorldFromId(worldId);
    world.customFilterFcn = fcn;
    world.customFilterContext = context;
}

/**
 * @summary Sets the gravity vector for a Box2D world.
 * @function b2World_SetGravity
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @param {b2Vec2} gravity - The gravity vector to apply to the world. Defaults to (0,0).
 * @returns {void}
 * @description
 * Updates the gravity vector of the specified Box2D world. The gravity vector
 * defines the global acceleration applied to all dynamic bodies in the world.
 */
export function b2World_SetGravity(worldId, gravity)
{
    const world = b2GetWorldFromId(worldId);
    world.gravity = gravity;
}

/**
 * @summary Gets the gravity vector from a Box2D world instance.
 * @function b2World_GetGravity
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @returns {b2Vec2} The gravity vector of the world. A 2D vector with x and y components.
 * @description
 * Retrieves the current gravity vector from the specified Box2D world instance.
 * The gravity vector represents the global gravity force applied to all dynamic bodies in the world.
 */
export function b2World_GetGravity(worldId)
{
    const world = b2GetWorldFromId(worldId);

    return world.gravity;
}

class ExplosionContext
{
    constructor(world, position, radius, magnitude)
    {
        this.world = world;
        this.position = position;
        this.radius = radius;
        this.magnitude = magnitude;
    }
}

function ExplosionCallback(proxyId, shapeId, context)
{
    // B2_MAYBE_UNUSED(proxyId);
    const explosionContext = context;
    const world = explosionContext.world;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    // b2CheckId(world.bodyArray, shape.bodyId);
    const body = world.bodyArray[shape.bodyId];

    if (body.type === b2BodyType.b2_kinematicBody)
    {
        return true;
    }

    b2WakeBody(world, body);

    if (body.setIndex !== b2SetType.b2_awakeSet)
    {
        return true;
    }

    const transform = b2GetBodyTransformQuick(world, body);
    const input = new b2DistanceInput();
    input.proxyA = b2MakeShapeDistanceProxy(shape);
    input.proxyB = b2MakeProxy([ explosionContext.position ], 1, 0.0);
    input.transformA = transform;
    input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
    input.useRadii = true;

    const cache = new b2DistanceCache();
    const output = b2ShapeDistance(cache, input, null, 0);

    if (output.distance > explosionContext.radius)
    {
        return true;
    }

    let closestPoint = output.pointA;

    if (output.distance === 0.0)
    {
        const localCentroid = b2GetShapeCentroid(shape);
        closestPoint = b2TransformPoint(transform, localCentroid);
    }

    const falloff = 0.4;
    const perimeter = b2GetShapePerimeter(shape);
    const magnitude = explosionContext.magnitude * perimeter * (1.0 - falloff * output.distance / explosionContext.radius);
    const direction = b2Normalize(b2Sub(closestPoint, explosionContext.position));
    const impulse = b2MulSV(magnitude, direction);

    const localIndex = body.localIndex;
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    console.assert(0 <= localIndex && localIndex < set.states.count);
    const state = set.states.data[localIndex];
    const bodySim = set.sims.data[localIndex];

    state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
    state.angularVelocity += bodySim.invInertia * b2Cross(b2Sub(closestPoint, bodySim.center), impulse);

    return true;
}

/**
 * @function b2World_Explode
 * @summary Creates an explosion effect that applies forces to nearby dynamic bodies
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2Vec2} position - The center point of the explosion
 * @param {number} radius - The radius of the explosion effect
 * @param {number} magnitude - The force magnitude of the explosion
 * @returns {void}
 * @description
 * Creates a circular explosion centered at the given position that applies radial forces
 * to dynamic bodies within the explosion radius. The explosion force decreases with
 * distance from the center point.
 * @throws {Error} Throws assertion errors if:
 * - position is invalid
 * - radius is invalid or <= 0
 * - magnitude is invalid
 * - world is locked
 */
export function b2World_Explode(worldId, position, radius, magnitude)
{
    console.assert(b2Vec2_IsValid(position));
    console.assert(b2IsValid(radius) && radius > 0.0);
    console.assert(b2IsValid(magnitude));
    const world = b2GetWorldFromId(worldId);
    console.assert(world.locked === false);

    if (world.locked)
    {
        return;
    }

    const explosionContext = new ExplosionContext(world, position, radius, magnitude);
    const aabb = new b2AABB(position.x - radius, position.y - radius, position.x + radius, position.y + radius);

    b2DynamicTree_Query(
        world.broadPhase.trees[b2BodyType.b2_dynamicBody],
        aabb,
        B2_DEFAULT_MASK_BITS,
        ExplosionCallback,
        explosionContext
    );
}

function b2GetRootIslandId(world, islandId)
{
    if (islandId === B2_NULL_INDEX)
    {
        return B2_NULL_INDEX;
    }

    let rootId = islandId;
    let rootIsland = world.islandArray[islandId];

    while (rootIsland.parentIsland !== B2_NULL_INDEX)
    {
        const parent = world.islandArray[rootIsland.parentIsland];
        rootId = rootIsland.parentIsland;
        rootIsland = parent;
    }

    return rootId;
}

export function b2CheckId(a, id)
{
    console.assert( 0 <= id && id < a.length && a[id].id == id );
}

export function b2CheckIndex(a, i)
{
    if (Array.isArray(a))
    { console.assert(0 <= i && i < a.length); }
    else
    { console.assert(0 <= i && i < a.count); }
}

export function b2ValidateConnectivity(world)
{
    if (!b2Validation) { return; }

    const bodyCapacity = world.bodyArray.length;

    for (let bodyIndex = 0; bodyIndex < bodyCapacity; ++bodyIndex)
    {
        const body = world.bodyArray[bodyIndex];

        if (body.id === B2_NULL_INDEX)
        {
            // b2ValidateFreeId(world.bodyIdPool, bodyIndex);
            continue;
        }

        console.assert(bodyIndex === body.id);

        const bodyIslandId = b2GetRootIslandId(world, body.islandId);
        const bodySetIndex = body.setIndex;

        let contactKey = body.headContactKey;

        while (contactKey !== B2_NULL_INDEX)
        {
            const contactId = contactKey >> 1;
            const edgeIndex = contactKey & 1;

            const contact = world.contactArray[contactId];

            const touching = (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0;

            if (touching && (contact.flags & b2ContactFlags.b2_contactSensorFlag) === 0)
            {
                if (bodySetIndex !== b2SetType.b2_staticSet)
                {
                    const contactIslandId = b2GetRootIslandId(world, contact.islandId);
                    console.assert(contactIslandId === bodyIslandId);
                }
            }
            else
            {
                console.assert(contact.islandId === B2_NULL_INDEX);
            }

            contactKey = contact.edges[edgeIndex].nextKey;
        }

        let jointKey = body.headJointKey;

        while (jointKey !== B2_NULL_INDEX)
        {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;

            const joint = world.jointArray[jointId];

            const otherEdgeIndex = edgeIndex ^ 1;

            const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];

            if (bodySetIndex === b2SetType.b2_disabledSet || otherBody.setIndex === b2SetType.b2_disabledSet)
            {
                console.assert(joint.islandId === B2_NULL_INDEX);
            }
            else if (bodySetIndex === b2SetType.b2_staticSet)
            {
                if (otherBody.setIndex === b2SetType.b2_staticSet)
                {
                    console.assert(joint.islandId === B2_NULL_INDEX);
                }
            }
            else
            {
                const jointIslandId = b2GetRootIslandId(world, joint.islandId);
                console.assert(jointIslandId === bodyIslandId);
            }

            jointKey = joint.edges[edgeIndex].nextKey;
        }
    }
}

export function b2ValidateSolverSets(world)
{
    if (!b2Validation) { return; }

    let activeSetCount = 0;
    let totalBodyCount = 0;
    let totalJointCount = 0;
    let totalContactCount = 0;
    let totalIslandCount = 0;

    // Validate all solver sets
    const setCount = world.solverSetArray.length;

    for (let setIndex = 0; setIndex < setCount; ++setIndex)
    {
        const set = world.solverSetArray[setIndex];

        if (set.setIndex !== B2_NULL_INDEX)
        {
            activeSetCount += 1;

            if (setIndex === b2SetType.b2_staticSet)
            {
                console.assert(set.contacts.count === 0);
                console.assert(set.islands.count === 0);
                console.assert(set.states.count === 0);
            }
            else if (setIndex === b2SetType.b2_awakeSet)
            {
                console.assert(set.sims.count === set.states.count);
                console.assert(set.joints.count === 0);
            }
            else if (setIndex === b2SetType.b2_disabledSet)
            {
                console.assert(set.islands.count === 0);
                console.assert(set.states.count === 0);
            }
            else
            {
                console.assert(set.states.count === 0);
            }

            // Validate bodies
            {
                const bodies = world.bodyArray;
                console.assert(set.sims.count >= 0);
                totalBodyCount += set.sims.count;

                for (let i = 0; i < set.sims.count; ++i)
                {
                    const bodySim = set.sims.data[i];

                    const bodyId = bodySim.bodyId;
                    b2CheckIndex(bodies, bodyId);
                    const body = bodies[bodyId];
                    console.assert(body.setIndex === setIndex);
                    console.assert(body.localIndex === i);

                    // console.assert(body.revision === body.revision);

                    if (setIndex === b2SetType.b2_disabledSet)
                    {
                        console.assert(body.headContactKey === B2_NULL_INDEX);
                    }

                    // Validate body shapes
                    let prevShapeId = B2_NULL_INDEX;
                    let shapeId = body.headShapeId;

                    while (shapeId !== B2_NULL_INDEX)
                    {
                        b2CheckId(world.shapeArray, shapeId);
                        const shape = world.shapeArray[shapeId];
                        console.assert(shape.prevShapeId === prevShapeId);

                        if (setIndex === b2SetType.b2_disabledSet)
                        {
                            console.assert(shape.proxyKey === B2_NULL_INDEX);
                        }
                        else if (setIndex === b2SetType.b2_staticSet)
                        {
                            console.assert(B2_PROXY_TYPE(shape.proxyKey) === b2BodyType.b2_staticBody);
                        }
                        else
                        {
                            const proxyType = B2_PROXY_TYPE(shape.proxyKey);
                            console.assert(proxyType === b2BodyType.b2_kinematicBody || proxyType === b2BodyType.b2_dynamicBody);
                        }

                        prevShapeId = shapeId;
                        shapeId = shape.nextShapeId;
                    }

                    // Validate body contacts
                    let contactKey = body.headContactKey;

                    while (contactKey !== B2_NULL_INDEX)
                    {
                        const contactId = contactKey >> 1;
                        const edgeIndex = contactKey & 1;

                        b2CheckIndex(world.contactArray, contactId);
                        const contact = world.contactArray[contactId];
                        console.assert(contact.setIndex !== b2SetType.b2_staticSet);
                        console.assert(contact.edges[0].bodyId === bodyId || contact.edges[1].bodyId === bodyId);
                        contactKey = contact.edges[edgeIndex].nextKey;
                    }

                    // Validate body joints
                    let jointKey = body.headJointKey;

                    while (jointKey !== B2_NULL_INDEX)
                    {
                        const jointId = jointKey >> 1;

                        // console.warn("jointKey " + jointKey);
                        const edgeIndex = jointKey & 1;

                        b2CheckIndex(world.jointArray, jointId);
                        const joint = world.jointArray[jointId];

                        // PJB: not sure about this...
                        console.assert(joint.jointId == jointId);

                        const otherEdgeIndex = edgeIndex ^ 1;

                        b2CheckIndex(world.bodyArray, joint.edges[otherEdgeIndex].bodyId);
                        const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];

                        if (setIndex === b2SetType.b2_disabledSet || otherBody.setIndex === b2SetType.b2_disabledSet)
                        {
                            console.assert(joint.setIndex === b2SetType.b2_disabledSet);
                        }
                        else if (setIndex === b2SetType.b2_staticSet && otherBody.setIndex === b2SetType.b2_staticSet)
                        {
                            console.assert(joint.setIndex === b2SetType.b2_staticSet);
                        }
                        else if (setIndex === b2SetType.b2_awakeSet)
                        {
                            console.assert(joint.setIndex === b2SetType.b2_awakeSet);
                        }
                        else if (setIndex >= b2SetType.b2_firstSleepingSet)
                        {
                            console.assert(joint.setIndex === setIndex);
                        }

                        const jointSim = b2GetJointSim(world, joint);
                        console.assert(jointSim.jointId === jointId);
                        console.assert(jointSim.bodyIdA === joint.edges[0].bodyId);
                        console.assert(jointSim.bodyIdB === joint.edges[1].bodyId);

                        jointKey = joint.edges[edgeIndex].nextKey;
                    }
                }
            }

            // Validate contacts
            {
                const contacts = world.contactArray;
                console.assert(set.contacts.count >= 0);
                totalContactCount += set.contacts.count;

                for (let i = 0; i < set.contacts.count; ++i)
                {
                    const contactSim = set.contacts.data[i];
                    console.assert(0 <= contactSim.contactId && contactSim.contactId < contacts.length);
                    const contact = contacts[contactSim.contactId];

                    if (setIndex === b2SetType.b2_awakeSet)
                    {
                        console.assert(contactSim.manifold.pointCount === 0 ||
                            (contactSim.simFlags & b2ContactSimFlags.b2_simStartedTouching) !== 0);
                    }
                    console.assert(contact.setIndex === setIndex);
                    console.assert(contact.colorIndex === B2_NULL_INDEX);
                    console.assert(contact.localIndex === i);
                }
            }

            // Validate joints
            {
                const joints = world.jointArray;
                console.assert(set.joints.count >= 0);
                totalJointCount += set.joints.count;

                for (let i = 0; i < set.joints.count; ++i)
                {
                    const jointSim = set.joints.data[i];
                    console.assert(0 <= jointSim.jointId && jointSim.jointId < joints.length);
                    const joint = joints[jointSim.jointId];
                    console.assert(joint.setIndex === setIndex);
                    console.assert(joint.colorIndex === B2_NULL_INDEX);
                    console.assert(joint.localIndex === i);
                }
            }

            // Validate islands
            {
                const islands = world.islandArray;
                console.assert(set.islands.count >= 0);
                totalIslandCount += set.islands.count;

                for (let i = 0; i < set.islands.count; ++i)
                {
                    const islandSim = set.islands.data[i];
                    console.assert(0 <= islandSim.islandId && islandSim.islandId < islands.length);
                    const island = islands[islandSim.islandId];
                    console.assert(island.setIndex === setIndex);
                    console.assert(island.localIndex === i);
                }
            }
        }
        else
        {
            console.assert(set.sims.count === 0);
            console.assert(set.contacts.count === 0);
            console.assert(set.joints.count === 0);
            console.assert(set.islands.count === 0);
            console.assert(set.states.count === 0);
        }
    }

    const setIdCount = b2GetIdCount(world.solverSetIdPool);
    console.assert(activeSetCount === setIdCount);

    const bodyIdCount = b2GetIdCount(world.bodyIdPool);
    console.assert(totalBodyCount === bodyIdCount);

    const islandIdCount = b2GetIdCount(world.islandIdPool);
    console.assert(totalIslandCount === islandIdCount);

    // Validate constraint graph
    for (let colorIndex = 0; colorIndex < b2_graphColorCount; ++colorIndex)
    {
        const color = world.constraintGraph.colors[colorIndex];

        {
            const contacts = world.contactArray;
            console.assert(color.contacts.count >= 0);
            totalContactCount += color.contacts.count;

            for (let i = 0; i < color.contacts.count; ++i)
            {
                const contactSim = color.contacts.data[i];
                b2CheckIndex(contacts, contactSim.contactId);
                const contact = contacts[contactSim.contactId];
                console.assert(contactSim.manifold.pointCount > 0 ||
                    (contactSim.simFlags & (b2ContactSimFlags.b2_simStoppedTouching | b2ContactSimFlags.b2_simDisjoint)) !== 0);
                console.assert(contact.setIndex === b2SetType.b2_awakeSet);
                console.assert(contact.colorIndex === colorIndex);
                console.assert(contact.localIndex === i);

                const bodyIdA = contact.edges[0].bodyId;
                const bodyIdB = contact.edges[1].bodyId;
                b2CheckIndex(world.bodyArray, bodyIdA);
                b2CheckIndex(world.bodyArray, bodyIdB);

                if (colorIndex < b2_overflowIndex)
                {
                    const bodyA = world.bodyArray[bodyIdA];
                    const bodyB = world.bodyArray[bodyIdB];
                    console.assert(b2GetBit(color.bodySet, bodyIdA) === (bodyA.type !== b2BodyType.b2_staticBody));
                    console.assert(b2GetBit(color.bodySet, bodyIdB) === (bodyB.type !== b2BodyType.b2_staticBody));
                }
            }
        }

        {
            const joints = world.jointArray;
            console.assert(color.joints.count >= 0);
            totalJointCount += color.joints.count;

            for (let i = 0; i < color.joints.count; ++i)
            {
                const jointSim = color.joints.data[i];
                b2CheckIndex(joints, jointSim.jointId);
                const joint = joints[jointSim.jointId];
                console.assert(joint.setIndex === b2SetType.b2_awakeSet);
                console.assert(joint.colorIndex === colorIndex);
                console.assert(joint.localIndex === i);

                const bodyIdA = joint.edges[0].bodyId;
                const bodyIdB = joint.edges[1].bodyId;
                b2CheckIndex(world.bodyArray, bodyIdA);
                b2CheckIndex(world.bodyArray, bodyIdB);

                if (colorIndex < b2_overflowIndex)
                {
                    const bodyA = world.bodyArray[bodyIdA];
                    const bodyB = world.bodyArray[bodyIdB];
                    console.assert(b2GetBit(color.bodySet, bodyIdA) === (bodyA.type !== b2BodyType.b2_staticBody));
                    console.assert(b2GetBit(color.bodySet, bodyIdB) === (bodyB.type !== b2BodyType.b2_staticBody));
                }
            }
        }
    }

    const contactIdCount = b2GetIdCount(world.contactIdPool);
    console.assert(totalContactCount === contactIdCount);
    console.assert(totalContactCount === world.broadPhase.pairSet.size, `totalContactCount ${totalContactCount} != pairSet.size ${world.broadPhase.pairSet.size}`);

    const jointIdCount = b2GetIdCount(world.jointIdPool);
    console.assert(totalJointCount === jointIdCount);
}

function b2GetBit(bitSet, bitIndex)
{
    const blockIndex = Math.floor(bitIndex / 64);

    if (blockIndex >= bitSet.blockCount)
    {
        return false;
    }

    return (bitSet.bits[blockIndex] & (BigInt(1) << BigInt(bitIndex % 64))) !== BigInt(0);
}

export function b2ValidateContacts(world)
{
    if (!b2Validation) { return; }
    
    const contactCount = world.contactArray.length;
    console.assert(contactCount >= b2GetIdCapacity(world.contactIdPool));
    let allocatedContactCount = 0;

    for (let contactIndex = 0; contactIndex < contactCount; ++contactIndex)
    {
        const contact = world.contactArray[contactIndex];

        if (contact.contactId === B2_NULL_INDEX)
        {
            continue;
        }

        console.assert(contact.contactId === contactIndex);

        allocatedContactCount += 1;

        const touching = (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0;
        const sensorTouching = (contact.flags & b2ContactFlags.b2_contactSensorTouchingFlag) !== 0;
        const isSensor = (contact.flags & b2ContactFlags.b2_contactSensorFlag) !== 0;

        console.assert(touching === false || sensorTouching === false);
        console.assert(touching === false || isSensor === false);

        const setId = contact.setIndex;

        if (setId === b2SetType.b2_awakeSet)
        {
            if (touching && isSensor === false)
            {
                console.assert(0 <= contact.colorIndex && contact.colorIndex < b2_graphColorCount);
            }
            else
            {
                console.assert(contact.colorIndex === B2_NULL_INDEX);
            }
        }
        else if (setId >= b2SetType.b2_firstSleepingSet)
        {
            console.assert(touching === true && isSensor === false);
        }
        else
        {
            console.assert(touching === false && setId === b2SetType.b2_disabledSet);
        }

        const contactSim = b2GetContactSim(world, contact);
        console.assert(contactSim.contactId === contactIndex);
        console.assert(contactSim._bodyIdA === contact.edges[0].bodyId, contact);
        console.assert(contactSim._bodyIdB === contact.edges[1].bodyId);

        const simTouching = (contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag) !== 0;

        console.assert(touching == simTouching || sensorTouching == simTouching, `failed: ${touching} or ${sensorTouching} == ${simTouching}`);
        console.assert(0 <= contactSim.manifold.pointCount && contactSim.manifold.pointCount <= 2);
    }

    const contactIdCount = b2GetIdCount(world.contactIdPool);
    console.assert(allocatedContactCount === contactIdCount);
}
