/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Rot, b2Transform, b2Vec2 } from './math_functions_h.js';

import { B2_NULL_INDEX } from '../core_c.js';
import { b2BodyType } from './types_h.js';

export class b2Body
{
    constructor()
    {
        this.userData = null;
        this.setIndex = 0;
        this.localIndex = 0;
        this.headContactKey = 0;
        this.contactCount = 0;
        this.headShapeId = 0;
        this.shapeCount = 0;
        this.headChainId = 0;
        this.headJointKey = B2_NULL_INDEX;
        this.jointCount = 0;
        this.islandId = 0;
        this.islandPrev = 0;
        this.islandNext = 0;
        this.sleepThreshold = 0;
        this.sleepTime = 0;
        this.bodyMoveIndex = 0;
        this.id = B2_NULL_INDEX;
        this.type = b2BodyType.b2_staticBody;
        this.revision = 0;
        this.enableSleep = false;
        this.fixedRotation = false;
        this.isSpeedCapped = false;
        this.isMarked = false;
        this.updateBodyMass = false;
    }
}

export class b2BodyState
{
    constructor()
    {
        this.linearVelocity = new b2Vec2(0, 0);
        this.angularVelocity = 0;
        this.flags = 0;
        this.deltaPosition = new b2Vec2(0, 0);
        this.deltaRotation = new b2Rot(1, 0);
    }
}

// export const b2_identityBodyState = new b2BodyState();

export class b2BodySim
{
    constructor()
    {
        this.transform = new b2Transform();
        this.center = new b2Vec2(0, 0);
        this.rotation0 = new b2Rot(1, 0);
        this.center0X = 0;
        this.center0Y = 0;
        this.localCenter = new b2Vec2(0, 0);
        this.force = new b2Vec2(0, 0);
        this.torque = 0;
        this.mass = 0;
        this.invMass = 0;
        this.inertia = 0;
        this.invInertia = 0;
        this.minExtent = 0;
        this.maxExtent = 0;
        this.linearDamping = 0;
        this.angularDamping = 0;
        this.gravityScale = 0;
        this.bodyId = 0;
        this.isFast = false;
        this.isBullet = false;
        this.isSpeedCapped = false;
        this.allowFastRotation = false;
        this.enlargeAABB = false;
    }

    copyTo(dst)
    {
        dst.transform = this.transform.deepClone();
        dst.center = this.center.clone();
        dst.rotation0 = this.rotation0.clone();
        dst.center0X = this.center0X;
        dst.center0Y = this.center0Y;
        dst.localCenter = this.localCenter.clone();
        dst.force = this.force.clone();
        dst.torque = this.torque;
        dst.mass = this.mass;
        dst.invMass = this.invMass;
        dst.inertia = this.inertia;
        dst.invInertia = this.invInertia;
        dst.minExtent = this.minExtent;
        dst.maxExtent = this.maxExtent;
        dst.linearDamping = this.linearDamping;
        dst.angularDamping = this.angularDamping;
        dst.gravityScale = this.gravityScale;
        dst.bodyId = this.bodyId;
        dst.isFast = this.isFast;
        dst.isBullet = this.isBullet;
        dst.isSpeedCapped = this.isSpeedCapped;
        dst.allowFastRotation = this.allowFastRotation;
        dst.enlargeAABB = this.enlargeAABB;
    }
}

export {
    b2CreateBody, b2DestroyBody, b2GetBodyFullId, b2GetBody, b2GetBodyTransformQuick, b2GetBodyTransform, b2MakeBodyId,
    b2ShouldBodiesCollide, b2IsBodyAwake, b2GetBodySim, b2GetBodyState, b2WakeBody, b2UpdateBodyMassData,
    b2Body_IsEnabled, b2Body_GetType, b2Body_SetType, b2Body_GetUserData, b2Body_SetUserData,
    b2Body_GetLocalPoint,
    b2Body_GetPosition, b2Body_GetRotation, b2Body_SetTransform,
    b2Body_GetMassData, b2Body_SetMassData, b2Body_GetMass,
    b2Body_GetTransform, b2Body_ApplyTorque, b2Body_GetWorldPoint, b2Body_GetWorldVector,
    b2Body_GetLinearDamping, b2Body_SetLinearDamping, b2Body_GetLinearVelocity, b2Body_SetLinearVelocity, b2Body_ApplyLinearImpulse, b2Body_ApplyLinearImpulseToCenter,
    b2Body_GetAngularVelocity, b2Body_SetAngularVelocity, b2Body_ApplyAngularImpulse,
    b2Body_GetInertiaTensor, b2Body_GetLocalCenterOfMass, b2Body_GetWorldCenterOfMass,
    b2Body_ApplyMassFromShapes, b2Body_SetAngularDamping, b2Body_GetAngularDamping, b2Body_SetGravityScale, b2Body_GetGravityScale,
    b2Body_EnableSleep, b2Body_IsSleepEnabled, b2Body_SetSleepThreshold, b2Body_GetSleepThreshold,
    b2Body_Enable, b2Body_Disable,
    b2Body_SetFixedRotation, b2Body_IsFixedRotation,
    b2Body_GetLocalVector, b2Body_SetBullet, b2Body_IsBullet, b2Body_EnableHitEvents,
    b2Body_GetShapeCount, b2Body_GetShapes, b2Body_GetJointCount, b2Body_GetJoints,
    b2Body_ApplyForce, b2Body_SetAwake, b2Body_IsAwake, b2Body_ApplyForceToCenter,
    b2Body_GetContactCapacity, b2Body_GetContactData, b2Body_ComputeAABB,
    b2MakeSweep,
    resetProperties
} from '../body_c.js';
