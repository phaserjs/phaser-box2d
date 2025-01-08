export class b2JointEdge {
    bodyId: number;
    prevKey: number;
    nextKey: number;
}
export class b2Joint {
    userData: any;
    setIndex: number;
    colorIndex: number;
    localIndex: number;
    edges: b2JointEdge[];
    jointId: number;
    islandId: number;
    islandPrev: number;
    islandNext: number;
    revision: number;
    drawSize: number;
    type: number;
    isMarked: boolean;
    collideConnected: boolean;
}
export class b2DistanceJoint {
    length: number;
    hertz: number;
    dampingRatio: number;
    minLength: number;
    maxLength: number;
    maxMotorForce: number;
    motorSpeed: number;
    impulse: number;
    lowerImpulse: number;
    upperImpulse: number;
    motorImpulse: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    deltaCenter: b2Vec2;
    distanceSoftness: b2Softness;
    axialMass: number;
    enableSpring: boolean;
    enableLimit: boolean;
    enableMotor: boolean;
    clone(): b2DistanceJoint;
}
export class b2MotorJoint {
    linearOffset: b2Vec2;
    angularOffset: number;
    linearImpulse: b2Vec2;
    angularImpulse: number;
    maxForce: number;
    maxTorque: number;
    correctionFactor: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    deltaCenter: b2Vec2;
    deltaAngle: number;
    linearMass: b2Mat22;
    angularMass: number;
    clone(): b2MotorJoint;
}
export class b2MouseJoint {
    targetA: b2Vec2;
    hertz: number;
    dampingRatio: number;
    maxForce: number;
    linearImpulse: b2Vec2;
    angularImpulse: number;
    linearSoftness: b2Softness;
    angularSoftness: b2Softness;
    indexB: number;
    anchorB: b2Vec2;
    deltaCenter: b2Vec2;
    linearMass: b2Mat22;
    clone(): b2MouseJoint;
}
export class b2PrismaticJoint {
    localAxisA: b2Vec2;
    impulse: b2Vec2;
    springImpulse: number;
    motorImpulse: number;
    lowerImpulse: number;
    upperImpulse: number;
    hertz: number;
    dampingRatio: number;
    maxMotorForce: number;
    motorSpeed: number;
    referenceAngle: number;
    lowerTranslation: number;
    upperTranslation: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    axisA: b2Vec2;
    deltaCenter: b2Vec2;
    deltaAngle: number;
    axialMass: number;
    springSoftness: b2Softness;
    enableSpring: boolean;
    enableLimit: boolean;
    enableMotor: boolean;
    clone(): b2PrismaticJoint;
}
export class b2RevoluteJoint {
    linearImpulse: b2Vec2;
    springImpulse: number;
    motorImpulse: number;
    lowerImpulse: number;
    upperImpulse: number;
    hertz: number;
    dampingRatio: number;
    maxMotorTorque: number;
    motorSpeed: number;
    referenceAngle: number;
    lowerAngle: number;
    upperAngle: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    deltaCenter: b2Vec2;
    deltaAngle: number;
    axialMass: number;
    springSoftness: b2Softness;
    enableSpring: boolean;
    enableMotor: boolean;
    enableLimit: boolean;
    clone(): b2RevoluteJoint;
}
export class b2WeldJoint {
    referenceAngle: number;
    linearHertz: number;
    linearDampingRatio: number;
    angularHertz: number;
    angularDampingRatio: number;
    linearSoftness: b2Softness;
    angularSoftness: b2Softness;
    linearImpulse: b2Vec2;
    angularImpulse: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    deltaCenter: b2Vec2;
    deltaAngle: number;
    axialMass: number;
    clone(): b2WeldJoint;
}
export class b2WheelJoint {
    localAxisA: b2Vec2;
    perpImpulse: number;
    motorImpulse: number;
    springImpulse: number;
    lowerImpulse: number;
    upperImpulse: number;
    maxMotorTorque: number;
    motorSpeed: number;
    lowerTranslation: number;
    upperTranslation: number;
    hertz: number;
    dampingRatio: number;
    indexA: number;
    indexB: number;
    anchorA: b2Vec2;
    anchorB: b2Vec2;
    axisA: b2Vec2;
    deltaCenter: b2Vec2;
    perpMass: number;
    motorMass: number;
    axialMass: number;
    springSoftness: b2Softness;
    enableSpring: boolean;
    enableMotor: boolean;
    enableLimit: boolean;
    clone(): b2WheelJoint;
}
export class b2JointSim {
    jointId: number;
    bodyIdA: number;
    bodyIdB: number;
    type: number;
    localOriginAnchorA: b2Vec2;
    localOriginAnchorB: b2Vec2;
    invMassA: number;
    invMassB: number;
    invIA: number;
    invIB: number;
    joint: any;
    distanceJoint: any;
    motorJoint: any;
    mouseJoint: any;
    revoluteJoint: any;
    prismaticJoint: any;
    weldJoint: any;
    wheelJoint: any;
    copyTo(dst: any): void;
}
import { b2Vec2 } from './math_functions_h.js';
import { b2Softness } from './solver_h.js';
import { b2Mat22 } from './math_functions_h.js';
export { b2GetJoint, b2DestroyJointInternal, b2DestroyJoint, b2PrepareJoint, b2WarmStartJoint, b2SolveJoint, b2DrawJoint, b2GetJointSim, b2GetJointSimCheckType, b2PrepareOverflowJoints, b2WarmStartOverflowJoints, b2SolveOverflowJoints, b2CreateRevoluteJoint, b2CreateWheelJoint, b2CreateWeldJoint, b2CreatePrismaticJoint, b2CreateDistanceJoint, b2CreateMotorJoint, b2CreateMouseJoint, b2Joint_WakeBodies, b2Joint_GetBodyA, b2Joint_GetBodyB, b2Joint_GetCollideConnected, b2Joint_GetConstraintForce, b2Joint_GetConstraintTorque, b2Joint_GetLocalAnchorA, b2Joint_GetLocalAnchorB, b2Joint_GetType, b2Joint_GetUserData, b2Joint_SetUserData, b2Joint_SetCollideConnected, b2DefaultDistanceJointDef, b2DefaultMotorJointDef, b2DefaultMouseJointDef, b2DefaultPrismaticJointDef, b2DefaultRevoluteJointDef, b2DefaultWeldJointDef, b2DefaultWheelJointDef } from "../joint_c.js";
