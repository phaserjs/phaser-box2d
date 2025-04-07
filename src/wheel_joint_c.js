/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Add, b2ClampFloat, b2Cross, b2Dot, b2LeftPerp, b2MulAdd, b2MulSV, b2MulSub, b2RotateVector, b2Sub, b2TransformPoint } from './include/math_functions_h.js';
import { b2GetWorld, b2SetType } from './include/world_h.js';
import { b2HexColor, b2JointType } from './include/types_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2BodyState } from './include/body_h.js';
import { b2GetJointSimCheckType } from './include/joint_h.js';
import { b2MakeSoft } from './include/solver_h.js';

/**
 * @namespace WheelJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * @function b2WheelJoint_EnableSpring
 * @description
 * Enables or disables the spring functionality of a wheel joint. When the spring state
 * changes, the spring impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify
 * @param {boolean} enableSpring - True to enable the spring, false to disable it
 * @returns {void}
 * @throws {Error} If the joint identified by jointId is not a wheel joint
 */
export function b2WheelJoint_EnableSpring(jointId, enableSpring)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    if (enableSpring !== joint.wheelJoint.enableSpring)
    {
        joint.wheelJoint.enableSpring = enableSpring;
        joint.wheelJoint.springImpulse = 0.0;
    }
}

/**
 * @summary Checks if the spring mechanism is enabled for a wheel joint.
 * @function b2WheelJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the spring is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_IsSpringEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.enableSpring;
}

/**
 * @summary Sets the spring frequency for a wheel joint.
 * @function b2WheelJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @description
 * Sets the spring frequency for a wheel joint's oscillation. The frequency is specified
 * in Hertz (Hz). The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_wheelJoint.
 */
export function b2WheelJoint_SetSpringHertz(jointId, hertz)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
    joint.wheelJoint.hertz = hertz;
}

/**
 * Gets the spring frequency in Hertz for a wheel joint.
 * @function b2WheelJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetSpringHertz(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.hertz;
}

/**
 * Sets the damping ratio for a wheel joint's spring.
 * @function b2WheelJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify
 * @param {number} dampingRatio - The damping ratio for the spring (0 = no damping, 1 = critical damping)
 * @returns {void}
 * @throws {Error} If the joint is not a wheel joint type
 */
export function b2WheelJoint_SetSpringDampingRatio(jointId, dampingRatio)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
    joint.wheelJoint.dampingRatio = dampingRatio;
}

/**
 * Gets the damping ratio of a wheel joint's spring.
 * @function b2WheelJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The spring damping ratio value.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetSpringDampingRatio(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.dampingRatio;
}

/**
 * @function b2WheelJoint_EnableLimit
 * @summary Enables or disables the joint's translation limit.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {boolean} enableLimit - True to enable the translation limit, false to disable it.
 * @returns {void}
 * @description
 * Sets whether the wheel joint's translation limit is active. When the limit is enabled,
 * the joint's translation will be constrained. When the limit state changes, the joint's
 * lower and upper impulses are reset to zero.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_EnableLimit(jointId, enableLimit)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    if (joint.wheelJoint.enableLimit !== enableLimit)
    {
        joint.wheelJoint.lowerImpulse = 0.0;
        joint.wheelJoint.upperImpulse = 0.0;
        joint.wheelJoint.enableLimit = enableLimit;
    }
}

/**
 * @summary Checks if the limit is enabled for a wheel joint.
 * @function b2WheelJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the limit is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint.
 */
export function b2WheelJoint_IsLimitEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.enableLimit;
}

/**
 * Gets the lower translation limit of a wheel joint.
 * @function b2WheelJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The lower translation limit of the wheel joint.
 * @throws {Error} If the joint is not a wheel joint or the jointId is invalid.
 */
export function b2WheelJoint_GetLowerLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.lowerTranslation;
}

/**
 * Gets the upper translation limit of a wheel joint.
 * @function b2WheelJoint_GetUpperLimit
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The upper translation limit of the wheel joint.
 * @throws {Error} If the joint is not a wheel joint or the joint ID is invalid.
 */
export function b2WheelJoint_GetUpperLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.upperTranslation;
}

/**
 * @function b2WheelJoint_SetLimits
 * @summary Sets the translation limits for a wheel joint.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {number} lower - The lower translation limit.
 * @param {number} upper - The upper translation limit.
 * @returns {void}
 * @description
 * Sets new translation limits for a wheel joint. The function automatically orders
 * the limits so that the lower value is always less than or equal to the upper value.
 * When the limits change, the joint's impulses are reset to zero.
 * @throws {Error} If the provided jointId does not reference a valid wheel joint.
 */
export function b2WheelJoint_SetLimits(jointId, lower, upper)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    if (lower !== joint.wheelJoint.lowerTranslation || upper !== joint.wheelJoint.upperTranslation)
    {
        joint.wheelJoint.lowerTranslation = Math.min(lower, upper);
        joint.wheelJoint.upperTranslation = Math.max(lower, upper);
        joint.wheelJoint.lowerImpulse = 0.0;
        joint.wheelJoint.upperImpulse = 0.0;
    }
}

/**
 * @function b2WheelJoint_EnableMotor
 * @description
 * Enables or disables the motor on a wheel joint. When the motor state changes,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the wheel joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not a wheel joint type
 */
export function b2WheelJoint_EnableMotor(jointId, enableMotor)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    if (joint.wheelJoint.enableMotor !== enableMotor)
    {
        joint.wheelJoint.motorImpulse = 0.0;
        joint.wheelJoint.enableMotor = enableMotor;
    }
}

/**
 * @summary Checks if the motor is enabled on a wheel joint.
 * @function b2WheelJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_IsMotorEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.enableMotor;
}

/**
 * @summary Sets the motor speed for a wheel joint.
 * @function b2WheelJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_SetMotorSpeed(jointId, motorSpeed)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
    joint.wheelJoint.motorSpeed = motorSpeed;
}

/**
 * Gets the motor speed of a wheel joint.
 * @function b2WheelJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The current motor speed of the wheel joint in radians per second.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetMotorSpeed(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.motorSpeed;
}

/**
 * @function b2WheelJoint_GetMotorTorque
 * @summary Gets the current motor torque of a wheel joint.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The current motor torque normalized by the step time (N⋅m).
 * @description
 * Calculates the motor torque by multiplying the motor impulse by the inverse
 * of the time step. The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws if the joint type is not b2_wheelJoint.
 */
export function b2WheelJoint_GetMotorTorque(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return world.inv_h * joint.wheelJoint.motorImpulse;
}

/**
 * @summary Sets the maximum motor torque for a wheel joint.
 * @function b2WheelJoint_SetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {number} torque - The maximum motor torque value to set.
 * @returns {void}
 * @description
 * Sets the maximum torque that can be applied by the wheel joint's motor.
 * The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_wheelJoint.
 */
export function b2WheelJoint_SetMaxMotorTorque(jointId, torque)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
    joint.wheelJoint.maxMotorTorque = torque;
}

/**
 * Gets the maximum motor torque of a wheel joint.
 * @function b2WheelJoint_GetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The maximum motor torque value.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetMaxMotorTorque(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);

    return joint.wheelJoint.maxMotorTorque;
}

export function b2GetWheelJointForce(world, base)
{
    const joint = base.wheelJoint;

    const axisA = joint.axisA;
    const perpA = b2LeftPerp(axisA);

    const perpForce = world.inv_h * joint.perpImpulse;
    const axialForce = world.inv_h * (joint.springImpulse + joint.lowerImpulse - joint.upperImpulse);

    const force = b2Add(b2MulSV(perpForce, perpA), b2MulSV(axialForce, axisA));

    return force;
}

export function b2GetWheelJointTorque(world, base)
{
    return world.inv_h * base.wheelJoint.motorImpulse;
}

// Linear constraint (point-to-line)
// d = pB - pA = xB + rB - xA - rA
// C = dot(ay, d)
// Cdot = dot(d, cross(wA, ay)) + dot(ay, vB + cross(wB, rB) - vA - cross(wA, rA))
//      = -dot(ay, vA) - dot(cross(d + rA, ay), wA) + dot(ay, vB) + dot(cross(rB, ay), vB)
// J = [-ay, -cross(d + rA, ay), ay, cross(rB, ay)]

// Spring linear constraint
// C = dot(ax, d)
// Cdot = = -dot(ax, vA) - dot(cross(d + rA, ax), wA) + dot(ax, vB) + dot(cross(rB, ax), vB)
// J = [-ax -cross(d+rA, ax) ax cross(rB, ax)]

// Motor rotational constraint
// Cdot = wB - wA
// J = [0 0 -1 0 0 1]

export function b2PrepareWheelJoint(base, context)
{
    console.assert(base.type == b2JointType.b2_wheelJoint);

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

    const joint = base.wheelJoint;

    joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;

    const qA = bodySimA.transform.q;
    const qB = bodySimB.transform.q;

    joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.axisA = b2RotateVector(qA, joint.localAxisA);
    joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);

    const rA = joint.anchorA;
    const rB = joint.anchorB;

    const d = b2Add(joint.deltaCenter, b2Sub(rB, rA));
    const axisA = joint.axisA;
    const perpA = b2LeftPerp(axisA);

    const s1 = b2Cross(b2Add(d, rA), perpA);
    const s2 = b2Cross(rB, perpA);

    const kp = mA + mB + iA * s1 * s1 + iB * s2 * s2;
    joint.perpMass = kp > 0.0 ? 1.0 / kp : 0.0;

    const a1 = b2Cross(b2Add(d, rA), axisA);
    const a2 = b2Cross(rB, axisA);

    const ka = mA + mB + iA * a1 * a1 + iB * a2 * a2;
    joint.axialMass = ka > 0.0 ? 1.0 / ka : 0.0;

    joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);

    const km = iA + iB;
    joint.motorMass = km > 0.0 ? 1.0 / km : 0.0;

    if (context.enableWarmStarting == false)
    {
        joint.perpImpulse = 0.0;
        joint.springImpulse = 0.0;
        joint.motorImpulse = 0.0;
        joint.lowerImpulse = 0.0;
        joint.upperImpulse = 0.0;
    }
}

export function b2WarmStartWheelJoint(base, context)
{
    console.assert(base.type == b2JointType.b2_wheelJoint);

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    const dummyState = new b2BodyState();

    const joint = base.wheelJoint;

    const stateA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
    const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
    const perpA = b2LeftPerp(axisA);

    const a1 = b2Cross(b2Add(d, rA), axisA);
    const a2 = b2Cross(rB, axisA);
    const s1 = b2Cross(b2Add(d, rA), perpA);
    const s2 = b2Cross(rB, perpA);

    const axialImpulse = joint.springImpulse + joint.lowerImpulse - joint.upperImpulse;

    const P = b2Add(b2MulSV(axialImpulse, axisA), b2MulSV(joint.perpImpulse, perpA));
    const LA = axialImpulse * a1 + joint.perpImpulse * s1 + joint.motorImpulse;
    const LB = axialImpulse * a2 + joint.perpImpulse * s2 + joint.motorImpulse;

    stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
    stateA.angularVelocity -= iA * LA;
    stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
    stateB.angularVelocity += iB * LB;
}

export function b2SolveWheelJoint(base, context, useBias)
{
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.wheelJoint;

    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    let vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    let vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;

    const fixedRotation = (iA + iB === 0.0);

    // current anchors
    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
    const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
    const translation = b2Dot(axisA, d);

    const a1 = b2Cross(b2Add(d, rA), axisA);
    const a2 = b2Cross(rB, axisA);

    // motor constraint
    if (joint.enableMotor && fixedRotation === false)
    {
        const Cdot = wB - wA - joint.motorSpeed;
        let impulse = -joint.motorMass * Cdot;
        const oldImpulse = joint.motorImpulse;
        const maxImpulse = context.h * joint.maxMotorTorque;
        joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
        impulse = joint.motorImpulse - oldImpulse;

        wA -= iA * impulse;
        wB += iB * impulse;
    }

    // spring constraint
    if (joint.enableSpring)
    {
        const C = translation;
        const bias = joint.springSoftness.biasRate * C;
        const massScale = joint.springSoftness.massScale;
        const impulseScale = joint.springSoftness.impulseScale;

        const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
        const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.springImpulse;
        joint.springImpulse += impulse;

        const P = b2MulSV(impulse, axisA);
        const LA = impulse * a1;
        const LB = impulse * a2;

        vA = b2MulSub(vA, mA, P);
        wA -= iA * LA;
        vB = b2MulAdd(vB, mB, P);
        wB += iB * LB;
    }

    if (joint.enableLimit)
    {
        const translation = b2Dot(axisA, d);

        // Lower limit
        {
            const C = translation - joint.lowerTranslation;
            let bias = 0.0;
            let massScale = 1.0;
            let impulseScale = 0.0;

            if (C > 0.0)
            {
                // speculation
                bias = C * context.inv_h;
            }
            else if (useBias)
            {
                bias = context.jointSoftness.biasRate * C;
                massScale = context.jointSoftness.massScale;
                impulseScale = context.jointSoftness.impulseScale;
            }

            const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
            let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
            const oldImpulse = joint.lowerImpulse;
            joint.lowerImpulse = Math.max(oldImpulse + impulse, 0.0);
            impulse = joint.lowerImpulse - oldImpulse;

            const P = b2MulSV(impulse, axisA);
            const LA = impulse * a1;
            const LB = impulse * a2;

            vA = b2MulSub(vA, mA, P);
            wA -= iA * LA;
            vB = b2MulAdd(vB, mB, P);
            wB += iB * LB;
        }

        // Upper limit
        {
            const C = joint.upperTranslation - translation;
            let bias = 0.0;
            let massScale = 1.0;
            let impulseScale = 0.0;

            if (C > 0.0)
            {
                // speculation
                bias = C * context.inv_h;
            }
            else if (useBias)
            {
                bias = context.jointSoftness.biasRate * C;
                massScale = context.jointSoftness.massScale;
                impulseScale = context.jointSoftness.impulseScale;
            }

            const Cdot = b2Dot(axisA, b2Sub(vA, vB)) + a1 * wA - a2 * wB;
            let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.upperImpulse;
            const oldImpulse = joint.upperImpulse;
            joint.upperImpulse = Math.max(oldImpulse + impulse, 0.0);
            impulse = joint.upperImpulse - oldImpulse;

            const P = b2MulSV(impulse, axisA);
            const LA = impulse * a1;
            const LB = impulse * a2;

            vA = b2MulAdd(vA, mA, P);
            wA += iA * LA;
            vB = b2MulSub(vB, mB, P);
            wB -= iB * LB;
        }
    }

    // point to line constraint
    {
        const perpA = b2LeftPerp(axisA);

        let bias = 0.0;
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias)
        {
            const C = b2Dot(perpA, d);
            bias = context.jointSoftness.biasRate * C;
            massScale = context.jointSoftness.massScale;
            impulseScale = context.jointSoftness.impulseScale;
        }

        const s1 = b2Cross(b2Add(d, rA), perpA);
        const s2 = b2Cross(rB, perpA);
        const Cdot = b2Dot(perpA, b2Sub(vB, vA)) + s2 * wB - s1 * wA;

        const impulse = -massScale * joint.perpMass * (Cdot + bias) - impulseScale * joint.perpImpulse;
        joint.perpImpulse += impulse;

        const P = b2MulSV(impulse, perpA);
        const LA = impulse * s1;
        const LB = impulse * s2;

        vA = b2MulSub(vA, mA, P);
        wA -= iA * LA;
        vB = b2MulAdd(vB, mB, P);
        wB += iB * LB;
    }

    stateA.linearVelocity = vA;
    stateA.angularVelocity = wA;
    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
}

/*
NOTE: unconverted C code

void b2WheelJoint_Dump()
{
	int32 indexA = joint.bodyA.joint.islandIndex;
	int32 indexB = joint.bodyB.joint.islandIndex;

	b2Dump("  b2WheelJointDef jd;\n");
	b2Dump("  jd.bodyA = sims[%d];\n", indexA);
	b2Dump("  jd.bodyB = sims[%d];\n", indexB);
	b2Dump("  jd.collideConnected = bool(%d);\n", joint.collideConnected);
	b2Dump("  jd.localAnchorA.Set(%.9g, %.9g);\n", joint.localAnchorA.x, joint.localAnchorA.y);
	b2Dump("  jd.localAnchorB.Set(%.9g, %.9g);\n", joint.localAnchorB.x, joint.localAnchorB.y);
	b2Dump("  jd.referenceAngle = %.9g;\n", joint.referenceAngle);
	b2Dump("  jd.enableLimit = bool(%d);\n", joint.enableLimit);
	b2Dump("  jd.lowerAngle = %.9g;\n", joint.lowerAngle);
	b2Dump("  jd.upperAngle = %.9g;\n", joint.upperAngle);
	b2Dump("  jd.enableMotor = bool(%d);\n", joint.enableMotor);
	b2Dump("  jd.motorSpeed = %.9g;\n", joint.motorSpeed);
	b2Dump("  jd.maxMotorTorque = %.9g;\n", joint.maxMotorTorque);
	b2Dump("  joints[%d] = joint.world.CreateJoint(&jd);\n", joint.index);
}
 */

export function b2DrawWheelJoint(draw, base, transformA, transformB)
{
    console.assert( base.type == b2JointType.b2_wheelJoint );

    const joint = base.wheelJoint;

    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
    const axis = b2RotateVector(transformA.q, joint.localAxisA);

    const c1 = b2HexColor.b2_colorGray7;
    const c2 = b2HexColor.b2_colorGreen;
    const c3 = b2HexColor.b2_colorRed;
    const c4 = b2HexColor.b2_colorGray4;
    const c5 = b2HexColor.b2_colorBlue;

    draw.DrawSegment(pA, pB, c5, draw.context);

    if (joint.enableLimit)
    {
        const lower = b2MulAdd(pA, joint.lowerTranslation, axis);
        const upper = b2MulAdd(pA, joint.upperTranslation, axis);
        const perp = b2LeftPerp(axis);
        draw.DrawSegment(lower, upper, c1, draw.context);
        draw.DrawSegment(b2MulSub(lower, 0.1, perp), b2MulAdd(lower, 0.1, perp), c2, draw.context);
        draw.DrawSegment(b2MulSub(upper, 0.1, perp), b2MulAdd(upper, 0.1, perp), c3, draw.context);
    }
    else
    {
        draw.DrawSegment(b2MulSub(pA, 1.0, axis), b2MulAdd(pA, 1.0, axis), c1, draw.context);
    }

    draw.DrawPoint(pA.x, pA.y, 5.0, c1, draw.context);
    draw.DrawPoint(pB.x, pB.y, 5.0, c4, draw.context);
}
