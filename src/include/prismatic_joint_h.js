/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export
{
    b2PrismaticJoint_EnableSpring, b2PrismaticJoint_IsSpringEnabled, b2PrismaticJoint_SetSpringHertz,
    b2PrismaticJoint_GetSpringHertz, b2PrismaticJoint_SetSpringDampingRatio, b2PrismaticJoint_GetSpringDampingRatio,
    b2PrismaticJoint_EnableLimit, b2PrismaticJoint_IsLimitEnabled, b2PrismaticJoint_GetLowerLimit,
    b2PrismaticJoint_GetUpperLimit, b2PrismaticJoint_SetLimits,
    b2PrismaticJoint_EnableMotor, b2PrismaticJoint_IsMotorEnabled, b2PrismaticJoint_SetMotorSpeed,
    b2PrismaticJoint_GetMotorSpeed, b2PrismaticJoint_GetMotorForce,
    b2PrismaticJoint_SetMaxMotorForce, b2PrismaticJoint_GetMaxMotorForce,
    b2GetPrismaticJointForce, b2GetPrismaticJointTorque,
    b2PreparePrismaticJoint, b2WarmStartPrismaticJoint, b2SolvePrismaticJoint,
    b2DrawPrismaticJoint
} from '../prismatic_joint_c.js';
