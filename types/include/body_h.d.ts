export class b2Body {
    userData: any;
    setIndex: number;
    localIndex: number;
    headContactKey: number;
    contactCount: number;
    headShapeId: number;
    shapeCount: number;
    headChainId: number;
    headJointKey: number;
    jointCount: number;
    islandId: number;
    islandPrev: number;
    islandNext: number;
    sleepThreshold: number;
    sleepTime: number;
    bodyMoveIndex: number;
    id: number;
    type: number;
    revision: number;
    enableSleep: boolean;
    fixedRotation: boolean;
    isSpeedCapped: boolean;
    isMarked: boolean;
    updateBodyMass: boolean;
}
export class b2BodyState {
    linearVelocity: b2Vec2;
    angularVelocity: number;
    flags: number;
    deltaPosition: b2Vec2;
    deltaRotation: b2Rot;
}
export class b2BodySim {
    transform: b2Transform;
    center: b2Vec2;
    rotation0: b2Rot;
    center0X: number;
    center0Y: number;
    localCenter: b2Vec2;
    force: b2Vec2;
    torque: number;
    mass: number;
    invMass: number;
    inertia: number;
    invInertia: number;
    minExtent: number;
    maxExtent: number;
    linearDamping: number;
    angularDamping: number;
    gravityScale: number;
    bodyId: number;
    isFast: boolean;
    isBullet: boolean;
    isSpeedCapped: boolean;
    allowFastRotation: boolean;
    enlargeAABB: boolean;
    copyTo(dst: any): void;
}
import { b2Vec2 } from './math_functions_h.js';
import { b2Rot } from './math_functions_h.js';
import { b2Transform } from './math_functions_h.js';
export { b2CreateBody, b2DestroyBody, b2GetBodyFullId, b2GetBody, b2GetBodyTransformQuick, b2GetBodyTransform, b2MakeBodyId, b2ShouldBodiesCollide, b2IsBodyAwake, b2GetBodySim, b2GetBodyState, b2WakeBody, b2UpdateBodyMassData, b2Body_IsEnabled, b2Body_GetType, b2Body_SetType, b2Body_GetUserData, b2Body_SetUserData, b2Body_GetLocalPoint, b2Body_GetPosition, b2Body_GetRotation, b2Body_SetTransform, b2Body_GetMassData, b2Body_SetMassData, b2Body_GetMass, b2Body_GetTransform, b2Body_ApplyTorque, b2Body_GetWorldPoint, b2Body_GetWorldVector, b2Body_GetLinearDamping, b2Body_SetLinearDamping, b2Body_GetLinearVelocity, b2Body_SetLinearVelocity, b2Body_ApplyLinearImpulse, b2Body_ApplyLinearImpulseToCenter, b2Body_GetAngularVelocity, b2Body_SetAngularVelocity, b2Body_ApplyAngularImpulse, b2Body_GetRotationalInertia, b2Body_GetLocalCenterOfMass, b2Body_GetWorldCenterOfMass, b2Body_ApplyMassFromShapes, b2Body_SetAngularDamping, b2Body_GetAngularDamping, b2Body_SetGravityScale, b2Body_GetGravityScale, b2Body_EnableSleep, b2Body_IsSleepEnabled, b2Body_SetSleepThreshold, b2Body_GetSleepThreshold, b2Body_Enable, b2Body_Disable, b2Body_SetFixedRotation, b2Body_IsFixedRotation, b2Body_GetLocalVector, b2Body_SetBullet, b2Body_IsBullet, b2Body_EnableHitEvents, b2Body_GetShapeCount, b2Body_GetShapes, b2Body_GetJointCount, b2Body_GetJoints, b2Body_ApplyForce, b2Body_SetAwake, b2Body_IsAwake, b2Body_ApplyForceToCenter, b2Body_GetContactCapacity, b2Body_GetContactData, b2Body_ComputeAABB, b2MakeSweep, resetProperties } from "../body_c.js";
