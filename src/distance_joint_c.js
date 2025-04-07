/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_HUGE, B2_NULL_INDEX, b2_lengthUnitsPerMeter, b2_linearSlop } from './include/core_h.js';
import {
    b2Add,
    b2ClampFloat,
    b2Cross,
    b2CrossSV,
    b2Dot,
    b2Length,
    b2MulAdd,
    b2MulSV,
    b2MulSub,
    b2Normalize,
    b2RightPerp,
    b2RotateVector,
    b2Sub,
    b2TransformPoint
} from './include/math_functions_h.js';
import { b2BodyState, b2GetBodyTransform } from './include/body_h.js';
import { b2GetWorld, b2SetType } from './include/world_h.js';
import { b2HexColor, b2JointType } from './include/types_h.js';

import { b2GetJointSimCheckType } from './include/joint_h.js';
import { b2MakeSoft } from './include/solver_h.js';

/**
 * @namespace DistanceJoint
*/

/**
 * @import {b2JointId} from './include/id_h'
 */

/**
 * @function b2DistanceJoint_SetLength
 * @summary Sets the target length of a distance joint and resets its impulses.
 * @param {b2JointId} jointId - The identifier of the distance joint to modify.
 * @param {number} length - The desired length of the joint, clamped between b2_linearSlop and B2_HUGE.
 * @returns {void}
 * @description
 * Sets the target length of a distance joint. The length value is automatically
 * clamped between b2_linearSlop and B2_HUGE. After setting the length,
 * the joint's impulse values are reset to zero.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_SetLength(jointId, length)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    joint.length = b2ClampFloat(length, b2_linearSlop, B2_HUGE);
    joint.impulse = 0.0;
    joint.lowerImpulse = 0.0;
    joint.upperImpulse = 0.0;
}

/**
 * @summary Gets the length of a distance joint.
 * @function b2DistanceJoint_GetLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current length of the distance joint.
 * @description
 * Returns the current length of a distance joint. The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_GetLength(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    return joint.length;
}

/**
 * @summary Enables or disables the limit constraint on a distance joint.
 * @function b2DistanceJoint_EnableLimit
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {boolean} enableLimit - True to enable the joint's limit, false to disable it.
 * @returns {void}
 * @description
 * Sets the enable/disable state of the limit constraint for a distance joint.
 * The joint must be of type b2_distanceJoint or an error will occur.
 * @throws {Error} Throws an error if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_EnableLimit(jointId, enableLimit)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;
    joint.enableLimit = enableLimit;
}

/**
 * @summary Checks if the limit is enabled for a distance joint.
 * @function b2DistanceJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the limit is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_IsLimitEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return joint.distanceJoint.enableLimit;
}

/**
 * @function b2DistanceJoint_SetLengthRange
 * @description
 * Sets the minimum and maximum length constraints for a distance joint.
 * The values are clamped between b2_linearSlop and B2_HUGE.
 * The function resets all impulse values to zero after updating the length range.
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @param {number} minLength - The minimum allowed length of the joint
 * @param {number} maxLength - The maximum allowed length of the joint
 * @returns {void}
 * @throws {Error} If the joint type is not b2_distanceJoint
 */
export function b2DistanceJoint_SetLengthRange(jointId, minLength, maxLength)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    minLength = b2ClampFloat(minLength, b2_linearSlop, B2_HUGE);
    maxLength = b2ClampFloat(maxLength, b2_linearSlop, B2_HUGE);
    joint.minLength = Math.min(minLength, maxLength);
    joint.maxLength = Math.max(minLength, maxLength);
    joint.impulse = 0.0;
    joint.lowerImpulse = 0.0;
    joint.upperImpulse = 0.0;
}

/**
 * Gets the minimum length of a distance joint.
 * @function b2DistanceJoint_GetMinLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The minimum length value of the distance joint.
 * @throws {Error} If the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_GetMinLength(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    return joint.minLength;
}

/**
 * Gets the maximum length of a distance joint.
 * @function b2DistanceJoint_GetMaxLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The maximum length value of the distance joint.
 * @throws {Error} If the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_GetMaxLength(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    return joint.maxLength;
}

/**
 * @function b2DistanceJoint_GetCurrentLength
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @returns {number} The current length between the two anchor points of the distance joint
 * @description
 * Calculates the current distance between the two anchor points of a distance joint
 * in world coordinates. The function transforms the local anchor points of both bodies
 * to world coordinates and computes the distance between them.
 * @throws {Error} Returns 0 if the world is locked
 */
export function b2DistanceJoint_GetCurrentLength(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    const world = b2GetWorld(jointId.world0);

    if (world.locked)
    {
        return 0.0;
    }

    const transformA = b2GetBodyTransform(world, base.bodyIdA);
    const transformB = b2GetBodyTransform(world, base.bodyIdB);

    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
    const d = b2Sub(pB, pA);
    const length = b2Length(d);

    return length;
}

/**
 * @summary Enables or disables the spring behavior of a distance joint.
 * @function b2DistanceJoint_EnableSpring
 * @param {b2JointId} jointId - The identifier of the distance joint to modify.
 * @param {boolean} enableSpring - True to enable spring behavior, false to disable it.
 * @returns {void}
 * @description
 * Sets the spring behavior state of a distance joint. When enabled, the joint acts like
 * a spring between two bodies. When disabled, the joint maintains a fixed distance
 * between the connected bodies.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_EnableSpring(jointId, enableSpring)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    base.distanceJoint.enableSpring = enableSpring;
}

/**
 * @summary Checks if the spring mechanism is enabled for a distance joint.
 * @function b2DistanceJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the spring mechanism is enabled, false otherwise.
 * @description
 * Returns the state of the spring enable flag for the specified distance joint.
 * The function validates that the joint is of type b2_distanceJoint before
 * accessing the spring enable property.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_IsSpringEnabled(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return base.distanceJoint.enableSpring;
}

/**
 * @summary Sets the spring frequency (hertz) of a distance joint.
 * @function b2DistanceJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (oscillations per second).
 * @returns {void}
 * @description
 * Sets the spring oscillation frequency for a distance joint. The frequency
 * determines how quickly the spring oscillates when disturbed from equilibrium.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_SetSpringHertz(jointId, hertz)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    base.distanceJoint.hertz = hertz;
}

/**
 * Sets the damping ratio for a distance joint's spring.
 * @function b2DistanceJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the distance joint to modify
 * @param {number} dampingRatio - The damping ratio for the spring (0 = no damping, 1 = critical damping)
 * @returns {void}
 * @description
 * Sets the damping ratio parameter for a distance joint's spring mechanism.
 * The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint
 */
export function b2DistanceJoint_SetSpringDampingRatio(jointId, dampingRatio)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    base.distanceJoint.dampingRatio = dampingRatio;
}

/**
 * Gets the hertz frequency parameter of a distance joint.
 * @function b2DistanceJoint_GetSpringHertz
 * @param {number} jointId - The identifier for the distance joint.
 * @returns {number} The hertz frequency value of the distance joint.
 * @throws {Error} If the joint is not a distance joint or the jointId is invalid.
 */
export function b2DistanceJoint_GetSpringHertz(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    return joint.hertz;
}

/**
 * Gets the damping ratio of a distance joint.
 * @function b2DistanceJoint_GetSpringDampingRatio
 * @param {number} jointId - The identifier for the distance joint.
 * @returns {number} The damping ratio of the distance joint.
 * @throws {Error} If the joint is not a distance joint or the jointId is invalid.
 */
export function b2DistanceJoint_GetSpringDampingRatio(jointId)
{
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    const joint = base.distanceJoint;

    return joint.dampingRatio;
}

/**
 * @function b2DistanceJoint_EnableMotor
 * @description
 * Enables or disables the motor on a distance joint. When the motor state changes,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not a distance joint type
 */
export function b2DistanceJoint_EnableMotor(jointId, enableMotor)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    if (enableMotor !== joint.distanceJoint.enableMotor)
    {
        joint.distanceJoint.enableMotor = enableMotor;
        joint.distanceJoint.motorImpulse = 0.0;
    }
}

/**
 * @summary Checks if the motor is enabled on a distance joint.
 * @function b2DistanceJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_IsMotorEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return joint.distanceJoint.enableMotor;
}

/**
 * Sets the motor speed for a distance joint.
 * @function b2DistanceJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} motorSpeed - The new motor speed value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a distance joint type.
 */
export function b2DistanceJoint_SetMotorSpeed(jointId, motorSpeed)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    joint.distanceJoint.motorSpeed = motorSpeed;
}

/**
 * Gets the motor speed of a distance joint.
 * @function b2DistanceJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current motor speed of the distance joint in radians per second.
 * @throws {Error} If the joint is not a distance joint or the joint ID is invalid.
 */
export function b2DistanceJoint_GetMotorSpeed(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return joint.distanceJoint.motorSpeed;
}

/**
 * Gets the current motor force for a distance joint.
 * @function b2DistanceJoint_GetMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current motor force in Newtons, calculated as the motor impulse divided by the step time.
 * @description
 * Calculates the motor force by dividing the joint's motor impulse by the inverse time step (inv_h).
 * The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_GetMotorForce(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return world.inv_h * base.distanceJoint.motorImpulse;
}

/**
 * Sets the maximum motor force for a distance joint.
 * @function b2DistanceJoint_SetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} force - The maximum force the motor can generate.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a distance joint type.
 */
export function b2DistanceJoint_SetMaxMotorForce(jointId, force)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
    joint.distanceJoint.maxMotorForce = force;
}

/**
 * Gets the maximum motor force of a distance joint.
 * @function b2DistanceJoint_GetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The maximum force that can be applied by the joint's motor.
 * @throws {Error} If the joint is not a distance joint or the joint ID is invalid.
 */
export function b2DistanceJoint_GetMaxMotorForce(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);

    return joint.distanceJoint.maxMotorForce;
}

export function b2GetDistanceJointForce(world, base)
{
    const joint = base.distanceJoint;

    const transformA = b2GetBodyTransform(world, base.bodyIdA);
    const transformB = b2GetBodyTransform(world, base.bodyIdB);

    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
    const d = b2Sub(pB, pA);
    const axis = b2Normalize(d);
    const force = (joint.impulse + joint.lowerImpulse - joint.upperImpulse + joint.motorImpulse) * world.inv_h;

    return b2MulSV(force, axis);
}

export function b2PrepareDistanceJoint(base, context)
{
    const world = context.world;
    const bodies = world.bodyArray;

    const idA = base.bodyIdA;
    const idB = base.bodyIdB;

    const bodyA = bodies[idA];
    const bodyB = bodies[idB];

    const setA = world.solverSetArray[bodyA.setIndex];
    const setB = world.solverSetArray[bodyB.setIndex];

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

    const joint = base.distanceJoint;

    joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? bodyA.localIndex : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? bodyB.localIndex : B2_NULL_INDEX;

    joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);

    const rA = joint.anchorA;
    const rB = joint.anchorB;
    const separation = b2Add(b2Sub(rB, rA), joint.deltaCenter);
    const axis = b2Normalize(separation);

    const crA = b2Cross(rA, axis);
    const crB = b2Cross(rB, axis);
    const k = mA + mB + iA * crA * crA + iB * crB * crB;
    joint.axialMass = k > 0.0 ? 1.0 / k : 0.0;

    joint.distanceSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);

    if (context.enableWarmStarting === false)
    {
        joint.impulse = 0.0;
        joint.lowerImpulse = 0.0;
        joint.upperImpulse = 0.0;
        joint.motorImpulse = 0.0;
    }
}

export function b2WarmStartDistanceJoint(base, context)
{
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    const dummyState = new b2BodyState();

    const joint = base.distanceJoint;
    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const ds = b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), b2Sub(rB, rA));
    const separation = b2Add(joint.deltaCenter, ds);
    const axis = b2Normalize(separation);

    const axialImpulse = joint.impulse + joint.lowerImpulse - joint.upperImpulse + joint.motorImpulse;
    const P = b2MulSV(axialImpulse, axis);

    stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
    stateA.angularVelocity -= iA * b2Cross(rA, P);
    stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
    stateB.angularVelocity += iB * b2Cross(rB, P);
}

export function b2SolveDistanceJoint(base, context, useBias)
{
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    const dummyState = new b2BodyState();

    const joint = base.distanceJoint;
    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    let vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    let vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const ds = b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), b2Sub(rB, rA));
    const separation = b2Add(joint.deltaCenter, ds);

    const length = b2Length(separation);
    const axis = b2Normalize(separation);

    if (joint.enableSpring && (joint.minLength < joint.maxLength || joint.enableLimit === false))
    {
        if (joint.hertz > 0.0)
        {
            const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
            const Cdot = b2Dot(axis, vr);
            const C = length - joint.length;
            const bias = joint.distanceSoftness.biasRate * C;

            const m = joint.distanceSoftness.massScale * joint.axialMass;
            const impulse = -m * (Cdot + bias) - joint.distanceSoftness.impulseScale * joint.impulse;
            joint.impulse += impulse;

            const P = b2MulSV(impulse, axis);
            vA = b2MulSub(vA, mA, P);
            wA -= iA * b2Cross(rA, P);
            vB = b2MulAdd(vB, mB, P);
            wB += iB * b2Cross(rB, P);
        }

        if (joint.enableLimit)
        {
            {
                const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
                const Cdot = b2Dot(axis, vr);

                const C = length - joint.minLength;

                let bias = 0.0;
                let massCoeff = 1.0;
                let impulseCoeff = 0.0;

                if (C > 0.0)
                {
                    bias = C * context.inv_h;
                }
                else if (useBias)
                {
                    bias = context.jointSoftness.biasRate * C;
                    massCoeff = context.jointSoftness.massScale;
                    impulseCoeff = context.jointSoftness.impulseScale;
                }

                const impulse = -massCoeff * joint.axialMass * (Cdot + bias) - impulseCoeff * joint.lowerImpulse;
                const newImpulse = Math.max(0.0, joint.lowerImpulse + impulse);
                const deltaImpulse = newImpulse - joint.lowerImpulse;
                joint.lowerImpulse = newImpulse;

                const P = b2MulSV(deltaImpulse, axis);
                vA = b2MulSub(vA, mA, P);
                wA -= iA * b2Cross(rA, P);
                vB = b2MulAdd(vB, mB, P);
                wB += iB * b2Cross(rB, P);
            }

            {
                const vr = b2Add(b2Sub(vA, vB), b2Sub(b2CrossSV(wA, rA), b2CrossSV(wB, rB)));
                const Cdot = b2Dot(axis, vr);

                const C = joint.maxLength - length;

                let bias = 0.0;
                let massScale = 1.0;
                let impulseScale = 0.0;

                if (C > 0.0)
                {
                    bias = C * context.inv_h;
                }
                else if (useBias)
                {
                    bias = context.jointSoftness.biasRate * C;
                    massScale = context.jointSoftness.massScale;
                    impulseScale = context.jointSoftness.impulseScale;
                }

                const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.upperImpulse;
                const newImpulse = Math.max(0.0, joint.upperImpulse + impulse);
                const deltaImpulse = newImpulse - joint.upperImpulse;
                joint.upperImpulse = newImpulse;

                const P = b2MulSV(-deltaImpulse, axis);
                vA = b2MulSub(vA, mA, P);
                wA -= iA * b2Cross(rA, P);
                vB = b2MulAdd(vB, mB, P);
                wB += iB * b2Cross(rB, P);
            }
        }

        if (joint.enableMotor)
        {
            const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
            const Cdot = b2Dot(axis, vr);
            const impulse = joint.axialMass * (joint.motorSpeed - Cdot);
            const oldImpulse = joint.motorImpulse;
            const maxImpulse = context.h * joint.maxMotorForce;
            joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
            const deltaImpulse = joint.motorImpulse - oldImpulse;

            const P = b2MulSV(deltaImpulse, axis);
            vA = b2MulSub(vA, mA, P);
            wA -= iA * b2Cross(rA, P);
            vB = b2MulAdd(vB, mB, P);
            wB += iB * b2Cross(rB, P);
        }
    }
    else
    {
        const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
        const Cdot = b2Dot(axis, vr);

        const C = length - joint.length;

        let bias = 0.0;
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias)
        {
            bias = context.jointSoftness.biasRate * C;
            massScale = context.jointSoftness.massScale;
            impulseScale = context.jointSoftness.impulseScale;
        }

        const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.impulse;
        joint.impulse += impulse;

        const P = b2MulSV(impulse, axis);
        vA = b2MulSub(vA, mA, P);
        wA -= iA * b2Cross(rA, P);
        vB = b2MulAdd(vB, mB, P);
        wB += iB * b2Cross(rB, P);
    }

    stateA.linearVelocity = vA;
    stateA.angularVelocity = wA;
    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
}

export function b2DrawDistanceJoint(draw, base, transformA, transformB)
{
    const joint = base.distanceJoint;

    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);

    const axis = b2Normalize(b2Sub(pB, pA));

    if (joint.minLength < joint.maxLength && joint.enableLimit)
    {
        const pMin = b2MulAdd(pA, joint.minLength, axis);
        const pMax = b2MulAdd(pA, joint.maxLength, axis);
        const offset = b2MulSV(0.05 * b2_lengthUnitsPerMeter, b2RightPerp(axis));

        if (joint.minLength > b2_linearSlop)
        {
            draw.DrawSegment(b2Sub(pMin, offset), b2Add(pMin, offset), b2HexColor.b2_colorLightGreen, draw.context);
        }

        if (joint.maxLength < B2_HUGE)
        {
            draw.DrawSegment(b2Sub(pMax, offset), b2Add(pMax, offset), b2HexColor.b2_colorRed, draw.context);
        }

        if (joint.minLength > b2_linearSlop && joint.maxLength < B2_HUGE)
        {
            draw.DrawSegment(pMin, pMax, b2HexColor.b2_colorGray, draw.context);
        }
    }

    draw.DrawSegment(pA, pB, b2HexColor.b2_colorWhite, draw.context);
    draw.DrawPoint(pA.x, pA.y, 4.0, b2HexColor.b2_colorWhite, draw.context);
    draw.DrawPoint(pB.x, pB.y, 4.0, b2HexColor.b2_colorWhite, draw.context);

    if (joint.hertz > 0.0 && joint.enableSpring)
    {
        const pRest = b2MulAdd(pA, joint.length, axis);
        draw.DrawPoint(pRest.x, pRest.y, 4.0, b2HexColor.b2_colorBlue, draw.context);
    }
}
