/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2BodyState } from './include/body_h.js';
import { b2SetType } from './include/world_h.js';
import { b2Softness } from './include/solver_h.js';
import { b2_overflowIndex } from './include/constraint_graph_h.js';

/**
 * @namespace ContactSolver
 */

export class b2ContactConstraint
{
    constructor()
    {
        this.indexA = 0;
        this.indexB = 0;
        this.normalX = 0;
        this.normalY = 0;
        this.friction = 0;
        this.restitution = 0;
        this.pointCount = 0;
        this.softness = new b2Softness();
        this.invMassA = 0;
        this.invIA = 0;
        this.invMassB = 0;
        this.invIB = 0;
        this.points = [];
    }
}

export class b2ContactConstraintPoint
{
    constructor()
    {
        this.normalImpulse = 0;
        this.tangentImpulse = 0;
        this.maxNormalImpulse = 0;
        this.anchorAX = 0;
        this.anchorAY = 0;
        this.anchorBX = 0;
        this.anchorBY = 0;
        this.baseSeparation = 0;
        this.normalMass = 0;
        this.tangentMass = 0;
        this.relativeVelocity = 0;
    }
}

export function b2PrepareOverflowContacts(context)
{
    const world = context.world;
    const graph = context.graph;
    const color = graph.colors[b2_overflowIndex];
    const constraints = color.overflowConstraints;
    const contactCount = color.contacts.count;
    const contacts = color.contacts.data;
    const awakeStates = context.states;

    // const bodies = world.bodyArray;     // debug only
    
    const contactSoftness = context.contactSoftness;
    const staticSoftness = context.staticSoftness;

    const warmStartScale = world.enableWarmStarting ? 1.0 : 0.0;

    for (let i = 0; i < contactCount; ++i)
    {
        const contactSim = contacts[i];
        const manifold = contactSim.manifold;
        const pointCount = manifold.pointCount;

        const indexA = contactSim.bodySimIndexA;
        const indexB = contactSim.bodySimIndexB;

        // #if B2_VALIDATE  debug only
        // const bodyA = bodies[contactSim._bodyIdA];
        // const validIndexA = bodyA.setIndex == b2SetType.b2_awakeSet ? bodyA.localIndex : B2_NULL_INDEX;
        // console.assert( indexA == validIndexA );

        // const bodyB = bodies[contactSim._bodyIdB];
        // const validIndexB = bodyB.setIndex == b2SetType.b2_awakeSet ? bodyB.localIndex : B2_NULL_INDEX;
        // console.assert( indexB == validIndexB );
        // #endif

        const constraint = constraints[i];
        constraint.indexA = indexA;
        constraint.indexB = indexB;
        constraint.normalX = manifold.normalX;
        constraint.normalY = manifold.normalY;
        constraint.friction = contactSim.friction;
        constraint.restitution = contactSim.restitution;
        constraint.pointCount = pointCount;

        // let vA = new b2Vec2();
        let vAX = 0;
        let vAY = 0;
        let wA = 0;
        const mA = contactSim.invMassA;
        const iA = contactSim.invIA;

        if (indexA !== B2_NULL_INDEX)
        {
            const stateA = awakeStates[indexA];
            vAX = stateA.linearVelocity.x;
            vAY = stateA.linearVelocity.y;
            wA = stateA.angularVelocity;
        }

        // let vB = new b2Vec2();
        let vBX = 0;
        let vBY = 0;
        let wB = 0;
        const mB = contactSim.invMassB;
        const iB = contactSim.invIB;

        if (indexB !== B2_NULL_INDEX)
        {
            const stateB = awakeStates[indexB];
            vBX = stateB.linearVelocity.x;
            vBY = stateB.linearVelocity.y;
            wB = stateB.angularVelocity;
        }

        constraint.softness = (indexA === B2_NULL_INDEX || indexB === B2_NULL_INDEX) ? staticSoftness : contactSoftness;

        constraint.invMassA = mA;
        constraint.invIA = iA;
        constraint.invMassB = mB;
        constraint.invIB = iB;

        const normalX = constraint.normalX;
        const normalY = constraint.normalY;

        // const tangent = b2RightPerp(constraint.normal);
        const tangentX = constraint.normalY;
        const tangentY = -constraint.normalX;

        for (let j = 0; j < pointCount; ++j)
        {
            const mp = manifold.points[j];
            const cp = constraint.points[j] = new b2ContactConstraintPoint();

            cp.normalImpulse = warmStartScale * mp.normalImpulse;
            cp.tangentImpulse = warmStartScale * mp.tangentImpulse;
            cp.maxNormalImpulse = 0.0;

            // const rA = new b2Vec2(mp.anchorAX, mp.anchorAY);
            const rAX = mp.anchorAX;
            const rAY = mp.anchorAY;

            // const rB = new b2Vec2(mp.anchorBX, mp.anchorBY);
            const rBX = mp.anchorBX;
            const rBY = mp.anchorBY;

            // cp.anchorA = rA;
            cp.anchorAX = rAX;
            cp.anchorAY = rAY;

            // cp.anchorB = rB;
            cp.anchorBX = rBX;
            cp.anchorBY = rBY;
            const subX = rBX - rAX;
            const subY = rBY - rAY;

            // cp.baseSeparation = mp.separation - b2Dot(b2Sub(rB, rA), normal);
            cp.baseSeparation = mp.separation - (subX * normalX + subY * normalY);

            // const rnA = b2Cross(rA, normal);
            const rnA = rAX * normalY - rAY * normalX;

            // const rnB = b2Cross(rB, normal);
            const rnB = rBX * normalY - rBY * normalX;
            const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
            cp.normalMass = kNormal > 0.0 ? 1.0 / kNormal : 0.0;

            // const rtA = b2Cross(rA, tangent);
            const rtA = rAX * tangentY - rAY * tangentX;

            // const rtB = b2Cross(rB, tangent);
            const rtB = rBX * tangentY - rBY * tangentX;
            const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
            cp.tangentMass = kTangent > 0.0 ? 1.0 / kTangent : 0.0;

            // const vrA = b2Add(vA, b2CrossSV(wA, rA));
            const vrAX = vAX + (-wA * rAY);
            const vrAY = vAY + (wA * rAX);

            // const vrB = b2Add(vB, b2CrossSV(wB, rB));
            const vrBX = vBX + (-wB * rBY);
            const vrBY = vBY + (wB * rBX);

            // cp.relativeVelocity = b2Dot(normal, b2Sub(vrB, vrA));
            cp.relativeVelocity = normalX * (vrBX - vrAX) + normalY * (vrBY - vrAY);
        }
    }
}

export function b2WarmStartOverflowContacts(context)
{
    const graph = context.graph;
    const color = graph.colors[b2_overflowIndex];
    const constraints = color.overflowConstraints;
    const contactCount = color.contacts.count;
    const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
    const states = awakeSet.states.data;

    const dummyState = new b2BodyState();

    for (let i = 0; i < contactCount; ++i)
    {
        const constraint = constraints[i];

        const indexA = constraint.indexA;
        const indexB = constraint.indexB;

        const stateA = indexA === B2_NULL_INDEX ? dummyState : states[indexA];
        const stateB = indexB === B2_NULL_INDEX ? dummyState : states[indexB];

        const vA = stateA.linearVelocity;
        let wA = stateA.angularVelocity;
        const vB = stateB.linearVelocity;
        let wB = stateB.angularVelocity;

        const mA = constraint.invMassA;
        const iA = constraint.invIA;
        const mB = constraint.invMassB;
        const iB = constraint.invIB;

        const normalX = constraint.normalX;
        const normalY = constraint.normalY;

        // const tangent = b2RightPerp(constraint.normal);
        const tangentx = constraint.normalY;
        const tangenty = -constraint.normalX;
        const pointCount = constraint.pointCount;

        for (let j = 0; j < pointCount; ++j)
        {
            const cp = constraint.points[j];
            const rAX = cp.anchorAX;
            const rAY = cp.anchorAY;
            const rBX = cp.anchorBX;
            const rBY = cp.anchorBY;

            // const P = b2Add(b2MulSV(cp.normalImpulse, normal), b2MulSV(cp.tangentImpulse, tangent));
            const Px = (cp.normalImpulse * normalX) + (cp.tangentImpulse * tangentx);
            const Py = (cp.normalImpulse * normalY) + (cp.tangentImpulse * tangenty);

            // wA -= iA * b2Cross(rA, P);
            wA -= iA * (rAX * Py - rAY * Px);

            // vA = b2MulAdd(vA, -mA, P);
            vA.x -= mA * Px;
            vA.y -= mA * Py;

            // wB += iB * b2Cross(rB, P);
            wB += iB * (rBX * Py - rBY * Px);

            // vB = b2MulAdd(vB, mB, P);
            vB.x += mB * Px;
            vB.y += mB * Py;
        }

        stateA.linearVelocity = vA;
        stateA.angularVelocity = wA;
        stateB.linearVelocity = vB;
        stateB.angularVelocity = wB;
    }
}

export function b2SolveOverflowContacts(context, useBias)
{
    const graph = context.graph;
    const color = graph.colors[b2_overflowIndex];
    const constraints = color.overflowConstraints;
    const contactCount = color.contacts.count;
    const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
    const states = awakeSet.states;

    const inv_h = context.inv_h;
    const pushout = context.world.contactPushoutVelocity;

    // Dummy body to represent a static body
    const dummyState = new b2BodyState();

    for (let i = 0; i < contactCount; ++i)
    {

        const constraint = constraints[i];
        const mA = constraint.invMassA;
        const iA = constraint.invIA;
        const mB = constraint.invMassB;
        const iB = constraint.invIB;

        const stateA = constraint.indexA === B2_NULL_INDEX ? dummyState : states.data[constraint.indexA];
        let vAX = stateA.linearVelocity.x;
        let vAY = stateA.linearVelocity.y;
        let wA = stateA.angularVelocity;
        const dqA = stateA.deltaRotation;

        const stateB = constraint.indexB === B2_NULL_INDEX ? dummyState : states.data[constraint.indexB];
        let vBX = stateB.linearVelocity.x;
        let vBY = stateB.linearVelocity.y;
        let wB = stateB.angularVelocity;
        const dqB = stateB.deltaRotation;

        const dpx = stateB.deltaPosition.x - stateA.deltaPosition.x;
        const dpy = stateB.deltaPosition.y - stateA.deltaPosition.y;

        const normalX = constraint.normalX;
        const normalY = constraint.normalY;
        const tangentx = normalY;
        const tangenty = -normalX;
        const friction = constraint.friction;
        const softness = constraint.softness;

        const pointCount = constraint.pointCount;

        for (let j = 0; j < pointCount; ++j)
        {
            const cp = constraint.points[j];

            // Compute current separation
            const rx = (dqB.c * cp.anchorBX - dqB.s * cp.anchorBY) - (dqA.c * cp.anchorAX - dqA.s * cp.anchorAY);
            const ry = (dqB.s * cp.anchorBX + dqB.c * cp.anchorBY) - (dqA.s * cp.anchorAX + dqA.c * cp.anchorAY);
            const s = (dpx + rx) * normalX + (dpy + ry) * normalY + cp.baseSeparation;

            let velocityBias = 0.0;
            let massScale = 1.0;
            let impulseScale = 0.0;

            if (s > 0.0)
            {
                velocityBias = s * inv_h;
            }
            else if (useBias)
            {
                velocityBias = Math.max(softness.biasRate * s, -pushout);
                massScale = softness.massScale;
                impulseScale = softness.impulseScale;
            }

            // Fixed anchor points
            const rAX = cp.anchorAX;
            const rAY = cp.anchorAY;
            const rBX = cp.anchorBX;
            const rBY = cp.anchorBY;

            // Relative normal velocity at contact
            const vn = (vBX - vAX + wB * -rBY - wA * -rAY) * normalX +
                        (vBY - vAY + wB * rBX - wA * rAX) * normalY;

            // Incremental normal impulse
            let impulse = -cp.normalMass * massScale * (vn + velocityBias) - impulseScale * cp.normalImpulse;

            // Clamp the accumulated impulse
            const newImpulse = Math.max(cp.normalImpulse + impulse, 0.0);
            impulse = newImpulse - cp.normalImpulse;
            cp.normalImpulse = newImpulse;
            cp.maxNormalImpulse = Math.max(cp.maxNormalImpulse, impulse);

            // Apply normal impulse
            const Px = impulse * normalX;
            const Py = impulse * normalY;
            vAX -= mA * Px;
            vAY -= mA * Py;
            wA -= iA * (rAX * Py - rAY * Px);
            vBX += mB * Px;
            vBY += mB * Py;
            wB += iB * (rBX * Py - rBY * Px);
        }

        for (let j = 0; j < pointCount; ++j)
        {
            const cp = constraint.points[j];
            const rAX = cp.anchorAX;
            const rAY = cp.anchorAY;
            const rBX = cp.anchorBX;
            const rBY = cp.anchorBY;
        
            // Relative tangent velocity at contact
            const vtx = (vBX - wB * rBY) - (vAX - wA * rAY);
            const vty = (vBY + wB * rBX) - (vAY + wA * rAX);
            const vt = vtx * tangentx + vty * tangenty;
        
            // Incremental tangent impulse
            let impulse = cp.tangentMass * (-vt);
        
            // Clamp the accumulated force
            const maxFriction = friction * cp.normalImpulse;
            const oldTangentImpulse = cp.tangentImpulse;
            cp.tangentImpulse = oldTangentImpulse + impulse;
            cp.tangentImpulse = cp.tangentImpulse < -maxFriction ? -maxFriction :
                (cp.tangentImpulse > maxFriction ? maxFriction : cp.tangentImpulse);
            impulse = cp.tangentImpulse - oldTangentImpulse;
        
            // Apply tangent impulse
            const Px = impulse * tangentx;
            const Py = impulse * tangenty;
        
            vAX -= mA * Px;
            vAY -= mA * Py;
            wA -= iA * (rAX * Py - rAY * Px);
        
            vBX += mB * Px;
            vBY += mB * Py;
            wB += iB * (rBX * Py - rBY * Px);
        }

        stateA.linearVelocity.x = vAX;
        stateA.linearVelocity.y = vAY;
        stateA.angularVelocity = wA;
        stateB.linearVelocity.x = vBX;
        stateB.linearVelocity.y = vBY;
        stateB.angularVelocity = wB;
    }
}

export function b2ApplyOverflowRestitution(context)
{
    const graph = context.graph;
    const color = graph.colors[b2_overflowIndex];
    const constraints = color.overflowConstraints;
    const contactCount = color.contacts.count;
    const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
    const states = awakeSet.states;

    const threshold = context.world.restitutionThreshold;

    // Dummy state to represent a static body
    const dummyState = new b2BodyState();

    for (let i = 0; i < contactCount; ++i)
    {
        const constraint = constraints[i];

        const restitution = constraint.restitution;

        if (restitution === 0.0)
        {
            continue;
        }

        const mA = constraint.invMassA;
        const iA = constraint.invIA;
        const mB = constraint.invMassB;
        const iB = constraint.invIB;

        const stateA = constraint.indexA === B2_NULL_INDEX ? dummyState : states.data[constraint.indexA];
        const vA = stateA.linearVelocity;
        let wA = stateA.angularVelocity;

        const stateB = constraint.indexB === B2_NULL_INDEX ? dummyState : states.data[constraint.indexB];
        const vB = stateB.linearVelocity;
        let wB = stateB.angularVelocity;

        const normalX = constraint.normalX;
        const normalY = constraint.normalY;
        const pointCount = constraint.pointCount;

        for (let j = 0; j < pointCount; ++j)
        {
            const cp = constraint.points[j];

            if (cp.relativeVelocity > -threshold || cp.maxNormalImpulse === 0.0)
            {
                continue;
            }

            // Fixed anchor points
            const rAX = cp.anchorAX;
            const rAY = cp.anchorAY;
            const rBX = cp.anchorBX;
            const rBY = cp.anchorBY;

            // Relative normal velocity at contact
            // const vrB = b2Add(vB, b2CrossSV(wB, rB));
            const vrBX = vB.x + -wB * rBY;
            const vrBY = vB.y + wB * rBX;

            // const vrA = b2Add(vA, b2CrossSV(wA, rA));
            const vrAX = vA.x + -wA * rAY;
            const vrAY = vA.y + wA * rAX;

            // const vn = b2Dot(b2Sub(vrB, vrA), normal);
            const subX = vrBX - vrAX;
            const subY = vrBY - vrAY;
            const vn = subX * normalX + subY * normalY;

            // Compute normal impulse
            let impulse = -cp.normalMass * (vn + restitution * cp.relativeVelocity);

            // Clamp the accumulated impulse
            const newImpulse = Math.max(cp.normalImpulse + impulse, 0.0);
            impulse = newImpulse - cp.normalImpulse;
            cp.normalImpulse = newImpulse;
            cp.maxNormalImpulse = Math.max(cp.maxNormalImpulse, impulse);

            // Apply contact impulse
            // const P = b2MulSV(impulse, normal);
            const PX = impulse * normalX;
            const PY = impulse * normalY;

            // vA = b2MulSub(vA, mA, P);
            vA.x -= mA * PX;
            vA.y -= mA * PY;

            // wA -= iA * b2Cross(rA, P);
            wA -= iA * (rAX * PY - rAY * PX);

            // vB = b2MulAdd(vB, mB, P);
            vB.x += mB * PX;
            vB.y += mB * PY;

            // wB += iB * b2Cross(rB, P);
            wB += iB * (rBX * PY - rBY * PX);
        }

        // stateA.linearVelocity = vA; PJB: vA, vB have been references all along...
        stateA.angularVelocity = wA;

        // stateB.linearVelocity = vB;
        stateB.angularVelocity = wB;
    }
}

export function b2StoreOverflowImpulses(context)
{
    const graph = context.graph;
    const color = graph.colors[b2_overflowIndex];
    const constraints = color.overflowConstraints;
    const contacts = color.contacts;
    const contactCount = color.contacts.count;

    for (let i = 0; i < contactCount; ++i)
    {
        const constraint = constraints[i];
        const contact = contacts.data[i];
        const manifold = contact.manifold;
        const pointCount = manifold.pointCount;

        for (let j = 0; j < pointCount; ++j)
        {
            manifold.points[j].normalImpulse = constraint.points[j].normalImpulse;
            manifold.points[j].tangentImpulse = constraint.points[j].tangentImpulse;
            manifold.points[j].maxNormalImpulse = constraint.points[j].maxNormalImpulse;
            manifold.points[j].normalVelocity = constraint.points[j].relativeVelocity;
        }
    }
}
