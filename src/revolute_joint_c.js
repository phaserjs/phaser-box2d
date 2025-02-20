/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    b2Add,
    b2ClampFloat,
    b2Cross,
    b2CrossSV,
    b2Mat22,
    b2MulAdd,
    b2MulSV,
    b2MulSub,
    b2RelativeAngle,
    b2RotateVector,
    b2Solve22,
    b2Sub,
    b2TransformPoint,
    b2UnwindAngle,
    b2Vec2
} from './include/math_functions_h.js';
import { b2BodyState, b2GetBodyTransform } from './include/body_h.js';
import { b2GetWorld, b2SetType } from './include/world_h.js';
import { b2HexColor, b2JointType } from './include/types_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2GetJointSimCheckType } from './joint_c.js';
import { b2MakeSoft } from './include/solver_h.js';

/**
 * @namespace RevoluteJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * @function b2RevoluteJoint_EnableSpring
 * @description
 * Enables or disables the spring functionality of a revolute joint.
 * When the spring state changes, the spring impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier of the revolute joint to modify
 * @param {boolean} enableSpring - True to enable the spring, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_EnableSpring(jointId, enableSpring)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    if (enableSpring !== joint.revoluteJoint.enableSpring)
    {
        joint.revoluteJoint.enableSpring = enableSpring;
        joint.revoluteJoint.springImpulse = 0.0;
    }
}

/**
 * @summary Checks if spring functionality is enabled for a revolute joint.
 * @function b2RevoluteJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if spring functionality is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsSpringEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.enableSpring;
}

/**
 * @summary Sets the spring frequency (in Hertz) for a revolute joint.
 * @function b2RevoluteJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the revolute joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @description
 * Sets the spring oscillation frequency for a revolute joint. The joint must be
 * of type b2_revoluteJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetSpringHertz(jointId, hertz)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
    joint.revoluteJoint.hertz = hertz;
}

/**
 * Gets the spring frequency in Hertz for a revolute joint.
 * @function b2RevoluteJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetSpringHertz(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.hertz;
}

/**
 * Sets the damping ratio for a revolute joint's spring.
 * @function b2RevoluteJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} dampingRatio - The damping ratio for the spring.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetSpringDampingRatio(jointId, dampingRatio)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
    joint.revoluteJoint.dampingRatio = dampingRatio;
}

/**
 * Gets the spring damping ratio of a revolute joint.
 * @function b2RevoluteJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier of the revolute joint.
 * @returns {number} The spring damping ratio value of the revolute joint.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetSpringDampingRatio(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.dampingRatio;
}

/**
 * @function b2RevoluteJoint_GetAngle
 * @summary Gets the current angle between two bodies connected by a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The current angle in radians between the two connected bodies,
 * relative to the reference angle.
 * @description
 * Calculates the relative angle between two bodies connected by a revolute joint by
 * comparing their transforms and subtracting the joint's reference angle. The result
 * is unwound to ensure consistent angle representation.
 */
export function b2RevoluteJoint_GetAngle(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const jointSim = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
    const transformA = b2GetBodyTransform(world, jointSim.bodyIdA);
    const transformB = b2GetBodyTransform(world, jointSim.bodyIdB);

    let angle = b2RelativeAngle(transformB.q, transformA.q) - jointSim.revoluteJoint.referenceAngle;
    angle = b2UnwindAngle(angle);

    return angle;
}

/**
 * @function b2RevoluteJoint_EnableLimit
 * @summary Enables or disables the joint angle limits for a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {boolean} enableLimit - True to enable the joint limits, false to disable them.
 * @returns {void}
 * @description
 * When enabled, the joint will restrict rotation to be between its upper and lower angle limits.
 * When the limit state changes, the joint's limit impulses are reset to zero.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_EnableLimit(jointId, enableLimit)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    if (enableLimit !== joint.revoluteJoint.enableLimit)
    {
        joint.revoluteJoint.enableLimit = enableLimit;
        joint.revoluteJoint.lowerImpulse = 0.0;
        joint.revoluteJoint.upperImpulse = 0.0;
    }
}

/**
 * @summary Checks if the limit is enabled for a revolute joint.
 * @function b2RevoluteJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if the joint's limit is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsLimitEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.enableLimit;
}

/**
 * Gets the lower angle limit of a revolute joint.
 * @function b2RevoluteJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The lower angle limit in radians.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetLowerLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.lowerAngle;
}

/**
 * Gets the upper angle limit of a revolute joint.
 * @function b2RevoluteJoint_GetUpperLimit
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The upper angle limit in radians.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetUpperLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.upperAngle;
}

/**
 * @function b2RevoluteJoint_SetLimits
 * @description
 * Sets the lower and upper angle limits for a revolute joint. The function automatically
 * orders the limits so that the lower value is always less than or equal to the upper value.
 * When the limits change, the joint impulses are reset to zero.
 * @param {b2JointId} jointId - The identifier for the revolute joint to modify
 * @param {number} lower - The lower angle limit in radians
 * @param {number} upper - The upper angle limit in radians
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_SetLimits(jointId, lower, upper)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    if (lower !== joint.revoluteJoint.lowerAngle || upper !== joint.revoluteJoint.upperAngle)
    {
        joint.revoluteJoint.lowerAngle = Math.min(lower, upper);
        joint.revoluteJoint.upperAngle = Math.max(lower, upper);
        joint.revoluteJoint.lowerImpulse = 0.0;
        joint.revoluteJoint.upperImpulse = 0.0;
    }
}

/**
 * @function b2RevoluteJoint_EnableMotor
 * @description
 * Enables or disables the motor on a revolute joint. When the motor is disabled,
 * its accumulated impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the revolute joint
 * @param {boolean} enableMotor - True to enable the joint's motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_EnableMotor(jointId, enableMotor)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    if (enableMotor !== joint.revoluteJoint.enableMotor)
    {
        joint.revoluteJoint.enableMotor = enableMotor;
        joint.revoluteJoint.motorImpulse = 0.0;
    }
}

/**
 * @summary Checks if the motor is enabled on a revolute joint.
 * @function b2RevoluteJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsMotorEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.enableMotor;
}

/**
 * @summary Sets the motor speed for a revolute joint.
 * @function b2RevoluteJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @description
 * Sets the angular velocity for the motor of a revolute joint. A positive velocity
 * means the joint will rotate counterclockwise.
 * @throws {Error} Throws an error if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetMotorSpeed(jointId, motorSpeed)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
    joint.revoluteJoint.motorSpeed = motorSpeed;
}

/**
 * Gets the motor speed of a revolute joint.
 * @function b2RevoluteJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier of the revolute joint.
 * @returns {number} The current motor speed in radians per second.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMotorSpeed(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.motorSpeed;
}

/**
 * @function b2RevoluteJoint_GetMotorTorque
 * @summary Gets the current motor torque of a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The current motor torque in Newton-meters.
 * @description
 * Calculates the motor torque by multiplying the motor impulse by the inverse
 * of the time step. The joint must be of type b2_revoluteJoint.
 * @throws {Error} If the joint type is not b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMotorTorque(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return world.inv_h * joint.revoluteJoint.motorImpulse;
}

/**
 * Sets the maximum motor torque for a revolute joint.
 * @function b2RevoluteJoint_SetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} torque - The maximum motor torque value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetMaxMotorTorque(jointId, torque)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
    joint.revoluteJoint.maxMotorTorque = torque;
}

/**
 * Gets the maximum motor torque of a revolute joint.
 * @function b2RevoluteJoint_GetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The maximum motor torque value.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMaxMotorTorque(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);

    return joint.revoluteJoint.maxMotorTorque;
}

export function b2GetRevoluteJointForce(world, base)
{
    const force = b2MulSV(world.inv_h, base.revoluteJoint.linearImpulse);

    return force;
}

export function b2GetRevoluteJointTorque(world, base)
{
    const revolute = base.revoluteJoint;
    const torque = world.inv_h * (revolute.motorImpulse + revolute.lowerImpulse - revolute.upperImpulse);

    return torque;
}

// Point-to-point constraint
// C = p2 - p1
// Cdot = v2 - v1
//      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
// J = [-I -r1_skew I r2_skew ]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)

// Motor constraint
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
// K = invI1 + invI2

// Body State
// The solver operates on the body state. The body state array does not hold static bodies. Static bodies are shared
// across worker threads. It would be okay to read their states, but writing to them would cause cache thrashing across
// workers, even if the values don't change.
// This causes some trouble when computing anchors. I rotate the anchors using the body rotation every sub-step. For static
// bodies the anchor doesn't rotate. Body A or B could be static and this can lead to lots of branching. This branching
// should be minimized.
//
// Solution 1:
// Use delta rotations. This means anchors need to be prepared in world space. The delta rotation for static bodies will be
// identity. Base separation and angles need to be computed. Manifolds will be behind a frame, but that is probably best if bodies
// move fast.
//
// Solution 2:
// Use full rotation. The anchors for static bodies will be in world space while the anchors for dynamic bodies will be in local
// space. Potentially confusing and bug prone.

export function b2PrepareRevoluteJoint(base, context)
{
    // chase body id to the solver set where the body lives
    const idA = base.bodyIdA;
    const idB = base.bodyIdB;
    const world = context.world;
    const bodies = world.bodyArray;
    const bodyA = bodies[idA];
    const bodyB = bodies[idB];
    console.assert( bodyA.setIndex == b2SetType.b2_awakeSet || bodyB.setIndex == b2SetType.b2_awakeSet, `bodyA.setIndex = ${bodyA.setIndex}, bodyB.setIndex = ${bodyB.setIndex}` );

    const setA = world.solverSetArray[bodyA.setIndex];
    const setB = world.solverSetArray[bodyB.setIndex];
    const localIndexA = bodyA.localIndex;
    const localIndexB = bodyB.localIndex;

    console.assert( 0 <= localIndexA && localIndexA <= setA.sims.count );
    console.assert( 0 <= localIndexB && localIndexB <= setB.sims.count );

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
    const joint = base.revoluteJoint;
    joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;

    // initial anchors in world space
    joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
    joint.deltaAngle = b2RelativeAngle(bodySimB.transform.q, bodySimA.transform.q) - joint.referenceAngle;
    joint.deltaAngle = b2UnwindAngle(joint.deltaAngle); // yes, this does seem to be deliberate reuse (line 254: revolute_joint.c)

    const k = iA + iB;
    joint.axialMass = k > 0.0 ? 1.0 / k : 0.0;
    joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);

    if (context.enableWarmStarting === false)
    {
        joint.linearImpulse = new b2Vec2(0, 0);
        joint.springImpulse = 0.0;
        joint.motorImpulse = 0.0;
        joint.lowerImpulse = 0.0;
        joint.upperImpulse = 0.0;
    }
}

export function b2WarmStartRevoluteJoint(base, context)
{
    console.assert( base.type == b2JointType.b2_revoluteJoint );

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();
    const joint = base.revoluteJoint;
    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const axialImpulse = joint.springImpulse + joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse;

    stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, joint.linearImpulse);
    stateA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + axialImpulse);

    stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, joint.linearImpulse);
    stateB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + axialImpulse);
}

export function b2SolveRevoluteJoint(base, context, useBias)
{
    console.assert( base.type == b2JointType.b2_revoluteJoint );

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.revoluteJoint;

    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    let vA = stateA.linearVelocity.clone();
    let wA = stateA.angularVelocity;
    let vB = stateB.linearVelocity.clone();
    let wB = stateB.angularVelocity;

    const fixedRotation = (iA + iB === 0.0);

    // const float maxBias = context.maxBiasVelocity;

    // Solve spring.
    if (joint.enableSpring && fixedRotation === false)
    {
        const C = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
        const bias = joint.springSoftness.biasRate * C;
        const massScale = joint.springSoftness.massScale;
        const impulseScale = joint.springSoftness.impulseScale;

        const Cdot = wB - wA;
        const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.springImpulse;
        joint.springImpulse += impulse;

        wA -= iA * impulse;
        wB += iB * impulse;
    }

    // Solve motor constraint.
    if (joint.enableMotor && fixedRotation === false)
    {
        const Cdot = wB - wA - joint.motorSpeed;
        let impulse = -joint.axialMass * Cdot;
        const oldImpulse = joint.motorImpulse;
        const maxImpulse = context.h * joint.maxMotorTorque;
        joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
        impulse = joint.motorImpulse - oldImpulse;

        wA -= iA * impulse;
        wB += iB * impulse;
    }

    if (joint.enableLimit && fixedRotation === false)
    {
        let jointAngle = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
        jointAngle = b2UnwindAngle(jointAngle);

        // Lower limit
        {
            const C = jointAngle - joint.lowerAngle;
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

            const Cdot = wB - wA;
            let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
            const oldImpulse = joint.lowerImpulse;
            joint.lowerImpulse = Math.max(joint.lowerImpulse + impulse, 0.0);
            impulse = joint.lowerImpulse - oldImpulse;

            wA -= iA * impulse;
            wB += iB * impulse;
        }

        // Upper limit
        // Note: signs are flipped to keep C positive when the constraint is satisfied.
        // This also keeps the impulse positive when the limit is active.
        {
            const C = joint.upperAngle - jointAngle;
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

            // sign flipped on Cdot
            const Cdot = wA - wB;
            let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
            const oldImpulse = joint.upperImpulse;
            joint.upperImpulse = Math.max(joint.upperImpulse + impulse, 0.0);
            impulse = joint.upperImpulse - oldImpulse;

            // sign flipped on applied impulse
            wA += iA * impulse;
            wB -= iB * impulse;
        }
    }

    // Solve point-to-point constraint
    {
        // current anchors
        const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
        const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

        const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));

        let bias = new b2Vec2(0, 0);
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias)
        {
            const dcA = stateA.deltaPosition;
            const dcB = stateB.deltaPosition;

            const separation = b2Add(b2Add(b2Sub(dcB, dcA), b2Sub(rB, rA)), joint.deltaCenter);
            bias = b2MulSV(context.jointSoftness.biasRate, separation);
            massScale = context.jointSoftness.massScale;
            impulseScale = context.jointSoftness.impulseScale;
        }

        const K = new b2Mat22(
            new b2Vec2(0, 0),
            new b2Vec2(0, 0)
        );
        K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
        K.cy.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
        K.cx.y = K.cy.x;
        K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
        const b = b2Solve22(K, b2Add(Cdot, bias));

        const impulse = new b2Vec2(
            -massScale * b.x - impulseScale * joint.linearImpulse.x,
            -massScale * b.y - impulseScale * joint.linearImpulse.y
        );
        joint.linearImpulse.x += impulse.x;
        joint.linearImpulse.y += impulse.y;

        vA = b2MulSub(vA, mA, impulse);
        wA -= iA * b2Cross(rA, impulse);
        vB = b2MulAdd(vB, mB, impulse);
        wB += iB * b2Cross(rB, impulse);
    }

    stateA.linearVelocity = vA;
    stateA.angularVelocity = wA;
    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
}

/*
NOTE: unconverted C original function

void b2RevoluteJoint::Dump()
{
    int32 indexA = joint.bodyA.joint.islandIndex;
    int32 indexB = joint.bodyB.joint.islandIndex;

    b2Dump("  b2RevoluteJointDef jd;\n");
    b2Dump("  jd.bodyA = bodies[%d];\n", indexA);
    b2Dump("  jd.bodyB = bodies[%d];\n", indexB);
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
    b2Dump("  joints[%d] = joint.world.CreateJoint(&jd);\n", joint.,,index);
}
 * @memberof RevoluteJoint
 */
export function b2DrawRevoluteJoint(draw, base, transformA, transformB, drawSize)
{

    console.assert( base.type == b2JointType.b2_revoluteJoint );

    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);

    const c1 = b2HexColor.b2_colorRed;

    // let c2 = b2HexColor.b2_colorGreen;
    // let c3 = b2HexColor.b2_colorRed;

    const L = drawSize;
    draw.DrawCircle(pB, L, c1, draw.context);

    const angle = b2RelativeAngle(transformB.q, transformA.q);

    const r = new b2Vec2(L * Math.cos(angle), L * Math.sin(angle));

    const pC = b2Add(pB, r);
    draw.DrawSegment(pB, pC, c1, draw.context);

    // if (draw.drawJointExtras) {
    //     let jointAngle = b2UnwindAngle(angle - joint.referenceAngle);
    //     let buffer = ` ${(180.0 * jointAngle / Math.PI).toFixed(1)} deg`;
    //     draw.DrawString(pC, buffer, draw.context);
    // }

    // let lowerAngle = joint.lowerAngle + joint.referenceAngle;
    // let upperAngle = joint.upperAngle + joint.referenceAngle;

    // if (joint.enableLimit) {
    //     const rlo = new b2Vec2(L * Math.cos(lowerAngle), L * Math.sin(lowerAngle));
    //     const rhi = new b2Vec2(L * Math.cos(upperAngle), L * Math.sin(upperAngle));


    //     draw.DrawSegment(pB, b2Add(pB, rlo), c2, draw.context);
    //     draw.DrawSegment(pB, b2Add(pB, rhi), c3, draw.context);

    //     const ref = new b2Vec2(L * Math.cos(joint.referenceAngle), L * Math.sin(joint.referenceAngle));

    //     draw.DrawSegment(pB, b2Add(pB, ref), b2HexColor.b2_colorBlue, draw.context);
    // }

    const color = b2HexColor.b2_colorGold;
    draw.DrawSegment(transformA.p, pA, color, draw.context);
    draw.DrawSegment(pA, pB, color, draw.context);
    draw.DrawSegment(transformB.p, pB, color, draw.context);
}
