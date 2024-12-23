/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Mat22, b2Vec2 } from './math_functions_h.js';

import { B2_NULL_INDEX } from './core_h.js';
import { b2JointType } from './types_h.js';
import { b2Softness } from './solver_h.js';

export class b2JointEdge
{
    constructor()
    {
        this.bodyId = B2_NULL_INDEX;
        this.prevKey = B2_NULL_INDEX;
        this.nextKey = B2_NULL_INDEX;
    }
}

export class b2Joint
{
    constructor()
    {
        this.userData = null;
        this.setIndex = B2_NULL_INDEX;
        this.colorIndex = B2_NULL_INDEX;
        this.localIndex = B2_NULL_INDEX;
        this.edges = [ new b2JointEdge(), new b2JointEdge() ];
        this.jointId = B2_NULL_INDEX;
        this.islandId = B2_NULL_INDEX;
        this.islandPrev = B2_NULL_INDEX;
        this.islandNext = B2_NULL_INDEX;
        this.revision = 0;
        this.drawSize = 0;
        this.type = b2JointType.b2_unknown;
        this.isMarked = false;
        this.collideConnected = false;
    }
}

export class b2DistanceJoint
{
    constructor()
    {
        this.length = 0;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.minLength = 0;
        this.maxLength = 0;
        this.maxMotorForce = 0;
        this.motorSpeed = 0;
        this.impulse = 0;
        this.lowerImpulse = 0;
        this.upperImpulse = 0;
        this.motorImpulse = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.distanceSoftness = new b2Softness();
        this.axialMass = 0;
        this.enableSpring = false;
        this.enableLimit = false;
        this.enableMotor = false;
    }

    clone()
    {
        const dj = new b2DistanceJoint();
        dj.length = this.length;
        dj.hertz = this.hertz;
        dj.dampingRatio = this.dampingRatio;
        dj.minLength = this.minLength;
        dj.maxLength = this.maxLength;
        dj.maxMotorForce = this.maxMotorForce;
        dj.motorSpeed = this.motorSpeed;
        dj.impulse = this.impulse;
        dj.lowerImpulse = this.lowerImpulse;
        dj.upperImpulse = this.upperImpulse;
        dj.motorImpulse = this.motorImpulse;
        dj.indexA = this.indexA;
        dj.indexB = this.indexB;
        dj.anchorA = this.anchorA.clone();
        dj.anchorB = this.anchorB.clone();
        dj.deltaCenter = this.deltaCenter.clone();
        dj.distanceSoftness = this.distanceSoftness;    // this.distanceSoftness.clone(); PJB it's all primitives, we might get away with a reference copy here
        dj.axialMass = this.axialMass;
        dj.enableSpring = this.enableSpring;
        dj.enableLimit = this.enableLimit;
        dj.enableMotor = this.enableMotor;

        return dj;
    }
}

export class b2MotorJoint
{
    constructor()
    {
        this.linearOffset = new b2Vec2();
        this.angularOffset = 0;
        this.linearImpulse = new b2Vec2();
        this.angularImpulse = 0;
        this.maxForce = 0;
        this.maxTorque = 0;
        this.correctionFactor = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.deltaAngle = 0;
        this.linearMass = new b2Mat22();
        this.angularMass = 0;
    }

    clone()
    {
        const mj = new b2MotorJoint();
        mj.linearOffset = this.linearOffset.clone();
        mj.angularOffset = this.angularOffset;
        mj.linearImpulse = this.linearImpulse.clone();
        mj.angularImpulse = this.angularImpulse;
        mj.maxForce = this.maxForce;
        mj.maxTorque = this.maxTorque;
        mj.correctionFactor = this.correctionFactor;
        mj.indexA = this.indexA;
        mj.indexB = this.indexB;
        mj.anchorA = this.anchorA.clone();
        mj.anchorB = this.anchorB.clone();
        mj.deltaCenter = this.deltaCenter.clone();
        mj.deltaAngle = this.deltaAngle;
        mj.linearMass = this.linearMass.clone();
        mj.angularMass = this.angularMass;

        return mj;
    }
}

export class b2MouseJoint
{
    constructor()
    {
        this.targetA = new b2Vec2();
        this.hertz = 0;
        this.dampingRatio = 0;
        this.maxForce = 0;
        this.linearImpulse = new b2Vec2();
        this.angularImpulse = 0;
        this.linearSoftness = new b2Softness();
        this.angularSoftness = new b2Softness();
        this.indexB = B2_NULL_INDEX;
        this.anchorB = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.linearMass = new b2Mat22();
    }

    clone()
    {
        const mj = new b2MouseJoint();
        mj.targetA = this.targetA.clone();
        mj.hertz = this.hertz;
        mj.dampingRatio = this.dampingRatio;
        mj.maxForce = this.maxForce;
        mj.linearImpulse = this.linearImpulse.clone();
        mj.angularImpulse = this.angularImpulse;
        mj.linearSoftness = this.linearSoftness;
        mj.angularSoftness = this.angularSoftness;
        mj.indexB = this.indexB;
        mj.anchorB = this.anchorB.clone();
        mj.deltaCenter = this.deltaCenter.clone();
        mj.linearMass = this.linearMass.clone();

        return mj;
    }
}

export class b2PrismaticJoint
{
    constructor()
    {
        this.localAxisA = new b2Vec2();
        this.impulse = new b2Vec2();
        this.springImpulse = 0;
        this.motorImpulse = 0;
        this.lowerImpulse = 0;
        this.upperImpulse = 0;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.maxMotorForce = 0;
        this.motorSpeed = 0;
        this.referenceAngle = 0;
        this.lowerTranslation = 0;
        this.upperTranslation = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.axisA = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.deltaAngle = 0;
        this.axialMass = 0;
        this.springSoftness = new b2Softness();
        this.enableSpring = false;
        this.enableLimit = false;
        this.enableMotor = false;
    }

    clone()
    {
        const pj = new b2PrismaticJoint();
        pj.localAxisA = this.localAxisA.clone();
        pj.impulse = this.impulse.clone();
        pj.springImpulse = this.springImpulse;
        pj.motorImpulse = this.motorImpulse;
        pj.lowerImpulse = this.lowerImpulse;
        pj.upperImpulse = this.upperImpulse;
        pj.hertz = this.hertz;
        pj.dampingRatio = this.dampingRatio;
        pj.maxMotorForce = this.maxMotorForce;
        pj.motorSpeed = this.motorSpeed;
        pj.referenceAngle = this.referenceAngle;
        pj.lowerTranslation = this.lowerTranslation;
        pj.upperTranslation = this.upperTranslation;
        pj.indexA = this.indexA;
        pj.indexB = this.indexB;
        pj.anchorA = this.anchorA.clone();
        pj.anchorB = this.anchorB.clone();
        pj.axisA = this.axisA.clone();
        pj.deltaCenter = this.deltaCenter.clone();
        pj.deltaAngle = this.deltaAngle;
        pj.axialMass = this.axialMass;
        pj.springSoftness = this.springSoftness.clone();
        pj.enableSpring = this.enableSpring;
        pj.enableLimit = this.enableLimit;
        pj.enableMotor = this.enableMotor;

        return pj;
    }
}

export class b2RevoluteJoint
{
    constructor()
    {
        this.linearImpulse = new b2Vec2();
        this.springImpulse = 0;
        this.motorImpulse = 0;
        this.lowerImpulse = 0;
        this.upperImpulse = 0;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.maxMotorTorque = 0;
        this.motorSpeed = 0;
        this.referenceAngle = 0;
        this.lowerAngle = 0;
        this.upperAngle = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.deltaAngle = 0;
        this.axialMass = 0;
        this.springSoftness = new b2Softness();
        this.enableSpring = false;
        this.enableMotor = false;
        this.enableLimit = false;
    }

    clone()
    {
        const rj = new b2RevoluteJoint();
        rj.linearImpulse = this.linearImpulse.clone();
        rj.springImpulse = this.springImpulse;
        rj.motorImpulse = this.motorImpulse;
        rj.lowerImpulse = this.lowerImpulse;
        rj.upperImpulse = this.upperImpulse;
        rj.hertz = this.hertz;
        rj.dampingRatio = this.dampingRatio;
        rj.maxMotorTorque = this.maxMotorTorque;
        rj.motorSpeed = this.motorSpeed;
        rj.referenceAngle = this.referenceAngle;
        rj.lowerAngle = this.lowerAngle;
        rj.upperAngle = this.upperAngle;
        rj.indexA = this.indexA;
        rj.indexB = this.indexB;
        rj.anchorA = this.anchorA.clone();
        rj.anchorB = this.anchorB.clone();
        rj.deltaCenter = this.deltaCenter.clone();
        rj.deltaAngle = this.deltaAngle;
        rj.axialMass = this.axialMass;
        rj.springSoftness = this.springSoftness;
        rj.enableSpring = this.enableSpring;
        rj.enableMotor = this.enableMotor;
        rj.enableLimit = this.enableLimit;

        return rj;
    }
}

export class b2WeldJoint
{
    constructor()
    {
        this.referenceAngle = 0;
        this.linearHertz = 0;
        this.linearDampingRatio = 0;
        this.angularHertz = 0;
        this.angularDampingRatio = 0;
        this.linearSoftness = new b2Softness();
        this.angularSoftness = new b2Softness();
        this.linearImpulse = new b2Vec2();
        this.angularImpulse = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.deltaAngle = 0;
        this.axialMass = 0;
    }

    clone()
    {
        const wj = new b2WeldJoint();
        wj.referenceAngle = this.referenceAngle;
        wj.linearHertz = this.linearHertz;
        wj.linearDampingRatio = this.linearDampingRatio;
        wj.angularHertz = this.angularHertz;
        wj.angularDampingRatio = this.angularDampingRatio;
        wj.linearSoftness = this.linearSoftness;
        wj.angularSoftness = this.angularSoftness;
        wj.linearImpulse = this.linearImpulse.clone();
        wj.angularImpulse = this.angularImpulse;
        wj.indexA = this.indexA;
        wj.indexB = this.indexB;
        wj.anchorA = this.anchorA.clone();
        wj.anchorB = this.anchorB.clone();
        wj.deltaCenter = this.deltaCenter.clone();
        wj.deltaAngle = this.deltaAngle;
        wj.axialMass = this.axialMass;

        return wj;
    }
}

export class b2WheelJoint
{
    constructor()
    {
        this.localAxisA = new b2Vec2();
        this.perpImpulse = 0;
        this.motorImpulse = 0;
        this.springImpulse = 0;
        this.lowerImpulse = 0;
        this.upperImpulse = 0;
        this.maxMotorTorque = 0;
        this.motorSpeed = 0;
        this.lowerTranslation = 0;
        this.upperTranslation = 0;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.indexA = B2_NULL_INDEX;
        this.indexB = B2_NULL_INDEX;
        this.anchorA = new b2Vec2();
        this.anchorB = new b2Vec2();
        this.axisA = new b2Vec2();
        this.deltaCenter = new b2Vec2();
        this.perpMass = 0;
        this.motorMass = 0;
        this.axialMass = 0;
        this.springSoftness = new b2Softness();
        this.enableSpring = false;
        this.enableMotor = false;
        this.enableLimit = false;
    }

    clone()
    {
        const wj = new b2WheelJoint();
        wj.localAxisA = this.localAxisA.clone();
        wj.perpImpulse = this.perpImpulse;
        wj.motorImpulse = this.motorImpulse;
        wj.springImpulse = this.springImpulse;
        wj.lowerImpulse = this.lowerImpulse;
        wj.upperImpulse = this.upperImpulse;
        wj.maxMotorTorque = this.maxMotorTorque;
        wj.motorSpeed = this.motorSpeed;
        wj.lowerTranslation = this.lowerTranslation;
        wj.upperTranslation = this.upperTranslation;
        wj.hertz = this.hertz;
        wj.dampingRatio = this.dampingRatio;
        wj.indexA = this.indexA;
        wj.indexB = this.indexB;
        wj.anchorA = this.anchorA.clone();
        wj.anchorB = this.anchorB.clone();
        wj.axisA = this.axisA.clone();
        wj.deltaCenter = this.deltaCenter.clone();
        wj.perpMass = this.perpMass;
        wj.motorMass = this.motorMass;
        wj.axialMass = this.axialMass;
        wj.springSoftness = this.springSoftness;
        wj.enableSpring = this.enableSpring;
        wj.enableMotor = this.enableMotor;
        wj.enableLimit = this.enableLimit;

        return wj;
    }
}

export class b2JointSim
{
    constructor()
    {
        this.jointId = B2_NULL_INDEX;
        this.bodyIdA = B2_NULL_INDEX;
        this.bodyIdB = B2_NULL_INDEX;
        this.type = b2JointType.b2_unknown;
        this.localOriginAnchorA = new b2Vec2();
        this.localOriginAnchorB = new b2Vec2();
        this.invMassA = 0;
        this.invMassB = 0;
        this.invIA = 0;
        this.invIB = 0;
        this.joint = null;

        // in C these joints are in a union
        // (shouldn't matter that they're separate here, unless there's any sneaky type swapping being done)
        this.distanceJoint = null;
        this.motorJoint = null;
        this.mouseJoint = null;
        this.revoluteJoint = null;
        this.prismaticJoint = null;
        this.weldJoint = null;
        this.wheelJoint = null;
    }

    copyTo(dst)
    {
        dst.jointId = this.jointId;
        dst.bodyIdA = this.bodyIdA;
        dst.bodyIdB = this.bodyIdB;
        dst.type = this.type;
        dst.localOriginAnchorA = this.localOriginAnchorA.clone();
        dst.localOriginAnchorB = this.localOriginAnchorB.clone();
        dst.invMassA = this.invMassA;
        dst.invMassB = this.invMassB;
        dst.invIA = this.invIA;
        dst.invIB = this.invIB;
        dst.joint = this.joint;
        dst.distanceJoint = (this.distanceJoint ? this.distanceJoint.clone() : null);
        dst.motorJoint = (this.motorJoint ? this.motorJoint.clone() : null);
        dst.mouseJoint = (this.mouseJoint ? this.mouseJoint.clone() : null);
        dst.revoluteJoint = (this.revoluteJoint ? this.revoluteJoint.clone() : null);
        dst.prismaticJoint = (this.prismaticJoint ? this.prismaticJoint.clone() : null);
        dst.weldJoint = (this.weldJoint ? this.weldJoint.clone() : null);
        dst.wheelJoint = (this.wheelJoint ? this.wheelJoint.clone() : null);
    }
}

export {
    b2GetJoint, b2DestroyJointInternal, b2DestroyJoint, b2PrepareJoint, b2WarmStartJoint, b2SolveJoint, b2DrawJoint,
    b2GetJointSim, b2GetJointSimCheckType,
    b2PrepareOverflowJoints, b2WarmStartOverflowJoints, b2SolveOverflowJoints,
    b2CreateRevoluteJoint, b2CreateWheelJoint, b2CreateWeldJoint, b2CreatePrismaticJoint, b2CreateDistanceJoint, b2CreateMotorJoint, b2CreateMouseJoint,
    b2Joint_WakeBodies, b2Joint_GetBodyA, b2Joint_GetBodyB, b2Joint_GetCollideConnected, b2Joint_GetConstraintForce, b2Joint_GetConstraintTorque, b2Joint_GetLocalAnchorA, b2Joint_GetLocalAnchorB,
    b2Joint_GetType, b2Joint_GetUserData, b2Joint_SetUserData, b2Joint_SetCollideConnected,
    b2DefaultDistanceJointDef,b2DefaultMotorJointDef,b2DefaultMouseJointDef,b2DefaultPrismaticJointDef,b2DefaultRevoluteJointDef,b2DefaultWeldJointDef,b2DefaultWheelJointDef
} from '../joint_c.js';
