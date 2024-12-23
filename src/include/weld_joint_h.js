/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export
{
    b2PrepareWeldJoint, b2WarmStartWeldJoint, b2SolveWeldJoint,
    b2GetWeldJointForce, b2GetWeldJointTorque,
    b2WeldJoint_SetLinearHertz,
    b2WeldJoint_GetLinearHertz,
    b2WeldJoint_SetLinearDampingRatio,
    b2WeldJoint_GetLinearDampingRatio,
    b2WeldJoint_SetAngularHertz,
    b2WeldJoint_GetAngularHertz,
    b2WeldJoint_SetAngularDampingRatio,
    b2WeldJoint_GetAngularDampingRatio
} from '../weld_joint_c.js';
