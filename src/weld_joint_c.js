/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    b2Add,
    b2Cross,
    b2CrossSV,
    b2IsValid,
    b2Mat22,
    b2MulAdd,
    b2MulSV,
    b2MulSub,
    b2RelativeAngle,
    b2RotateVector,
    b2Solve22,
    b2Sub,
    b2Vec2
} from './include/math_functions_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2BodyState } from './include/body_h.js';
import { b2GetJointSimCheckType } from './include/joint_h.js';
import { b2JointType } from './include/types_h.js';
import { b2MakeSoft } from './include/solver_h.js';
import { b2SetType } from './include/world_h.js';

/**
 * @namespace WeldJoint
 */

/**
 * @import {b2JointId} from './include/id_h.js'
 */

/**
 * Sets the linear frequency (hertz) for a weld joint.
 * @function b2WeldJoint_SetLinearHertz
 * @param {b2JointId} jointId - The identifier for the weld joint to modify
 * @param {number} hertz - The frequency in hertz (must be >= 0)
 * @returns {void}
 * @throws {Error} If the hertz value is invalid or negative
 */
export function b2WeldJoint_SetLinearHertz(jointId, hertz)
{
    // Assert is not directly translatable to JS, so we'll use a simple if check
    if (!(b2IsValid(hertz) && hertz >= 0.0))
    {
        throw new Error("Invalid hertz value");
    }
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
    joint.weldJoint.linearHertz = hertz;
}

/**
 * Gets the linear Hertz value from a weld joint.
 * @function b2WeldJoint_GetLinearHertz
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The linear Hertz value of the weld joint.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetLinearHertz(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);

    return joint.weldJoint.linearHertz;
}

/**
 * Sets the linear damping ratio for a weld joint.
 * @function b2WeldJoint_SetLinearDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} dampingRatio - The damping ratio value. Must be non-negative.
 * @returns {void}
 * @throws {Error} If dampingRatio is invalid or negative.
 */
export function b2WeldJoint_SetLinearDampingRatio(jointId, dampingRatio)
{
    if (!(b2IsValid(dampingRatio) && dampingRatio >= 0.0))
    {
        throw new Error("Invalid dampingRatio value");
    }
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
    joint.weldJoint.linearDampingRatio = dampingRatio;
}

/**
 * Gets the linear damping ratio of a weld joint.
 * @function b2WeldJoint_GetLinearDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The linear damping ratio of the weld joint.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetLinearDampingRatio(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);

    return joint.weldJoint.linearDampingRatio;
}

/**
 * Sets the angular frequency (hertz) for a weld joint's angular spring-damper.
 * @function b2WeldJoint_SetAngularHertz
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} hertz - The angular frequency in Hertz (must be >= 0).
 * @returns {void}
 * @throws {Error} If the hertz value is invalid (NaN, negative, or infinity).
 * @throws {Error} If the joint is not a weld joint.
 */
export function b2WeldJoint_SetAngularHertz(jointId, hertz)
{
    if (!(b2IsValid(hertz) && hertz >= 0.0))
    {
        throw new Error("Invalid hertz value");
    }
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
    joint.weldJoint.angularHertz = hertz;
}

/**
 * Gets the angular frequency (hertz) of a weld joint.
 * @function b2WeldJoint_GetAngularHertz
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The angular frequency in hertz.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetAngularHertz(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);

    return joint.weldJoint.angularHertz;
}

/**
 * Sets the angular damping ratio for a weld joint.
 * @function b2WeldJoint_SetAngularDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} dampingRatio - The angular damping ratio. Must be non-negative.
 * @returns {void}
 * @throws {Error} If dampingRatio is invalid or negative.
 */
export function b2WeldJoint_SetAngularDampingRatio(jointId, dampingRatio)
{
    if (!(b2IsValid(dampingRatio) && dampingRatio >= 0.0))
    {
        throw new Error("Invalid dampingRatio value");
    }
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
    joint.weldJoint.angularDampingRatio = dampingRatio;
}

/**
 * Gets the angular damping ratio of a weld joint.
 * @function b2WeldJoint_GetAngularDampingRatio
 * @param {b2JointId} jointId - The identifier of the weld joint.
 * @returns {number} The angular damping ratio of the weld joint.
 * @throws {Error} Throws an error if the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetAngularDampingRatio(jointId)
{
    const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);

    return joint.weldJoint.angularDampingRatio;
}

export function b2GetWeldJointForce(world, base)
{
    const force = b2MulSV(world.inv_h, base.weldJoint.linearImpulse);

    return force;
}

export function b2GetWeldJointTorque(world, base)
{
    return world.inv_h * base.weldJoint.angularImpulse;
}

export function b2PrepareWeldJoint(base, context)
{
    if (base.type !== b2JointType.b2_weldJoint)
    {
        throw new Error("Invalid joint type");
    }

    const idA = base.bodyIdA;
    const idB = base.bodyIdB;

    const world = context.world;
    const bodies = world.bodyArray;

    // b2CheckIndex(bodies, idA);
    // b2CheckIndex(bodies, idB);

    const bodyA = bodies[idA];
    const bodyB = bodies[idB];

    if (!(bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet))
    {
        throw new Error("At least one body must be awake");
    }

    // b2CheckIndex(world.solverSetArray, bodyA.setIndex);
    // b2CheckIndex(world.solverSetArray, bodyB.setIndex);

    const setA = world.solverSetArray[bodyA.setIndex];
    const setB = world.solverSetArray[bodyB.setIndex];

    const localIndexA = bodyA.localIndex;
    const localIndexB = bodyB.localIndex;

    if (!(0 <= localIndexA && localIndexA <= setA.sims.count))
    {
        throw new Error("Invalid localIndexA");
    }

    if (!(0 <= localIndexB && localIndexB <= setB.sims.count))
    {
        throw new Error("Invalid localIndexB");
    }

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

    const joint = base.weldJoint;
    joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
    joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;

    const qA = bodySimA.transform.q;
    const qB = bodySimB.transform.q;

    joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
    joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
    joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
    joint.deltaAngle = b2RelativeAngle(qB, qA) - joint.referenceAngle;

    const ka = iA + iB;
    joint.axialMass = ka > 0.0 ? 1.0 / ka : 0.0;

    if (joint.linearHertz === 0.0)
    {
        joint.linearSoftness = context.jointSoftness;
    }
    else
    {
        joint.linearSoftness = b2MakeSoft(joint.linearHertz, joint.linearDampingRatio, context.h);
    }

    if (joint.angularHertz === 0.0)
    {
        joint.angularSoftness = context.jointSoftness;
    }
    else
    {
        joint.angularSoftness = b2MakeSoft(joint.angularHertz, joint.angularDampingRatio, context.h);
    }

    if (context.enableWarmStarting === false)
    {
        joint.linearImpulse = new b2Vec2(0, 0);
        joint.angularImpulse = 0.0;
    }
}

export function b2WarmStartWeldJoint(base, context)
{
    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.weldJoint;

    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

    stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, joint.linearImpulse);
    stateA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + joint.angularImpulse);

    stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, joint.linearImpulse);
    stateB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);
}

export function b2SolveWeldJoint(base, context, useBias)
{
    if (base.type !== b2JointType.b2_weldJoint)
    {
        throw new Error("Invalid joint type");
    }

    const mA = base.invMassA;
    const mB = base.invMassB;
    const iA = base.invIA;
    const iB = base.invIB;

    // dummy state for static bodies
    const dummyState = new b2BodyState();

    const joint = base.weldJoint;

    const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
    const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];

    let vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    let vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;

    // angular constraint
    {
        let bias = 0.0;
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias || joint.angularHertz > 0.0)
        {
            const C = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
            bias = joint.angularSoftness.biasRate * C;
            massScale = joint.angularSoftness.massScale;
            impulseScale = joint.angularSoftness.impulseScale;
        }

        const Cdot = wB - wA;
        const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.angularImpulse;
        joint.angularImpulse += impulse;

        wA -= iA * impulse;
        wB += iB * impulse;
    }

    // linear constraint
    {
        const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
        const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);

        let bias = new b2Vec2(0, 0);
        let massScale = 1.0;
        let impulseScale = 0.0;

        if (useBias || joint.linearHertz > 0.0)
        {
            const dcA = stateA.deltaPosition;
            const dcB = stateB.deltaPosition;
            const C = b2Add(b2Add(b2Sub(dcB, dcA), b2Sub(rB, rA)), joint.deltaCenter);

            bias = b2MulSV(joint.linearSoftness.biasRate, C);
            massScale = joint.linearSoftness.massScale;
            impulseScale = joint.linearSoftness.impulseScale;
        }

        const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));

        const K = new b2Mat22();
        K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
        K.cy.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
        K.cx.y = K.cy.x;
        K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
        const b = b2Solve22(K, b2Add(Cdot, bias));

        const impulse = new b2Vec2(
            -massScale * b.x - impulseScale * joint.linearImpulse.x,
            -massScale * b.y - impulseScale * joint.linearImpulse.y);

        joint.linearImpulse = b2Add(joint.linearImpulse, impulse);

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
