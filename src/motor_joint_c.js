/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    B2_PI,
    b2Add,
    b2ClampFloat,
    b2Cross,
    b2CrossSV,
    b2GetInverse22,
    b2LengthSquared,
    b2Mat22,
    b2MulAdd,
    b2MulMV,
    b2MulSV,
    b2MulSub,
    b2Normalize,
    b2RelativeAngle,
    b2RotateVector,
    b2Sub,
    b2UnwindAngle,
    b2Vec2
} from './include/math_functions_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2BodyState } from './include/body_h.js';
import { b2GetJointSimCheckType } from './include/joint_h.js';
import { b2JointType } from './include/types_h.js';
import { b2SetType } from './include/world_h.js';

/**
 * @namespace MotorJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * @summary Sets the target linear offset for a motor joint.
 * @function b2MotorJoint_SetLinearOffset
 * @param {b2JointId} jointId - The identifier for the motor joint to modify.
 * @param {b2Vec2} linearOffset - The desired linear offset in local coordinates.
 * @returns {void}
 * @description
 * Updates the target linear offset of a motor joint. The linear offset represents
 * the desired translation between the two bodies connected by the joint.
 * @throws {Error} Throws if the joint is not a motor joint or if the jointId is invalid.
 */
export function b2MotorJoint_SetLinearOffset(jointId, linearOffset)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
    joint.motorJoint.linearOffset = linearOffset;
}

/**
 * Gets the linear offset of a motor joint.
 * @function b2MotorJoint_GetLinearOffset
 * @param {b2JointId} jointId - The identifier of the motor joint.
 * @returns {b2Vec2} The linear offset vector of the motor joint.
 * @throws {Error} If the joint is not a motor joint or the joint ID is invalid.
 */
export function b2MotorJoint_GetLinearOffset(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);

    return joint.motorJoint.linearOffset;
}

/**
 * @summary Sets the target angular offset for a motor joint.
 * @function b2MotorJoint_SetAngularOffset
 * @param {b2JointId} jointId - The identifier for the motor joint to modify.
 * @param {number} angularOffset - The desired angular offset in radians, clamped between -π and π.
 * @returns {void}
 * @description
 * Sets the target angular offset for a motor joint, which defines the desired relative rotation
 * between the connected bodies. The input angle is automatically clamped to the range [-π, π].
 * @throws {Error} Throws if the joint is not a motor joint type.
 */
export function b2MotorJoint_SetAngularOffset(jointId, angularOffset)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
    joint.motorJoint.angularOffset = b2ClampFloat(angularOffset, -B2_PI, B2_PI);
}

/**
 * @summary Gets the angular offset of a motor joint.
 * @function b2MotorJoint_GetAngularOffset
 * @param {b2JointId} jointId - The identifier of the motor joint.
 * @returns {number} The angular offset value of the motor joint in radians.
 * @throws {Error} Throws if the joint is not a motor joint or if the joint ID is invalid.
 */
export function b2MotorJoint_GetAngularOffset(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);

    return joint.motorJoint.angularOffset;
}

/**
 * Sets the maximum force that can be applied by a motor joint.
 * @function b2MotorJoint_SetMaxForce
 * @param {b2JointId} jointId - The identifier for the motor joint
 * @param {number} maxForce - The maximum force value to set. Will be clamped to non-negative values.
 * @returns {void}
 * @throws {Error} If the joint is not a motor joint type
 */
export function b2MotorJoint_SetMaxForce(jointId, maxForce)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
    joint.motorJoint.maxForce = Math.max(0.0, maxForce);
}

/**
 * Gets the maximum force value from a motor joint.
 * @function b2MotorJoint_GetMaxForce
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The maximum force value of the motor joint.
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_GetMaxForce(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);

    return joint.motorJoint.maxForce;
}

/**
 * Sets the maximum torque that can be applied by a motor joint.
 * @function b2MotorJoint_SetMaxTorque
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @param {number} maxTorque - The maximum torque value. Will be clamped to non-negative values.
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_SetMaxTorque(jointId, maxTorque)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
    joint.motorJoint.maxTorque = Math.max(0.0, maxTorque);
}

/**
 * Gets the maximum torque value for a motor joint.
 * @function b2MotorJoint_GetMaxTorque
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The maximum torque value of the motor joint.
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_GetMaxTorque(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);

    return joint.motorJoint.maxTorque;
}

/**
 * @function b2MotorJoint_SetCorrectionFactor
 * @summary Sets the position correction factor for a motor joint.
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @param {number} correctionFactor - The correction factor value, clamped between 0 and 1.
 * @returns {void}
 * @description
 * Sets the position correction factor for a motor joint, which determines how much position error is corrected each time step.
 * The correction factor is automatically clamped between 0 and 1.
 * @throws {Error} Throws an error if the joint is not a motor joint type.
 */
export function b2MotorJoint_SetCorrectionFactor(jointId, correctionFactor)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
    joint.motorJoint.correctionFactor = b2ClampFloat(correctionFactor, 0.0, 1.0);
}

/**
 * Gets the correction factor of a motor joint.
 * @function b2MotorJoint_GetCorrectionFactor
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The correction factor value of the motor joint.
 * @throws {Error} If the joint is not a motor joint type.
 */
export function b2MotorJoint_GetCorrectionFactor(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);

    return joint.motorJoint.correctionFactor;
}

export function b2GetMotorJointForce(world, base)
{
    const force = b2MulSV(world.inv_h, base.motorJoint.linearImpulse);

    return force;
}

export function b2GetMotorJointTorque(world, base)
{
    return world.inv_h * base.motorJoint.angularImpulse;
}

// Point-to-point constraint
// C = p2 - p1
// Cdot = v2 - v1
//      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
// J = [-I -r1_skew I r2_skew ]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)
// Angle constraint
// C = angle2 - angle1 - referenceAngle
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
// K = invI1 + invI2

export function b2PrepareMotorJoint(base, context)
{
    console.assert(base.type == b2JointType.b2_motorJoint);
    const idA = base.bodyIdA;
    const idB = base.bodyIdB;
    const world = context.world;
    const bodies = world.bodyArray;

    // b2CheckIndex(bodies, idA);
    // b2CheckIndex(bodies, idB);
    const bodyA = bodies[idA];
    const bodyB = bodies[idB];
    console.assert(bodyA.setIndex == b2SetType.b2_awakeSet || bodyB.setIndex == b2SetType.b2_awakeSet);

    // b2CheckIndex(world.solverSetArray, bodyA.setIndex);
    // b2CheckIndex(world.solverSetArray, bodyB.setIndex);
    const setA = world.solverSetArray[bodyA.setIndex];
    const setB = world.solverSetArray[bodyB.setIndex];
    const localIndexA = bodyA.localIndex;
    const localIndexB = bodyB.localIndex;
    console.assert(0 <= localIndexA && localIndexA <= setA.sims.count);
    console.assert(0 <= localIndexB && localIndexB <= setB.sims.count);
    const bodySimA = setA.sims.data[bodyA.localIndex];
    const bodySimB = setB.sims.data[bodyB.localIndex];
    const mA = bodySimA.invMass;
    const iA = bodySimA.invInertia;
    const mB = bodySimB.invMass;
    const iB = bodySimB.invInertia;
    base.invMassA = mA;
    base.invMassB = mB;
    base.invIA = iA;
    base.invIB = iB;
    const joint = base.motorJoint;
    joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
    joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.deltaCenter = b2Sub(b2Sub(bodySimB.center, bodySimA.center), joint.linearOffset);
    joint.deltaAngle = b2RelativeAngle(bodySimB.transform.q, bodySimA.transform.q) - joint.angularOffset;
    joint.deltaAngle = b2UnwindAngle(joint.deltaAngle);
    const rA = joint.anchorA;
    const rB = joint.anchorB;
    const K = new b2Mat22(
        new b2Vec2(0, 0),
        new b2Vec2(0, 0)
    );
    K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
    K.cx.y = -rA.y * rA.x * iA - rB.y * rB.x * iB;
    K.cy.x = K.cx.y;
    K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
    joint.linearMass = b2GetInverse22(K);
    const ka = iA + iB;
    joint.angularMass = ka > 0.0 ? 1.0 / ka : 0.0;

    if (context.enableWarmStarting == false)
    {
        joint.linearImpulse = new b2Vec2(0, 0);
        joint.angularImpulse = 0.0;
    }
}

export function b2WarmStartMotorJoint(base, context)
{
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;
    const joint = base.motorJoint;

    // dummy state for static bodies
    const dummyState = new b2BodyState();
    const bodyA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const bodyB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
    const rA = b2RotateVector(bodyA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(bodyB.deltaRotation, joint.anchorB);
    bodyA.linearVelocity = b2MulSub(bodyA.linearVelocity, mA, joint.linearImpulse);
    bodyA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + joint.angularImpulse);
    bodyB.linearVelocity = b2MulAdd(bodyB.linearVelocity, mB, joint.linearImpulse);
    bodyB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);
}

export function b2SolveMotorJoint(base, context, useBias)
{
    console.assert(base.type == b2JointType.b2_motorJoint);
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();
    const joint = base.motorJoint;
    const bodyA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const bodyB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
    let vA = bodyA.linearVelocity;
    let wA = bodyA.angularVelocity;
    let vB = bodyB.linearVelocity;
    let wB = bodyB.angularVelocity;

    // angular constraint
    {
        let angularSeperation = b2RelativeAngle(bodyB.deltaRotation, bodyA.deltaRotation) + joint.deltaAngle;
        angularSeperation = b2UnwindAngle(angularSeperation);
        const angularBias = context.inv_h * joint.correctionFactor * angularSeperation;
        const Cdot = wB - wA;
        let impulse = -joint.angularMass * (Cdot + angularBias);
        const oldImpulse = joint.angularImpulse;
        const maxImpulse = context.h * joint.maxTorque;
        joint.angularImpulse = b2ClampFloat(joint.angularImpulse + impulse, -maxImpulse, maxImpulse);
        impulse = joint.angularImpulse - oldImpulse;
        wA -= iA * impulse;
        wB += iB * impulse;
    }

    // linear constraint
    {
        const rA = b2RotateVector(bodyA.deltaRotation, joint.anchorA);
        const rB = b2RotateVector(bodyB.deltaRotation, joint.anchorB);
        const ds = b2Add(b2Sub(bodyB.deltaPosition, bodyA.deltaPosition), b2Sub(rB, rA));
        const linearSeparation = b2Add(joint.deltaCenter, ds);
        const linearBias = b2MulSV(context.inv_h * joint.correctionFactor, linearSeparation);
        const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));
        const b = b2MulMV(joint.linearMass, b2Add(Cdot, linearBias));
        let impulse = new b2Vec2(-b.x, -b.y);
        const oldImpulse = joint.linearImpulse;
        const maxImpulse = context.h * joint.maxForce;
        joint.linearImpulse = b2Add(joint.linearImpulse, impulse);

        if (b2LengthSquared(joint.linearImpulse) > maxImpulse * maxImpulse)
        {
            joint.linearImpulse = b2Normalize(joint.linearImpulse);
            joint.linearImpulse.x *= maxImpulse;
            joint.linearImpulse.y *= maxImpulse;
        }
        impulse = b2Sub(joint.linearImpulse, oldImpulse);
        vA = b2MulSub(vA, mA, impulse);
        wA -= iA * b2Cross(rA, impulse);
        vB = b2MulAdd(vB, mB, impulse);
        wB += iB * b2Cross(rB, impulse);
    }

    bodyA.linearVelocity = vA;
    bodyA.angularVelocity = wA;
    bodyB.linearVelocity = vB;
    bodyB.angularVelocity = wB;
}
