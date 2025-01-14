export class Skeletons {
    static HumanBones: {
        e_hip: number;
        e_torso: number;
        e_head: number;
        e_upperLeftLeg: number;
        e_lowerLeftLeg: number;
        e_upperRightLeg: number;
        e_lowerRightLeg: number;
        e_upperLeftArm: number;
        e_lowerLeftArm: number;
        e_upperRightArm: number;
        e_lowerRightArm: number;
        e_count: number;
    };
    static sideViewHuman11: {
        BONE_DATA: ({
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale?: undefined;
            linearDamping?: undefined;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping?: undefined;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping: number;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            foot: string;
            linearDamping?: undefined;
        })[];
        JOINT_DATA: {
            boneName: string;
            pivot: number[];
            limits: number[];
        }[];
    };
    static frontViewHuman11: {
        BONE_DATA: ({
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale?: undefined;
            linearDamping?: undefined;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping?: undefined;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping: number;
            foot?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            foot: string;
            linearDamping?: undefined;
        })[];
        JOINT_DATA: {
            boneName: string;
            pivot: number[];
            limits: number[];
        }[];
    };
    static ElephantBones: {
        e_torso: number;
        e_head: number;
        e_trunkBase: number;
        e_trunkMid: number;
        e_trunkTip: number;
        e_upperFrontLegL: number;
        e_lowerFrontLegL: number;
        e_upperRearLegL: number;
        e_lowerRearLegL: number;
        e_tail: number;
        e_ear: number;
        e_count: number;
    };
    static sideViewElephant: {
        BONE_DATA: ({
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping?: undefined;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale: number;
            linearDamping: number;
        } | {
            name: string;
            parentIndex: number;
            position: number[];
            capsule: {
                center1: number[];
                center2: number[];
                radius: number;
            };
            frictionScale?: undefined;
            linearDamping?: undefined;
        })[];
        JOINT_DATA: {
            boneName: string;
            pivot: number[];
            limits: number[];
        }[];
    };
}
export class Ragdoll {
    constructor(skeleton: any, x: any, y: any, worldId: any, groupIndex: any, color: any, size?: number);
    skeleton: any;
    position: b2Vec2;
    worldId: any;
    groupIndex: any;
    color: any;
    m_scale: number;
    frictionTorque: number;
    hertz: number;
    dampingRatio: number;
    jointDrawSize: number;
    maxTorque: number;
    m_bones: any[];
    createBone(boneData: any): JointedBone;
    createJoint(jointData: any): b2JointId;
    create(): this;
    destroy(): void;
}
import { b2Vec2 } from "./include/math_functions_h.js";
/**
 * @namespace Ragdoll
 */
declare class JointedBone {
    bodyId: any;
    jointId: any;
    frictionScale: number;
    parentIndex: number;
    name: string;
}
import { b2JointId } from "./include/id_h.js";
export {};
