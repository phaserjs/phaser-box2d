/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_HUGE, B2_NULL_INDEX, b2_linearSlop } from "./include/core_h.js";
import { b2AddJoint, b2RemoveJoint } from "./include/block_array_h.js";
import { b2AllocId, b2FreeId } from "./include/id_pool_h.js";
import { b2Body_IsValid, b2GetWorld, b2GetWorldFromId, b2GetWorldLocked, b2SetType, b2ValidateSolverSets } from "./include/world_h.js";
import { b2ClampFloat, b2InvTransformPoint, b2IsValid, b2Lerp, b2Normalize, b2TransformPoint, b2Vec2 } from "./include/math_functions_h.js";
import { b2CreateJointInGraph, b2RemoveJointFromGraph, b2_overflowIndex } from "./include/constraint_graph_h.js";
import { b2DistanceJoint, b2Joint, b2JointEdge, b2MotorJoint, b2MouseJoint, b2PrismaticJoint, b2RevoluteJoint, b2WeldJoint, b2WheelJoint } from "./include/joint_h.js";
import { b2DistanceJointDef, b2HexColor, b2JointType, b2MotorJointDef, b2MouseJointDef, b2PrismaticJointDef, b2RevoluteJointDef, b2WeldJointDef, b2WheelJointDef } from "./include/types_h.js";
import { b2DrawDistanceJoint, b2GetDistanceJointForce, b2PrepareDistanceJoint, b2SolveDistanceJoint, b2WarmStartDistanceJoint } from "./include/distance_joint_h.js";
import { b2DrawPrismaticJoint, b2GetPrismaticJointForce, b2GetPrismaticJointTorque, b2PreparePrismaticJoint, b2SolvePrismaticJoint, b2WarmStartPrismaticJoint } from "./include/prismatic_joint_h.js";
import { b2DrawRevoluteJoint, b2PrepareRevoluteJoint, b2SolveRevoluteJoint, b2WarmStartRevoluteJoint } from "./include/revolute_joint_h.js";
import { b2DrawWheelJoint, b2PrepareWheelJoint, b2SolveWheelJoint, b2WarmStartWheelJoint } from "./include/wheel_joint_h.js";
import { b2GetBody, b2GetBodyFullId, b2GetBodyTransformQuick, b2MakeBodyId, b2WakeBody } from "./include/body_h.js";
import { b2GetMotorJointForce, b2GetMotorJointTorque } from "./include/motor_joint_h.js";
import { b2GetMouseJointForce, b2GetMouseJointTorque, b2PrepareMouseJoint, b2SolveMouseJoint, b2WarmStartMouseJoint } from "./include/mouse_joint_h.js";
import { b2GetRevoluteJointForce, b2GetRevoluteJointTorque } from "./include/revolute_joint_h.js";
import { b2GetWeldJointForce, b2GetWeldJointTorque } from "./include/weld_joint_h.js";
import { b2GetWheelJointForce, b2GetWheelJointTorque } from "./include/wheel_joint_h.js";
import { b2LinkJoint, b2UnlinkJoint } from "./include/island_h.js";
import { b2MergeSolverSets, b2WakeSolverSet } from "./include/solver_set_h.js";
import { b2PrepareMotorJoint, b2SolveMotorJoint, b2WarmStartMotorJoint } from "./include/motor_joint_h.js";
import { b2PrepareWeldJoint, b2SolveWeldJoint, b2WarmStartWeldJoint } from "./include/weld_joint_h.js";

import { b2BufferMove } from "./include/broad_phase_h.js";
import { b2DestroyContact } from "./include/contact_h.js";
import { b2JointId } from "./include/id_h.js";

/**
 * @namespace Joint
 */

/**
 * @import {b2WorldId, b2BodyId} from './include/id_h.js'
 */

/**
 * Creates a default distance joint definition with preset values.
 * @function b2DefaultDistanceJointDef
 * @returns {b2DistanceJointDef} A distance joint definition with:
 * - length set to 1
 * - maxLength set to B2_HUGE
 * - all other properties at their default values
 * @description
 * Creates and returns a new b2DistanceJointDef object initialized with specific default values.
 * The length is set to 1 unit and the maxLength is set to B2_HUGE. All other properties
 * of the joint definition retain their default values from the b2DistanceJointDef constructor.
 */
export function b2DefaultDistanceJointDef()
{
    const def = new b2DistanceJointDef();
    def.length = 1.0;
    def.maxLength = B2_HUGE;

    return def;
}

/**
 * Creates a b2MotorJointDef with default values.
 * @function b2DefaultMotorJointDef
 * @returns {b2MotorJointDef} A motor joint definition with:
 * - maxForce: 1
 * - maxTorque: 1
 * - correctionFactor: 0.3
 * - linearOffset: (0,0)
 * - angularOffset: 0
 * @description
 * Initializes a new b2MotorJointDef with common default values.
 * The joint definition includes preset values for maximum force,
 * maximum torque, and correction factor while using default
 * values for linear and angular offsets.
 */
export function b2DefaultMotorJointDef()
{
    const def = new b2MotorJointDef();
    def.maxForce = 1.0;
    def.maxTorque = 1.0;
    def.correctionFactor = 0.3;

    return def;
}

/**
 * Creates a b2MouseJointDef with default settings.
 * @function b2DefaultMouseJointDef
 * @returns {b2MouseJointDef} A mouse joint definition with:
 * - hertz = 4
 * - dampingRatio = 1
 * - maxForce = 1
 * @description
 * Creates and returns a new b2MouseJointDef object initialized with default values
 * for frequency (hertz), damping ratio, and maximum force parameters.
 */
export function b2DefaultMouseJointDef()
{
    const def = new b2MouseJointDef();
    def.hertz = 4.0;
    def.dampingRatio = 1.0;
    def.maxForce = 1.0;

    return def;
}

/**
 * Creates a default prismatic joint definition with preset values.
 * @function b2DefaultPrismaticJointDef
 * @returns {b2PrismaticJointDef} A prismatic joint definition with localAxisA set to (1,0)
 * @description
 * Creates and returns a new b2PrismaticJointDef instance with localAxisA initialized
 * to a unit vector pointing along the x-axis (1,0). All other properties retain their
 * default values from the b2PrismaticJointDef constructor.
 */
export function b2DefaultPrismaticJointDef()
{
    const def = new b2PrismaticJointDef();
    def.localAxisA = new b2Vec2(1.0, 0.0);

    return def;
}

/**
 * Creates a default b2RevoluteJointDef with preset values.
 * @function b2DefaultRevoluteJointDef
 * @returns {b2RevoluteJointDef} A new revolution joint definition with drawSize set to 0.25
 * @description
 * Creates and initializes a new b2RevoluteJointDef with default values.
 * Sets the drawSize property to 0.25 for visualization purposes.
 */
export function b2DefaultRevoluteJointDef()
{
    const def = new b2RevoluteJointDef();
    def.drawSize = 0.25;

    return def;
}

/**
 * @summary Creates a new weld joint definition with default values.
 * @function b2DefaultWeldJointDef
 * @returns {b2WeldJointDef} A new weld joint definition with default configuration:
 * - localAnchorA: b2Vec2(0,0)
 * - localAnchorB: b2Vec2(0,0)
 * - referenceAngle: 0
 * - stiffness: 0
 * - damping: 0
 * @description
 * Creates and returns a new b2WeldJointDef object initialized with default values.
 * A weld joint essentially glues two bodies together at a reference point.
 */
export function b2DefaultWeldJointDef()
{
    return new b2WeldJointDef();
}

/**
 * Creates a default wheel joint definition with preset values.
 * @function b2DefaultWheelJointDef
 * @returns {b2WheelJointDef} A wheel joint definition with:
 * - localAxisA set to (0,1)
 * - enableSpring set to true
 * - hertz set to 1
 * - dampingRatio set to 0.7
 * @description
 * Creates and returns a new b2WheelJointDef with common default values.
 * The joint's local axis is set to point upward, and spring behavior
 * is enabled with standard frequency and damping values.
 */
export function b2DefaultWheelJointDef()
{
    const def = new b2WheelJointDef();
    def.localAxisA = new b2Vec2(0.0, 1.0);
    def.enableSpring = true;
    def.hertz = 1.0;
    def.dampingRatio = 0.7;

    return def;
}

function b2GetJointFullId(world, jointId)
{
    const id = jointId.index1 - 1;

    // b2CheckIndex(world.jointArray, id);
    const joint = world.jointArray[id];

    // b2CheckIndex(world.solverSetArray, joint.setIndex);
    console.assert(joint.revision === jointId.revision);

    return joint;
}

export function b2GetJoint(world, jointId)
{
    // b2CheckIndex(world.jointArray, jointId);
    return world.jointArray[jointId];
}

export function b2GetJointSim(world, joint)
{
    // b2CheckIndex(world.solverSetArray, joint.setIndex);

    if (joint.setIndex === b2SetType.b2_awakeSet)
    {
        // console.assert(0 <= joint.colorIndex && joint.colorIndex < b2_graphColorCount);
        const color = world.constraintGraph.colors[joint.colorIndex];

        // console.assert(0 <= joint.localIndex && joint.localIndex < color.joints.count);

        if (joint.jointId !== color.joints.data[joint.localIndex].jointId)
        {
            console.error("jointId " + joint.jointId + " localIndex " +  joint.localIndex + " jointSim.jointId " + color.joints.data[joint.localIndex].jointId);

            // debugger;
        }

        return color.joints.data[joint.localIndex];
    }

    const set = world.solverSetArray[joint.setIndex];
    console.assert(0 <= joint.localIndex && joint.localIndex < set.joints.count);
    console.assert(joint.jointId == set.joints.data[joint.localIndex].jointId);

    return set.joints.data[joint.localIndex];
}

export function b2GetJointSimCheckType(jointId, type)
{
    const world = b2GetWorld(jointId.world0);
    console.assert(world.locked === false);

    if (world.locked)
    {
        return null;
    }

    const joint = b2GetJointFullId(world, jointId);
    console.assert(joint.type === type);
    const jointSim = b2GetJointSim(world, joint);
    console.assert(jointSim.type === type);

    return jointSim;
}

class b2JointPair
{
    constructor(joint = null, jointSim = null)
    {
        this.joint = joint;
        this.jointSim = jointSim;
        
    }
}

export function b2CreateJoint(world, bodyA, bodyB, userData, drawSize, type, collideConnected)
{

    b2ValidateSolverSets(world);

    const bodyIdA = bodyA.id;
    const bodyIdB = bodyB.id;
    const maxSetIndex = Math.max(bodyA.setIndex, bodyB.setIndex);

    // Create joint id and joint
    const jointId = b2AllocId(world.jointIdPool);
    console.assert(jointId !== B2_NULL_INDEX);

    // console.warn("create jointId " + jointId + " world joints " +  world.jointArray.length + ", for body " + bodyIdA + " joined to " + bodyIdB);
    while (jointId >= world.jointArray.length)
    {
        world.jointArray.push(new b2Joint());
    }

    const joint = world.jointArray[jointId];
    joint.edges = [ new b2JointEdge(), new b2JointEdge() ];
    joint.jointId = jointId;
    joint.userData = userData;
    joint.setIndex = B2_NULL_INDEX;
    joint.colorIndex = B2_NULL_INDEX;
    joint.localIndex = B2_NULL_INDEX;
    joint.islandId = B2_NULL_INDEX;
    joint.islandPrev = B2_NULL_INDEX;
    joint.islandNext = B2_NULL_INDEX;
    joint.revision += 1;
    joint.drawSize = drawSize;
    joint.type = type;
    joint.isMarked = false;
    joint.collideConnected = collideConnected;

    // Doubly linked list on bodyA
    joint.edges[0].bodyId = bodyIdA;
    joint.edges[0].prevKey = B2_NULL_INDEX;
    joint.edges[0].nextKey = bodyA.headJointKey;

    const keyA = (jointId << 1) | 0;

    if (bodyA.headJointKey !== B2_NULL_INDEX)
    {
        const jointA = world.jointArray[bodyA.headJointKey >> 1];
        const edgeA = jointA.edges[bodyA.headJointKey & 1];
        edgeA.prevKey = keyA;
    }
    bodyA.headJointKey = keyA;
    bodyA.jointCount += 1;

    // console.warn("keyA " + keyA);

    // Doubly linked list on bodyB
    joint.edges[1].bodyId = bodyIdB;
    joint.edges[1].prevKey = B2_NULL_INDEX;
    joint.edges[1].nextKey = bodyB.headJointKey;

    const keyB = (jointId << 1) | 1;

    if (bodyB.headJointKey !== B2_NULL_INDEX)
    {
        const jointB = world.jointArray[bodyB.headJointKey >> 1];
        const edgeB = jointB.edges[bodyB.headJointKey & 1];
        edgeB.prevKey = keyB;
    }
    bodyB.headJointKey = keyB;
    bodyB.jointCount += 1;

    // console.warn("keyB " + keyB);

    let jointSim;

    if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet)
    {
        // if either body is disabled, create in disabled set
        const set = world.solverSetArray[b2SetType.b2_disabledSet];
        joint.setIndex = b2SetType.b2_disabledSet;
        joint.localIndex = set.joints.length;

        jointSim = b2AddJoint(set.joints);
        jointSim.jointId = jointId;

        // console.warn("disabled " + jointId);
        jointSim.bodyIdA = bodyIdA;
        jointSim.bodyIdB = bodyIdB;
    }
    else if (bodyA.setIndex === b2SetType.b2_staticSet && bodyB.setIndex === b2SetType.b2_staticSet)
    {
        // joint is connecting static bodies
        const set = world.solverSetArray[b2SetType.b2_staticSet];
        joint.setIndex = b2SetType.b2_staticSet;
        joint.localIndex = set.joints.length;

        jointSim = b2AddJoint(set.joints);
        jointSim.jointId = jointId;

        // console.warn("static " + jointId);
        jointSim.bodyIdA = bodyIdA;
        jointSim.bodyIdB = bodyIdB;
    }
    else if (bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet)
    {
        // if either body is sleeping, wake it
        if (maxSetIndex >= b2SetType.b2_firstSleepingSet)
        {
            // console.warn("waking");
            b2WakeSolverSet(world, maxSetIndex);
        }

        joint.setIndex = b2SetType.b2_awakeSet;

        jointSim = b2CreateJointInGraph(world, joint);
        jointSim.jointId = jointId;

        // console.warn("awake " + jointId);
        jointSim.bodyIdA = bodyIdA;
        jointSim.bodyIdB = bodyIdB;
    }
    else
    {
        // joint connected between sleeping and/or static bodies
        console.assert(bodyA.setIndex >= b2SetType.b2_firstSleepingSet || bodyB.setIndex >= b2SetType.b2_firstSleepingSet);
        console.assert(bodyA.setIndex !== b2SetType.b2_staticSet || bodyB.setIndex !== b2SetType.b2_staticSet);

        // joint should go into the sleeping set (not static set)
        let setIndex = maxSetIndex;

        // b2CheckIndex(world.solverSetArray, setIndex);
        const set = world.solverSetArray[setIndex];
        joint.setIndex = setIndex;
        joint.localIndex = set.joints.length;
        jointSim = b2AddJoint(set.joints);
        jointSim.jointId = jointId;

        // console.warn("else " + jointId);
        jointSim.bodyIdA = bodyIdA;
        jointSim.bodyIdB = bodyIdB;

        if (bodyA.setIndex !== bodyB.setIndex && bodyA.setIndex >= b2SetType.b2_firstSleepingSet &&
            bodyB.setIndex >= b2SetType.b2_firstSleepingSet)
        {
            // merge sleeping sets
            b2MergeSolverSets(world, bodyA.setIndex, bodyB.setIndex);
            console.assert(bodyA.setIndex === bodyB.setIndex);

            // fix potentially invalid set index
            setIndex = bodyA.setIndex;

            // Careful! The joint sim pointer was orphaned by the set merge.
            jointSim = world.solverSetArray[setIndex].joints[joint.localIndex];
        }

        console.assert(joint.setIndex === setIndex);
    }

    console.assert(jointSim.jointId === jointId);
    console.assert(jointSim.bodyIdA === bodyIdA);
    console.assert(jointSim.bodyIdB === bodyIdB);

    if (joint.setIndex > b2SetType.b2_disabledSet)
    {
        // Add edge to island graph
        const mergeIslands = true;
        b2LinkJoint(world, joint, mergeIslands);
    }

    b2ValidateSolverSets(world);

    return new b2JointPair(joint, jointSim);
}

// Assuming similar data structures exist in JS

export function b2DestroyContactsBetweenBodies(world, bodyA, bodyB)
{
    let contactKey;
    let otherBodyId;

    if (bodyA.contactCount < bodyB.contactCount)
    {
        contactKey = bodyA.headContactKey;
        otherBodyId = bodyB.id;
    }
    else
    {
        contactKey = bodyB.headContactKey;
        otherBodyId = bodyA.id;
    }

    const wakeBodies = false;

    while (contactKey !== B2_NULL_INDEX)
    {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;

        // b2CheckIndex(world.contactArray, contactId);
        const contact = world.contactArray[contactId];
        contactKey = contact.edges[edgeIndex].nextKey;

        const otherEdgeIndex = edgeIndex ^ 1;

        if (contact.edges[otherEdgeIndex].bodyId === otherBodyId)
        {
            // Careful, this removes the contact from the current doubly linked list
            b2DestroyContact(world, contact, wakeBodies);
        }
    }

    b2ValidateSolverSets(world);
}

/**
 * @function b2CreateDistanceJoint
 * @summary Creates a distance joint between two bodies in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2DistanceJointDef} def - The joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - length: Desired distance between anchor points
 * - minLength: Minimum allowed distance
 * - maxLength: Maximum allowed distance
 * - hertz: Spring frequency in Hz
 * - dampingRatio: Spring damping ratio
 * - maxMotorForce: Maximum motor force
 * - motorSpeed: Motor speed
 * - enableSpring: Enable/disable spring
 * - enableLimit: Enable/disable length limits
 * - enableMotor: Enable/disable motor
 * - collideConnected: Allow collision between connected bodies
 * - userData: User data
 * @returns {b2JointId} The ID of the created distance joint
 * @throws {Error} Throws assertion error if world is locked, bodies are invalid, or length <= 0
 */
export function b2CreateDistanceJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked === false);

    if (world.locked)
    {
        return new b2JointId();
    }

    console.assert(b2Body_IsValid(def.bodyIdA));
    console.assert(b2Body_IsValid(def.bodyIdB));
    console.assert(b2IsValid(def.length) && def.length > 0.0);

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_distanceJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_distanceJoint;
    joint.localOriginAnchorA = def.localAnchorA;
    joint.localOriginAnchorB = def.localAnchorB;

    joint.distanceJoint = new b2DistanceJoint();
    joint.distanceJoint.length = Math.max(def.length, b2_linearSlop);
    joint.distanceJoint.hertz = def.hertz;
    joint.distanceJoint.dampingRatio = def.dampingRatio;
    joint.distanceJoint.minLength = Math.max(def.minLength, b2_linearSlop);
    joint.distanceJoint.maxLength = Math.max(def.minLength, def.maxLength);
    joint.distanceJoint.maxMotorForce = def.maxMotorForce;
    joint.distanceJoint.motorSpeed = def.motorSpeed;
    joint.distanceJoint.enableSpring = def.enableSpring;
    joint.distanceJoint.enableLimit = def.enableLimit;
    joint.distanceJoint.enableMotor = def.enableMotor;
    joint.distanceJoint.impulse = 0.0;
    joint.distanceJoint.lowerImpulse = 0.0;
    joint.distanceJoint.upperImpulse = 0.0;
    joint.distanceJoint.motorImpulse = 0.0;

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * @function b2CreateMotorJoint
 * @summary Creates a motor joint between two bodies in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2MotorJointDef} def - The joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - linearOffset: The target linear offset between bodies
 * - angularOffset: The target angular offset between bodies
 * - maxForce: Maximum force that can be applied
 * - maxTorque: Maximum torque that can be applied
 * - correctionFactor: Position correction factor in [0,1]
 * - collideConnected: Whether bodies can collide
 * - userData: User data
 * @returns {b2JointId} The ID of the created motor joint
 * @throws {Error} If the world is locked when attempting to create the joint
 */
export function b2CreateMotorJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked === false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_motorJoint, def.collideConnected);
    const joint = pair.jointSim;

    joint.type = b2JointType.b2_motorJoint;
    joint.localOriginAnchorA = new b2Vec2(0, 0);
    joint.localOriginAnchorB = new b2Vec2(0, 0);
    joint.motorJoint = new b2MotorJoint();
    joint.motorJoint.linearOffset = def.linearOffset;
    joint.motorJoint.angularOffset = def.angularOffset;
    joint.motorJoint.maxForce = def.maxForce;
    joint.motorJoint.maxTorque = def.maxTorque;
    joint.motorJoint.correctionFactor = b2ClampFloat(def.correctionFactor, 0.0, 1.0);

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * @function b2CreateMouseJoint
 * @summary Creates a mouse joint in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world where the joint will be created
 * @param {b2MouseJointDef} def - The mouse joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - target: Target point in world coordinates
 * - hertz: Frequency in Hertz
 * - dampingRatio: Damping ratio
 * - maxForce: Maximum force
 * - userData: User data
 * - collideConnected: Whether connected bodies can collide
 * @returns {b2JointId} The ID of the created mouse joint
 * @throws {Error} Throws an assertion error if the world is locked
 * @description
 * Creates a mouse joint between two bodies at a specified target point. The joint
 * transforms the target point into local coordinates for both bodies and initializes
 * the joint properties including frequency, damping ratio, and maximum force.
 */
export function b2CreateMouseJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const transformA = b2GetBodyTransformQuick(world, bodyA);
    const transformB = b2GetBodyTransformQuick(world, bodyB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_mouseJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_mouseJoint;
    joint.localOriginAnchorA = b2InvTransformPoint(transformA, def.target);
    joint.localOriginAnchorB = b2InvTransformPoint(transformB, def.target);

    joint.mouseJoint = new b2MouseJoint();
    joint.mouseJoint.targetA = def.target;
    joint.mouseJoint.hertz = def.hertz;
    joint.mouseJoint.dampingRatio = def.dampingRatio;
    joint.mouseJoint.maxForce = def.maxForce;

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * @summary Creates a revolute joint between two bodies in a Box2D world
 * @function b2CreateRevoluteJoint
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2RevoluteJointDef} def - The joint definition containing properties like:
 * - bodyIdA: ID of first body
 * - bodyIdB: ID of second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - referenceAngle: Initial angle between bodies (clamped to [-π,π])
 * - hertz: Spring frequency
 * - dampingRatio: Spring damping ratio
 * - lowerAngle: Lower angle limit (clamped to [-π,π])
 * - upperAngle: Upper angle limit (clamped to [-π,π])
 * - maxMotorTorque: Maximum motor torque
 * - motorSpeed: Motor speed
 * - enableSpring: Enable spring behavior
 * - enableLimit: Enable angle limits
 * - enableMotor: Enable motor
 * - collideConnected: Allow collision between connected bodies
 * - userData: User data
 * - drawSize: Drawing size
 * @returns {b2JointId} ID of the created revolute joint
 * @throws {Error} If the world is locked
 */
export function b2CreateRevoluteJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, def.drawSize, b2JointType.b2_revoluteJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_revoluteJoint;
    joint.localOriginAnchorA = def.localAnchorA;
    joint.localOriginAnchorB = def.localAnchorB;

    joint.revoluteJoint = new b2RevoluteJoint();
    joint.revoluteJoint.referenceAngle = b2ClampFloat(def.referenceAngle, -Math.PI, Math.PI);
    joint.revoluteJoint.linearImpulse = new b2Vec2(0, 0);
    joint.revoluteJoint.axialMass = 0.0;
    joint.revoluteJoint.springImpulse = 0.0;
    joint.revoluteJoint.motorImpulse = 0.0;
    joint.revoluteJoint.lowerImpulse = 0.0;
    joint.revoluteJoint.upperImpulse = 0.0;
    joint.revoluteJoint.hertz = def.hertz;
    joint.revoluteJoint.dampingRatio = def.dampingRatio;
    joint.revoluteJoint.lowerAngle = Math.min(def.lowerAngle, def.upperAngle);
    joint.revoluteJoint.upperAngle = Math.max(def.lowerAngle, def.upperAngle);
    joint.revoluteJoint.lowerAngle = b2ClampFloat(joint.revoluteJoint.lowerAngle, -Math.PI, Math.PI);
    joint.revoluteJoint.upperAngle = b2ClampFloat(joint.revoluteJoint.upperAngle, -Math.PI, Math.PI);
    joint.revoluteJoint.maxMotorTorque = def.maxMotorTorque;
    joint.revoluteJoint.motorSpeed = def.motorSpeed;
    joint.revoluteJoint.enableSpring = def.enableSpring;
    joint.revoluteJoint.enableLimit = def.enableLimit;
    joint.revoluteJoint.enableMotor = def.enableMotor;

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * @function b2CreatePrismaticJoint
 * @description
 * Creates a prismatic joint between two bodies in a Box2D world. A prismatic joint
 * constrains two bodies to move relative to each other along a specified axis.
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2PrismaticJointDef} def - The joint definition containing:
 * - bodyIdA: First body ID
 * - bodyIdB: Second body ID
 * - localAnchorA: Anchor point on body A in local coordinates
 * - localAnchorB: Anchor point on body B in local coordinates
 * - localAxisA: The axis of translation in body A's local coordinates
 * - referenceAngle: The initial angle between the bodies
 * - enableLimit: Whether translation limits are enabled
 * - lowerTranslation: Lower translation limit
 * - upperTranslation: Upper translation limit
 * - enableMotor: Whether the motor is enabled
 * - motorSpeed: Motor speed
 * - maxMotorForce: Maximum motor force
 * - enableSpring: Whether spring is enabled
 * - hertz: Spring frequency in Hz
 * - dampingRatio: Spring damping ratio
 * - collideConnected: Whether connected bodies can collide
 * - userData: User data
 * @returns {b2JointId} The identifier for the created prismatic joint
 */
export function b2CreatePrismaticJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_prismaticJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_prismaticJoint;
    joint.localOriginAnchorA = def.localAnchorA;
    joint.localOriginAnchorB = def.localAnchorB;

    joint.prismaticJoint = new b2PrismaticJoint();
    joint.prismaticJoint.localAxisA = b2Normalize(def.localAxisA);
    joint.prismaticJoint.referenceAngle = def.referenceAngle;
    joint.prismaticJoint.impulse = new b2Vec2(0, 0);
    joint.prismaticJoint.axialMass = 0.0;
    joint.prismaticJoint.springImpulse = 0.0;
    joint.prismaticJoint.motorImpulse = 0.0;
    joint.prismaticJoint.lowerImpulse = 0.0;
    joint.prismaticJoint.upperImpulse = 0.0;
    joint.prismaticJoint.hertz = def.hertz;
    joint.prismaticJoint.dampingRatio = def.dampingRatio;
    joint.prismaticJoint.lowerTranslation = def.lowerTranslation;
    joint.prismaticJoint.upperTranslation = def.upperTranslation;
    joint.prismaticJoint.maxMotorForce = def.maxMotorForce;
    joint.prismaticJoint.motorSpeed = def.motorSpeed;
    joint.prismaticJoint.enableSpring = def.enableSpring;
    joint.prismaticJoint.enableLimit = def.enableLimit;
    joint.prismaticJoint.enableMotor = def.enableMotor;

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * Creates a weld joint between two bodies in a Box2D world.
 * @function b2CreateWeldJoint
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2WeldJointDef} def - The weld joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - referenceAngle: Reference angle between the bodies
 * - linearHertz: Frequency for the linear constraint
 * - linearDampingRatio: Damping ratio for the linear constraint
 * - angularHertz: Frequency for the angular constraint
 * - angularDampingRatio: Damping ratio for the angular constraint
 * - collideConnected: Whether the connected bodies can collide
 * - userData: User data associated with the joint
 * @returns {b2JointId} The identifier of the created weld joint
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2CreateWeldJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_weldJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_weldJoint;
    joint.localOriginAnchorA = def.localAnchorA;
    joint.localOriginAnchorB = def.localAnchorB;

    joint.weldJoint = new b2WeldJoint();
    joint.weldJoint.referenceAngle = def.referenceAngle;
    joint.weldJoint.linearHertz = def.linearHertz;
    joint.weldJoint.linearDampingRatio = def.linearDampingRatio;
    joint.weldJoint.angularHertz = def.angularHertz;
    joint.weldJoint.angularDampingRatio = def.angularDampingRatio;
    joint.weldJoint.linearImpulse = new b2Vec2(0, 0);
    joint.weldJoint.angularImpulse = 0.0;

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

/**
 * @function b2CreateWheelJoint
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2WheelJointDef} def - The wheel joint definition containing configuration parameters
 * @returns {b2JointId} The identifier of the created wheel joint
 * @description
 * Creates a wheel joint between two bodies in a Box2D world. A wheel joint provides two degrees of
 * freedom: translation along a specified axis and rotation about an orthogonal axis. The joint can
 * be configured with a spring and damper mechanism, translation limits, and a motor.
 * @throws {Error} Throws an assertion error if the world is locked
 * @note If collideConnected is false, any contacts between the connected bodies are destroyed
 */
export function b2CreateWheelJoint(worldId, def)
{
    // b2CheckDef(def);
    const world = b2GetWorldFromId(worldId);

    console.assert(world.locked == false);

    if (world.locked)
    {
        return new b2JointId();
    }

    const bodyA = b2GetBodyFullId(world, def.bodyIdA);
    const bodyB = b2GetBodyFullId(world, def.bodyIdB);

    const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1.0, b2JointType.b2_wheelJoint, def.collideConnected);

    const joint = pair.jointSim;
    joint.type = b2JointType.b2_wheelJoint;
    joint.localOriginAnchorA = def.localAnchorA;
    joint.localOriginAnchorB = def.localAnchorB;

    joint.wheelJoint = new b2WheelJoint();
    joint.wheelJoint.localAxisA = b2Normalize(def.localAxisA);
    joint.wheelJoint.perpMass = 0.0;
    joint.wheelJoint.axialMass = 0.0;
    joint.wheelJoint.motorImpulse = 0.0;
    joint.wheelJoint.lowerImpulse = 0.0;
    joint.wheelJoint.upperImpulse = 0.0;
    joint.wheelJoint.lowerTranslation = def.lowerTranslation;
    joint.wheelJoint.upperTranslation = def.upperTranslation;
    joint.wheelJoint.maxMotorTorque = def.maxMotorTorque;
    joint.wheelJoint.motorSpeed = def.motorSpeed;
    joint.wheelJoint.hertz = def.hertz;
    joint.wheelJoint.dampingRatio = def.dampingRatio;
    joint.wheelJoint.enableSpring = def.enableSpring;
    joint.wheelJoint.enableLimit = def.enableLimit;
    joint.wheelJoint.enableMotor = def.enableMotor;

    if (def.collideConnected === false)
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }

    const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);

    return jointId;
}

export function b2DestroyJointInternal(world, joint, wakeBodies)
{
    const jointId = joint.jointId;

    const edgeA = joint.edges[0];
    const edgeB = joint.edges[1];

    const idA = edgeA.bodyId;
    const idB = edgeB.bodyId;
    const bodyA = b2GetBody(world, idA);
    const bodyB = b2GetBody(world, idB);

    // Remove from body A
    if (edgeA.prevKey !== B2_NULL_INDEX)
    {
        const prevJoint = world.jointArray[edgeA.prevKey >> 1];
        const prevEdge = prevJoint.edges[edgeA.prevKey & 1];
        prevEdge.nextKey = edgeA.nextKey;
    }

    if (edgeA.nextKey !== B2_NULL_INDEX)
    {
        const nextJoint = world.jointArray[edgeA.nextKey >> 1];
        const nextEdge = nextJoint.edges[edgeA.nextKey & 1];
        nextEdge.prevKey = edgeA.prevKey;
    }

    const edgeKeyA = (jointId << 1) | 0;

    if (bodyA.headJointKey === edgeKeyA)
    {
        bodyA.headJointKey = edgeA.nextKey;
    }

    bodyA.jointCount -= 1;

    // Remove from body B
    if (edgeB.prevKey !== B2_NULL_INDEX)
    {
        const prevJoint = world.jointArray[edgeB.prevKey >> 1];
        const prevEdge = prevJoint.edges[edgeB.prevKey & 1];
        prevEdge.nextKey = edgeB.nextKey;
    }

    if (edgeB.nextKey !== B2_NULL_INDEX)
    {
        const nextJoint = world.jointArray[edgeB.nextKey >> 1];
        const nextEdge = nextJoint.edges[edgeB.nextKey & 1];
        nextEdge.prevKey = edgeB.prevKey;
    }

    const edgeKeyB = (jointId << 1) | 1;

    if (bodyB.headJointKey === edgeKeyB)
    {
        bodyB.headJointKey = edgeB.nextKey;
    }

    bodyB.jointCount -= 1;

    if (joint.islandId !== B2_NULL_INDEX)
    {
        b2UnlinkJoint(world, joint);
    }

    // Remove joint from solver set that owns it
    const setIndex = joint.setIndex;
    const localIndex = joint.localIndex;

    if (setIndex === b2SetType.b2_awakeSet)
    {
        b2RemoveJointFromGraph(world, joint.edges[0].bodyId, joint.edges[1].bodyId, joint.colorIndex, localIndex);
    }
    else
    {
        const set = world.solverSetArray[setIndex];
        const movedIndex = b2RemoveJoint(set.joints, localIndex);

        if (movedIndex !== B2_NULL_INDEX)
        {
            // Fix moved joint
            const movedJointSim = set.joints.data[localIndex];
            const movedId = movedJointSim.jointId;
            const movedJoint = world.jointArray[movedId];
            console.assert(movedJoint.localIndex === movedIndex);
            movedJoint.localIndex = localIndex;
        }
    }

    // Free joint and id (preserve joint revision)
    joint.setIndex = B2_NULL_INDEX;
    joint.colorIndex = B2_NULL_INDEX;
    joint.localIndex = B2_NULL_INDEX;
    joint.jointId = B2_NULL_INDEX;
    joint.type = b2JointType.b2_unknown;
    b2FreeId(world.jointIdPool, jointId);

    if (wakeBodies)
    {
        b2WakeBody(world, bodyA);
        b2WakeBody(world, bodyB);
    }

    b2ValidateSolverSets(world);
}

/**
 * @function b2DestroyJoint
 * @param {b2JointId} jointId - The identifier of the joint to be destroyed
 * @returns {void}
 * @description
 * Destroys a joint in the physics world. If the world is locked (e.g. during collision detection
 * or integration), the function will return without destroying the joint. The function internally
 * calls b2DestroyJointInternal to handle the actual joint destruction.
 * @throws {Error} Throws an assertion error if attempting to destroy a joint in a locked world
 */
export function b2DestroyJoint(jointId)
{
    const world = b2GetWorld(jointId.world0);
    console.assert(world.locked === false);

    if (world.locked)
    {
        return;
    }

    const joint = b2GetJointFullId(world, jointId);
    b2DestroyJointInternal(world, joint, true);
}

/**
 * Gets the type of a joint from its ID.
 * @function b2Joint_GetType
 * @param {b2JointId} jointId - The ID of the joint to query.
 * @returns {b2JointType} The type of the specified joint.
 * @description
 * Retrieves the joint type from the world using the provided joint ID.
 * The function first gets the world reference from the joint ID,
 * then retrieves the full joint object to access its type property.
 */
export function b2Joint_GetType(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);

    return joint.type;
}

/**
 * @summary Gets the first body connected to a joint.
 * @function b2Joint_GetBodyA
 * @param {b2JointId} jointId - The identifier of the joint.
 * @returns {b2BodyId} The identifier of the first body connected to the joint.
 * @description
 * This function retrieves the identifier of the first body (body A) that is
 * connected to the specified joint. The joint must exist in the world referenced
 * by the jointId.
 */
export function b2Joint_GetBodyA(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);

    return b2MakeBodyId(world, joint.edges[0].bodyId);
}

/**
 * @summary Gets the second body (body B) connected to a joint.
 * @function b2Joint_GetBodyB
 * @param {b2JointId} jointId - The identifier of the joint.
 * @returns {b2BodyId} The identifier of body B connected to the joint.
 * @description
 * This function retrieves the identifier of the second body (body B) that is
 * connected to the specified joint. The joint must exist in the world referenced
 * by the jointId.
 */
export function b2Joint_GetBodyB(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);

    return b2MakeBodyId(world, joint.edges[1].bodyId);
}

/**
 * @function b2Joint_GetLocalAnchorA
 * @summary Gets the local anchor point A of a joint.
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The local anchor point A in the body A frame.
 * @description
 * Retrieves the local anchor point A from a joint's simulation data. The anchor point
 * is expressed in the local coordinate system of body A.
 */
export function b2Joint_GetLocalAnchorA(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);
    const jointSim = b2GetJointSim(world, joint);

    return jointSim.localOriginAnchorA;
}

/**
 * @function b2Joint_GetLocalAnchorB
 * @summary Gets the local anchor point B of a joint.
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The local anchor point B in the body's local coordinates.
 * @description
 * Retrieves the local anchor point B of a joint, which represents the connection
 * point on the second body (body B) in that body's local coordinate system.
 */
export function b2Joint_GetLocalAnchorB(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);
    const jointSim = b2GetJointSim(world, joint);

    return jointSim.localOriginAnchorB;
}

/**
 * Sets whether two bodies connected by a joint should collide with each other.
 * @function b2Joint_SetCollideConnected
 * @param {b2JointId} jointId - The identifier for the joint to modify.
 * @param {boolean} shouldCollide - True to enable collision between connected bodies, false to disable.
 * @returns {void}
 * @description
 * When enabled, the bodies connected by the joint can collide with each other.
 * When disabled, collisions between the connected bodies are filtered out.
 * The function updates the broadphase when enabling collisions and destroys
 * existing contacts between the bodies when disabling collisions.
 */
export function b2Joint_SetCollideConnected(jointId, shouldCollide)
{
    const world = b2GetWorldLocked(jointId.world0);

    if (world === null)
    {
        return;
    }

    const joint = b2GetJointFullId(world, jointId);

    if (joint.collideConnected === shouldCollide)
    {
        return;
    }

    joint.collideConnected = shouldCollide;

    const bodyA = b2GetBody(world, joint.edges[0].bodyId);
    const bodyB = b2GetBody(world, joint.edges[1].bodyId);

    if (shouldCollide)
    {
        // need to tell the broad-phase to look for new pairs for one of the
        // two bodies. Pick the one with the fewest shapes.
        const shapeCountA = bodyA.shapeCount;
        const shapeCountB = bodyB.shapeCount;

        let shapeId = shapeCountA < shapeCountB ? bodyA.headShapeId : bodyB.headShapeId;

        while (shapeId !== B2_NULL_INDEX)
        {
            const shape = world.shapeArray[shapeId];

            if (shape.proxyKey !== B2_NULL_INDEX)
            {
                b2BufferMove(world.broadPhase, shape.proxyKey);
            }

            shapeId = shape.nextShapeId;
        }
    }
    else
    {
        b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
    }
}

/**
 * @function b2Joint_GetCollideConnected
 * @param {b2JointId} jointId - The ID of the joint to query
 * @returns {boolean} Whether the connected bodies can collide with each other
 * @description
 * Gets the collideConnected flag for the specified joint. This flag determines if
 * the two bodies connected by this joint are allowed to collide with each other.
 */
export function b2Joint_GetCollideConnected(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);

    return joint.collideConnected;
}

/**
 * @summary Sets the user data for a joint.
 * @function b2Joint_SetUserData
 * @param {b2JointId} jointId - The identifier for the joint to modify.
 * @param {*} userData - The user data to associate with the joint.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a specified joint in the physics world.
 * The joint is located using its world and joint identifiers, and its user data
 * property is updated with the provided value.
 */
export function b2Joint_SetUserData(jointId, userData)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);
    joint.userData = userData;
}

/**
 * @summary Gets the user data associated with a joint.
 * @function b2Joint_GetUserData
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {void} The user data associated with the joint.
 * @description
 * Retrieves the user data that was previously attached to the specified joint.
 * The function first gets the world object from the joint ID, then retrieves
 * the joint using the full joint ID, and finally returns the userData property
 * of that joint.
 */
export function b2Joint_GetUserData(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);

    return joint.userData;
}

/**
 * @function b2Joint_WakeBodies
 * @description
 * Wakes up both bodies connected by a joint in the physics simulation.
 * @param {b2JointId} jointId - The identifier for the joint whose connected bodies should be awakened.
 * @returns {void}
 * @throws {Error} If the world reference in the jointId is invalid or cannot be accessed.
 */
export function b2Joint_WakeBodies(jointId)
{
    const world = b2GetWorldLocked(jointId.world0);

    if (world === null)
    {
        return;
    }

    const joint = b2GetJointFullId(world, jointId);
    const bodyA = world.bodyArray[joint.edges[0].bodyId];
    const bodyB = world.bodyArray[joint.edges[1].bodyId];

    b2WakeBody(world, bodyA);
    b2WakeBody(world, bodyB);
}

// External function declarations (these would be implemented elsewhere)
// export function b2GetDistanceJointForce(world, base) {}
// export function b2GetMotorJointForce(world, base) {}
// export function b2GetMouseJointForce(world, base) {}
// export function b2GetPrismaticJointForce(world, base) {}
// export function b2GetRevoluteJointForce(world, base) {}
// export function b2GetWeldJointForce(world, base) {}
// export function b2GetWheelJointForce(world, base) {}

/**
 * Gets the constraint force for a joint.
 * @function b2Joint_GetConstraintForce
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The constraint force vector. Returns (0,0) for unknown joint types.
 * @description
 * Returns the constraint force for different joint types including distance, motor,
 * mouse, prismatic, revolute, weld, and wheel joints. The force is retrieved from
 * the corresponding joint-specific force getter function.
 * @throws {Error} Throws an assertion error for unknown joint types.
 */
export function b2Joint_GetConstraintForce(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);
    const base = b2GetJointSim(world, joint);

    switch (joint.type)
    {
        case b2JointType.b2_distanceJoint:
            return b2GetDistanceJointForce(world, base);

        case b2JointType.b2_motorJoint:
            return b2GetMotorJointForce(world, base);

        case b2JointType.b2_mouseJoint:
            return b2GetMouseJointForce(world, base);

        case b2JointType.b2_prismaticJoint:
            return b2GetPrismaticJointForce(world, base);

        case b2JointType.b2_revoluteJoint:
            return b2GetRevoluteJointForce(world, base);

        case b2JointType.b2_weldJoint:
            return b2GetWeldJointForce(world, base);

        case b2JointType.b2_wheelJoint:
            return b2GetWheelJointForce(world, base);

        default:
            console.assert(false);

            return new b2Vec2(0, 0);
    }
}

// External function declarations (these would be implemented elsewhere)
// export function b2GetMotorJointTorque(world, base) {}
// export function b2GetMouseJointTorque(world, base) {}
// export function b2GetPrismaticJointTorque(world, base) {}
// export function b2GetRevoluteJointTorque(world, base) {}
// export function b2GetWeldJointTorque(world, base) {}
// export function b2GetWheelJointTorque(world, base) {}

/**
 * @function b2Joint_GetConstraintTorque
 * @summary Gets the constraint torque for a joint.
 * @param {b2JointId} jointId - The ID of the joint to get the constraint torque from.
 * @returns {number} The constraint torque value. Returns 0 for distance joints or if joint type is invalid.
 * @description
 * Returns the constraint torque for different joint types including motor, mouse, prismatic,
 * revolute, weld and wheel joints. For distance joints, it always returns 0.
 * @throws {Error} Throws an assertion error if an unsupported joint type is provided.
 */
export function b2Joint_GetConstraintTorque(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointFullId(world, jointId);
    const base = b2GetJointSim(world, joint);

    switch (joint.type)
    {
        case b2JointType.b2_distanceJoint:
            return 0.0;

        case b2JointType.b2_motorJoint:
            return b2GetMotorJointTorque(world, base);

        case b2JointType.b2_mouseJoint:
            return b2GetMouseJointTorque(world, base);

        case b2JointType.b2_prismaticJoint:
            return b2GetPrismaticJointTorque(world, base);

        case b2JointType.b2_revoluteJoint:
            return b2GetRevoluteJointTorque(world, base);

        case b2JointType.b2_weldJoint:
            return b2GetWeldJointTorque(world, base);

        case b2JointType.b2_wheelJoint:
            return b2GetWheelJointTorque(world, base);

        default:
            console.assert(false);

            return 0.0;
    }
}

export function b2PrepareJoint(joint, context)
{
    switch (joint.type)
    {
        case b2JointType.b2_distanceJoint:
            b2PrepareDistanceJoint(joint, context);

            break;

        case b2JointType.b2_motorJoint:
            b2PrepareMotorJoint(joint, context);

            break;

        case b2JointType.b2_mouseJoint:
            b2PrepareMouseJoint(joint, context);

            break;

        case b2JointType.b2_prismaticJoint:
            b2PreparePrismaticJoint(joint, context);

            break;

        case b2JointType.b2_revoluteJoint:
            b2PrepareRevoluteJoint(joint, context);

            break;

        case b2JointType.b2_weldJoint:
            b2PrepareWeldJoint(joint, context);

            break;

        case b2JointType.b2_wheelJoint:
            b2PrepareWheelJoint(joint, context);

            break;

        default:
            console.assert(false);
    }
}

export function b2WarmStartJoint(joint, context)
{
    switch (joint.type)
    {
        case b2JointType.b2_distanceJoint:
            b2WarmStartDistanceJoint(joint, context);

            break;

        case b2JointType.b2_motorJoint:
            b2WarmStartMotorJoint(joint, context);

            break;

        case b2JointType.b2_mouseJoint:
            b2WarmStartMouseJoint(joint, context);

            break;

        case b2JointType.b2_prismaticJoint:
            b2WarmStartPrismaticJoint(joint, context);

            break;

        case b2JointType.b2_revoluteJoint:
            b2WarmStartRevoluteJoint(joint, context);

            break;

        case b2JointType.b2_weldJoint:
            b2WarmStartWeldJoint(joint, context);

            break;

        case b2JointType.b2_wheelJoint:
            b2WarmStartWheelJoint(joint, context);

            break;

        default:
            console.assert(false);
    }
}

export function b2SolveJoint(joint, context, useBias)
{
    switch (joint.type)
    {
        case b2JointType.b2_distanceJoint:
            b2SolveDistanceJoint(joint, context, useBias);

            break;

        case b2JointType.b2_motorJoint:
            b2SolveMotorJoint(joint, context, useBias);

            break;

        case b2JointType.b2_mouseJoint:
            b2SolveMouseJoint(joint, context);

            break;

        case b2JointType.b2_prismaticJoint:
            b2SolvePrismaticJoint(joint, context, useBias);

            break;

        case b2JointType.b2_revoluteJoint:
            b2SolveRevoluteJoint(joint, context, useBias);

            break;

        case b2JointType.b2_weldJoint:
            b2SolveWeldJoint(joint, context, useBias);

            break;

        case b2JointType.b2_wheelJoint:
            b2SolveWheelJoint(joint, context, useBias);

            break;

        default:
            console.assert(false);
    }
}

export function b2PrepareOverflowJoints(context)
{
    const graph = context.graph;
    const joints = graph.colors[b2_overflowIndex].joints.data;
    const jointCount = graph.colors[b2_overflowIndex].joints.count;

    for (let i = 0; i < jointCount; ++i)
    {
        const joint = joints[i];
        b2PrepareJoint(joint, context);
    }
}

export function b2WarmStartOverflowJoints(context)
{
    const graph = context.graph;
    const joints = graph.colors[b2_overflowIndex].joints.data;
    const jointCount = graph.colors[b2_overflowIndex].joints.count;

    for (let i = 0; i < jointCount; ++i)
    {
        const joint = joints[i];
        b2WarmStartJoint(joint, context);
    }
}

export function b2SolveOverflowJoints(context, useBias)
{
    const graph = context.graph;
    const joints = graph.colors[b2_overflowIndex].joints.data;
    const jointCount = graph.colors[b2_overflowIndex].joints.count;

    for (let i = 0; i < jointCount; ++i)
    {
        const joint = joints[i];
        b2SolveJoint(joint, context, useBias);
    }
}

export function b2DrawJoint(draw, world, joint)
{
    const bodyA = b2GetBody(world, joint.edges[0].bodyId);
    const bodyB = b2GetBody(world, joint.edges[1].bodyId);

    if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet)
    {
        return;
    }

    const jointSim = b2GetJointSim(world, joint);
    console.assert(jointSim);

    const transformA = b2GetBodyTransformQuick(world, bodyA);
    const transformB = b2GetBodyTransformQuick(world, bodyB);
    const pA = b2TransformPoint(transformA, jointSim.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, jointSim.localOriginAnchorB);

    const color = b2HexColor.b2_colorDarkSeaGreen;

    switch (joint.type)
    {
        
        case b2JointType.b2_distanceJoint:
            b2DrawDistanceJoint(draw, jointSim, transformA, transformB);

            break;

        case b2JointType.b2_mouseJoint:
            {
                const target = jointSim.mouseJoint.targetA;

                const c1 = b2HexColor.b2_colorGreen;
                draw.DrawPoint(target.x, target.y, 4.0, c1, draw.context);
                draw.DrawPoint(pB.x, pB.y, 4.0, c1, draw.context);

                const c2 = b2HexColor.b2_colorGray8;
                draw.DrawSegment(target, pB, c2, draw.context);
            }

            break;

        case b2JointType.b2_prismaticJoint:
            b2DrawPrismaticJoint(draw, jointSim, transformA, transformB);

            break;

        case b2JointType.b2_revoluteJoint:
            b2DrawRevoluteJoint(draw, jointSim, transformA, transformB, joint.drawSize);

            break;

        case b2JointType.b2_wheelJoint:
            b2DrawWheelJoint(draw, jointSim, transformA, transformB);

            break;

        default:
            draw.DrawSegment(transformA.p, pA, color, draw.context);
            draw.DrawSegment(pA, pB, color, draw.context);
            draw.DrawSegment(transformB.p, pB, color, draw.context);
    }

    if (draw.drawGraphColors)
    {
        const colors = [ b2HexColor.b2_colorRed, b2HexColor.b2_colorOrange, b2HexColor.b2_colorYellow, b2HexColor.b2_colorGreen,
            b2HexColor.b2_colorCyan, b2HexColor.b2_colorBlue, b2HexColor.b2_colorViolet, b2HexColor.b2_colorPink,
            b2HexColor.b2_colorChocolate, b2HexColor.b2_colorGoldenrod, b2HexColor.b2_colorCoral, b2HexColor.b2_colorBlack ];

        const colorIndex = joint.colorIndex;

        if (colorIndex !== B2_NULL_INDEX)
        {
            const p = b2Lerp(pA, pB, 0.5);
            draw.DrawPoint(p.x, p.y, 5.0, colors[colorIndex], draw.context);
        }
    }
}
