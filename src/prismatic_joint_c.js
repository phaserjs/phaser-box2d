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
    b2Dot,
    b2LeftPerp,
    b2Mat22,
    b2MulAdd,
    b2MulSV,
    b2MulSub,
    b2RelativeAngle,
    b2RotateVector,
    b2Solve22,
    b2Sub,
    b2TransformPoint,
    b2Vec2
} from './include/math_functions_h.js';
import { b2BodyState, b2GetBodyTransform } from './include/body_h.js';
import { b2GetWorld, b2SetType } from './include/world_h.js';
import { b2HexColor, b2JointType } from './include/types_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2GetJointSimCheckType } from './include/joint_h.js';
import { b2MakeSoft } from './include/solver_h.js';

/**
 * @namespace PrismaticJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * @function b2PrismaticJoint_EnableSpring
 * @summary Enables or disables the spring functionality of a prismatic joint.
 * @param {b2JointId} jointId - The identifier of the prismatic joint to modify.
 * @param {boolean} enableSpring - Whether to enable (true) or disable (false) the spring.
 * @returns {void}
 * @description
 * Sets the spring state of a prismatic joint. When the spring state changes,
 * the spring impulse is reset to zero. If the state doesn't change, no action is taken.
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_EnableSpring(jointId, enableSpring)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    if (enableSpring !== joint.prismaticJoint.enableSpring)
    {
        joint.prismaticJoint.enableSpring = enableSpring;
        joint.prismaticJoint.springImpulse = 0.0;
    }
}

/**
 * @summary Checks if the spring mechanism is enabled for a prismatic joint.
 * @function b2PrismaticJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the spring mechanism is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsSpringEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.enableSpring;
}

/**
 * @summary Sets the spring frequency (in Hertz) for a prismatic joint.
 * @function b2PrismaticJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the prismatic joint to modify.
 * @param {number} hertz - The spring frequency in Hertz.
 * @returns {void}
 * @description
 * Updates the spring frequency of a prismatic joint. The joint must be of type b2_prismaticJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetSpringHertz(jointId, hertz)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
    joint.prismaticJoint.hertz = hertz;
}

/**
 * Gets the spring frequency in Hertz for a prismatic joint.
 * @function b2PrismaticJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetSpringHertz(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.hertz;
}

/**
 * @summary Sets the damping ratio for a prismatic joint's spring.
 * @function b2PrismaticJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} dampingRatio - The damping ratio for the spring.
 * @returns {void}
 * @description
 * Sets the spring damping ratio for a prismatic joint. The joint must be of type b2_prismaticJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetSpringDampingRatio(jointId, dampingRatio)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
    joint.prismaticJoint.dampingRatio = dampingRatio;
}

/**
 * Gets the spring damping ratio of a prismatic joint.
 * @function b2PrismaticJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The spring damping ratio value.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetSpringDampingRatio(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.dampingRatio;
}

/**
 * @function b2PrismaticJoint_EnableLimit
 * @description
 * Enables or disables the translation limits on a prismatic joint. When the limit is disabled,
 * the joint's limit impulses are reset to zero.
 * @param {b2JointId} jointId - The identifier for the prismatic joint
 * @param {boolean} enableLimit - True to enable the translation limit, false to disable it
 * @returns {void}
 * @throws {Error} If the joint identified by jointId is not a prismatic joint
 */
export function b2PrismaticJoint_EnableLimit(jointId, enableLimit)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    if (enableLimit !== joint.prismaticJoint.enableLimit)
    {
        joint.prismaticJoint.enableLimit = enableLimit;
        joint.prismaticJoint.lowerImpulse = 0.0;
        joint.prismaticJoint.upperImpulse = 0.0;
    }
}

/**
 * @summary Checks if the limit is enabled for a prismatic joint.
 * @function b2PrismaticJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the limit is enabled for the joint, false otherwise.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsLimitEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.enableLimit;
}

/**
 * @summary Gets the lower translation limit of a prismatic joint.
 * @function b2PrismaticJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The lower translation limit of the prismatic joint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetLowerLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.lowerTranslation;
}

/**
 * @function b2PrismaticJoint_GetUpperLimit
 * @summary Gets the upper translation limit of a prismatic joint.
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The upper translation limit of the prismatic joint.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetUpperLimit(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.upperTranslation;
}

/**
 * Sets the translation limits for a prismatic joint.
 * @function b2PrismaticJoint_SetLimits
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} lower - The lower translation limit.
 * @param {number} upper - The upper translation limit.
 * @returns {void}
 * @description
 * Sets new translation limits for a prismatic joint. The function automatically
 * orders the limits so that the lower value is always less than or equal to
 * the upper value. When the limits change, the joint's impulses are reset to zero.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetLimits(jointId, lower, upper)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    if (lower !== joint.prismaticJoint.lowerTranslation || upper !== joint.prismaticJoint.upperTranslation)
    {
        joint.prismaticJoint.lowerTranslation = Math.min(lower, upper);
        joint.prismaticJoint.upperTranslation = Math.max(lower, upper);
        joint.prismaticJoint.lowerImpulse = 0.0;
        joint.prismaticJoint.upperImpulse = 0.0;
    }
}

/**
 * @function b2PrismaticJoint_EnableMotor
 * @description
 * Enables or disables the motor on a prismatic joint. When the motor is disabled,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the prismatic joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_prismaticJoint
 */
export function b2PrismaticJoint_EnableMotor(jointId, enableMotor)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    if (enableMotor !== joint.prismaticJoint.enableMotor)
    {
        joint.prismaticJoint.enableMotor = enableMotor;
        joint.prismaticJoint.motorImpulse = 0.0;
    }
}

/**
 * @summary Checks if the motor is enabled on a prismatic joint.
 * @function b2PrismaticJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsMotorEnabled(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.enableMotor;
}

/**
 * @summary Sets the motor speed for a prismatic joint.
 * @function b2PrismaticJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the prismatic joint to modify.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetMotorSpeed(jointId, motorSpeed)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
    joint.prismaticJoint.motorSpeed = motorSpeed;
}

/**
 * Gets the motor speed of a prismatic joint.
 * @function b2PrismaticJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The current motor speed of the prismatic joint.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetMotorSpeed(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.motorSpeed;
}

/**
 * @function b2PrismaticJoint_GetMotorForce
 * @param {b2JointId} jointId - The ID of the prismatic joint
 * @returns {number} The current motor force in Newtons
 * @description
 * Gets the current motor force of a prismatic joint. The force is calculated by
 * multiplying the joint's motor impulse by the inverse of the world's time step.
 * @throws {Error} Throws if the joint type is not a prismatic joint
 */
export function b2PrismaticJoint_GetMotorForce(jointId)
{
    const world = b2GetWorld(jointId.world0);
    const base = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return world.inv_h * base.prismaticJoint.motorImpulse;
}

/**
 * Sets the maximum motor force for a prismatic joint.
 * @function b2PrismaticJoint_SetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} force - The maximum force the motor can apply.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetMaxMotorForce(jointId, force)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
    joint.prismaticJoint.maxMotorForce = force;
}

/**
 * Gets the maximum motor force of a prismatic joint.
 * @function b2PrismaticJoint_GetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The maximum force that can be applied by the joint's motor.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetMaxMotorForce(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);

    return joint.prismaticJoint.maxMotorForce;
}

export function b2GetPrismaticJointForce(world, base)
{
    const idA = base.bodyIdA;
    const transformA = b2GetBodyTransform(world, idA);

    const joint = base.prismaticJoint;

    const axisA = b2RotateVector(transformA.q, joint.localAxisA);
    const perpA = b2LeftPerp(axisA);

    const inv_h = world.inv_h;
    const perpForce = inv_h * joint.impulse.x;
    const axialForce = inv_h * (joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse);

    const force = b2Add(b2MulSV(perpForce, perpA), b2MulSV(axialForce, axisA));

    return force;
}

export function b2GetPrismaticJointTorque(world, base)
{
    return world.inv_h * base.prismaticJoint.impulse.y;
}

// Linear constraint (point-to-line)
// d = p2 - p1 = x2 + r2 - x1 - r1
// C = dot(perp, d)
// Cdot = dot(d, cross(w1, perp)) + dot(perp, v2 + cross(w2, r2) - v1 - cross(w1, r1))
//      = -dot(perp, v1) - dot(cross(d + r1, perp), w1) + dot(perp, v2) + dot(cross(r2, perp), v2)
// J = [-perp, -cross(d + r1, perp), perp, cross(r2,perp)]
//
// Angular constraint
// C = a2 - a1 + a_initial
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
//
// K = J * invM * JT
//
// J = [-a -s1 a s2]
//     [0  -1  0  1]
// a = perp
// s1 = cross(d + r1, a) = cross(p2 - x1, a)
// s2 = cross(r2, a) = cross(p2 - x2, a)

// Motor/Limit linear constraint
// C = dot(ax1, d)
// Cdot = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
// J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]

// Predictive limit is applied even when the limit is not active.
// Prevents a constraint speed that can lead to a constraint error in one time step.
// Want C2 = C1 + h * Cdot >= 0
// Or:
// Cdot + C1/h >= 0
// I do not apply a negative constraint error because that is handled in position correction.
// So:
// Cdot + max(C1, 0)/h >= 0

// Block Solver
// We develop a block solver that includes the angular and linear constraints. This makes the limit stiffer.
//
// The Jacobian has 2 rows:
// J = [-uT -s1 uT s2] // linear
//     [0   -1   0  1] // angular
//
// u = perp
// s1 = cross(d + r1, u), s2 = cross(r2, u)
// a1 = cross(d + r1, v), a2 = cross(r2, v)

export function b2PreparePrismaticJoint(base, context)
{
    // Comment out B2_ASSERT
    console.assert(base.type == b2JointType.b2_prismaticJoint);

    // chase body id to the solver set where the body lives
    const idA = base.bodyIdA;
    const idB = base.bodyIdB;

    const world = context.world;
    const bodies = world.bodyArray;

    // Comment out b2CheckIndex
    // b2CheckIndex(bodies, idA);
    // b2CheckIndex(bodies, idB);

    const bodyA = bodies[idA];
    const bodyB = bodies[idB];

    // Comment out B2_ASSERT
    console.assert(bodyA.setIndex == b2SetType.b2_awakeSet || bodyB.setIndex == b2SetType.b2_awakeSet);

    // b2CheckIndex(world.solverSetArray, bodyA.setIndex);
    // b2CheckIndex(world.solverSetArray, bodyB.setIndex);

    const setA = world.solverSetArray[bodyA.setIndex];
    const setB = world.solverSetArray[bodyB.setIndex];

    const localIndexA = bodyA.localIndex;
    const localIndexB = bodyB.localIndex;

    // Comment out B2_ASSERT
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

    const joint = base.prismaticJoint;
    joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;

    const qA = bodySimA.transform.q;
    const qB = bodySimB.transform.q;

    joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.axisA = b2RotateVector(qA, joint.localAxisA);
    joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
    joint.deltaAngle = b2RelativeAngle(qB, qA) - joint.referenceAngle;

    const rA = joint.anchorA;
    const rB = joint.anchorB;

    const d = b2Add(joint.deltaCenter, b2Sub(rB, rA));
    const a1 = b2Cross(b2Add(d, rA), joint.axisA);
    const a2 = b2Cross(rB, joint.axisA);

    // effective masses
    const k = mA + mB + iA * a1 * a1 + iB * a2 * a2;
    joint.axialMass = k > 0.0 ? 1.0 / k : 0.0;

    joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);

    if (context.enableWarmStarting == false)
    {
        joint.impulse = new b2Vec2(0, 0);
        joint.springImpulse = 0.0;
        joint.motorImpulse = 0.0;
        joint.lowerImpulse = 0.0;
        joint.upperImpulse = 0.0;
    }
}

export function b2WarmStartPrismaticJoint(base, context)
{
    // Comment out B2_ASSERT
    console.assert(base.type == b2JointType.b2_prismaticJoint);

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.prismaticJoint;

    const stateA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
    const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);

    // impulse is applied at anchor point on body B
    const a1 = b2Cross(b2Add(d, rA), axisA);
    const a2 = b2Cross(rB, axisA);
    const axialImpulse = joint.springImpulse + joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse;

    // perpendicular constraint
    const perpA = b2LeftPerp(axisA);
    const s1 = b2Cross(b2Add(d, rA), perpA);
    const s2 = b2Cross(rB, perpA);
    const perpImpulse = joint.impulse.x;
    const angleImpulse = joint.impulse.y;

    const P = b2Add(b2MulSV(axialImpulse, axisA), b2MulSV(perpImpulse, perpA));
    const LA = axialImpulse * a1 + perpImpulse * s1 + angleImpulse;
    const LB = axialImpulse * a2 + perpImpulse * s2 + angleImpulse;

    stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
    stateA.angularVelocity -= iA * LA;
    stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
    stateB.angularVelocity += iB * LB;
}

export function b2SolvePrismaticJoint(base, context, useBias)
{
    console.assert(base.type == b2JointType.b2_prismaticJoint);

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.prismaticJoint;

    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    let vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    let vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;

    // current anchors
    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
    const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
    const translation = b2Dot(axisA, d);

    // These scalars are for torques generated by axial forces
    const a1 = b2Cross(b2Add(d, rA), axisA);
    const a2 = b2Cross(rB, axisA);

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

    // Solve motor constraint
    if (joint.enableMotor)
    {
        const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
        let impulse = joint.axialMass * (joint.motorSpeed - Cdot);
        const oldImpulse = joint.motorImpulse;
        const maxImpulse = context.h * joint.maxMotorForce;
        joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
        impulse = joint.motorImpulse - oldImpulse;

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

            const oldImpulse = joint.lowerImpulse;
            const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
            let impulse = -joint.axialMass * massScale * (Cdot + bias) - impulseScale * oldImpulse;
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

            const oldImpulse = joint.upperImpulse;
            const Cdot = b2Dot(axisA, b2Sub(vA, vB)) + a1 * wA - a2 * wB;
            let impulse = -joint.axialMass * massScale * (Cdot + bias) - impulseScale * oldImpulse;
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

    // Solve the prismatic constraint in block form
    {
        const perpA = b2LeftPerp(axisA);

        // These scalars are for torques generated by the perpendicular constraint force
        const s1 = b2Cross(b2Add(d, rA), perpA);
        const s2 = b2Cross(rB, perpA);

        const Cdot = new b2Vec2(b2Dot(perpA, b2Sub(vB, vA)) + s2 * wB - s1 * wA, wB - wA);

        let bias = new b2Vec2();
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias)
        {
            const C = new b2Vec2(b2Dot(perpA, d), b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle);
            bias = b2MulSV(context.jointSoftness.biasRate, C);
            massScale = context.jointSoftness.massScale;
            impulseScale = context.jointSoftness.impulseScale;
        }

        const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
        const k12 = iA * s1 + iB * s2;
        let k22 = iA + iB;

        if (k22 === 0.0)
        {
            // For bodies with fixed rotation.
            k22 = 1.0;
        }

        const K = new b2Mat22(new b2Vec2(k11, k12), new b2Vec2(k12, k22));

        const b = b2Solve22(K, b2Add(Cdot, bias));
        const impulse = new b2Vec2(-massScale * b.x - impulseScale * joint.impulse.x, -massScale * b.y - impulseScale * joint.impulse.y);
        joint.impulse.x += impulse.x;
        joint.impulse.y += impulse.y;

        const P = b2MulSV(impulse.x, perpA);
        const LA = impulse.x * s1 + impulse.y;
        const LB = impulse.x * s2 + impulse.y;

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

export function b2DrawPrismaticJoint(draw, base, transformA, transformB)
{
    console.assert(base.type == b2JointType.b2_prismaticJoint);
    const joint = base.prismaticJoint;
    const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
    const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
    const axis = b2RotateVector(transformA.q, joint.localAxisA);
    const c1 = b2HexColor.b2_colorGray7;
    const c2 = b2HexColor.b2_colorGreen;
    const c3 = b2HexColor.b2_colorRed;
    const c4 = b2HexColor.b2_colorBlue;
    const c5 = b2HexColor.b2_colorGray4;

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
