/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Add, b2Cross, b2CrossSV, b2GetInverse22, b2Length, b2Mat22, b2MulAdd, b2MulMV, b2MulSV, b2Normalize, b2RotateVector, b2Sub, b2Vec2 } from "./include/math_functions_h.js";
import { b2GetJointSimCheckType, b2Joint_WakeBodies } from "./include/joint_h.js";

import { B2_NULL_INDEX } from "./include/core_h.js";
import { b2JointType } from "./include/types_h.js";
import { b2MakeSoft } from "./include/solver_h.js";
import { b2SetType } from "./include/world_h.js";

/**
 * @namespace MouseJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * @summary Sets the target position for a mouse joint.
 * @function b2MouseJoint_SetTarget
 * @param {b2JointId} jointId - The identifier of the mouse joint to modify.
 * @param {b2Vec2} target - The new target position vector to set.
 * @returns {void}
 * @description
 * Updates the target position of a mouse joint by cloning the provided target vector.
 * The joint must be of type b2_mouseJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_SetTarget(jointId, target)
{
    // b2Vec2_IsValid(target);
    b2Joint_WakeBodies(jointId);
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
    base.mouseJoint.targetA = target.clone();
}

/**
 * @function b2MouseJoint_GetTarget
 * @summary Gets the target point of a mouse joint.
 * @param {b2JointId} jointId - The identifier of the mouse joint.
 * @returns {b2Vec2} The target point of the mouse joint.
 * @throws {Error} If the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_GetTarget(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);

    return base.mouseJoint.targetA;
}

/**
 * @summary Sets the spring frequency (in Hertz) for a mouse joint.
 * @function b2MouseJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_SetSpringHertz(jointId, hertz)
{
    // b2IsValid(hertz) && hertz >= 0.0;
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
    base.mouseJoint.hertz = hertz;
}

/**
 * Gets the spring frequency in Hertz from a mouse joint.
 * @function b2MouseJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the mouse joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not a mouse joint type.
 */
export function b2MouseJoint_GetSpringHertz(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);

    return base.mouseJoint.hertz;
}

/**
 * Sets the damping ratio for a mouse joint.
 * @function b2MouseJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} dampingRatio - The damping ratio value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_SetSpringDampingRatio(jointId, dampingRatio)
{
    // b2IsValid(dampingRatio) && dampingRatio >= 0.0;
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
    base.mouseJoint.dampingRatio = dampingRatio;
}

/**
 * Gets the spring damping ratio of a mouse joint.
 * @function b2MouseJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier of the mouse joint.
 * @returns {number} The spring damping ratio value of the mouse joint.
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_GetSpringDampingRatio(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);

    return base.mouseJoint.dampingRatio;
}

/**
 * @summary Sets the maximum force for a mouse joint.
 * @function b2MouseJoint_SetMaxForce
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} maxForce - The maximum force value to set for the joint.
 * @returns {void}
 * @description
 * Sets the maximum force that can be applied by the mouse joint to maintain its constraint.
 * @throws {Error} Throws an error if the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_SetMaxForce(jointId, maxForce)
{
    // b2IsValid(maxForce) && maxForce >= 0.0;
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
    base.mouseJoint.maxForce = maxForce;
}

/**
 * Gets the maximum force value from a mouse joint.
 * @function b2MouseJoint_GetMaxForce
 * @param {b2JointId} jointId - The identifier for the mouse joint.
 * @returns {number} The maximum force value of the mouse joint.
 * @throws {Error} If the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_GetMaxForce(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);

    return base.mouseJoint.maxForce;
}

export function b2GetMouseJointForce(world, base)
{
    const force = b2MulSV(world.inv_h, base.mouseJoint.linearImpulse);

    return force;
}

export function b2GetMouseJointTorque(world, base)
{
    return world.inv_h * base.mouseJoint.angularImpulse;
}

export function b2PrepareMouseJoint(base, context)
{
    // base.type === b2JointType.b2_mouseJoint;

    const idB = base.bodyIdB;

    const world = context.world;
    const bodies = world.bodyArray;

    // b2CheckIndex(bodies, idB);

    const bodyB = bodies[idB];

    bodyB.setIndex === b2SetType.b2_awakeSet;

    // b2CheckIndex(world.solverSetArray, bodyB.setIndex);

    const setB = world.solverSetArray[bodyB.setIndex];

    const localIndexB = bodyB.localIndex;

    // 0 <= localIndexB && localIndexB <= setB.sims.count;

    const bodySimB = setB.sims.data[localIndexB];

    base.invMassB = bodySimB.invMass;
    base.invIB = bodySimB.invInertia;

    const joint = base.mouseJoint;
    joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
    joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));

    joint.linearSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);

    const angularHertz = 0.5;
    const angularDampingRatio = 0.1;
    joint.angularSoftness = b2MakeSoft(angularHertz, angularDampingRatio, context.h);

    const rB = joint.anchorB;
    const mB = bodySimB.invMass;
    const iB = bodySimB.invInertia;

    const K = new b2Mat22(
        new b2Vec2(mB + iB * rB.y * rB.y, -iB * rB.x * rB.y),
        new b2Vec2(-iB * rB.x * rB.y, mB + iB * rB.x * rB.x)
    );

    joint.linearMass = b2GetInverse22(K);
    joint.deltaCenter = b2Sub(bodySimB.center, joint.targetA);

    if (context.enableWarmStarting === false)
    {
        joint.linearImpulse = new b2Vec2(0, 0);
        joint.angularImpulse = 0.0;
    }
}

export function b2WarmStartMouseJoint(base, context)
{
    base.type === b2JointType.b2_mouseJoint;

    const mB = base.invMassB;
    const iB = base.invIB;

    const joint = base.mouseJoint;

    const stateB = context.states[joint.indexB];
    let vB = stateB.linearVelocity.clone();
    let wB = stateB.angularVelocity;

    const dqB = stateB.deltaRotation;
    const rB = b2RotateVector(dqB, joint.anchorB);

    vB = b2MulAdd(vB, mB, joint.linearImpulse);
    wB += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);

    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
}

export function b2SolveMouseJoint(base, context)
{
    const mB = base.invMassB;
    const iB = base.invIB;

    const joint = base.mouseJoint;
    const stateB = context.states[joint.indexB];

    let vB = stateB.linearVelocity.clone();
    let wB = stateB.angularVelocity;

    {
        const massScale = joint.angularSoftness.massScale;
        const impulseScale = joint.angularSoftness.impulseScale;

        let impulseStrength = iB > 0.0 ? -wB / iB : 0.0;
        impulseStrength = massScale * impulseStrength - impulseScale * joint.angularImpulse;
        joint.angularImpulse += impulseStrength;

        wB += iB * impulseStrength;
    }

    const maxImpulse = joint.maxForce * context.h;

    {
        const dqB = stateB.deltaRotation;
        const rB = b2RotateVector(dqB, joint.anchorB);
        const Cdot = b2Add(vB, b2CrossSV(wB, rB));

        const separation = b2Add(b2Add(stateB.deltaPosition, rB), joint.deltaCenter);
        const bias = b2MulSV(joint.linearSoftness.biasRate, separation);

        const massScale = joint.linearSoftness.massScale;
        const impulseScale = joint.linearSoftness.impulseScale;

        const b = b2MulMV(joint.linearMass, b2Add(Cdot, bias));

        const impulseVector = new b2Vec2(
            -massScale * b.x - impulseScale * joint.linearImpulse.x,
            -massScale * b.y - impulseScale * joint.linearImpulse.y);

        const oldImpulse = joint.linearImpulse.clone();
        joint.linearImpulse.x += impulseVector.x;
        joint.linearImpulse.y += impulseVector.y;

        const mag = b2Length(joint.linearImpulse);

        if (mag > maxImpulse)
        {
            joint.linearImpulse = b2MulSV(maxImpulse, b2Normalize(joint.linearImpulse));
        }

        impulseVector.x = joint.linearImpulse.x - oldImpulse.x;
        impulseVector.y = joint.linearImpulse.y - oldImpulse.y;

        vB = b2MulAdd(vB, mB, impulseVector);
        wB += iB * b2Cross(rB, impulseVector);
    }

    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
}
