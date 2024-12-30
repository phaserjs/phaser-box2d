/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import * as bitset_h from './include/bitset_h.js';
import * as body_h from './include/body_h.js';
import * as constraint_graph_h from './include/constraint_graph_h.js';
import * as contact_solver_h from './include/contact_solver_h.js';
import * as core_h from './include/core_h.js';
import * as joint_h from './include/joint_h.js';
import * as shape_h from './include/shape_h.js';

import { B2_DEFAULT_MASK_BITS, b2Manifold, b2Sweep, b2TOIInput } from './include/collision_h.js';
import { B2_NULL_INDEX, b2_graphColorCount } from './include/core_h.js';
import {
    B2_PI,
    b2AABB,
    b2AABB_Contains,
    b2AABB_Union,
    b2IntegrateRotationOut,
    b2InvMagRot,
    b2IsValid,
    b2Length,
    b2Lerp,
    b2MulRotC,
    b2MulRotS,
    b2NLerp,
    b2Rot,
    b2RotateVector,
    b2Sub,
    b2Transform,
    b2TransformPoint,
    b2TransformPointOut,
    b2Vec2
} from './include/math_functions_h.js';
import { B2_PROXY_ID, B2_PROXY_TYPE, b2BroadPhase_EnlargeProxy, b2BufferMove } from './include/broad_phase_h.js';
import { b2AllocateStackItem, b2FreeStackItem } from './include/stack_allocator_h.js';
import { b2BodyId, b2ShapeId } from './include/id_h.js';
import { b2BodyMoveEvent, b2BodyType, b2ContactHitEvent, b2ShapeType } from './include/types_h.js';
import { b2ContactSimFlags, b2ShouldShapesCollide } from './include/contact_h.js';
import { b2DynamicTree_EnlargeProxy, b2DynamicTree_Query } from './include/dynamic_tree_h.js';
import { b2GetSweepTransform, b2MakeProxy, b2TimeOfImpact } from './include/distance_h.js';
import { b2MergeAwakeIslands, b2SplitIsland } from './include/island_h.js';
import { b2SetType, b2ValidateSolverSets, b2_maxWorkers } from './include/world_h.js';

import { b2CTZ64 } from './include/ctz_h.js';
import { b2ComputeManifold } from './contact_c.js';
import { b2TrySleepIsland } from './include/solver_set_h.js';

/**
 * @namespace Solver
 */

export const b2SolverStageType = {
    b2_stagePrepareJoints: 0,
    b2_stagePrepareContacts: 1,
    b2_stageIntegrateVelocities: 2,
    b2_stageWarmStart: 3,
    b2_stageSolve: 4,
    b2_stageIntegratePositions: 5,
    b2_stageRelax: 6,
    b2_stageRestitution: 7,
    b2_stageStoreImpulses: 8
};

export const b2SolverBlockType = {
    b2_bodyBlock: 0,
    b2_jointBlock: 1,
    b2_contactBlock: 2,
    b2_graphJointBlock: 3,
    b2_graphContactBlock: 4
};

export class b2SolverBlock
{
    constructor()
    {
        this.startIndex = 0;
        this.count = 0;
        this.blockType = 0;
        this.syncIndex = 0;
        
    }
}

export class b2SolverStage
{
    constructor()
    {
        this.type = 0;
        this.blocks = null;
        this.blockCount = 0;
        this.colorIndex = 0;
        this.completionCount = 0;
        
    }
}

export class b2WorkerContext
{
    constructor()
    {
        this.context = new b2StepContext();
        this.workerIndex = 0;
        this.userTask = null;
        
    }
}

export class b2Softness
{
    constructor(biasRate = 0, massScale = 0, impulseScale = 0)
    {
        this.biasRate = biasRate;
        this.massScale = massScale;
        this.impulseScale = impulseScale;
    }

    clone()
    {
        return new b2Softness(this.biasRate, this.massScale, this.impulseScale);
    }
}

export class b2StepContext
{
    constructor()
    {
        this.dt = 0;
        this.inv_dt = 0;
        this.h = 0;
        this.inv_h = 0;
        this.subStepCount = 0;
        this.jointSoftness = new b2Softness(0, 0, 0);
        this.contactSoftness = new b2Softness(0, 0, 0);
        this.staticSoftness = new b2Softness(0, 0, 0);
        this.restitutionThreshold = 0;
        this.maxLinearVelocity = 0;
        this.world = null;
        this.graph = null;
        this.states = null;
        this.sims = null;
        this.enlargedShapes = null;
        this.enlargedShapeCount = 0;
        this.fastBodies = null;
        this.fastBodyCount = 0;
        this.bulletBodies = null;
        this.bulletBodyCount = 0;
        this.joints = null;
        this.contacts = null;
        this.simdContactConstraints = null;
        this.activeColorCount = 0;
        this.workerCount = 0;
        this.stages = null;
        this.stageCount = 0;
        this.enableWarmStarting = false;
        this.atomicSyncBits = 0;
        
    }
}

export function b2MakeSoft(hertz, zeta, h)
{
    if (hertz === 0.0)
    {
        return new b2Softness(0.0, 1.0, 0.0);
    }

    const omega = 2.0 * B2_PI * hertz;
    const a1 = 2.0 * zeta + h * omega;
    const a2 = h * omega * a1;
    const a3 = 1.0 / (1.0 + a2);

    return new b2Softness(omega / a1, a2 * a3, a3);
}


// Integrate velocities and apply damping
function b2IntegrateVelocitiesTask(startIndex, endIndex, context)
{
    const states = context.states;
    const sims = context.sims;

    const gravity = context.world.gravity;
    const h = context.h;
    const maxLinearSpeed = context.maxLinearVelocity;
    const maxAngularSpeed = core_h.B2_MAX_ROTATION * context.inv_dt;
    const maxLinearSpeedSquared = maxLinearSpeed * maxLinearSpeed;
    const maxAngularSpeedSquared = maxAngularSpeed * maxAngularSpeed;

    for (let i = startIndex; i < endIndex; ++i)
    {
        const sim = sims[i];
        const state = states[i];

        const v = state.linearVelocity;   // .clone();
        let w = state.angularVelocity;

        // Apply forces, torque, gravity, and damping
        // Apply damping.
        // Differential equation: dv/dt + c * v = 0
        // Solution: v(t) = v0 * exp(-c * t)
        // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v(t) * exp(-c * dt)
        // v2 = exp(-c * dt) * v1
        // Pade approximation:
        // v2 = v1 * 1 / (1 + c * dt)
        const linearDamping = 1.0 / (1.0 + h * sim.linearDamping);
        const angularDamping = 1.0 / (1.0 + h * sim.angularDamping);

        // const linearVelocityDelta = b2MulSV(h * sim.invMass, b2MulAdd(sim.force, sim.mass * sim.gravityScale, gravity));
        const m = sim.mass * sim.gravityScale;
        const im = h * sim.invMass;
        const lvdX = im * (sim.force.x + m * gravity.x);
        const lvdY = im * (sim.force.y + m * gravity.y);
        const angularVelocityDelta = h * sim.invInertia * sim.torque;

        // v = b2MulAdd(linearVelocityDelta, linearDamping, v);
        v.x = lvdX + linearDamping * v.x;
        v.y = lvdY + linearDamping * v.y;
        w = angularVelocityDelta + angularDamping * w;

        // Clamp to max linear speed
        // b2Dot(v, v)
        const l = v.x * v.x + v.y * v.y;

        if (l > maxLinearSpeedSquared)
        {
            const ratio = maxLinearSpeed / Math.sqrt(l);    // b2Length(v);
            // v = b2MulSV(ratio, v);
            v.x *= ratio;
            v.y *= ratio;
            sim.isSpeedCapped = true;
        }

        // Clamp to max angular speed
        if (w * w > maxAngularSpeedSquared && sim.allowFastRotation === false)
        {
            const ratio = maxAngularSpeed / Math.abs(w);
            w *= ratio;
            sim.isSpeedCapped = true;
        }

        state.linearVelocity = v;
        state.angularVelocity = w;
    }
}

//  PJB: 19/11/2024 another unused function (SIMD related?)

/**
function b2PrepareJointsTask(startIndex, endIndex, context)
{
    const joints = context.joints;

    for (let i = startIndex; i < endIndex; ++i) {
        const joint = joints[i];
        joint_h.b2PrepareJoint(joint, context);
    }
}
*/

function b2IntegratePositionsTask(startIndex, endIndex, context)
{
    const states = context.states;
    const h = context.h;

    console.assert(startIndex <= endIndex);

    for (let i = startIndex; i < endIndex; ++i)
    {
        const state = states[i];

        // state.deltaRotation = b2IntegrateRotation(state.deltaRotation, h * state.angularVelocity);
        b2IntegrateRotationOut(state.deltaRotation, h * state.angularVelocity, state.deltaRotation);

        // state.deltaPosition = b2MulAdd(state.deltaPosition, h, state.linearVelocity);
        state.deltaPosition.x = state.deltaPosition.x + h * state.linearVelocity.x;
        state.deltaPosition.y = state.deltaPosition.y + h * state.linearVelocity.y;
        console.assert(state.deltaPosition != null);
    }
}

function b2FinalizeBodiesTask(startIndex, endIndex, threadIndex, context)
{
    const stepContext = context;
    const world = stepContext.world;
    const enableSleep = world.enableSleep;
    const states = stepContext.states;
    const sims = stepContext.sims;
    const bodies = world.bodyArray;
    const timeStep = stepContext.dt;
    const invTimeStep = stepContext.inv_dt;

    const worldId = world.worldId;
    const moveEvents = world.bodyMoveEventArray;

    const islands = world.islandArray;

    const enlargedSimBitSet = world.taskContextArray[threadIndex].enlargedSimBitSet;
    const awakeIslandBitSet = world.taskContextArray[threadIndex].awakeIslandBitSet;
    const taskContext = world.taskContextArray[threadIndex];

    const enableContinuous = world.enableContinuous;

    const speculativeDistance = core_h.b2_speculativeDistance;
    const aabbMargin = core_h.b2_aabbMargin;

    console.assert(startIndex <= endIndex);

    for (let simIndex = startIndex; simIndex < endIndex; ++simIndex)
    {
        const state = states[simIndex];
        const sim = sims[simIndex];

        const v = state.linearVelocity;
        const w = state.angularVelocity;

        console.assert(b2IsValid(v.x) && b2IsValid(v.y));
        console.assert(Number.isFinite(w));
        sim.center.x += state.deltaPosition.x;
        sim.center.y += state.deltaPosition.y;

        const c = b2MulRotC(state.deltaRotation, sim.transform.q);
        const s = b2MulRotS(state.deltaRotation, sim.transform.q);
        const im = b2InvMagRot(c, s);

        // sim.transform.q.c = im * c; //b2NormalizeRot(b2MulRot(state.deltaRotation, sim.transform.q));
        // sim.transform.q.s = im * s;
        sim.transform.q = new b2Rot(im * c, im * s);        // PJB: REQUIRES a new b2Rot here to prevent breaking tests e.g. "drive"

        const maxVelocity = b2Length(v) + Math.abs(w) * sim.maxExtent;

        const maxDeltaPosition = b2Length(state.deltaPosition) + Math.abs(state.deltaRotation.s) * sim.maxExtent;

        const positionSleepFactor = 0.5;

        const sleepVelocity = Math.max(maxVelocity, positionSleepFactor * invTimeStep * maxDeltaPosition);

        state.deltaPosition.x = 0;  // new b2Vec2(0, 0);
        state.deltaPosition.y = 0;
        state.deltaRotation.c = 1;  // new b2Rot(1, 0);
        state.deltaRotation.s = 0;

        sim.transform.p.x = sim.center.x - (sim.transform.q.c * sim.localCenter.x - sim.transform.q.s * sim.localCenter.y);  // b2Sub(sim.center, b2RotateVector(sim.transform.q, sim.localCenter));
        sim.transform.p.y = sim.center.y - (sim.transform.q.s * sim.localCenter.x + sim.transform.q.c * sim.localCenter.y);

        const body = bodies[sim.bodyId];
        body.bodyMoveIndex = simIndex;
        moveEvents[simIndex].transform = sim.transform;
        moveEvents[simIndex].bodyId = new b2BodyId(sim.bodyId + 1, worldId, body.revision);   // { id: sim.bodyId + 1, worldId: worldId, revision: body.revision };
        moveEvents[simIndex].userData = body.userData;
        moveEvents[simIndex].fellAsleep = false;

        sim.force.x = 0;    // new b2Vec2(0, 0);
        sim.force.y = 0;
        sim.torque = 0.0;

        body.isSpeedCapped = sim.isSpeedCapped;
        sim.isSpeedCapped = false;

        sim.isFast = false;

        if (enableSleep === false || body.enableSleep === false || sleepVelocity > body.sleepThreshold)
        {
            body.sleepTime = 0.0;

            const safetyFactor = 0.5;

            if (body.type === b2BodyType.b2_dynamicBody && enableContinuous && maxVelocity * timeStep > safetyFactor * sim.minExtent)
            {
                if (sim.isBullet)
                {
                    stepContext.bulletBodyCount++;
                    stepContext.bulletBodies[stepContext.bulletBodyCount - 1] = simIndex;
                }
                else
                {
                    stepContext.fastBodyCount++;
                    stepContext.fastBodies[stepContext.fastBodyCount - 1] = simIndex;
                }

                sim.isFast = true;
            }
            else
            {
                sim.center0X = sim.center.x;
                sim.center0Y = sim.center.y;
                sim.rotation0.x = sim.transform.q.x;
                sim.rotation0.y = sim.transform.q.y;
            }
        }
        else
        {
            // console.warn("sleeping " + body.setIndex + " " + body.id);
            sim.center0X = sim.center.x;
            sim.center0Y = sim.center.y;
            sim.rotation0.x = sim.transform.q.x;
            sim.rotation0.y = sim.transform.q.y;
            body.sleepTime += timeStep;
        }

        // b2CheckIndex(islands, body.islandId);
        const island = islands[body.islandId];

        if (body.sleepTime < core_h.b2_timeToSleep)
        {
            const islandIndex = island.localIndex;
            bitset_h.b2SetBit(awakeIslandBitSet, islandIndex);
        }
        else if (island.constraintRemoveCount > 0)
        {
            if (body.sleepTime > taskContext.splitSleepTime)
            {
                taskContext.splitIslandId = body.islandId;
                taskContext.splitSleepTime = body.sleepTime;
            }
        }

        const transform = sim.transform;
        const isFast = sim.isFast;
        let shapeId = body.headShapeId;

        while (shapeId !== core_h.B2_NULL_INDEX)
        {
            const shape = world.shapeArray[shapeId];

            console.assert(shape.isFast === false);

            if (isFast)
            {
                shape.isFast = true;
                bitset_h.b2SetBit(enlargedSimBitSet, simIndex);
            }
            else
            {
                const aabb = shape_h.b2ComputeShapeAABB(shape, transform);
                aabb.lowerBoundX -= speculativeDistance;
                aabb.lowerBoundY -= speculativeDistance;
                aabb.upperBoundX += speculativeDistance;
                aabb.upperBoundY += speculativeDistance;
                shape.aabb = aabb;

                console.assert(shape.enlargedAABB === false);

                if (b2AABB_Contains(shape.fatAABB, aabb) === false)
                {
                    const fatAABB = new b2AABB(aabb.lowerBoundX - aabbMargin, aabb.lowerBoundY - aabbMargin,
                        aabb.upperBoundX + aabbMargin, aabb.upperBoundY + aabbMargin);
                    shape.fatAABB = fatAABB;

                    shape.enlargedAABB = true;

                    bitset_h.b2SetBit(enlargedSimBitSet, simIndex);
                }
            }

            shapeId = shape.nextShapeId;
        }
    }
}

function b2ExecuteBlock(stage, context, block)
{
    const stageType = stage.type;
    const startIndex = block.startIndex;
    const endIndex = startIndex + block.count;

    if (stageType === b2SolverStageType.b2_stageIntegrateVelocities)
    {
        b2IntegrateVelocitiesTask(startIndex, endIndex, context);
    }
    else if (stageType === b2SolverStageType.b2_stageIntegratePositions)
    {
        b2IntegratePositionsTask(startIndex, endIndex, context);
    }
    else
    {
        /*
        console.log("block stage " + [
            "b2_stagePrepareJoints: 0",
            "b2_stagePrepareContacts: 1",
            "b2_stageIntegrateVelocities: 2",
            "b2_stageWarmStart: 3",
            "b2_stageSolve: 4",
            "b2_stageIntegratePositions: 5",
            "b2_stageRelax: 6",
            "b2_stageRestitution: 7",
            "b2_stageStoreImpulses: 8"
        ][stageType]);
        */

        console.warn("unsupported stage type: " + stageType);
    }

    // PJB: many of these stages handle SIMD data preparation or processing, all of which has been removed for the JS translation
    // RD: Swapped for faster if/else block above
}

function b2ExecuteMainStage(stage, context)
{
    // PJB: we're not multi-threading for the JS, we simply iterate the work blocks (0..4 seems typical)
    const blockCount = stage.blockCount;

    for (let i = 0; i < blockCount; i++)
    {
        b2ExecuteBlock(stage, context, stage.blocks[i]);
    }
}

export function b2SolverTask(workerContext)
{
    const workerIndex = workerContext.workerIndex;
    const context = workerContext.context;
    const activeColorCount = context.activeColorCount;
    const stages = context.stages;

    if (workerIndex === 0)
    {
        // let bodySyncIndex = 1; // un-used except in debugging
        let stageIndex = 0;

        b2ExecuteMainStage(stages[stageIndex], context);
        stageIndex += 1;

        //  unused except for debugging
        // let contactSyncIndex = 1;

        // syncBits = (contactSyncIndex << 16) | stageIndex;
        b2ExecuteMainStage(stages[stageIndex], context);
        stageIndex += 1;

        // contactSyncIndex += 1;

        //  unused except for debugging
        // let graphSyncIndex = 1;

        joint_h.b2PrepareOverflowJoints(context);
        contact_solver_h.b2PrepareOverflowContacts(context);

        const subStepCount = context.subStepCount;

        for (let i = 0; i < subStepCount; ++i)
        {
            let iterStageIndex = stageIndex;

            // syncBits = (bodySyncIndex << 16) | iterStageIndex;
            b2ExecuteMainStage(stages[iterStageIndex], context);
            iterStageIndex += 1;

            // bodySyncIndex += 1;

            joint_h.b2WarmStartOverflowJoints(context);
            contact_solver_h.b2WarmStartOverflowContacts(context);

            for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex)
            {
                // syncBits = (graphSyncIndex << 16) | iterStageIndex;
                b2ExecuteMainStage(stages[iterStageIndex], context);
                iterStageIndex += 1;
            }

            // graphSyncIndex += 1;

            let useBias = true;
            joint_h.b2SolveOverflowJoints(context, useBias);
            contact_solver_h.b2SolveOverflowContacts(context, useBias);

            for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex)
            {
                // syncBits = (graphSyncIndex << 16) | iterStageIndex;
                b2ExecuteMainStage(stages[iterStageIndex], context);
                iterStageIndex += 1;
            }

            // graphSyncIndex += 1;

            // syncBits = (bodySyncIndex << 16) | iterStageIndex;
            b2ExecuteMainStage(stages[iterStageIndex], context);
            iterStageIndex += 1;

            // bodySyncIndex += 1;

            useBias = false;
            joint_h.b2SolveOverflowJoints(context, useBias);
            contact_solver_h.b2SolveOverflowContacts(context, useBias);

            for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex)
            {
                // syncBits = (graphSyncIndex << 16) | iterStageIndex;
                b2ExecuteMainStage(stages[iterStageIndex], context);
                iterStageIndex += 1;
            }

            // graphSyncIndex += 1;
        }

        stageIndex += 1 + activeColorCount + activeColorCount + 1 + activeColorCount;

        {
            contact_solver_h.b2ApplyOverflowRestitution(context);

            let iterStageIndex = stageIndex;

            for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex)
            {
                // syncBits = (graphSyncIndex << 16) | iterStageIndex;
                b2ExecuteMainStage(stages[iterStageIndex], context);
                iterStageIndex += 1;
            }
            stageIndex += activeColorCount;
        }

        contact_solver_h.b2StoreOverflowImpulses(context);

        // syncBits = (contactSyncIndex << 16) | stageIndex;
        console.assert( stages[stageIndex].type == b2SolverStageType.b2_stageStoreImpulses );
        b2ExecuteMainStage(stages[stageIndex], context);

        context.atomicSyncBits = Number.MAX_SAFE_INTEGER;
        console.assert( stageIndex + 1 == context.stageCount );

        return;
    }

    console.error("b2SolverTask workerIndex = " + workerIndex);
}

const constSweep = new b2Sweep(new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Rot(), new b2Rot());

export function b2ContinuousQueryCallback(proxyId, shapeId, context)
{
    // B2_MAYBE_UNUSED(proxyId);

    const continuousContext = context;
    const fastShape = continuousContext.fastShape;
    const fastBodySim = continuousContext.fastBodySim;

    // skip same shape
    if (shapeId === fastShape.id)
    {
        return true;
    }

    const world = continuousContext.world;

    // b2CheckId(world.shapeArray, shapeId);
    const shape = world.shapeArray[shapeId];

    // skip same body
    if (shape.bodyId === fastShape.bodyId)
    {
        return true;
    }

    // skip sensors
    if (shape.isSensor === true)
    {
        return true;
    }

    // skip filtered shapes
    let canCollide = b2ShouldShapesCollide(fastShape.filter, shape.filter);

    if (canCollide === false)
    {
        return true;
    }

    // b2CheckIndex(world.bodyArray, shape.bodyId);
    const body = world.bodyArray[shape.bodyId];
    const bodySim = body_h.b2GetBodySim(world, body);
    console.assert(body.type === b2BodyType.b2_staticBody || fastBodySim.isBullet);

    if (bodySim.isBullet)
    {
        return true;
    }

    // b2CheckIndex(world.bodyArray, fastBodySim.bodyId);
    const fastBody = world.bodyArray[fastBodySim.bodyId];
    canCollide = body_h.b2ShouldBodiesCollide(world, fastBody, body);

    if (canCollide === false)
    {
        return true;
    }

    const customFilterFcn = world.customFilterFcn;

    if (customFilterFcn != null)
    {
        const idA = new b2ShapeId(shape.id + 1, world.worldId, shape.revision);
        const idB = new b2ShapeId(fastShape.id + 1, world.worldId, fastShape.revision);
        canCollide = customFilterFcn(idA, idB, world.customFilterContext);

        if (canCollide === false)
        {
            return true;
        }
    }

    if (shape.type === b2ShapeType.b2_chainSegmentShape)
    {
        const transform = bodySim.transform;
        const p1 = b2TransformPoint(transform, shape.chainSegment.segment.point1);
        const p2 = b2TransformPoint(transform, shape.chainSegment.segment.point2);

        // let e = b2Sub(p2, p1);
        const eX = p2.x - p1.x;
        const eY = p2.y - p1.y;
        const c1X = continuousContext.centroid1X;
        const c1Y = continuousContext.centroid1Y;
        const c2X = continuousContext.centroid2X;
        const c2Y = continuousContext.centroid2Y;

        // let offset1 = b2Cross(b2Sub(c1, p1), e);
        let dx = c1X - p1.x;
        let dy = c1Y - p1.y;
        const offset1 = dx * eY - dy * eX;

        // let offset2 = b2Cross(b2Sub(c2, p1), e);
        dx = c2X - p1.x;
        dy = c2Y - p1.y;
        const offset2 = dx * eY - dy * eX;

        if (offset1 < 0.0 || offset2 > 0.0)
        {
            return true;
        }
    }

    const input = new b2TOIInput();
    input.proxyA = shape_h.b2MakeShapeDistanceProxy(shape);
    input.proxyB = shape_h.b2MakeShapeDistanceProxy(fastShape);
    input.sweepA = body_h.b2MakeSweep(bodySim, constSweep);
    input.sweepB = continuousContext.sweep;
    input.tMax = continuousContext.fraction;

    let hitFraction = continuousContext.fraction;

    let didHit = false;
    let output = b2TimeOfImpact(input);

    if (0.0 < output.t && output.t < continuousContext.fraction)
    {
        hitFraction = output.t;
        didHit = true;
    }
    else if (0.0 === output.t)
    {
        const centroid = shape_h.b2GetShapeCentroid(fastShape);
        input.proxyB = b2MakeProxy([ centroid ], 1, core_h.b2_speculativeDistance);
        output = b2TimeOfImpact(input);

        if (0.0 < output.t && output.t < continuousContext.fraction)
        {
            hitFraction = output.t;
            didHit = true;
        }
    }

    if (didHit && (shape.enablePreSolveEvents || fastShape.enablePreSolveEvents))
    {
        // Pre-solve is expensive because I need to compute a temporary manifold
        const transformA = b2GetSweepTransform( input.sweepA, hitFraction );
        const transformB = b2GetSweepTransform( input.sweepB, hitFraction );
        const manifold = new b2Manifold();
        b2ComputeManifold( shape, transformA, fastShape, transformB, manifold );
        const shapeIdA = new b2ShapeId( shape.id + 1, world.worldId, shape.revision );
        const shapeIdB = new b2ShapeId( fastShape.id + 1, world.worldId, fastShape.revision );

        // The user may modify the temporary manifold here but it doesn't matter. They will be able to
        // modify the real manifold in the discrete solver.
        didHit = world.preSolveFcn( shapeIdA, shapeIdB, manifold, world.preSolveContext );
    }

    if (didHit)
    {
        continuousContext.fraction = hitFraction;
    }

    return true;
}

class b2ContinuousContext
{
    constructor()
    {
        this.world = null;
        this.fastBodySim = null;
        this.fastShape = null;
        this.centroid1X = 0;
        this.centroid1Y = 0;
        this.centroid2X = 0;
        this.centroid2Y = 0;
        this.sweep = null;
        this.fraction = 0.0;
    }
}

const p = new b2Vec2();
const p1 = new b2Vec2();
const constSweep2 = new b2Sweep(new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Rot(), new b2Rot());

// Continuous collision of dynamic versus static
export function b2SolveContinuous(world, bodySimIndex)
{
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    console.assert(0 <= bodySimIndex && bodySimIndex < awakeSet.sims.count);
    const fastBodySim = awakeSet.sims.data[bodySimIndex];
    console.assert(fastBodySim.isFast);

    const shapes = world.shapeArray;

    const sweep = body_h.b2MakeSweep(fastBodySim, constSweep2);

    // let xf1 = new b2Transform(b2Sub(sweep.c1, b2RotateVector(sweep.q1, sweep.localCenter)), sweep.q1);
    p.x = sweep.c1.x - (sweep.q1.c * sweep.localCenter.x - sweep.q1.s * sweep.localCenter.y);
    p.y = sweep.c1.y - (sweep.q1.s * sweep.localCenter.x + sweep.q1.c * sweep.localCenter.y);
    const xf1 = new b2Transform(p, sweep.q1);

    // let xf2 = new b2Transform(b2Sub(sweep.c2, b2RotateVector(sweep.q2, sweep.localCenter)), sweep.q2);
    p1.x = sweep.c2.x - (sweep.q2.c * sweep.localCenter.x - sweep.q2.s * sweep.localCenter.y);
    p1.y = sweep.c2.y - (sweep.q2.s * sweep.localCenter.x + sweep.q2.c * sweep.localCenter.y);
    const xf2 = new b2Transform(p1, sweep.q2);

    const staticTree = world.broadPhase.trees[b2BodyType.b2_staticBody];
    const kinematicTree = world.broadPhase.trees[b2BodyType.b2_kinematicBody];
    const dynamicTree = world.broadPhase.trees[b2BodyType.b2_dynamicBody];
    const fastBody = world.bodyArray[fastBodySim.bodyId];

    const context = new b2ContinuousContext();
    context.world = world;
    context.sweep = sweep;
    context.fastBodySim = fastBodySim;
    context.fraction = 1.0;

    const isBullet = fastBodySim.isBullet;

    let shapeId = fastBody.headShapeId;

    while (shapeId != B2_NULL_INDEX)
    {
        // b2CheckId(shapes, shapeId);
        const fastShape = shapes[shapeId];
        console.assert(fastShape.isFast == true);

        shapeId = fastShape.nextShapeId;

        // Clear flag (keep set on body)
        fastShape.isFast = false;

        context.fastShape = fastShape;

        // context.centroid1 = b2TransformPoint(xf1, fastShape.localCentroid);
        b2TransformPointOut(xf1, fastShape.localCentroid, p);
        context.centroid1X = p.x;
        context.centroid1Y = p.y;

        // context.centroid2 = b2TransformPoint(xf2, fastShape.localCentroid);
        b2TransformPointOut(xf2, fastShape.localCentroid, p);
        context.centroid2X = p.x;
        context.centroid2Y = p.y;

        const box1 = fastShape.aabb;
        const box2 = shape_h.b2ComputeShapeAABB(fastShape, xf2);
        const box = b2AABB_Union(box1, box2);

        // Store this for later
        fastShape.aabb = box2;

        // No continuous collision for sensors
        if (fastShape.isSensor)
        {
            continue;
        }

        b2DynamicTree_Query(staticTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);

        if (isBullet)
        {
            b2DynamicTree_Query(kinematicTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);
            b2DynamicTree_Query(dynamicTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);
        }
    }

    const speculativeDistance = core_h.b2_speculativeDistance;
    const aabbMargin = core_h.b2_aabbMargin;

    if (context.fraction < 1.0)
    {
        // Handle time of impact event
        const q = b2NLerp(sweep.q1, sweep.q2, context.fraction);
        const c = b2Lerp(sweep.c1, sweep.c2, context.fraction);
        const origin = b2Sub(c, b2RotateVector(q, sweep.localCenter));

        // Advance body
        const transform = new b2Transform(origin, q);
        fastBodySim.transform = transform;
        fastBodySim.center = c;
        fastBodySim.rotation0 = q;
        fastBodySim.center0X = c.x;
        fastBodySim.center0Y = c.y;

        // Prepare AABBs for broad-phase
        shapeId = fastBody.headShapeId;

        while (shapeId != B2_NULL_INDEX)
        {
            const shape = shapes[shapeId];

            // Must recompute aabb at the interpolated transform
            const aabb = shape_h.b2ComputeShapeAABB(shape, transform);
            aabb.lowerBoundX -= speculativeDistance;
            aabb.lowerBoundY -= speculativeDistance;
            aabb.upperBoundX += speculativeDistance;
            aabb.upperBoundY += speculativeDistance;
            shape.aabb = aabb;

            if (!b2AABB_Contains(shape.fatAABB, aabb))
            {
                const fatAABB = new b2AABB(aabb.lowerBoundX - aabbMargin, aabb.lowerBoundY - aabbMargin,
                    aabb.upperBoundX + aabbMargin, aabb.upperBoundY + aabbMargin);
                shape.fatAABB = fatAABB;

                shape.enlargedAABB = true;
                fastBodySim.enlargeAABB = true;
            }

            shapeId = shape.nextShapeId;
        }
    }
    else
    {
        // No time of impact event

        // Advance body
        fastBodySim.rotation0 = fastBodySim.transform.q;
        fastBodySim.center0X = fastBodySim.center.x;
        fastBodySim.center0Y = fastBodySim.center.y;

        // Prepare AABBs for broad-phase
        shapeId = fastBody.headShapeId;

        while (shapeId != B2_NULL_INDEX)
        {
            const shape = shapes[shapeId];

            // shape.aabb is still valid

            if (!b2AABB_Contains(shape.fatAABB, shape.aabb))
            {
                const fatAABB = new b2AABB(shape.aabb.lowerBoundX - aabbMargin, shape.aabb.lowerBoundY - aabbMargin,
                    shape.aabb.upperBoundX + aabbMargin, shape.aabb.upperBoundY + aabbMargin);
                shape.fatAABB = fatAABB;

                shape.enlargedAABB = true;
                fastBodySim.enlargeAABB = true;
            }

            shapeId = shape.nextShapeId;
        }
    }
}

export function b2FastBodyTask(startIndex, endIndex, taskContext)
{
    // B2_MAYBE_UNUSED(threadIndex);

    const stepContext = taskContext;

    console.assert(startIndex <= endIndex);

    for (let i = startIndex; i < endIndex; ++i)
    {
        const simIndex = stepContext.fastBodies[i];
        b2SolveContinuous(stepContext.world, simIndex);
    }
}

export function b2BulletBodyTask(startIndex, endIndex, taskContext)
{
    // B2_MAYBE_UNUSED(threadIndex);

    const stepContext = taskContext;

    console.assert(startIndex <= endIndex);

    for (let i = startIndex; i < endIndex; ++i)
    {
        const simIndex = stepContext.bulletBodies[i];
        b2SolveContinuous(stepContext.world, simIndex);
    }
}

// Solve with graph coloring
export function b2Solve(world, stepContext)
{
    // const timer = b2CreateTimer();

    world.stepIndex += 1;

    b2MergeAwakeIslands(world);

    // world.profile.buildIslands = b2GetMillisecondsAndReset(timer);

    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    const awakeBodyCount = awakeSet.sims.count;

    if (awakeBodyCount === 0)
    {
        // b2ValidateNoEnlarged(world.broadPhase);
        return;
    }

    // Prepare buffers for continuous collision (fast bodies)
    stepContext.fastBodyCount = 0;
    stepContext.fastBodies = b2AllocateStackItem(world.stackAllocator, awakeBodyCount, "fast bodies");
    stepContext.bulletBodyCount = 0;
    stepContext.bulletBodies = b2AllocateStackItem(world.stackAllocator, awakeBodyCount, "bullet bodies");

    // Solve constraints using graph coloring
    {
        const graph = world.constraintGraph;
        const colors = graph.colors;

        stepContext.sims = awakeSet.sims.data;
        stepContext.states = awakeSet.states.data;

        // count contacts, joints, and colors
        // let awakeContactCount = 0;
        let awakeJointCount = 0;
        let activeColorCount = 0;

        for (let i = 0; i < b2_graphColorCount - 1; ++i)
        {
            const perColorContactCount = colors[i].contacts.count;
            const perColorJointCount = colors[i].joints.count;
            const occupancyCount = perColorContactCount + perColorJointCount;
            activeColorCount += occupancyCount > 0 ? 1 : 0;

            // awakeContactCount += perColorContactCount;
            awakeJointCount += perColorJointCount;
        }

        // Deal with void**
        {
            const bodyMoveEventArray = world.bodyMoveEventArray;

            // b2Array_Resize(bodyMoveEventArray, awakeBodyCount);
            // if (bodyMoveEventArray.length < awakeBodyCount) {
            while (bodyMoveEventArray.length < awakeBodyCount)
            {
                bodyMoveEventArray.push(new b2BodyMoveEvent());
            }

            // }
        }

        const workerCount = world.workerCount;
        const blocksPerWorker = 4;
        const maxBlockCount = blocksPerWorker * workerCount;

        // PJB TODO: is ANY of this parallel stuff used in the JS? It should all be handled by 'overflow' cases...

        // Configure blocks for tasks that parallel-for bodies
        let bodyBlockSize = 1 << 5;
        let bodyBlockCount;

        if (awakeBodyCount > bodyBlockSize * maxBlockCount)
        {
            // Too many blocks, increase block size
            bodyBlockSize = Math.floor(awakeBodyCount / maxBlockCount);
            bodyBlockCount = maxBlockCount;
        }
        else
        {
            bodyBlockCount = Math.floor((awakeBodyCount - 1) >> 5) + 1;
        }

        // Configure blocks for tasks parallel-for each active graph color
        // The blocks are a mix of SIMD contact blocks and joint blocks

        const colorContactCounts = new Array(b2_graphColorCount);
        const colorContactBlockSizes = new Array(b2_graphColorCount);
        const colorContactBlockCounts = new Array(b2_graphColorCount);

        const colorJointCounts = new Array(b2_graphColorCount);
        const colorJointBlockSizes = new Array(b2_graphColorCount);
        const colorJointBlockCounts = new Array(b2_graphColorCount);

        const graphBlockCount = 0;
        const simdContactCount = 0;

        const overflowContactCount = colors[constraint_graph_h.b2_overflowIndex].contacts.count;
        const overflowContactConstraints = b2AllocateStackItem(
            world.stackAllocator,
            overflowContactCount,
            "overflow contact constraint",
            () => { return new contact_solver_h.b2ContactConstraint(); }
        );
       
        graph.colors[constraint_graph_h.b2_overflowIndex].overflowConstraints = overflowContactConstraints;

        // Define work blocks for preparing contacts and storing contact impulses
        let contactBlockSize = blocksPerWorker;
        let contactBlockCount = simdContactCount > 0 ? Math.floor((simdContactCount - 1) >> 2) + 1 : 0;

        if (simdContactCount > contactBlockSize * maxBlockCount)
        {
            // Too many blocks, increase block size
            contactBlockSize = Math.floor(simdContactCount / maxBlockCount);
            contactBlockCount = maxBlockCount;
        }

        // Define work blocks for preparing joints
        let jointBlockSize = blocksPerWorker;
        let jointBlockCount = awakeJointCount > 0 ? Math.floor((awakeJointCount - 1) >> 2) + 1 : 0;

        if (awakeJointCount > jointBlockSize * maxBlockCount)
        {
            // Too many blocks, increase block size
            jointBlockSize = Math.floor(awakeJointCount / maxBlockCount);
            jointBlockCount = maxBlockCount;
        }
       
        let stageCount = 0;

        // b2_stagePrepareJoints
        stageCount += 1;

        // b2_stagePrepareContacts
        stageCount += 1;

        // b2_stageIntegrateVelocities
        stageCount += 1;

        // b2_stageWarmStart
        stageCount += activeColorCount;

        // b2_stageSolve
        stageCount += activeColorCount;

        // b2_stageIntegratePositions
        stageCount += 1;

        // b2_stageRelax
        stageCount += activeColorCount;

        // b2_stageRestitution
        stageCount += activeColorCount;

        // b2_stageStoreImpulses
        stageCount += 1;

        const stages = Array.from({ length: stageCount }, () => new b2SolverStage());   // b2AllocateStackItem(world.stackAllocator, stageCount, "stages", () => { return new b2SolverStage(); });
        const bodyBlocks = b2AllocateStackItem(world.stackAllocator, bodyBlockCount, "body blocks");
        const contactBlocks = b2AllocateStackItem(world.stackAllocator, contactBlockCount, "contact blocks");
        const jointBlocks = b2AllocateStackItem(world.stackAllocator, jointBlockCount, "joint blocks");
        const graphBlocks = b2AllocateStackItem(world.stackAllocator, graphBlockCount, "graph blocks");

        // Split an awake island. This modifies:
        // - stack allocator
        // - world island array and solver set
        // - island indices on bodies, contacts, and joints
        if (world.splitIslandId != B2_NULL_INDEX)
        {
            b2SplitIsland(world, world.splitIslandId);
        }

        // Prepare body work blocks
        for (let i = 0; i < bodyBlockCount; ++i)
        {
            const block = new b2SolverBlock();
            block.startIndex = i * bodyBlockSize;
            block.count = bodyBlockSize;
            block.blockType = b2SolverBlockType.b2_bodyBlock;
            block.syncIndex = 0;
            bodyBlocks[i] = block;
        }
        bodyBlocks[bodyBlockCount - 1].count = awakeBodyCount - (bodyBlockCount - 1) * bodyBlockSize;

        // Prepare joint work blocks
        for (let i = 0; i < jointBlockCount; ++i)
        {
            const block = new b2SolverBlock();
            block.startIndex = i * jointBlockSize;
            block.count = jointBlockSize;
            block.blockType = b2SolverBlockType.b2_jointBlock;
            block.syncIndex = 0;
            jointBlocks[i] = block;
        }

        if (jointBlockCount > 0)
        {
            jointBlocks[jointBlockCount - 1].count = awakeJointCount - (jointBlockCount - 1) * jointBlockSize;
        }

        // Prepare contact work blocks
        for (let i = 0; i < contactBlockCount; ++i)
        {
            const block = new b2SolverBlock();
            block.startIndex = i * contactBlockSize;
            block.count = contactBlockSize;
            block.blockType = b2SolverBlockType.b2_contactBlock;
            block.syncIndex = 0;
            contactBlocks[i] = block;
        }

        if (contactBlockCount > 0)
        {
            contactBlocks[contactBlockCount - 1].count = simdContactCount - (contactBlockCount - 1) * contactBlockSize;
        }

        // Prepare graph work blocks
        const graphColorBlocks = new Array(b2_graphColorCount);
        let baseGraphBlock = 0; // Index into graphBlocks

        for (let i = 0; i < activeColorCount; ++i)
        {
            graphColorBlocks[i] = baseGraphBlock;
            const colorJointBlockCount = colorJointBlockCounts[i];
            const colorJointBlockSize = colorJointBlockSizes[i];

            for (let j = 0; j < colorJointBlockCount; ++j)
            {
                const block = new b2SolverBlock();
                block.startIndex = j * colorJointBlockSize;
                block.count = colorJointBlockSize;
                block.blockType = b2SolverBlockType.b2_graphJointBlock;
                block.syncIndex = 0;
                graphBlocks[baseGraphBlock + j] = block;
            }

            if (colorJointBlockCount > 0)
            {
                graphBlocks[baseGraphBlock + colorJointBlockCount - 1].count =
                    colorJointCounts[i] - (colorJointBlockCount - 1) * colorJointBlockSize;
                baseGraphBlock += colorJointBlockCount;
            }
            const colorContactBlockCount = colorContactBlockCounts[i];
            const colorContactBlockSize = colorContactBlockSizes[i];

            for (let j = 0; j < colorContactBlockCount; ++j)
            {
                const block = new b2SolverBlock();
                block.startIndex = j * colorContactBlockSize;
                block.count = colorContactBlockSize;
                block.blockType = b2SolverBlockType.b2_graphContactBlock;
                block.syncIndex = 0;
                graphBlocks[baseGraphBlock + j] = block;
            }

            if (colorContactBlockCount > 0)
            {
                graphBlocks[baseGraphBlock + colorContactBlockCount - 1].count =
                    colorContactCounts[i] - (colorContactBlockCount - 1) * colorContactBlockSize;
                baseGraphBlock += colorContactBlockCount;
            }
        }
        const blockDiff = baseGraphBlock;
        console.assert(blockDiff === graphBlockCount, `Block count mismatch: ${blockDiff} !== ${graphBlockCount}`);

        // modified stage builder
        let si = 0;

        // Helper function to set stage properties
        const setStageProperties = (stage, type, blocks, blockCount, colorIndex = -1) =>
        {
            stage.type = type;
            stage.blocks = blocks;
            stage.blockCount = blockCount;
            stage.colorIndex = colorIndex;
            stage.completionCount = 0;
        };
        
        // Prepare joints
        setStageProperties(stages[si++], b2SolverStageType.b2_stagePrepareJoints, jointBlocks, jointBlockCount);

        // Prepare contacts
        setStageProperties(stages[si++], b2SolverStageType.b2_stagePrepareContacts, contactBlocks, contactBlockCount);

        // Integrate velocities
        setStageProperties(stages[si++], b2SolverStageType.b2_stageIntegrateVelocities, bodyBlocks, bodyBlockCount);

        // Warm start
        /*
        console.log("activeColorCount " + activeColorCount);
        for (let i = 0; i < activeColorCount; ++i) {
            setStageProperties(
                stages[si++],
                b2SolverStageType.b2_stageWarmStart,
                graphBlocks.slice(graphColorBlocks[i], graphColorBlocks[i] + colorJointBlockCounts[i] + colorContactBlockCounts[i]),
                colorJointBlockCounts[i] + colorContactBlockCounts[i],
                activeColorIndices[i]
            );
        }
        */
        
        // Solve graph
        /*
        for (let i = 0; i < activeColorCount; ++i) {
            setStageProperties(
                stages[si++],
                b2SolverStageType.b2_stageSolve,
                graphBlocks.slice(graphColorBlocks[i], graphColorBlocks[i] + colorJointBlockCounts[i] + colorContactBlockCounts[i]),
                colorJointBlockCounts[i] + colorContactBlockCounts[i],
                activeColorIndices[i]
            );
        }
        */
        
        // Integrate positions
        setStageProperties(stages[si++], b2SolverStageType.b2_stageIntegratePositions, bodyBlocks, bodyBlockCount);
        
        // Relax constraints
        /*
        for (let i = 0; i < activeColorCount; ++i) {
            setStageProperties(
                stages[si++],
                b2SolverStageType.b2_stageRelax,
                graphBlocks.slice(graphColorBlocks[i], graphColorBlocks[i] + colorJointBlockCounts[i] + colorContactBlockCounts[i]),
                colorJointBlockCounts[i] + colorContactBlockCounts[i],
                activeColorIndices[i]
            );
        }
        */
        
        // Restitution
        // Note: joint blocks mixed in, could have joint limit restitution
        /*
        for (let i = 0; i < activeColorCount; ++i) {
            setStageProperties(
                stages[si++],
                b2SolverStageType.b2_stageRestitution,
                graphBlocks.slice(graphColorBlocks[i], graphColorBlocks[i] + colorJointBlockCounts[i] + colorContactBlockCounts[i]),
                colorJointBlockCounts[i] + colorContactBlockCounts[i],
                activeColorIndices[i]
            );
        }
        */
        
        // Store impulses
        setStageProperties(stages[si++], b2SolverStageType.b2_stageStoreImpulses, contactBlocks, contactBlockCount);
        
        console.assert(si === stageCount, "Stage count mismatch");
            
        console.assert(workerCount <= b2_maxWorkers);

        stepContext.graph = graph;
        stepContext.joints = null;  // joints;
        stepContext.contacts = null;    // contacts;
        stepContext.simdContactConstraints = null;  // simdContactConstraints;
        stepContext.activeColorCount = activeColorCount;
        stepContext.workerCount = workerCount;
        stepContext.stageCount = stageCount;
        stepContext.stages = stages;

        {
            const workerContext = new b2WorkerContext();
            workerContext.context = stepContext;
            workerContext.workerIndex = 0;
            b2SolverTask(workerContext);
        }

        world.splitIslandId = B2_NULL_INDEX;

        // Prepare contact, enlarged body, and island bit sets used in body finalization.
        const awakeIslandCount = awakeSet.islands.count;

        for (let i = 0; i < world.workerCount; ++i)
        {
            const taskContext = world.taskContextArray[i];
            taskContext.enlargedSimBitSet = bitset_h.b2SetBitCountAndClear(taskContext.enlargedSimBitSet, awakeBodyCount);
            taskContext.awakeIslandBitSet = bitset_h.b2SetBitCountAndClear(taskContext.awakeIslandBitSet, awakeIslandCount);
            taskContext.splitIslandId = B2_NULL_INDEX;
            taskContext.splitSleepTime = 0.0;
        }


        // Finalize bodies. Must happen after the constraint solver and after island splitting.
        b2FinalizeBodiesTask(0, awakeBodyCount, 0, stepContext);

        b2FreeStackItem(world.stackAllocator, graphBlocks);
        b2FreeStackItem(world.stackAllocator, jointBlocks);
        b2FreeStackItem(world.stackAllocator, contactBlocks);
        b2FreeStackItem(world.stackAllocator, bodyBlocks);

        // b2FreeStackItem(world.stackAllocator, stages);
        b2FreeStackItem(world.stackAllocator, overflowContactConstraints);

        // b2FreeStackItem(world.stackAllocator, joints);
        // b2FreeStackItem(world.stackAllocator, contacts);
    }

    // Report hit events
    // todo perhaps optimize this with a bitset
    {
        console.assert(world.contactHitArray.length === 0);

        const threshold = world.hitEventThreshold;
        const colors = world.constraintGraph.colors;

        for (let i = 0; i < b2_graphColorCount; ++i)
        {
            const color = colors[i];
            const contactCount = color.contacts.count;
            const contactSims = color.contacts.data;

            for (let j = 0; j < contactCount; ++j)
            {
                const contactSim = contactSims[j];

                if ((contactSim.simFlags & b2ContactSimFlags.b2_simEnableHitEvent) === 0)
                {
                    continue;
                }

                const event = new b2ContactHitEvent();
                event.approachSpeed = threshold;
                event.shapeIdA = new b2ShapeId(0, 0, 0);
                event.shapeIdB = new b2ShapeId(0, 0, 0);

                let hit = false;
                const pointCount = contactSim.manifold.pointCount;

                for (let k = 0; k < pointCount; ++k)
                {
                    const mp = contactSim.manifold.points[k];
                    const approachSpeed = -mp.normalVelocity;

                    // Need to check max impulse because the point may be speculative and not colliding
                    if (approachSpeed > event.approachSpeed && mp.maxNormalImpulse > 0.0)
                    {
                        event.approachSpeed = approachSpeed;
                        event.pointX = mp.pointX;
                        event.pointY = mp.pointY;
                        hit = true;
                    }
                }

                if (hit === true)
                {
                    event.normalX = contactSim.manifold.normalX;
                    event.normalY = contactSim.manifold.normalY;

                    // b2CheckId(world.shapeArray, contactSim.shapeIdA);
                    // b2CheckId(world.shapeArray, contactSim.shapeIdB);
                    const shapeA = world.shapeArray[contactSim.shapeIdA];
                    const shapeB = world.shapeArray[contactSim.shapeIdB];

                    event.shapeIdA = new b2ShapeId(shapeA.id + 1, world.worldId, shapeA.revision);
                    event.shapeIdB = new b2ShapeId(shapeB.id + 1, world.worldId, shapeB.revision);

                    world.contactHitArray.push(event);
                }
            }
        }
    }

    // Gather bits for all sim bodies that have enlarged AABBs
    const simBitSet = world.taskContextArray[0].enlargedSimBitSet;

    for (let i = 1; i < world.workerCount; ++i)
    {
        bitset_h.b2InPlaceUnion(simBitSet, world.taskContextArray[i].enlargedSimBitSet);
    }

    // Enlarge broad-phase proxies and build move array
    // Apply shape AABB changes to broad-phase. This also creates the move array which must be
    // in deterministic order. I'm tracking sim bodies because the number of shape ids can be huge.
    {
        const broadPhase = world.broadPhase;
        const shapes = world.shapeArray;
        const wordCount = simBitSet.blockCount;
        const bits = simBitSet.bits;

        for (let k = 0; k < wordCount; ++k)
        {
            let word = bits[k];

            while (word !== 0n)
            {
                const ctz = b2CTZ64(word);              // 0..63
                const bodySimIndex = 64 * k + ctz;

                // cache misses
                console.assert(bodySimIndex < awakeSet.sims.count);
                const bodySim = awakeSet.sims.data[bodySimIndex];

                // b2CheckIndex(world.bodyArray, bodySim.bodyId);
                const body = world.bodyArray[bodySim.bodyId];

                let shapeId = body.headShapeId;

                while (shapeId !== B2_NULL_INDEX)
                {
                    // b2CheckId(shapes, shapeId);
                    const shape = shapes[shapeId];

                    if (shape.enlargedAABB)
                    {
                        console.assert(shape.isFast === false);

                        b2BroadPhase_EnlargeProxy(broadPhase, shape.proxyKey, shape.fatAABB);
                        shape.enlargedAABB = false;
                    }
                    else if (shape.isFast)
                    {
                        // Shape is fast. It's aabb will be enlarged in continuous collision.
                        b2BufferMove(broadPhase, shape.proxyKey);
                    }

                    shapeId = shape.nextShapeId;
                }

                // Clear the smallest set bit
                word = word & (word - 1n);
            }
        }
    }

    // Continuous collision
    if (stepContext.fastBodyCount > 0)
    {
        // fast bodies
        b2FastBodyTask(0, stepContext.fastBodyCount, stepContext);
    }

    // Serially enlarge broad-phase proxies for fast shapes
    // Doing this here so that bullet shapes see them
    {
        const broadPhase = world.broadPhase;
        const dynamicTree = broadPhase.trees[b2BodyType.b2_dynamicBody];
        const bodies = world.bodyArray;
        const shapes = world.shapeArray;

        const fastBodies = stepContext.fastBodies;
        const fastBodyCount = stepContext.fastBodyCount;

        // This loop has non-deterministic order but it shouldn't affect the result
        for (let i = 0; i < fastBodyCount; ++i)
        {
            console.assert(0 <= fastBodies[i] && fastBodies[i] < awakeSet.sims.count);
            const fastBodySim = awakeSet.sims.data[fastBodies[i]];

            if (fastBodySim.enlargeAABB === false)
            {
                continue;
            }

            // clear flag
            fastBodySim.enlargeAABB = false;

            // b2CheckIndex(bodies, fastBodySim.bodyId);
            const fastBody = bodies[fastBodySim.bodyId];

            let shapeId = fastBody.headShapeId;

            while (shapeId !== B2_NULL_INDEX)
            {
                const shape = shapes[shapeId];

                if (shape.enlargedAABB === false)
                {
                    shapeId = shape.nextShapeId;

                    continue;
                }

                // clear flag
                shape.enlargedAABB = false;

                const proxyKey = shape.proxyKey;
                const proxyId = B2_PROXY_ID(proxyKey);
                console.assert(B2_PROXY_TYPE(proxyKey) === b2BodyType.b2_dynamicBody);

                // all fast shapes should already be in the move buffer
                // console.assert(b2ContainsKey(broadPhase.moveSet, proxyKey + 1));

                b2DynamicTree_EnlargeProxy(dynamicTree, proxyId, shape.fatAABB);

                shapeId = shape.nextShapeId;
            }
        }
    }


    if (stepContext.bulletBodyCount > 0)
    {
        // bullet bodies
        b2BulletBodyTask(0, stepContext.bulletBodyCount, stepContext);
    }

    // Serially enlarge broad-phase proxies for bullet shapes
    {
        const broadPhase = world.broadPhase;
        const dynamicTree = broadPhase.trees[b2BodyType.b2_dynamicBody];
        const bodies = world.bodyArray;
        const shapes = world.shapeArray;

        const bulletBodies = stepContext.bulletBodies;
        const bulletBodyCount = stepContext.bulletBodyCount;

        // This loop has non-deterministic order but it shouldn't affect the result
        for (let i = 0; i < bulletBodyCount; ++i)
        {
            console.assert(0 <= bulletBodies[i] && bulletBodies[i] < awakeSet.sims.count);
            const bulletBodySim = awakeSet.sims.data[bulletBodies[i]];

            if (bulletBodySim.enlargeAABB === false)
            {
                continue;
            }

            // clear flag
            bulletBodySim.enlargeAABB = false;

            // b2CheckIndex(bodies, bulletBodySim.bodyId);
            const bulletBody = bodies[bulletBodySim.bodyId];

            let shapeId = bulletBody.headShapeId;

            while (shapeId !== B2_NULL_INDEX)
            {
                const shape = shapes[shapeId];

                if (shape.enlargedAABB === false)
                {
                    shapeId = shape.nextShapeId;

                    continue;
                }

                // clear flag
                shape.enlargedAABB = false;

                const proxyKey = shape.proxyKey;
                const proxyId = B2_PROXY_ID(proxyKey);
                console.assert(B2_PROXY_TYPE(proxyKey) === b2BodyType.b2_dynamicBody);

                // all fast shapes should already be in the move buffer
                // console.assert(b2ContainsKey(broadPhase.moveSet, proxyKey + 1));

                b2DynamicTree_EnlargeProxy(dynamicTree, proxyId, shape.fatAABB);

                shapeId = shape.nextShapeId;
            }
        }
    }

    b2FreeStackItem(world.stackAllocator, stepContext.bulletBodies);
    stepContext.bulletBodies = null;
    stepContext.bulletBodyCount = 0;

    b2FreeStackItem(world.stackAllocator, stepContext.fastBodies);
    stepContext.fastBodies = null;
    stepContext.fastBodyCount = 0;

    // Island sleeping
    // This must be done last because putting islands to sleep invalidates the enlarged body bits.
    if (world.enableSleep === true)
    {

        // Collect split island candidate for the next time step. No need to split if sleeping is disabled.
        console.assert(world.splitIslandId === B2_NULL_INDEX);
        let splitSleepTimer = 0.0;

        for (let i = 0; i < world.workerCount; ++i)
        {
            const taskContext = world.taskContextArray[i];

            if (taskContext.splitIslandId !== B2_NULL_INDEX && taskContext.splitSleepTime > splitSleepTimer)
            {
                world.splitIslandId = taskContext.splitIslandId;
                splitSleepTimer = taskContext.splitSleepTime;
            }
        }

        const awakeIslandBitSet = world.taskContextArray[0].awakeIslandBitSet;

        for (let i = 1; i < world.workerCount; ++i)
        {
            bitset_h.b2InPlaceUnion(awakeIslandBitSet, world.taskContextArray[i].awakeIslandBitSet);
        }

        // Need to process in reverse because this moves islands to sleeping solver sets.
        const islands = awakeSet.islands.data;
        const count = awakeSet.islands.count;

        for (let islandIndex = count - 1; islandIndex >= 0; islandIndex -= 1)
        {
            if (bitset_h.b2GetBit(awakeIslandBitSet, islandIndex) === true)
            {
                // this island is still awake
                continue;
            }

            const island = islands[islandIndex];
            const islandId = island.islandId;

            // console.warn("move island " + islandIndex + " " + island.islandId + " to sleeping solver set");

            b2TrySleepIsland(world, islandId);
        }

        b2ValidateSolverSets(world);
    }
}
