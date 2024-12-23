/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Add, b2Vec2 } from "./include/math_functions_h.js";
import { b2BodyType, b2RevoluteJointDef } from "./include/types_h.js";
import { b2Body_GetLocalPoint, b2Body_SetUserData, b2DestroyBody } from "./include/body_h.js";
import { b2CreateRevoluteJoint, b2DestroyJoint } from "./include/joint_h.js";

import { B2_NULL_INDEX } from "./include/core_h.js";
import { CreateCapsule } from "./physics.js";
import { b2Capsule } from "./include/collision_h.js";
import { b2CreateCapsuleShape } from "./include/shape_h.js";
import { b2DefaultShapeDef } from "./include/types_h.js";
import { b2JointId } from "./include/id_h.js";

/**
 * @namespace Ragdoll
 */

class JointedBone
{
    constructor()
    {
        this.bodyId = null;
        this.jointId = null;
        this.frictionScale = 1.0;
        this.parentIndex = -1;
        this.name = "";
    }
}

export class Skeletons
{
    static HumanBones =
        {
            e_hip: 0,
            e_torso: 1,
            e_head: 2,
            e_upperLeftLeg: 3,
            e_lowerLeftLeg: 4,
            e_upperRightLeg: 5,
            e_lowerRightLeg: 6,
            e_upperLeftArm: 7,
            e_lowerLeftArm: 8,
            e_upperRightArm: 9,
            e_lowerRightArm: 10,
            e_count: 11
        };

    static sideViewHuman11 =
        {
            BONE_DATA: [
                { name: 'hip', parentIndex: -1, position: [ 0, 0.95 ], capsule: { center1: [ 0, -0.02 ], center2: [ 0, 0.02 ], radius: 0.095 } },
                { name: 'torso', parentIndex: 0, position: [ 0, 1.2 ], capsule: { center1: [ 0, -0.135 ], center2: [ 0, 0.135 ], radius: 0.09 }, frictionScale: 0.5 },
                { name: 'head', parentIndex: 1, position: [ 0, 1.5 ], capsule: { center1: [ 0, -0.0325 ], center2: [ 0, 0.0325 ], radius: 0.08 }, frictionScale: 0.25, linearDamping: 0.1 },
                { name: 'upperLeftLeg', parentIndex: 0, position: [ 0, 0.775 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.06 } },
                { name: 'lowerLeftLeg', parentIndex: 3, position: [ 0, 0.475 ], capsule: { center1: [ 0, -0.14 ], center2: [ 0, 0.125 ], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
                { name: 'upperRightLeg', parentIndex: 0, position: [ 0, 0.775 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.06 } },
                { name: 'lowerRightLeg', parentIndex: 5, position: [ 0, 0.475 ], capsule: { center1: [ 0, -0.14 ], center2: [ 0, 0.125 ], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
                { name: 'upperLeftArm', parentIndex: 1, position: [ 0, 1.225 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.035 }, frictionScale: 0.5 },
                { name: 'lowerLeftArm', parentIndex: 7, position: [ 0, 0.975 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
                { name: 'upperRightArm', parentIndex: 1, position: [ 0, 1.225 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.035 }, frictionScale: 0.5 },
                { name: 'lowerRightArm', parentIndex: 9, position: [ 0, 0.975 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
            ],
            JOINT_DATA: [
                { boneName: 'torso', pivot: [ 0, 1.0 ], limits: [ -0.25 * Math.PI, 0 ] },
                { boneName: 'head', pivot: [ 0, 1.4 ], limits: [ -0.3 * Math.PI, 0.1 * Math.PI ] },
                { boneName: 'upperLeftLeg', pivot: [ 0, 0.9 ], limits: [ -0.05 * Math.PI, 0.4 * Math.PI ] },
                { boneName: 'lowerLeftLeg', pivot: [ 0, 0.625 ], limits: [ -0.5 * Math.PI, -0.02 * Math.PI ] },
                { boneName: 'upperRightLeg', pivot: [ 0, 0.9 ], limits: [ -0.05 * Math.PI, 0.4 * Math.PI ] },
                { boneName: 'lowerRightLeg', pivot: [ 0, 0.625 ], limits: [ -0.5 * Math.PI, -0.02 * Math.PI ] },
                { boneName: 'upperLeftArm', pivot: [ 0, 1.35 ], limits: [ -0.1 * Math.PI, 0.8 * Math.PI ] },
                { boneName: 'lowerLeftArm', pivot: [ 0, 1.1 ], limits: [ 0.01 * Math.PI, 0.5 * Math.PI ] },
                { boneName: 'upperRightArm', pivot: [ 0, 1.35 ], limits: null },
                { boneName: 'lowerRightArm', pivot: [ 0, 1.1 ], limits: [ 0.01 * Math.PI, 0.5 * Math.PI ] },
            ]
        };

    static frontViewHuman11 =
        {
            BONE_DATA: [
                { name: 'hip', parentIndex: -1, position: [ 0, 0.95 ], capsule: { center1: [ -0.03, 0 ], center2: [ 0.03, 0 ], radius: 0.095 } },
                { name: 'torso', parentIndex: 0, position: [ 0, 1.2 ], capsule: { center1: [ 0, -0.135 ], center2: [ 0, 0.135 ], radius: 0.09 }, frictionScale: 0.5 },
                { name: 'head', parentIndex: 1, position: [ 0, 1.5 ], capsule: { center1: [ 0, -0.0325 ], center2: [ 0, 0.0325 ], radius: 0.08 }, frictionScale: 0.25, linearDamping: 0.1 },
                { name: 'upperLeftLeg', parentIndex: 0, position: [ -0.1, 0.775 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.06 } },
                { name: 'lowerLeftLeg', parentIndex: 3, position: [ -0.1, 0.475 ], capsule: { center1: [ 0, -0.14 ], center2: [ 0, 0.125 ], radius: 0.05 }, frictionScale: 0.5, foot: "left" },
                { name: 'upperRightLeg', parentIndex: 0, position: [ 0.1, 0.775 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.06 } },
                { name: 'lowerRightLeg', parentIndex: 5, position: [ 0.1, 0.475 ], capsule: { center1: [ 0, -0.14 ], center2: [ 0, 0.125 ], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
                { name: 'upperLeftArm', parentIndex: 1, position: [ -0.15, 1.22 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0.05, 0.125 ], radius: 0.035 }, frictionScale: 0.5 },
                { name: 'lowerLeftArm', parentIndex: 7, position: [ -0.15, 0.97 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
                { name: 'upperRightArm', parentIndex: 1, position: [ 0.15, 1.22 ], capsule: { center1: [ 0, -0.125 ], center2: [ -0.05, 0.125 ], radius: 0.035 }, frictionScale: 0.5 },
                { name: 'lowerRightArm', parentIndex: 9, position: [ 0.15, 0.97 ], capsule: { center1: [ 0, -0.125 ], center2: [ 0, 0.125 ], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
            ],
            JOINT_DATA: [
                { boneName: 'torso', pivot: [ 0, 1.0 ], limits: [ -0.1 * Math.PI, 0.1 * Math.PI ] },
                { boneName: 'head', pivot: [ 0, 1.4 ], limits: [ -0.2 * Math.PI, 0.2 * Math.PI ] },
                { boneName: 'upperLeftLeg', pivot: [ -0.1, 0.9 ], limits: [ -0.3 * Math.PI, 0.1 * Math.PI ] },
                { boneName: 'lowerLeftLeg', pivot: [ -0.1, 0.625 ], limits: [ 0, 0.5 * Math.PI ] },
                { boneName: 'upperRightLeg', pivot: [ 0.1, 0.9 ], limits: [ -0.1 * Math.PI, 0.3 * Math.PI ] },
                { boneName: 'lowerRightLeg', pivot: [ 0.1, 0.625 ], limits: [ -0.5 * Math.PI, 0 ] },
                { boneName: 'upperLeftArm', pivot: [ -0.12, 1.35 ], limits: [ -0.7 * Math.PI, 0.1 * Math.PI ] },
                { boneName: 'lowerLeftArm', pivot: [ -0.16, 1.10 ], limits: [ 0, 0.75 * Math.PI ] },
                { boneName: 'upperRightArm', pivot: [ 0.12, 1.35 ], limits: [ -0.1 * Math.PI, 0.7 * Math.PI ] },
                { boneName: 'lowerRightArm', pivot: [ 0.14, 1.10 ], limits: [ 0, 0.75 * Math.PI ] },
            ]
        };

    static ElephantBones =
        {
            e_torso: 0,
            e_head: 1,
            e_trunkBase: 2,
            e_trunkMid: 3,
            e_trunkTip: 4,
            e_upperFrontLegL: 5,
            e_lowerFrontLegL: 6,
            e_upperRearLegL: 7,
            e_lowerRearLegL: 8,
            e_tail: 9,
            e_ear: 10,
            e_count: 11,
        };

    static sideViewElephant = {
        BONE_DATA: [
            { name: 'torso', parentIndex: -1, position: [ 0, 1.5 ], capsule: { center1: [ 0.8, 0 ], center2: [ -0.8, 0 ], radius: 0.6 }, frictionScale: 0.5 },
            { name: 'head', parentIndex: 0, position: [ -1.4, 2.2 ], capsule: { center1: [ 0.3, 0 ], center2: [ -0.3, 0 ], radius: 0.35 }, frictionScale: 0.25, linearDamping: 0.1 },
            { name: 'trunkBase', parentIndex: 1, position: [ -1.95, 1.85 ], capsule: { center1: [ 0, -0.2 ], center2: [ 0, 0.2 ], radius: 0.15 } },
            { name: 'trunkMid', parentIndex: 2, position: [ -1.95, 1.4 ], capsule: { center1: [ 0, -0.2 ], center2: [ 0, 0.2 ], radius: 0.12 } },
            { name: 'trunkTip', parentIndex: 3, position: [ -1.95, 1.05 ], capsule: { center1: [ 0, -0.2 ], center2: [ 0, 0.2 ], radius: 0.08 }, frictionScale: 0.1, linearDamping: 0.1 },
            { name: 'upperFrontLeg', parentIndex: 0, position: [ -0.6, 0.8 ], capsule: { center1: [ 0, -0.3 ], center2: [ 0, 0.3 ], radius: 0.2 } },
            { name: 'lowerFrontLeg', parentIndex: 5, position: [ -0.6, 0.2 ], capsule: { center1: [ 0, -0.3 ], center2: [ 0, 0.3 ], radius: 0.18 }, frictionScale: 0.5 },
            { name: 'upperBackLeg', parentIndex: 0, position: [ 0.7, 0.8 ], capsule: { center1: [ 0, -0.3 ], center2: [ 0, 0.3 ], radius: 0.22 } },
            { name: 'lowerBackLeg', parentIndex: 7, position: [ 0.7, 0.2 ], capsule: { center1: [ 0, -0.3 ], center2: [ 0, 0.3 ], radius: 0.2 }, frictionScale: 0.5 },
            { name: 'tail', parentIndex: 0, position: [ 1.2, 1.6 ], capsule: { center1: [ 0, -0.3 ], center2: [ 0, 0.3 ], radius: 0.05 }, frictionScale: 0.1, linearDamping: 0.1 },
            { name: 'ear', parentIndex: 1, position: [ -1.1, 2.0 ], capsule: { center1: [ 0, -0.15 ], center2: [ 0, 0.15 ], radius: 0.3 }, frictionScale: 0.1, linearDamping: 0.1 },
        ],
        JOINT_DATA: [
            { boneName: 'head', pivot: [ -1.0, 2.0 ], limits: [ -0.1 * Math.PI, 0.3 * Math.PI ] },
            { boneName: 'trunkBase', pivot: [ -1.95, 2 ], limits: [ -0.5 * Math.PI, 0.5 * Math.PI ] },
            { boneName: 'trunkMid', pivot: [ -1.95, 1.55 ], limits: [ -0.7 * Math.PI, 0.7 * Math.PI ] },
            { boneName: 'trunkTip', pivot: [ -1.95, 1.15 ], limits: [ -0.9 * Math.PI, 0.9 * Math.PI ] },
            { boneName: 'upperFrontLeg', pivot: [ -0.6, 1.1 ], limits: [ -0.2 * Math.PI, 0.2 * Math.PI ] },
            { boneName: 'lowerFrontLeg', pivot: [ -0.6, 0.5 ], limits: [ -0.3 * Math.PI, 0.1 * Math.PI ] },
            { boneName: 'upperBackLeg', pivot: [ 0.7, 1.1 ], limits: [ -0.2 * Math.PI, 0.2 * Math.PI ] },
            { boneName: 'lowerBackLeg', pivot: [ 0.7, 0.5 ], limits: [ -0.1 * Math.PI, 0.3 * Math.PI ] },
            { boneName: 'tail', pivot: [ 1.2, 1.9 ], limits: [ -0.4 * Math.PI, 0.4 * Math.PI ] },
            { boneName: 'ear', pivot: [ -1.1, 2.2 ], limits: [ -0.3 * Math.PI, 0.9 * Math.PI ] },
        ]
    };
}

export class Ragdoll
{
    constructor(skeleton, x, y, worldId, groupIndex, color, size = 2)
    {
        this.skeleton = skeleton;
        this.position = new b2Vec2(x, y);
        this.worldId = worldId;
        this.groupIndex = groupIndex;
        this.color = color;
        this.m_scale = size;
        this.frictionTorque = 0.05;
        this.hertz = 0.0;
        this.dampingRatio = 0.5;
        this.jointDrawSize = 0.5;
        this.maxTorque = this.frictionTorque * this.m_scale;
        this.m_bones = [];

        this.create();
    }

    createBone(boneData)
    {
        const { bodyId } = CreateCapsule({
            worldId: this.worldId,
            position: b2Add(new b2Vec2(boneData.position[0] * this.m_scale, boneData.position[1] * this.m_scale), this.position),
            type: b2BodyType.b2_dynamicBody,
            center1: new b2Vec2(boneData.capsule.center1[0] * this.m_scale, boneData.capsule.center1[1] * this.m_scale),
            center2: new b2Vec2(boneData.capsule.center2[0] * this.m_scale, boneData.capsule.center2[1] * this.m_scale),
            radius: boneData.capsule.radius * this.m_scale,
            density: 1.0,
            friction: 0.2,
            groupIndex: -this.groupIndex,
            color: this.color
        });

        const bone = new JointedBone();
        bone.name = boneData.name;
        bone.parentIndex = boneData.parentIndex;
        bone.frictionScale = boneData.frictionScale || 1.0;
        bone.bodyId = bodyId;

        if (boneData.foot)
        {
            const footShapeDef = b2DefaultShapeDef();
            footShapeDef.density = 1.0;
            footShapeDef.friction = 0.2;
            footShapeDef.filter.groupIndex = -this.groupIndex;
            footShapeDef.filter.maskBits = 1;
            footShapeDef.customColor = this.color;

            const footDir = boneData.foot == "left" ? -1 : 1;
            const footCapsule = new b2Capsule();
            footCapsule.center1 = new b2Vec2(footDir * -0.02 * this.m_scale, -0.175 * this.m_scale);
            footCapsule.center2 = new b2Vec2(footDir * 0.13 * this.m_scale, -0.175 * this.m_scale);
            footCapsule.radius = 0.03 * this.m_scale;
            b2CreateCapsuleShape(bodyId, footShapeDef, footCapsule);
        }

        return bone;
    }

    createJoint(jointData)
    {
        const bone = this.m_bones.find(b => b.name === jointData.boneName);
        const parentBone = this.m_bones[bone.parentIndex];

        const pivot = b2Add(new b2Vec2(jointData.pivot[0] * this.m_scale, jointData.pivot[1] * this.m_scale), this.position);
        const jointDef = new b2RevoluteJointDef();
        jointDef.bodyIdA = parentBone.bodyId;
        jointDef.bodyIdB = bone.bodyId;
        jointDef.localAnchorA = b2Body_GetLocalPoint(jointDef.bodyIdA, pivot);
        jointDef.localAnchorB = b2Body_GetLocalPoint(jointDef.bodyIdB, pivot);
        
        if (jointData.limits)
        {
            jointDef.enableLimit = true;
            jointDef.lowerAngle = jointData.limits[0];
            jointDef.upperAngle = jointData.limits[1];
        }
        
        jointDef.enableMotor = true;
        jointDef.maxMotorTorque = bone.frictionScale * this.maxTorque;
        jointDef.enableSpring = this.hertz > 0.0;
        jointDef.hertz = this.hertz;
        jointDef.dampingRatio = this.dampingRatio;
        jointDef.drawSize = this.jointDrawSize;

        return b2CreateRevoluteJoint(this.worldId, jointDef);
    }

    create()
    {
        this.m_bones = this.skeleton.BONE_DATA.map(boneData => this.createBone(boneData));

        this.skeleton.JOINT_DATA.forEach(jointData =>
        {
            const bone = this.m_bones.find(b => b.name === jointData.boneName);
            bone.jointId = this.createJoint(jointData);
        });

        this.m_bones.forEach(bone => b2Body_SetUserData(bone.bodyId, this));

        return this;
    }

    destroy()
    {
        for ( let i = 0; i < this.m_bones.length; ++i )
        {
            if ( this.m_bones[i].jointId )
            {
                if ( this.m_bones[i].jointId.index1 - 1 != B2_NULL_INDEX )
                {
                    b2DestroyJoint( this.m_bones[i].jointId );
                    this.m_bones[i].jointId = new b2JointId();
                }
            }
        }
    
        for ( let i = 0; i < this.m_bones.length; ++i )
        {
            if ( this.m_bones[i].bodyId.index1 - 1 != B2_NULL_INDEX )
            {
                b2DestroyBody( this.m_bones[i].bodyId );
                this.m_bones[i].bodyId = null;
            }
        }
        this.m_bones = null;
    }
}
